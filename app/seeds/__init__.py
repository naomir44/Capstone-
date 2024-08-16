from flask.cli import AppGroup
from .users import seed_users, undo_users
from .groups import seed_groups, undo_groups
from .members import seed_members, undo_members
from .expenses import seed_expenses, undo_expenses
from .balances import seed_balances, undo_balances
from .images import seed_images, undo_images
from .friendships import seed_friendships, undo_friendships
from .payments import seed_payments, undo_payments
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    # if environment == 'production':
    #     # Before seeding in production, you want to run the seed undo
    #     # command, which will  truncate all tables prefixed with
    #     # the schema name (see comment in users.py undo_users function).
    #     # Make sure to add all your other model's undo functions below
    #     undo_payments()
    #     undo_friendships()
    #     undo_images()
    #     undo_balances()
    #     undo_expenses()
    #     undo_members()
    #     undo_groups()
    #     undo_users()
    seed_users()
    seed_groups()
    seed_members()
    seed_expenses()
    seed_balances()
    seed_images()
    seed_friendships()
    seed_payments()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_groups()
    undo_members()
    undo_expenses()
    undo_balances()
    undo_images()
    undo_friendships()
    undo_payments()
    # Add other undo functions here
