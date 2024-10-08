from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/login', methods=['POST'])
def login():
    from app import socketio

    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)

        socketio.emit('join', {'room': user.email })

        return user.to_dict()
    return form.errors, 401

@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            name=form.data['name'],
            email=form.data['email'],
            password=form.data['password'],
            profile_picture=form.data['profile_picture'],
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401

@auth_routes.route('/update_profile_picture', methods=['POST'])
@login_required
def update_profile_picture():
    """
    Updates the profile picture URL for the current user.
    """
    data = request.get_json()
    profile_picture_url = data.get('profile_picture')

    if not profile_picture_url:
        return {'error': 'No profile picture URL provided'}, 400

    current_user.profile_picture = profile_picture_url
    db.session.commit()

    return current_user.to_dict(), 200

@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
