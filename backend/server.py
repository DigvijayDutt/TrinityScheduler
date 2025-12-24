from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import random
from psycopg2.pool import SimpleConnectionPool
from jose import jwt
from datetime import datetime, timedelta, date
import pandas as pd
import io
import os
from psycopg2.pool import SimpleConnectionPool

from psycopg2 import errors

from pydantic import BaseModel
from typing import Optional




# 🔔 EMAIL SERVICE
from email_service import send_assignment_email

# --------------------------
# Config
# --------------------------

# prabhat's change
class EmployeeCreate(BaseModel):
    name: str
    email: str
    teamlead: int
    lister: int
    mover_packer: int
    cleaner: int
    truck_driver: int
    car_driver: int

# prabhat's change
class SkillUpdate(BaseModel):
    name: str
    description: Optional[str] = ""



SECRET_KEY = "SECRET_KEY"
ALGORITHM = "HS256"

app = FastAPI()

# --------------------------
# CORS
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# PostgreSQL Pool
# --------------------------
pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host="localhost",
    database="trinityscheduler",
    user="admin",
    password="admin123",
    port=5432
)

# --------------------------
# LOGIN
# --------------------------
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

# --------------------------
# JOB TYPES
# --------------------------
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
        return [row[0] for row in cur.fetchall()]
    finally:
        cur.close()
        pool.putconn(conn)

@app.get("/employees")
def getEmployees():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM employees ORDER BY id ASC")
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        return [dict(zip(colnames, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)



# prabhat's change
@app.post("/employees")
def createEmployee(emp: EmployeeCreate):
    conn = pool.getconn()
    try:
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO employees
            (name, email, teamlead, lister, mover_packer, cleaner, truck_driver, car_driver)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            emp.name,
            emp.email,
            emp.teamlead,
            emp.lister,
            emp.mover_packer,
            emp.cleaner,
            emp.truck_driver,
            emp.car_driver
        ))

        row = cur.fetchone()
        conn.commit()

        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))

    finally:
        cur.close()
        pool.putconn(conn)



# prabhat's delete
@app.delete("/employees/{emp_id}")
def deleteEmployee(emp_id: int):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM employees WHERE id = %s RETURNING *", (emp_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Employee not found")
        conn.commit()
        return {"message": "Employee deleted successfully", "id": emp_id}
    finally:
        cur.close()
        pool.putconn(conn)


# @app.get("/skills")
# def getSkills():
#     conn = pool.getconn()
#     try:
#         cur = conn.cursor()
#         cur.execute("SELECT * FROM skills")
#         return [row[0] for row in cur.fetchall()]
#     finally:
#         cur.close()
#         pool.putconn(conn)


# prabhat's
@app.get("/skills")
def getSkills():
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, onsite_work, description FROM skills ORDER BY id")
        rows = cur.fetchall()
        return [{"id": r[0], "name": r[1], "description": r[2]} for r in rows]
    finally:
        cur.close()
        pool.putconn(conn)


# --------------------------
# JOBS
# --------------------------
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


# @app.post("/scheduledjobs")
# def postScheduledJobs(data: dict, background_tasks: BackgroundTasks):
#     conn = pool.getconn()
#     try:
#         cur = conn.cursor()

#         job_id = f"J-{random.randint(10000,99999)}"
#         address = data.get("address")
#         job_type = data.get("jobType")
#         client = data.get("client")
#         assigned = [int(e) for e in (data.get("assigned") or [])]
#         start_date = datetime.fromisoformat(data.get("time"))

#         cur.execute("""
#             INSERT INTO scheduledjobs
#             (id, address, type, client, status, assigned, start_date)
#             VALUES (%s, %s, %s, %s, %s, %s::int[], %s)
#         """, (job_id, address, job_type, client, "Scheduled", assigned, start_date))

#         employee_names = []
#         employee_emails = []

#         for emp_id in assigned:
#             cur.execute(
#                 "INSERT INTO assignments (jobid, empid, jobdate) VALUES (%s, %s, %s)",
#                 (job_id, emp_id, start_date)
#             )

#             cur.execute(
#                 "SELECT name, email FROM employees WHERE id = %s",
#                 (emp_id,)
#             )
#             emp = cur.fetchone()
#             if emp and emp[1]:
#                 employee_names.append(emp[0])
#                 employee_emails.append(emp[1])

#         if employee_emails:
#             background_tasks.add_task(
#                 send_assignment_email,
#                 employee_emails,
#                 employee_names,
#                 job_id,
#                 job_type,
#                 start_date,
#                 client,
#                 address
#             )

#         conn.commit()
#         return {"message": "Job created", "id": job_id}

#     finally:
#         cur.close()
#         pool.putconn(conn)


# prabhat's chnage
@app.post("/scheduledjobs")
def postScheduledJobs(data: dict, background_tasks: BackgroundTasks):
    conn = pool.getconn()
    try:
        cur = conn.cursor()

        job_id = f"J-{random.randint(10000,99999)}"
        address = data.get("address")
        job_type = data.get("jobType")
        client = data.get("client")
        assigned = [int(e) for e in (data.get("assigned") or [])]
        start_date = datetime.fromisoformat(data.get("time"))

        # Insert main job record
        cur.execute("""
            INSERT INTO scheduledjobs
            (id, address, type, client, status, assigned, start_date)
            VALUES (%s, %s, %s, %s, %s, %s::int[], %s)
        """, (job_id, address, job_type, client, "Scheduled", assigned, start_date))

        employee_names = []
        employee_emails = []

        # Assign employees safely
        for emp_id in assigned:
            try:
                cur.execute(
                    "INSERT INTO assignments (jobid, empid, jobdate) VALUES (%s, %s, %s)",
                    (job_id, emp_id, start_date)
                )
            except errors.UniqueViolation:
                conn.rollback()
                # fetch employee name
                cur.execute("SELECT name FROM employees WHERE id = %s", (emp_id,))
                emp_name = cur.fetchone()[0]
                raise HTTPException(
                    status_code=400,
                    detail=f"Employee {emp_name} is already assigned on {start_date.date()}"
                )

        # conflicts = []

        # for emp_id in assigned:
        #     try:
        #         cur.execute(
        #             "INSERT INTO assignments (jobid, empid, jobdate) VALUES (%s, %s, %s)",
        #             (job_id, emp_id, start_date)
        #         )
        #     except errors.UniqueViolation:
        #         conn.rollback()
        #         cur.execute("SELECT name FROM employees WHERE id = %s", (emp_id,))
        #         emp_name = cur.fetchone()[0]
        #         conflicts.append(emp_name)

        # if conflicts:
        #     names_str = ", ".join(conflicts)
        #     raise HTTPException(
        #         status_code=400,
        #         detail=f"Employees {names_str} are already assigned on {start_date.date()}"
        #     )


            # fetch email for sending assignment
            cur.execute("SELECT name, email FROM employees WHERE id = %s", (emp_id,))
            emp = cur.fetchone()
            if emp and emp[1]:
                employee_names.append(emp[0])
                employee_emails.append(emp[1])

        if employee_emails:
            background_tasks.add_task(
                send_assignment_email,
                employee_emails,
                employee_names,
                job_id,
                job_type,
                start_date,
                client,
                address
            )

        conn.commit()
        return {"message": "Job created", "id": job_id}

    finally:
        cur.close()
        pool.putconn(conn)



@app.delete("/scheduledjobs/{job_id}")
def deleteJobs(job_id: str):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM scheduledjobs WHERE id = %s", (job_id,))
        conn.commit()
        return {"message": "Job deleted", "id": job_id}
    finally:
        cur.close()
        pool.putconn(conn)

@app.put("/scheduledjobs/{job_id}")
def editJobs(job_id: str, data: dict):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT address, type, client, status, start_date FROM scheduledjobs WHERE id = %s",
            (job_id,)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Job not found")

        address, job_type, client, status, start_date = row

        cur.execute(
            """
            UPDATE scheduledjobs
            SET address = %s, type = %s, client = %s, status = %s, start_date = %s
            WHERE id = %s
            """,
            (
                data.get("address", address),
                data.get("type", job_type),
                data.get("client", client),
                data.get("status", status),
                data.get("start_date", start_date),
                job_id
            )
        )

        conn.commit()
        return {"message": "Job updated", "id": job_id}

    finally:
        cur.close()
        pool.putconn(conn)

# --------------------------
# DOWNLOAD SCHEDULED JOBS
# --------------------------
@app.get("/scheduledjobs/download")
def download_scheduled_jobs():
    conn = pool.getconn()
    try:
        query = "SELECT id, address, type, client, status, assigned, start_date FROM scheduledjobs"
        df = pd.read_sql(query, conn)
        df["start_date"] = pd.to_datetime(df["start_date"]).dt.date

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Scheduled Jobs")
        output.seek(0)

        headers = {"Content-Disposition": "attachment; filename=scheduled_jobs.xlsx"}
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers
        )
    finally:
        pool.putconn(conn)

# --------------------------
# CALENDAR
# --------------------------
@app.get("/calendar/{Date}")
def getCalendar(Date: date):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT sj.start_date, sj.id AS job_id, sj.type,
                   e.name AS employee
            FROM scheduledjobs sj
            JOIN assignments ja ON ja.jobid = sj.id
            JOIN employees e ON e.id = ja.empid
            WHERE sj.start_date::date = %s
            ORDER BY sj.start_date;
        """, (Date,))
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
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
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        cur.close()
        pool.putconn(conn)

# @app.put('/skills/{skill},{old}')
# def editSkill(skill: str, old: str):
#     conn = pool.getconn()
#     try:
#         cur = conn.cursor()
#         cur.execute("update skills set onsite_work = %s where onsite_work = %s",(skill,old))
#     finally:
#         cur.close()
#         pool.putconn(conn)


# prabhat's
@app.put("/skills/{skill_id}")
def updateSkill(skill_id: int, data: SkillUpdate):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        try:
            cur.execute(
                "UPDATE skills SET onsite_work = %s, description = %s WHERE id = %s",
                (data.name, data.description, skill_id)
            )
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Skill not found")

            conn.commit()
            return {"message": "Skill updated", "id": skill_id, "name": data.name}

        except errors.UniqueViolation:
            conn.rollback()
            raise HTTPException(
                status_code=400,
                detail="Skill already exists"
            )
    finally:
        cur.close()
        pool.putconn(conn)





# @app.post('/skills')
# def addSkill(data: dict):
#     conn = pool.getconn()
#     skillname = data.get("skillName")
#     try:
#         cur = conn.cursor()
#         cur.execute("insert into skills (onsite_work) values (%s)", (skillname,))
#         conn.commit()
#         return {"message": "skill created", "name": skillname}
#     finally:
#         cur.close()
#         pool.putconn(conn)


# prabhat's
@app.post("/skills")
def addSkill(data: dict):
    conn = pool.getconn()
    skillname = data.get("skillName")
    description = data.get("description", "")
    try:
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO skills (onsite_work, description) VALUES (%s, %s) RETURNING id",
                (skillname, description)
            )
            skill_id = cur.fetchone()[0]
            conn.commit()
            return {"id": skill_id, "name": skillname, "description": description}

        except errors.UniqueViolation:
            conn.rollback()
            raise HTTPException(
                status_code=400,
                detail="Skill already exists"
            )
    finally:
        cur.close()
        pool.putconn(conn)





# @app.delete("/skills/{id}")
# def deleteJobs(id: str):
#     conn = pool.getconn()
#     try:
#         cur = conn.cursor()
#         cur.execute("DELETE FROM skills WHERE onsite_work = %s", (id,))
#         conn.commit()
#         return {"message": "skill deleted", "id": id}
#     finally:
#         cur.close()
#         pool.putconn(conn)


# prabhat's
@app.delete("/skills/{skill_id}")
def deleteSkill(skill_id: int):
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute(
            "DELETE FROM skills WHERE id = %s RETURNING id",
            (skill_id,)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Skill not found")

        conn.commit()
        return {"message": "Skill deleted", "id": skill_id}
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