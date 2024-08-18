from .db import db, environment, SCHEMA, add_prefix_for_prod

class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String, nullable=True)

    creator = db.relationship('User', back_populates='groups')
    members = db.relationship('Member', back_populates='group', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', back_populates='group', cascade='all, delete-orphan')
    images = db.relationship('Image', back_populates='group')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'image_url': self.image_url,
            'members': [member.to_dict() for member in self.members],
            'expenses': [expense.to_dict() for expense in self.expenses],
            'creator': {'id': self.creator.id, 'name': self.creator.name, 'profile_picture': self.creator.profile_picture},
            'images': [image.to_dict() for image in self.images]
        }
