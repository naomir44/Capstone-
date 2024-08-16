from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String, nullable=True)

    groups = db.relationship('Group', back_populates='creator', cascade='all, delete-orphan')
    balances = db.relationship('Balance', back_populates='user', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', back_populates='payer', cascade='all, delete-orphan')
    members = db.relationship('Member', back_populates='user', cascade='all, delete-orphan')
    images = db.relationship('Image', back_populates='user')
    friendships = db.relationship(
        'Friendship',
        primaryjoin="or_(User.id == Friendship.user_id, User.id == Friendship.friend_id)",
        back_populates="user",
        cascade='all, delete-orphan'
    )


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'profile_picture': self.profile_picture,
            'groups': [group.to_dict() for group in self.groups],
            'images': [image.to_dict() for image in self.images],
            'friendships': [friendship.to_dict() for friendship in self.friendships],
            'expenses': [expense.to_dict() for expense in self.expenses]
        }
