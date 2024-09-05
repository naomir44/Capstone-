from flask import Blueprint, request, jsonify
from ..models import Message, Notification, db
from datetime import datetime, timezone
from flask_socketio import join_room
from flask_login import current_user

message_bp = Blueprint('messages', __name__)

@message_bp.route('/private', methods=['GET'])
def get_private_messages():
    sender_email = request.args.get('sender')
    recipient_email = request.args.get('recipient')

    messages = Message.query.filter(
        ((Message.sender_email == sender_email) & (Message.recipient_email == recipient_email)) |
        ((Message.sender_email == recipient_email) & (Message.recipient_email == sender_email))
    ).order_by(Message.id).all()

    return {'messages': [message.to_dict() for message in messages]}

@message_bp.route('/send', methods=['POST'])
def send_private_message():
    from app import socketio
    data = request.json
    user_email = data.get('user_email')  # Sender's email
    recipient_email = data.get('recipient_email')  # Recipient's email
    message_content = data.get('content')

    if not user_email or not recipient_email or not message_content:
        return jsonify({'error': 'Missing data'}), 400

    timestamp = datetime.now(timezone.utc)

    new_message = Message(
        sender_email=user_email,
        recipient_email=recipient_email,
        content=message_content,
        timestamp=timestamp
    )
    db.session.add(new_message)
    db.session.commit()

    message_dict = new_message.to_dict()

    if current_user.email != recipient_email:
        notification_message = f"New message from {user_email}"
        new_notification = Notification(
            user_id=new_message.recipient.id,
            message=notification_message,
            link=f"/chat/{new_message.sender_email}/{new_message.recipient_email}",
            is_read=False,
            created_at=timestamp,
            notification_from=new_message.sender_email
        )
        db.session.add(new_notification)
        db.session.commit()

        notification_dict = new_notification.to_dict()
        socketio.emit('new_notification', notification_dict, room=recipient_email)

    return jsonify(message_dict), 201


@message_bp.route('/notifications', methods=['GET'])
def get_notifications():
    user_id = current_user.id

    notifications = Notification.query.filter_by(user_id=user_id, is_read=False).order_by(Notification.created_at.desc()).all()

    return jsonify([notification.to_dict() for notification in notifications])

@message_bp.route('/notifications/mark-read/<int:notification_id>', methods=['POST'])
def mark_notification_as_read(notification_id):
    notification = Notification.query.get(notification_id)
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    if notification.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    notification.is_read = True
    db.session.commit()

    return jsonify({'message': 'Notification marked as read'}), 200

@message_bp.route('/notifications/mark-all-read', methods=['POST'])
def mark_all_notifications_as_read():
    user_id = current_user.id
    notification_from = request.json.get('friendEmail')

    if not notification_from:
        return jsonify({'error': 'Missing notification_from data'}), 400

    notifications = Notification.query.filter_by(user_id=user_id, notification_from=notification_from, is_read=False).all()

    for notification in notifications:
        notification.is_read = True

    db.session.commit()

    return jsonify({'message': 'All notifications related to message marked as read'}), 200
