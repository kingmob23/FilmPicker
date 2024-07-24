"""Drop all data

Revision ID: 7629556ccaba
Revises: a6612e41e273
Create Date: 2024-07-24 15:28:44.326449

Change message: Clear application data

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7629556ccaba"
down_revision: Union[str, None] = "a6612e41e273"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Очистка всех данных из таблиц, кроме alembic_version
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM films;"))
    conn.execute(sa.text("DELETE FROM users;"))
    conn.execute(sa.text("DELETE FROM watchlist_films;"))


def downgrade() -> None:
    pass
