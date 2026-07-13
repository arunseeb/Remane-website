from pathlib import Path

import psycopg

env = (Path(__file__).resolve().parent.parent / ".env.local").read_text(encoding="utf-8")
pwd = next(
    line.split("=", 1)[1].strip()
    for line in env.splitlines()
    if line.startswith("SUPABASE_DB_PASSWORD=")
)
conn = psycopg.connect(
    host="db.ywsomacajloqyysslisf.supabase.co", port=5432,
    user="postgres", password=pwd, dbname="postgres", sslmode="require",
)
with conn.cursor() as cur:
    cur.execute("select id from rooms where type='dm' limit 1")
    room = cur.fetchone()[0]
    cur.execute("select id from profiles where role='client' limit 1")
    client = cur.fetchone()[0]
    cur.execute(
        "insert into messages (room_id, sender_id, content) values (%s, %s, %s) returning id",
        (room, client, "Test message — checking the unread indicator. (You can delete this.)"),
    )
    print("inserted message", cur.fetchone()[0])
conn.commit()
conn.close()
