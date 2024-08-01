from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from app.models import Group, User, Member, db

group_bp = Blueprint('groups', __name__)

#Get user groups
@group_bp.route('/')
def get_groups():
  groups = Group.query.join(Member).filter(Member.user_id == current_user.id).all()
  return jsonify([group.to_dict() for group in groups])

#Get group details
@group_bp.route('/<int:id>/')
def get_group(id):
  group = Group.query.get_or_404(id)
  return jsonify(group.to_dict())

#Create a group
@group_bp.route('/new/', methods=["POST"])
@login_required
def create_group():
    data = request.get_json()

    if not data:
        abort(400, description="Invalid data")

    name = data.get('name')
    description = data.get('description')
    image_url = data.get('image_url')
    member_ids = data.get('members', [])

    new_group = Group(
        name=name,
        description=description,
        created_by=current_user.id,
        image_url=image_url
        )
    db.session.add(new_group)
    db.session.commit()

    for member_id in member_ids:
        user = User.query.get(member_id)
        if user:
            member = Member(user_id=user.id, group_id=new_group.id, role='member')
            db.session.add(member)

    db.session.commit()

    return jsonify(new_group.to_dict()), 201

#Update group
@group_bp.route('/<int:group_id>/', methods=["PUT"])
@login_required
def update_group(group_id):
    group = Group.query.get_or_404(group_id)

    if group.created_by != current_user.id:
        abort(403, description="You are not authorized to update this group")

    data = request.get_json()
    group.name = data.get('name', group.name)
    group.description = data.get('description', group.description)
    group.image_url = data.get('image_url', group.image_url)

    member_ids = data.get('members', [])

   #Update group members
    existing_member_ids = {member.user_id for member in group.members}
    new_member_ids = set(member_ids) - existing_member_ids
    removed_member_ids = existing_member_ids - set(member_ids)

    #Add new members
    for member_id in new_member_ids:
        user = User.query.get(member_id)
        if user:
            member = Member(user_id=user.id, group_id=group.id, role='member')
            db.session.add(member)
    #Remove old members
    for member_id in removed_member_ids:
        member = Member.query.filter_by(user_id=member_id, group_id=group.id).first()
        if member:
            db.session.delete(member)

    db.session.commit()
    return jsonify(group.to_dict()), 200

#Delete a group
@group_bp.route('/<int:group_id>/', methods=["DELETE"])
@login_required
def delete_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        abort(404, description="Group not found")

    if group.created_by != current_user.id:
        abort(403, description="Not authorized to delete this group")

    db.session.delete(group)
    db.session.commit()

    return jsonify({'message': 'Group deleted successfully'}), 200
