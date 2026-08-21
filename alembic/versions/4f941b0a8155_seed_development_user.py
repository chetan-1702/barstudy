"""seed development user

Revision ID: 4f941b0a8155
Revises: 4848f4cd1af6
Create Date: 2026-08-21
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4f941b0a8155"
down_revision: Union[str, Sequence[str], None] = "4848f4cd1af6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            INSERT INTO users (
                id,
                name,
                email,
                inn_registered,
                inn_name
            )
            VALUES (
                1,
                'BarStudy User',
                'dev@barstudy.local',
                false,
                NULL
            )
            ON CONFLICT (id) DO NOTHING
            """
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            DELETE FROM users
            WHERE id = 1
              AND email = 'dev@barstudy.local'
            """
        )
    )
