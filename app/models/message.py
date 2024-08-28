from .db import db, SCHEMA, environment, add_prefix_for_prod
from datetime import datetime, timezone

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sender_email = db.Column(db.String(255), db.ForeignKey(add_prefix_for_prod('users.email')), nullable=False)
    recipient_email = db.Column(db.String(255), db.ForeignKey(add_prefix_for_prod('users.email')), nullable=True)  # Nullable for group messages
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


    sender = db.relationship('User', foreign_keys=[sender_email], back_populates='sent_messages')
    recipient = db.relationship('User', foreign_keys=[recipient_email], back_populates='received_messages')

    def to_dict(self):
        return {
            'id': self.id,
            'sender_email': self.sender_email,
            'recipient_email': self.recipient_email,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'sender_name': self.sender.name,
            'recipient_name': self.recipient.name
        }
