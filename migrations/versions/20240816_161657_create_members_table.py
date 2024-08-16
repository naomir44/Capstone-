"""create members table

Revision ID: 27c1ff4d38ca
Revises: b07cdc19cdea
Create Date: 2024-08-16 16:16:57.962680

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '27c1ff4d38ca'
down_revision = 'b07cdc19cdea'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id']),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE members SET SCHEMA {SCHEMA};")


def downgrade():
    op.drop_table('members')
