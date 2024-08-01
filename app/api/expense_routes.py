from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from app.models import Expense, Group, db
from datetime import datetime
expense_bp = Blueprint('expenses', __name__)

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

  group_id=data.get('group_id')
  description=data.get('description')
  amount=data.get('amount')
  date_str=data.get('date')
  split_method=data.get('split_method')

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
  return jsonify(new_expense.to_dict()), 201

# Update an expense
@expense_bp.route('/<int:expense_id>/', methods=["PUT"])
@login_required
def update_expense(expense_id):
    data = request.get_json()
    expense = Expense.query.get_or_404(expense_id)
    expense.description = data.get('description', expense.description)
    expense.amount = data.get('amount', expense.amount)
    expense.date = data.get('date', expense.date)
    expense.split_method = data.get('split_method', expense.split_method)
    db.session.commit()
    return jsonify(expense.to_dict()), 200

# Delete an expense
@expense_bp.route('/<int:expense_id>/', methods=["DELETE"])
@login_required
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200
