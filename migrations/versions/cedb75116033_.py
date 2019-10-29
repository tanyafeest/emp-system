"""empty message

Revision ID: cedb75116033
Revises: c7cbb3600459
Create Date: 2019-10-29 19:30:03.684168

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cedb75116033'
down_revision = 'c7cbb3600459'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('name', table_name='company')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('name', 'company', ['name'], unique=True)
    # ### end Alembic commands ###
