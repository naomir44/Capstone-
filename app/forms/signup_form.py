from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Regexp
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


# def username_exists(form, field):
#     # Checking if username is already in use
#     username = field.data
#     user = User.query.filter(User.username == username).first()
#     if user:
#         raise ValidationError('Username is already in use.')

def check_whitespace(form, field):
    if field.data.strip() != field.data:
        raise ValidationError('Remove whitespace from this field.')

class SignUpForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), check_whitespace])
    email = StringField('email', validators=[DataRequired(), user_exists, check_whitespace, Regexp(r'^[^@]+@[^@]+\.[^@]+$', message="Invalid email address.")])
    password = StringField('password', validators=[DataRequired(), check_whitespace])
    profile_picture = StringField('profile_picture')
