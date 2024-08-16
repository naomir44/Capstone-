"""create_users_table

Revision ID: ffdc0a98111c
Revises:
Create Date: 2020-11-20 15:06:02.230689

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'ffdc0a98111c'
down_revision = None
branch_labels = None
depends_on = None

if environment == "production":
    op.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA};")

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name',sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('profile_picture', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['users.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('balances',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('balance', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id']),
    sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('expenses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('payer_id', sa.Integer(), nullable=False),
    sa.Column('split_method', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id']),
    sa.ForeignKeyConstraint(['payer_id'], ['users.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id']),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id']),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('friendships',
    sa.Column('friendship_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=False, default='pending'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id']),
    sa.PrimaryKeyConstraint('friendship_id')
    )
    op.create_table('payments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('expense_id', sa.Integer(), nullable=False),
    sa.Column('payer_id', sa.Integer(), nullable=False),
    sa.Column('payee_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('status', sa.String(), nullable=False, default='pending'),
    sa.ForeignKeyConstraint(['expense_id'], ['expenses.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['payer_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['payee_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    print("Payments table created.")

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE groups SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE balances SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE expenses SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE members SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE images SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE friendships SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE payments SET SCHEMA {SCHEMA};")

    # ### end Alembic commands ###qqqqqqqqq


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('payments')
    op.drop_table('friendships')
    op.drop_table('images')
    op.drop_table('members')
    op.drop_table('expenses')
    op.drop_table('balances')
    op.drop_table('groups')
    op.drop_table('users')
    # ### end Alembic commands ###
