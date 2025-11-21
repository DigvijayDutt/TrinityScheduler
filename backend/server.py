from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import bcrypt
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "SECRET_KEY"   # same as your JS version
ALGORITHM = "HS256"

app = FastAPI()

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