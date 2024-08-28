from flask import Blueprint, request, jsonify
from ..models import Message, db
from datetime import datetime, timezone
from flask_socketio import SocketIO

message_bp = Blueprint('messages', __name__)

socketio = SocketIO()

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
    data = request.json
    user_email = data.get('user_email')
    recipient_email = data.get('recipient_email')
    message_content = data.get('content')

    if not user_email or not recipient_email or not message_content:
        return jsonify({'error': 'Missing data'}), 400

    # Generate the timestamp on the server
    timestamp = datetime.now(timezone.utc)

    # Save the message to the database
    new_message = Message(
        sender_email=user_email,
        recipient_email=recipient_email,
        content=message_content,
        timestamp=timestamp  # Ensure the timestamp is added here
    )
    db.session.add(new_message)
    db.session.commit()

    # Convert the message to a dictionary to include in the response and WebSocket emission
    message_dict = new_message.to_dict()

    # Emit the message via WebSocket to both sender and recipient
    socketio.emit('receive_private_message', message_dict, room=user_email)
    socketio.emit('receive_private_message', message_dict, room=recipient_email)

    return jsonify(message_dict), 201  # Return the message with the correct timestamp
