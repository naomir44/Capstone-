from .db import db, environment, SCHEMA, add_prefix_for_prod

class Balance(db.Model):
    __tablename__ = 'balances'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id'), ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    balance = db.Column(db.Float, nullable=False)

    user = db.relationship('User', back_populates='balances')

    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'user_id': self.user_id,
            'balance': self.balance
        }
