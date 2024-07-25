from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Group, db

group_bp = Blueprint('groups', __name__)

#Get all groups
@group_bp.route('/')
def get_groups():
  groups = Group.query.all()
  return jsonify([group.to_dict() for group in groups])

#Get group details
@group_bp.route('/<int:id>/')
def get_group(id):
  group = Group.query.get_or_404(id)
  return jsonify(group.to_dict())
