from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from app.models import Expense, Group, Payment, db
from datetime import datetime

expense_bp = Blueprint('expenses', __name__)

def calculate_user_expenses(user_id):
    # Calculate the total amount the user has paid
    total_paid = db.session.query(
        db.func.coalesce(db.func.sum(Payment.amount), 0).label('total_paid')
    ).filter(Payment.payer_id == user_id).scalar()

    # Calculate the total amount the user is owed by others
    total_owed = db.session.query(
        db.func.coalesce(db.func.sum(Payment.amount), 0).label('total_owed')
    ).filter(Payment.payee_id == user_id).scalar()

    return {
        'total_paid': total_paid,
        'total_owed': total_owed,
        'net_balance': total_owed - total_paid
    }

#Get balances for user
@expense_bp.route('/my-balance/', methods=['GET'])
@login_required
def get_my_balance():
    balance_summary = calculate_user_expenses(current_user.id)
    return jsonify(balance_summary)

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

    group = Group.query.get(group_id)

    if split_method == 'equal':
        share = amount / len(group.members)
        for member in group.members:
            if member.id != current_user.id:
                payment = Payment(
                    expense_id=new_expense.id,
                    payer_id=current_user.id,
                    payee_id=member.id,
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
    group = Group.query.get(expense.group_id)

    if expense.split_method == 'equal':
        share = expense.amount / len(group.members)
        for member in group.members:
            if member.id != current_user.id:
                payment = Payment(
                    expense_id=expense.id,
                    payer_id=current_user.id,
                    payee_id=member.id,
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
