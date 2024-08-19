from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payments():
    payment1 = Payment(
        expense_id=1,
        payer_id=1,
        payee_id=2,
        amount=166.66,
        status='pending'
    )
    payment2 = Payment(
        expense_id=1,
        payer_id=1,
        payee_id=3,
        amount=166.66,
        status='pending'
    )
    payment3 = Payment(
        expense_id=2,
        payer_id=2,
        payee_id=1,
        amount=400.00,
        status='pending'
    )
    payment4 = Payment(
        expense_id=2,
        payer_id=2,
        payee_id=3,
        amount=400.00,
        status='pending'
    )
    payment5 = Payment(
        expense_id=4,
        payer_id=7,
        payee_id=1,
        amount=100.00,
        status='pending'
    )
    payment6 = Payment(
        expense_id=5,
        payer_id=6,
        payee_id=1,
        amount=600.00,
        status='pending'
    )

    db.session.add(payment1)
    db.session.add(payment2)
    db.session.add(payment3)
    db.session.add(payment4)
    db.session.add(payment5)
    db.session.add(payment6)
    db.session.commit()

def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
