from .db import db, environment, SCHEMA

class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    split_method = db.Column(db.String(50), nullable=False)

    payer = db.relationship('User', back_populates='expenses')
    group = db.relationship('Group', back_populates='expenses')

    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'description': self.description,
            'amount': self.amount,
            'date': self.date.isoformat(),
            'payer_id': self.payer_id,
            'split_method': self.split_method
        }
