from .db import db, environment, SCHEMA, add_prefix_for_prod

class Image(db.Model):
  __tablename__ = 'images'

  if environment == "production":
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  url = db.Column(db.String, nullable=False)
  group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id'), ondelete='CASCADE'), nullable=True)
  user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=True)

  group = db.relationship('Group', back_populates='images', foreign_keys=[group_id])
  user = db.relationship('User', back_populates= 'images', foreign_keys=[user_id])


  def to_dict(self):
    return {
      'id': self.id,
      'url': self.url,
      'group_id': self.group_id,
      'user_id': self.user_id
    }
