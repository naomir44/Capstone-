from .db import db, environment, SCHEMA, add_prefix_for_prod

class Payment(db.Model):
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id'), ondelete='CASCADE'), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')

    expense = db.relationship('Expense', back_populates='payments')
    payer = db.relationship('User', foreign_keys=[payer_id])
    payee = db.relationship('User', foreign_keys=[payee_id])

    def to_dict(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'payer_id': self.payer_id,
            'payee_id': self.payee_id,
            'amount': self.amount,
            'status': self.status
        }
