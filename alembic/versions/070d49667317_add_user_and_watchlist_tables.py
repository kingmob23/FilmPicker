"""Add User and Watchlist tables

Revision ID: 070d49667317
Revises: dab677406255
Create Date: 2024-07-21 22:01:45.750008

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '070d49667317'
down_revision: Union[str, None] = 'dab677406255'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_table('watchlist_films',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('film_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['film_id'], ['films.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'film_id')
    )
    op.drop_index('ix_films_username', table_name='films')
    op.drop_column('films', 'username')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('films', sa.Column('username', sa.VARCHAR(), nullable=True))
    op.create_index('ix_films_username', 'films', ['username'], unique=False)
    op.drop_table('watchlist_films')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###
