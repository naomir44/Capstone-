from app.models import db, Member, environment, SCHEMA
from sqlalchemy.sql import text

def seed_members():
    member1 = Member(user_id=1, group_id=1, role='Admin')  # Demo in Vacation Fund
    member2 = Member(user_id=2, group_id=1, role='Member')  # Marnie in Vacation Fund
    member3 = Member(user_id=3, group_id=2, role='Admin')  # Bobbie in Office Expenses

    db.session.add(member1)
    db.session.add(member2)
    db.session.add(member3)
    db.session.commit()

def undo_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM members"))

    db.session.commit()
