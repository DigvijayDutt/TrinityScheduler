from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import random
import psycopg2
import bcrypt
from jose import jwt
from datetime import datetime, timedelta, date
import os
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
conn = psycopg2.connect(
    host="localhost",
    database="trinityscheduler",
    user="admin",
    password="admin123",
    port=5432
)


# Login Route
@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    cur = conn.cursor()
    cur.execute("SELECT id, username, email, password_hash FROM users WHERE email = %s", (email,))
    row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=401, detail="User not found")

    user_id, db_username, email, password_hash = row

    # Compare password
    if password != password_hash:
        raise HTTPException(status_code=401, detail="Invalid password")

    # Create JWT
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

@app.get("/jobTypes")
def getJobType():
    cur = conn.cursor()
    cur.execute("select type from jobs")
    rows = cur.fetchall()
    return [row[0] for row in rows]

@app.get("/employeeNames")
def getEmployeeName():
    cur = conn.cursor()
    cur.execute("select name from employees")
    rows = cur.fetchall()
    return [row[0] for row in rows]

@app.get("/employees")
def getEmployees():
    cur = conn.cursor()
    cur.execute("select * from employees")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]

    return [dict(zip(colnames, row)) for row in rows]

@app.get("/skills")
def getSkills():
    cur = conn.cursor()
    cur.execute("select * from skills")
    rows = cur.fetchall()
    return [row[0] for row in rows]

@app.get("/jobs")
def getJobs():
    cur = conn.cursor()
    cur.execute("select * from jobs")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    ret = [dict(zip(colnames, row)) for row in rows]
    return ret

@app.get("/scheduledjobs")
def getScheduledJobs():
    cur = conn.cursor()
    cur.execute("select * from scheduledjobs")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    ret = [dict(zip(colnames, row)) for row in rows]
    return ret

@app.post("/scheduledjobs")
def postScheduledJobs(data: dict):
    id = f"J-{random.randint(10000,99999)}"
    address = data.get("address")
    Type = data.get("jobType")
    client = data.get("client")
    status = "Scheduled"
    assigned = data.get("assigned")
    start_date = data.get("time")
    cur = conn.cursor()
    cur.execute("insert into scheduledjobs (id,address,type,client,status,assigned,start_date) values (%s, %s, %s, %s, %s, %s::int[], %s)", (id, address, Type, client, status, assigned, start_date))
    for i in assigned:
        cur.execute("insert into assignments (jobid,empid,jobdate) values (%s,%s,%s)", (id,i,start_date))
    
    conn.commit()
    return {
        "message": "Job created successfully",
        "id": id,
        "address": address,
        "type": Type,
        "client": client,
        "status": status,
        "assigned": assigned,
        "start_date": start_date
    }

@app.delete("/scheduledjobs/{id}")
def deleteJobs(id: str):
    cur = conn.cursor()
    cur.execute("delete from scheduledjobs where id=%s",(id,))
    conn.commit()
    return {
        "message": "Job deleted",
        "id": id,
    }

@app.put("/scheduledjobs/{id}")
def editJobs(id: str,data: dict):
    cur = conn.cursor()
    cur.execute(
        "SELECT id, address, type, client, status, assigned, start_date "
        "FROM scheduledjobs WHERE id = %s",
        (id,)
    )
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    
    existing_id, existing_address, existing_type,existing_client, existing_status, existing_assigned, existing_start_date = row

    new_address = data.get("address", existing_address)
    new_type = data.get("type", existing_type)
    new_client = data.get("client", existing_client)
    new_status = data.get("status", existing_status)
    new_start_date = data.get("start_date", existing_start_date)

    cur.execute(
        """
        UPDATE scheduledjobs
        SET address = %s,
            type = %s,
            client = %s,
            status = %s,
            start_date = %s
        WHERE id = %s
        """,
        (new_address, new_type, new_client, new_status, new_start_date, id)
    )
    conn.commit()
    return {
        "message": "Job editted",
        "id": id,
    }

@app.get("/scheduledjobs/download")
def download_scheduled_jobs():
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

@app.get("/calender/{Date}")
def getCalendar(Date :date):
    cur = conn.cursor()
    cur.execute("SELECT sj.start_date, sj.id AS job_id, sj.type, e.name AS employee FROM scheduledjobs sj JOIN assignments ja ON ja.jobid = sj.id JOIN employees e ON e.id = ja.empid ORDER BY sj.start_date;")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    ret = [dict(zip(colnames, row)) for row in rows]
    return ret

@app.get("/calendar")
def getAllCalendar():
    cur =conn.cursor()
    cur.execute("select * from assignments;")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    ret = [dict(zip(colnames, row)) for row in rows]
    return ret