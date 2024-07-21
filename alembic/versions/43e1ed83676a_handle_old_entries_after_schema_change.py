"""Handle old entries after schema change

Revision ID: 43e1ed83676a
Revises: 36687fe4daf8
Create Date: 2024-07-21 14:10:14.402783

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "43e1ed83676a"
down_revision: Union[str, None] = "36687fe4daf8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DELETE FROM films WHERE slug IS NULL OR year IS NULL")


def downgrade() -> None:
    pass
