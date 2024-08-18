from .db import db, environment, SCHEMA, add_prefix_for_prod

class Friendship(db.Model):
    __tablename__ = 'friendships'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    friendship_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')

    user = db.relationship('User', foreign_keys=[user_id], back_populates='friendships')
    friend = db.relationship('User', foreign_keys=[friend_id])

    def to_dict(self):
        return {
            'friendship_id': self.friendship_id,
            'user_id': self.user_id,
            'friend_id': self.friend_id,
            'status': self.status,
            'friend_name': self.friend.name,
            'sender_name': self.user.name,
            'profile_picture': self.friend.profile_picture,
            'sender_profile_pic': self.user.profile_picture
        }
