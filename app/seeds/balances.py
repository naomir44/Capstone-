from app.models import db, Balance, environment, SCHEMA
from sqlalchemy.sql import text

def seed_balances():
    balance1 = Balance(group_id=1, user_id=1, balance=-850.0)  # Demo's balance in Vacation Fund
    balance2 = Balance(group_id=1, user_id=2, balance=350.0)   # Marnie's balance in Vacation Fund
    balance3 = Balance(group_id=2, user_id=3, balance=-200.0)  # Bobbie's balance in Office Expenses

    db.session.add(balance1)
    db.session.add(balance2)
    db.session.add(balance3)
    db.session.commit()

def undo_balances():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.balances RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM balances"))

    db.session.commit()
