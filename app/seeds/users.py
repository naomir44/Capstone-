from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

# Adds a demo user, you can add other users here if you want
def seed_users():
    Demo = User(
        name='Demo', email='demo@aa.io', password='password', profile_picture='https://pyschguacbucket.s3.us-west-1.amazonaws.com/profile-pic-3.jpeg')
    Marnie = User(
        name='marnie', email='marnie@aa.io', password='password',profile_picture='https://pyschguacbucket.s3.us-west-1.amazonaws.com/profile-pic-2.jpeg' )
    Bobbie = User(
        name='bobbie', email='bobbie@aa.io', password='password',profile_picture='https://pyschguacbucket.s3.us-west-1.amazonaws.com/profile-pic-4.png')
    Keri = User(
        name='Keri', email='keri@aa.io', password='password',profile_picture='https://pyschguacbucket.s3.us-west-1.amazonaws.com/profile-pic.jpeg')
    Jake = User(
        name='Jake', email='jake@aa.io', password='password',profile_picture='https://pyschguacbucket.s3.us-west-1.amazonaws.com/profile-pic-5.jpeg')


    db.session.add(Demo)
    db.session.add(Marnie)
    db.session.add(Bobbie)
    db.session.add(Keri)
    db.session.add(Jake)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
