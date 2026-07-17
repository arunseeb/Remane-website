# Applies all pending Remane migrations directly to the Supabase database.
# Requires SUPABASE_DB_PASSWORD in ../.env.local (the project's database password).
# Usage:  python apply_migrations.py

import sys
from pathlib import Path

import psycopg

HERE = Path(__file__).resolve().parent
PROJECT_REF = "ywsomacajloqyysslisf"

MIGRATIONS = [
    "migration-002-client-notes.sql",
    "migration-003-progress-and-library.sql",
    "migration-004-unread-and-flags.sql",
    "migration-005-sessions.sql",
    "migration-006-session-details.sql",
    "migration-007-note-stage-week.sql",
    "migration-008-security-hardening.sql",
    "migration-009-reforge-phase.sql",
    "migration-010-attachments.sql",
    "migration-011-homework-reviews.sql",
]

VERIFY_TABLES = [
    "client_notes", "client_dossier", "resources", "resource_shares",
    "room_reads", "message_flags", "room_alerts", "scheduled_sessions",
    "homework_reviews",
]


def read_password() -> str:
    env = (HERE.parent / ".env.local").read_text(encoding="utf-8")
    for line in env.splitlines():
        if line.startswith("SUPABASE_DB_PASSWORD="):
            return line.split("=", 1)[1].strip()
    return ""


def candidates(password: str):
    # Session pooler (IPv4) across likely regions, then the direct host.
    regions = ["eu-west-2", "eu-west-1", "eu-central-1", "us-east-1"]
    for region in regions:
        yield (
            f"aws-0-{region}.pooler.supabase.com", 5432,
            f"postgres.{PROJECT_REF}", password,
        )
    yield (f"db.{PROJECT_REF}.supabase.co", 5432, "postgres", password)


def main():
    password = read_password()
    if not password:
        print("SUPABASE_DB_PASSWORD is empty in .env.local — paste the database password first.")
        sys.exit(1)

    conn = None
    last_error = None
    for host, port, user, pwd in candidates(password):
        try:
            print(f"Connecting to {host} as {user} …")
            conn = psycopg.connect(
                host=host, port=port, user=user, password=pwd,
                dbname="postgres", connect_timeout=12, sslmode="require",
            )
            print("Connected.")
            break
        except Exception as error:
            last_error = error
            print(f"  no: {str(error).strip()[:120]}")
    if conn is None:
        print(f"\nCould not connect anywhere. Last error: {last_error}")
        print("Check the password (Settings -> Database -> Reset database password).")
        sys.exit(1)

    with conn:
        with conn.cursor() as cur:
            for name in MIGRATIONS:
                sql = (HERE / name).read_text(encoding="utf-8")
                print(f"Applying {name} …", end=" ")
                cur.execute(sql)
                print("done")
        conn.commit()

        with conn.cursor() as cur:
            cur.execute(
                "select table_name from information_schema.tables "
                "where table_schema = 'public' and table_name = any(%s)",
                (VERIFY_TABLES,),
            )
            present = {row[0] for row in cur.fetchall()}
    conn.close()

    missing = [table for table in VERIFY_TABLES if table not in present]
    print(f"\nVerified {len(present)}/{len(VERIFY_TABLES)} tables present.")
    if missing:
        print("STILL MISSING:", ", ".join(missing))
        sys.exit(1)
    print("All migrations applied successfully.")


if __name__ == "__main__":
    main()
