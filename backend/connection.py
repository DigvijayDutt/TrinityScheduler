import psycopg2

try:
    
    conn = psycopg2.connect(
        host = "localhost",
        database = "trinityscheduler",
        user="admin",
        password="admin123",
        port="5432"
    )

    cur = conn.cursor()
    cur.execute("SELECT Version()")
    db_ver = cur.fetchone()
    print(f"PostgreSQL db version: {db_ver}")

except psycopg2.Error as e:
    print(f"Error connecting:{e}")

finally:
    if cur:
        cur.close()
    if conn:
        conn.close()
    print("Connection Closed")