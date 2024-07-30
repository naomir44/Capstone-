from app.models import db, Friendship, environment, SCHEMA
from sqlalchemy.sql import text

def seed_friendships():
  friendship1 = Friendship(user_id=1, friend_id=2, status='accepted')
  friendship2 = Friendship(user_id=1, friend_id=3, status='accepted')
  friendship3 = Friendship(user_id=2, friend_id=3, status='accepted')
  friendship4 = Friendship(user_id=4, friend_id=5, status='pending')
  friendship5 = Friendship(user_id=5, friend_id=2, status='pending')

  db.session.add(friendship1)
  db.session.add(friendship2)
  db.session.add(friendship3)
  db.session.add(friendship4)
  db.session.add(friendship5)
  db.session.commit()


def undo_friendships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friendships"))

    db.session.commit()
