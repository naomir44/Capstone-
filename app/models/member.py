from .db import db, environment, SCHEMA, add_prefix_for_prod

class Member(db.Model):
    __tablename__ = 'members'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id'), ondelete='CASCADE'), nullable=False)
    role = db.Column(db.String, nullable=True)

    user = db.relationship('User', back_populates='members')
    group = db.relationship('Group', back_populates='members')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'member': {'id': self.user.id, 'name': self.user.name, 'profile_picture': self.user.profile_picture},
            'group_id': self.group_id,
        }
