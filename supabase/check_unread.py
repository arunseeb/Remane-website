# Diagnostic: what unread counts should each user currently see?
from pathlib import Path

import psycopg

HERE = Path(__file__).resolve().parent


def read_password() -> str:
    env = (HERE.parent / ".env.local").read_text(encoding="utf-8")
    for line in env.splitlines():
        if line.startswith("SUPABASE_DB_PASSWORD="):
            return line.split("=", 1)[1].strip()
    return ""


conn = psycopg.connect(
    host="db.ywsomacajloqyysslisf.supabase.co", port=5432,
    user="postgres", password=read_password(), dbname="postgres",
    connect_timeout=12, sslmode="require",
)
with conn.cursor() as cur:
    cur.execute("select id, role, coalesce(nullif(full_name,''), email) from profiles")
    profiles = cur.fetchall()
    print("PROFILES:")
    for pid, role, name in profiles:
        print(f"  {str(pid)[:8]}  {role:6}  {name}")

    cur.execute("""
        select r.id, r.type, coalesce(r.name,'(dm)'),
               (select count(*) from messages m where m.room_id = r.id)
        from rooms r order by r.created_at
    """)
    print("\nROOMS:")
    for rid, rtype, name, count in cur.fetchall():
        print(f"  {str(rid)[:8]}  {rtype:9}  {name:20}  {count} messages")

    cur.execute("select room_id, user_id, last_read_at from room_reads")
    print("\nROOM_READS:")
    rows = cur.fetchall()
    for rid, uid, ts in rows:
        print(f"  room {str(rid)[:8]}  user {str(uid)[:8]}  last_read {ts}")
    if not rows:
        print("  (none)")

    print("\nEXPECTED UNREAD PER USER:")
    for pid, role, name in profiles:
        cur.execute("""
            select m.room_id, count(*)
            from messages m
            join room_members rm on rm.room_id = m.room_id and rm.user_id = %s
            left join room_reads r on r.room_id = m.room_id and r.user_id = %s
            where m.sender_id <> %s
              and m.created_at > coalesce(r.last_read_at, 'epoch'::timestamptz)
            group by m.room_id
        """, (pid, pid, pid))
        result = cur.fetchall()
        total = sum(c for _, c in result)
        print(f"  {name} ({role}): total {total}  {[(str(r)[:8], c) for r, c in result]}")
conn.close()
