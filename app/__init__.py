import os
from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, join_room, emit
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager, current_user
from .models import db, User, Message, Notification
from datetime import datetime, timezone
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.friend_routes import friendship_bp
from .api.expense_routes import expense_bp
from .seeds import seed_commands
from .config import Config
from .api.group_routes import group_bp
from .api.message_routes import message_bp

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

socketio = SocketIO(app, cors_allowed_origins="*")

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(group_bp, url_prefix='/api/groups')
app.register_blueprint(friendship_bp, url_prefix='/api/friendships')
app.register_blueprint(expense_bp, url_prefix='/api/expenses')
app.register_blueprint(message_bp, url_prefix='/api/messages')

db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# WebSocket event handlers

@socketio.on('message')
def handle_message(msg):
    print('Message received: ' + msg)
    socketio.send('Message received: ' + msg)

@socketio.on('user_logged_in')
def handle_user_logged_in(data):
    user_email = data['email']
    join_room(user_email)
    print(f"{user_email} has joined their personal notification room.")

@socketio.on('join_private')
def handle_join_private(data):
    user_email = data['user_email']
    recipient_email = data['recipient_email']

    room = f'private_{min(user_email, recipient_email)}_{max(user_email, recipient_email)}'
    join_room(room)

    emit('message', {'message': f'{user_email} has joined the room.'}, room=room)


@socketio.on('send_private_message')
def handle_private_message(data):
    user_email = data['user_email']  # sender
    recipient_email = data['recipient_email']
    message_content = data['content']

    new_message = Message(
        sender_email=user_email,
        recipient_email=recipient_email,
        content=message_content
    )
    db.session.add(new_message)
    db.session.commit()

    room = f'private_{min(user_email, recipient_email)}_{max(user_email, recipient_email)}'
    socketio.emit('receive_private_message', new_message.to_dict(), room=room)


@socketio.on('join')
def handle_join(data):
    room = data['room']
    if room:
        notification_room = f'notification_{room}'
        join_room(notification_room)
        print(f'User joined notification room: {notification_room}')
    else:
        print(f'No room name received in join event. Data: {data}')


@socketio.on('send_notification')
def handle_send_notification(data):
    recipient_email = data['recipient_email']
    notification_message = data['message']
    notification_from = data.get('notification_from')

    if notification_from is None:
        emit('error', {'error': 'Missing notification_from'})
        return

    recipient = User.query.filter_by(email=recipient_email).first()
    if not recipient:
        emit('error', {'error': 'Recipient not found'})
        return

    try:
        new_notification = Notification(
            user_id=recipient.id,
            message=notification_message,
            link=data.get('link', '#'),
            is_read=False,
            notification_from=notification_from
        )
        db.session.add(new_notification)
        db.session.commit()
        socketio.emit('new_notification', new_notification.to_dict(), room=f'notification_{recipient_email}')
        print("Notification created successfully")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating notification: {e}")


@socketio.on('mark_notification_as_read')
def handle_mark_notification_as_read(data):
    friend_email = data.get('friend_email')
    user = current_user

    if not friend_email:
        emit('error', {'error': 'Missing friend_email'})
        return

    notifications = Notification.query.filter_by(user_id=user.id, notification_from=friend_email, is_read=False).all()

    for notification in notifications:
        notification.is_read = True
    db.session.commit()

    updated_notifications = [notification.to_dict() for notification in notifications]
    socketio.emit('mark_notifications_as_read', updated_notifications, room=user.email)

    emit('message', {'message': f'Notifications marked as read for {friend_email}'}, room=user.email)
