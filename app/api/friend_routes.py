from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from app.models import  User, Friendship, db

friendship_bp = Blueprint('friendships', __name__)

# Get all friends
@friendship_bp.route('/all/')
@login_required
def get_friends():
    friendships = Friendship.query.filter(
        (Friendship.user_id == current_user.id) |
        (Friendship.friend_id == current_user.id)
    ).all()
    #the filter above
    #this is check to see if the user_id or the friend_id is the current user
    #there is only one '|' operator to combine both conditionals in the filter

    friends = []
    for friendship in friendships: #for each 'friendship' record, we find the friend by check which id is not the current user
        friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
        friend = User.query.get(friend_id) #once we find the friend, we get the friend(users) info
        friends.append(friend.to_dict())
    return jsonify(friends), 200

#Add a friend
@friendship_bp.route('/add/', methods=["POST"])
@login_required
def add_friend():
    data = request.get_json()
    friend_email = data.get('email')
    friend = User.query.filter_by(email=friend_email).first()

    if not friend:
       return jsonify({"error": "User not found"}), 404

    if friend.id == current_user.id:
        return jsonify({"error": "You cannot add yourself as a friend"}), 400

    existing_friendship = Friendship.query.filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend.id))
    ).first()

    if existing_friendship:
        return jsonify({"error": "Friendship already exists"}), 400

    new_friendship = Friendship(user_id=current_user.id, friend_id=friend.id, status='pending')
    db.session.add(new_friendship)
    db.session.commit()

    return jsonify(new_friendship.to_dict()), 201

#Accept a friend request
@friendship_bp.route('/accept/<int:friend_id>/', methods=["POST"])
@login_required
def accept_friend(friend_id):
    friend = Friendship.query.get_or_404(friend_id)

    if friend.friend_id != current_user.id:
        return jsonify({"error": "You are not allowed to accept this request"}), 403

    friend.status = 'accepted'
    db.session.commit()

    return jsonify(friend.to_dict()), 200

#Getting friend requests
@friendship_bp.route('/requests/')
@login_required
def get_friend_requests():
    friend_requests = Friendship.query.filter_by(friend_id=current_user.id, status='pending').all()
    return jsonify([request.to_dict() for request in friend_requests]), 200

#Delete a friend
@friendship_bp.route('/delete/<int:friend_id>/', methods=["DELETE"])
@login_required
def delete_friend(friend_id):
    friendship = Friendship.query.filter(
        (Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id) |
        (Friendship.user_id == friend_id) & (Friendship.friend_id == current_user.id)
    ).first()

    if not friendship:
        return jsonify({"error": "Friendship not found"}), 404

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({"message": "Friendship deleted"}), 200
