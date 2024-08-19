from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_expenses():
    expense1 = Expense(group_id=1, description='Hotel Booking', amount=500.00, date=date.today(), payer_id=1, split_method='equal')  # Paid by Demo
    expense2 = Expense(group_id=1, description='Flight Tickets', amount=1200.00, date=date.today(), payer_id=2, split_method='equal')  # Paid by Marnie
    expense3 = Expense(group_id=2, description='Office Supplies', amount=200.00, date=date.today(), payer_id=3, split_method='equal')  # Paid by Bobbie
    expense4 = Expense(group_id=4, description='Groceries', amount=300.00, date=date.today(), payer_id=7, split_method='equal')  # Paid by Bobbie
    expense5 = Expense(group_id=7, description='Concert Tickets', amount=1800.0, date=date.today(), payer_id=6, split_method='equal')  # Paid by Bobbie

    db.session.add(expense1)
    db.session.add(expense2)
    db.session.add(expense3)
    db.session.add(expense4)
    db.session.add(expense5)
    db.session.commit()

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
