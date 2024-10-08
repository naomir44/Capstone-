"""Add Message model

Revision ID: 61395cd4f35f
Revises: b07cdc19cdea
Create Date: 2024-08-21 20:33:11.686655

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '61395cd4f35f'
down_revision = 'b07cdc19cdea'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sender_email', sa.String(length=255), nullable=False),
    sa.Column('recipient_email', sa.String(length=255), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False, server_default=func.current_timestamp()),
    sa.ForeignKeyConstraint(['recipient_email'], ['users.email'], ),
    sa.ForeignKeyConstraint(['sender_email'], ['users.email'], ),
    sa.PrimaryKeyConstraint('id')
    )

    # ### end Alembic commands ###

    if environment == "production":
        op.execute(f"ALTER TABLE payments SET SCHEMA {SCHEMA};")

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.drop_table('messages')
    # ### end Alembic commands ###
