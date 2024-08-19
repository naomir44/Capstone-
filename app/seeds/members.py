from app.models import db, Member, environment, SCHEMA
from sqlalchemy.sql import text

def seed_members():
    member1 = Member(user_id=3, group_id=1)
    member2 = Member(user_id=2, group_id=1)
    member3 = Member(user_id=3, group_id=2)
    member4 = Member(user_id=5, group_id=2)
    member5 = Member(user_id=4, group_id=3)
    member6 = Member(user_id=6, group_id=3)
    member7 = Member(user_id=7, group_id=4)
    member8 = Member(user_id=1, group_id=4)
    member10 = Member(user_id=4, group_id=5)
    member11= Member(user_id=7, group_id=5)
    member12 = Member(user_id=5, group_id=6)
    member13 = Member(user_id=7, group_id=6)
    member14 = Member(user_id=6, group_id=7)
    member15 = Member(user_id=1, group_id=7)


    db.session.add(member1)
    db.session.add(member2)
    db.session.add(member3)
    db.session.add(member4)
    db.session.add(member5)
    db.session.add(member6)
    db.session.add(member7)
    db.session.add(member8)
    db.session.add(member10)
    db.session.add(member11)
    db.session.add(member12)
    db.session.add(member13)
    db.session.add(member14)
    db.session.add(member15)

    db.session.commit()

def undo_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM members"))

    db.session.commit()
