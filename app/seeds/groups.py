from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text

def seed_groups():
    group1 = Group(name='Vacation Fund', description='Saving for a group vacation', created_by=1, image_url='https://example.com/vacation.jpg')
    group2 = Group(name='Office Expenses', description='Expenses for office supplies and activities', created_by=2, image_url='https://example.com/office.jpg')

    db.session.add(group1)
    db.session.add(group2)
    db.session.commit()

def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
