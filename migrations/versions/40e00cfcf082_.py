"""empty message

Revision ID: 40e00cfcf082
Revises: 
Create Date: 2019-11-13 13:53:59.029000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '40e00cfcf082'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('employee', sa.Column('accnumber', sa.String(length=50), nullable=True))
    op.add_column('employee', sa.Column('bankname', sa.String(length=100), nullable=True))
    op.add_column('employee', sa.Column('ifsccode', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('employee', 'ifsccode')
    op.drop_column('employee', 'bankname')
    op.drop_column('employee', 'accnumber')
    # ### end Alembic commands ###