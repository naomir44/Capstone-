from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from app.models import Expense, Group, Payment, db
from datetime import datetime

expense_bp = Blueprint('expenses', __name__)

def calculate_user_expenses(user_id):
    total_paid = db.session.query(
    db.func.coalesce(db.func.sum(Payment.amount), 0).label('total_paid')
    ).filter(
        Payment.payee_id == user_id,
        Payment.status == 'paid'
    ).scalar()

    # Calculate the total amount the user is owed by others
    total_owed = db.session.query(
        db.func.coalesce(db.func.sum(Payment.amount), 0).label('total_owed')
    ).filter(
        Payment.payer_id == user_id,
        Payment.status == 'pending'
        ).scalar()

    return {
        'total_paid': total_paid,
        'total_owed': total_owed,
        'net_balance': total_owed - total_paid
    }

#Get balances for user
@expense_bp.route('/my-balance/', methods=['GET'])
@login_required
def get_my_balance():
    user_id = current_user.id

    balance_summary = calculate_user_expenses(user_id)

    expenses_you_owe = db.session.query(Expense).join(Payment).filter(
        Payment.payer_id != user_id,
        Payment.payee_id == user_id,
        Payment.status == 'pending'
    ).all()

    expenses_owed_to_you = db.session.query(Expense).join(Payment).filter(
        Payment.payee_id != user_id,
        Payment.payer_id == user_id,
        Payment.status == 'pending'
    ).all()

    return jsonify({
        'total_paid': balance_summary['total_paid'],
        'total_owed': balance_summary['total_owed'],
        'net_balance': balance_summary['net_balance'],
        'expenses_you_owe': [expense.to_dict() for expense in expenses_you_owe],
        'expenses_owed_to_you': [expense.to_dict() for expense in expenses_owed_to_you]
    })

#Get all expenses for a group
@expense_bp.route('/group/<int:group_id>/')
@login_required
def get_expenses(group_id):
  expenses = Expense.query.filter_by(group_id=group_id).all()
  return jsonify([expense.to_dict() for expense in expenses]), 200

#Add an expense
@expense_bp.route('/new/', methods=["POST"])
@login_required
def add_expense():
    data = request.get_json()

    if not data:
        abort(400, description="Invalid data")

    group_id = data.get('group_id')
    description = data.get('description')
    amount = data.get('amount')
    date_str = data.get('date')
    split_method = data.get('split_method')
    selected_members = data.get('members', [])

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    new_expense = Expense(
        group_id=group_id,
        description=description,
        amount=amount,
        date=date,
        split_method=split_method,
        payer_id=current_user.id,
    )
    db.session.add(new_expense)
    db.session.commit()

    if split_method == 'equal':
        total_members = len(selected_members)
        if total_members == 0:
            abort(400, description="No members selected for equal split")

        share = amount / (total_members + 1)
        for member_id in selected_members:
            if member_id != current_user.id:
                payment = Payment(
                    expense_id=new_expense.id,
                    payer_id=current_user.id,
                    payee_id=member_id,
                    amount=share,
                    status='pending'
                )
                db.session.add(payment)

    elif split_method == 'exact':
        shares = data.get('shares')
        for payee_id, share_amount in shares.items():
            if payee_id != current_user.id:
                payment = Payment(
                    expense_id=new_expense.id,
                    payer_id=current_user.id,
                    payee_id=payee_id,
                    amount=share_amount,
                    status='pending'
                )
                db.session.add(payment)

    db.session.commit()
    return jsonify(new_expense.to_dict()), 201

# Update an expense
@expense_bp.route('/update/<int:expense_id>/', methods=["PUT"])
@login_required
def update_expense(expense_id):
    data = request.get_json()
    expense = Expense.query.get_or_404(expense_id)

    # Update expense details
    expense.description = data.get('description', expense.description)
    expense.amount = data.get('amount', expense.amount)
    date_str = data.get('date')
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    expense.date = date
    expense.split_method = data.get('split_method', expense.split_method)

    # Delete old payments
    Payment.query.filter_by(expense_id=expense.id).delete()

    # Recalculate and add new payments based on updated expense details
    selected_members = data.get('members', [])

    if expense.split_method == 'equal':
        total_members = len(selected_members)
        if total_members == 0:
            abort(400, description="No members selected for equal split")

        share = expense.amount / (total_members + 1)
        for member_id in selected_members:
            if member_id != current_user.id:
                payment = Payment(
                    expense_id=expense.id,
                    payer_id=current_user.id,
                    payee_id=member_id,
                    amount=share,
                    status='pending'
                )
                db.session.add(payment)

    elif expense.split_method == 'exact':
        shares = data.get('shares')
        for payee_id, share_amount in shares.items():
            if payee_id != current_user.id:
                payment = Payment(
                    expense_id=expense.id,
                    payer_id=current_user.id,
                    payee_id=payee_id,
                    amount=share_amount,
                    status='pending'
                )
                db.session.add(payment)

    db.session.commit()
    return jsonify(expense.to_dict()), 200

# Delete an expense
@expense_bp.route('/delete/<int:expense_id>/', methods=["DELETE"])
@login_required
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200

# Pay expense
@expense_bp.route('/pay/<int:expense_id>/', methods=["PUT"])
@login_required
def pay_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    payment = next((payment for payment in expense.payments if payment.payee_id == current_user.id), None)
    data = request.get_json()

    payment.status = data.get('status', payment.status)
    db.session.commit()
    return jsonify(payment.to_dict())
