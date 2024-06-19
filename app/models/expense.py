from datetime import datetime
from .db import db, environment, SCHEMA

class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    description = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    split_method = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'description': self.description,
            'amount': str(self.amount),
            'date': self.date.isoformat(),
            'payer_id': self.payer_id,
            'split_method': self.split_method
        }
