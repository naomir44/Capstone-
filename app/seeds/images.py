from app.models import db, Image, environment, SCHEMA
from sqlalchemy.sql import text

def seed_images():

    # Create image instances
    image1 = Image(url='https://example.com/image1.jpg', group_id=1)
    image2 = Image(url='https://example.com/image2.jpg', user_id=1)
    image3 = Image(url='https://example.com/image3.jpg', group_id=2)
    image4 = Image(url='https://example.com/image4.jpg', user_id=2)

    # Add images to the session
    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.add(image4)

    # Commit the session to save the images to the database
    db.session.commit()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))

    db.session.commit()
