from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import random
import psycopg2
import bcrypt
from jose import jwt
from datetime import datetime, timedelta, date
import os
from psycopg2.pool import SimpleConnectionPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
import pandas as pd
import io
SECRET_KEY = "SECRET_KEY"   # same as your JS version
ALGORITHM = "HS256"

app = FastAPI()

# DB_HOST = "trinityschedduler-1.cz2gag8s6ils.ap-south-1.rds.amazonaws.com"
# DB_PORT = "5432"
# DB_USER = "postgres"
# DB_PASSWORD = quote_plus("Trinity123&")  
# DB_NAME = "postgres"

# DATABASE_URL = (
#     f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# )

# engine = create_engine(DATABASE_URL, pool_pre_ping=True)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL Connection
pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host="localhost",
    database="trinityscheduler",
    user="admin",
    password="admin123",
    port=5432
)


# Login Route
@app.post("/login")
def login(data: dict):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        email = data.get("email")
        password = data.get("password")

        cur.execute(
            "SELECT id, username, email, password_hash FROM users WHERE email = %s",
            (email,)
        )
        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=401, detail="User not found")

        user_id, db_username, email, password_hash = row

        if password != password_hash:
            raise HTTPException(status_code=401, detail="Invalid password")

        token = jwt.encode(
            {
                "id": user_id,
                "username": db_username,
                "exp": datetime.utcnow() + timedelta(hours=1)
            },
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {"message": "Login successful", "token": token}

    finally:
        cur.close()
        pool.putconn(conn)

@app.get("/jobTypes")
def getJobType():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT type FROM jobs")
        rows = cur.fetchall()
        return [row[0] for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)

@app.get("/employeeNames")
def getEmployeeName():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT name FROM employees")
        rows = cur.fetchall()
        return [row[0] for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)


@app.get("/employees")
def getEmployees():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM employees")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        return [dict(zip(colnames, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)


@app.get("/skills")
def getSkills():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM skills")
        rows = cur.fetchall()
        return [row[0] for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)


@app.get("/jobs")
def getJobs():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM jobs")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        return [dict(zip(colnames, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)


@app.get("/scheduledjobs")
def getScheduledJobs():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM scheduledjobs")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        return [dict(zip(colnames, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)


@app.post("/scheduledjobs")
def postScheduledJobs(data: dict):
    conn = pool.getconn()
    try:
        cur = conn.cursor()

        id = f"J-{random.randint(10000,99999)}"
        address = data.get("address")
        Type = data.get("jobType")
        client = data.get("client")
        status = "Scheduled"
        assigned = data.get("assigned")
        start_date = data.get("time")

        cur.execute(
            """
            INSERT INTO scheduledjobs
            (id, address, type, client, status, assigned, start_date)
            VALUES (%s, %s, %s, %s, %s, %s::int[], %s)
            """,
            (id, address, Type, client, status, assigned, start_date)
        )

        for emp_id in assigned:
            cur.execute(
                "INSERT INTO assignments (jobid, empid, jobdate) VALUES (%s, %s, %s)",
                (id, emp_id, start_date)
            )

        conn.commit()
        return {"message": "Job created", "id": id}

    finally:
        cur.close()
        pool.putconn(conn)


@app.delete("/scheduledjobs/{id}")
def deleteJobs(id: str):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM scheduledjobs WHERE id = %s", (id,))
        conn.commit()
        return {"message": "Job deleted", "id": id}
    finally:
        cur.close()
        pool.putconn(conn)


@app.put("/scheduledjobs/{id}")
def editJobs(id: str, data: dict):
    conn = pool.getconn()
    try:
        cur = conn.cursor()

        cur.execute(
            "SELECT address, type, client, status, start_date FROM scheduledjobs WHERE id = %s",
            (id,)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Job not found")

        address, Type, client, status, start_date = row

        cur.execute(
            """
            UPDATE scheduledjobs
            SET address = %s, type = %s, client = %s, status = %s, start_date = %s
            WHERE id = %s
            """,
            (
                data.get("address", address),
                data.get("type", Type),
                data.get("client", client),
                data.get("status", status),
                data.get("start_date", start_date),
                id
            )
        )

        conn.commit()
        return {"message": "Job updated", "id": id}

    finally:
        cur.close()
        pool.putconn(conn)


@app.get("/scheduledjobs/download")
def download_scheduled_jobs():
    conn = pool.getconn()
    try:
        query = """
        SELECT id, address, type, client, status, assigned, start_date
        FROM scheduledjobs
        """

        df = pd.read_sql(query, conn)
        df["start_date"] = pd.to_datetime(df["start_date"]).dt.date

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Scheduled Jobs")

        output.seek(0)

        headers = {
            "Content-Disposition": "attachment; filename=scheduled_jobs.xlsx"
        }

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers
        )
    finally:
        pool.putconn(conn)

@app.get("/calender/{Date}")
def getCalendar(Date :date):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT sj.start_date, sj.id AS job_id, sj.type, e.name AS employee FROM scheduledjobs sj JOIN assignments ja ON ja.jobid = sj.id JOIN employees e ON e.id = ja.empid ORDER BY sj.start_date;")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        ret = [dict(zip(colnames, row)) for row in rows]
        return ret
    finally:
        cur.close()
        pool.putconn(conn)

@app.get("/calendar")
def getAllCalendar():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM assignments")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        return [dict(zip(colnames, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)

@app.get("/busystaff")
def getBusyStaff():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("select empid from assignments")
        rows = cur.fetchall()
        return [row[0] for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)

@app.put('/skills/{skill},{old}')
def editSkill(skill: str, old: str):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("update skills set onsite_work = %s where onsite_work = %s",(skill,old))
    finally:
        cur.close()
        pool.putconn(conn)

@app.post('/skills')
def addSkill(data: dict):
    conn = pool.getconn()
    skillname = data.get("skillName")
    try:
        cur = conn.cursor()
        cur.execute("insert into skills (onsite_work) values (%s)", (skillname,))
        conn.commit()
        return {"message": "skill created", "name": skillname}
    finally:
        cur.close()
        pool.putconn(conn)

@app.delete("/skills/{id}")
def deleteJobs(id: str):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM skills WHERE onsite_work = %s", (id,))
        conn.commit()
        return {"message": "skill deleted", "id": id}
    finally:
        cur.close()
        pool.putconn(conn)