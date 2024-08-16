"""Create payments table

Revision ID: b07cdc19cdea
Revises: ffdc0a98111c
Create Date: 2024-08-16 15:42:23.057611

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'b07cdc19cdea'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
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

    if environment == "production":
        op.execute(f"ALTER TABLE payments SET SCHEMA {SCHEMA};")

def downgrade():
    op.drop_table('payments')
