"""initial database schema

Revision ID: 560e41f7285a
Revises:
Create Date: 2026-08-17 10:23:21.628164

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "560e41f7285a"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the initial database schema."""

    # ------------------------------------------------------------------
    # users
    # ------------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("inn_registered", sa.Boolean(), nullable=False),
        sa.Column("inn_name", sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )

    op.create_index(
        "ix_users_id",
        "users",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_users_email",
        "users",
        ["email"],
        unique=True,
    )

    # ------------------------------------------------------------------
    # subjects
    # ------------------------------------------------------------------
    op.create_table(
        "subjects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_subjects_id",
        "subjects",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_subjects_user_id",
        "subjects",
        ["user_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # exams
    # ------------------------------------------------------------------
    op.create_table(
        "exams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("exam_date", sa.Date(), nullable=False),
        sa.Column("exam_type", sa.String(length=100), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["subject_id"],
            ["subjects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_exams_id",
        "exams",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_exams_subject_id",
        "exams",
        ["subject_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # tasks
    # ------------------------------------------------------------------
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("exam_id", sa.Integer(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("priority", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["exam_id"],
            ["exams.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["subject_id"],
            ["subjects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_tasks_id",
        "tasks",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_tasks_subject_id",
        "tasks",
        ["subject_id"],
        unique=False,
    )

    op.create_index(
        "ix_tasks_exam_id",
        "tasks",
        ["exam_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # resources
    # ------------------------------------------------------------------
    op.create_table(
        "resources",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("exam_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("file_type", sa.String(length=100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["exam_id"],
            ["exams.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["subject_id"],
            ["subjects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_resources_id",
        "resources",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_resources_subject_id",
        "resources",
        ["subject_id"],
        unique=False,
    )

    op.create_index(
        "ix_resources_exam_id",
        "resources",
        ["exam_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # study_sessions
    # ------------------------------------------------------------------
    op.create_table(
        "study_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("session_date", sa.Date(), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["subject_id"],
            ["subjects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_study_sessions_id",
        "study_sessions",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_study_sessions_subject_id",
        "study_sessions",
        ["subject_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # inn_profiles
    # ------------------------------------------------------------------
    op.create_table(
        "inn_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("registered", sa.Boolean(), nullable=False),
        sa.Column("inn_name", sa.String(length=150), nullable=True),
        sa.Column("application_status", sa.String(length=100), nullable=True),
        sa.Column("intended_application_date", sa.Date(), nullable=True),
        sa.Column("joining_date", sa.Date(), nullable=True),
        sa.Column("membership_status", sa.String(length=100), nullable=True),
        sa.Column("important_dates", sa.Text(), nullable=True),
        sa.Column("documents", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_index(
        "ix_inn_profiles_id",
        "inn_profiles",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_inn_profiles_user_id",
        "inn_profiles",
        ["user_id"],
        unique=True,
    )


def downgrade() -> None:
    """Drop the initial database schema."""

    op.drop_index(
        "ix_inn_profiles_user_id",
        table_name="inn_profiles",
    )

    op.drop_index(
        "ix_inn_profiles_id",
        table_name="inn_profiles",
    )

    op.drop_table("inn_profiles")

    op.drop_index(
        "ix_study_sessions_subject_id",
        table_name="study_sessions",
    )

    op.drop_index(
        "ix_study_sessions_id",
        table_name="study_sessions",
    )

    op.drop_table("study_sessions")

    op.drop_index(
        "ix_resources_exam_id",
        table_name="resources",
    )

    op.drop_index(
        "ix_resources_subject_id",
        table_name="resources",
    )

    op.drop_index(
        "ix_resources_id",
        table_name="resources",
    )

    op.drop_table("resources")

    op.drop_index(
        "ix_tasks_exam_id",
        table_name="tasks",
    )

    op.drop_index(
        "ix_tasks_subject_id",
        table_name="tasks",
    )

    op.drop_index(
        "ix_tasks_id",
        table_name="tasks",
    )

    op.drop_table("tasks")

    op.drop_index(
        "ix_exams_subject_id",
        table_name="exams",
    )

    op.drop_index(
        "ix_exams_id",
        table_name="exams",
    )

    op.drop_table("exams")

    op.drop_index(
        "ix_subjects_user_id",
        table_name="subjects",
    )

    op.drop_index(
        "ix_subjects_id",
        table_name="subjects",
    )

    op.drop_table("subjects")

    op.drop_index(
        "ix_users_email",
        table_name="users",
    )

    op.drop_index(
        "ix_users_id",
        table_name="users",
    )

    op.drop_table("users")
