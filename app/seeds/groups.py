from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text

def seed_groups():
    group1 = Group(name='Vacation Fund', description='Splitting costs for a group vacation', created_by=1, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/vacation-group.jpeg')
    group2 = Group(name='Office Expenses', description='Splitting expenses for office supplies and activities', created_by=4, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/office-supplies.jpeg')
    group3 = Group(name='Rent & Utilities', description='Sharing rent and utility bills among roommates', created_by=2, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/roommates-group-pic.jpeg')
    group4 = Group(name='Grocery Sharing', description='Splitting grocery costs among friends or family', created_by=3, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/groceries-group-pic.jpeg')
    group5 = Group(name='Road Trip', description='Dividing up costs for a group road trip', created_by=5, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/roadtrip-group-pic.jpeg')
    group6 = Group(name='Wedding Costs', description='Sharing expenses for a wedding', created_by=6, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/wedding-group-pic.jpeg')
    group7 = Group(name='Concert Tickets', description='Splitting the cost of concert tickets and related expenses', created_by=7, image_url='https://pyschguacbucket.s3.us-west-1.amazonaws.com/concert-group-pic.jpeg')

    db.session.add(group1)
    db.session.add(group2)
    db.session.add(group3)
    db.session.add(group4)
    db.session.add(group5)
    db.session.add(group6)
    db.session.add(group7)

    db.session.commit()

def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
