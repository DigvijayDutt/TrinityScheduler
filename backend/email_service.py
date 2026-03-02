import os
import requests
from datetime import datetime
import requests
import html
from email_signature import SIGNATURE_HTML

# --------------------------
# Sender email (hardcoded)
# --------------------------
SENDER_EMAIL = "schedule@trinitycontents.com"

# --------------------------
# Azure credentials
# --------------------------
CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
TENANT_ID = os.getenv("AZURE_TENANT_ID")
CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")

# --------------------------
# Get Microsoft Graph token
# --------------------------
def get_access_token():
    url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    data = {
        "client_id": CLIENT_ID,
        "scope": "https://graph.microsoft.com/.default",
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
    }
    resp = requests.post(url, data=data)
    resp.raise_for_status()
    return resp.json()["access_token"]

# --------------------------
# SEND ONE EMAIL TO MANY STAFF
# --------------------------
# def send_assignment_email(
#     to_emails: list,
#     employee_names: list,
#     team_lead_name: str,   # 👈 ADD THIS
#     job_id: str,
#     job_type: str,
#     job_date,
#     client: str,
#     address: str,
#     loss_type: str = None,
#     project_manager: str = None,
#     vehicle: str = None,
#     special_instructions: str = None
# ):
# def send_assignment_email(
#     to_emails: list,
#     employee_names: list,
#     team_lead_name: str,
#     job_id: str,
#     job_type: str,
#     job_date,
#     start_time=None,
#     end_time=None,
#     client: str = "",
#     address: str = "",
#     loss_type: str = None,
#     project_manager: str = None,
#     vehicle: str = None,
#     special_instructions: str = None
# ):



#     access_token = get_access_token()
#     url = f"https://graph.microsoft.com/v1.0/users/{SENDER_EMAIL}/sendMail"

#     staff_line = ", ".join(employee_names)
#     formatted_date = (
#     job_date.strftime("%Y-%m-%d") if isinstance(job_date, datetime) else str(job_date)
# )
#     formatted_start_time = start_time.strftime("%H:%M") if start_time else "—"
#     formatted_end_time = end_time.strftime("%H:%M") if end_time else "—"

#     team_lead_name = team_lead_name or "N/A"

#     loss_type = loss_type or "N/A"
#     project_manager = project_manager or "N/A"
#     vehicle = vehicle or "N/A"
#     special_instructions = special_instructions or "None"

    

#     subject = f"Job Assigned – {job_type} | {job_id}"

#     body = (
#     f"Hi {staff_line},\n\n"
#     f"You have been assigned a job with the following details:\n\n"
#     f"Team Lead: {team_lead_name}\n\n"
#     f"Job ID: {job_id}\n"
#     f"Job Type: {job_type}\n"
#     f"Date: {formatted_date}\n"
#     f"Start Time: {formatted_start_time}\n"
#     f"End Time: {formatted_end_time}\n"
#     f"Client: {client}\n"
#     f"Address: {address}\n\n"
#     f"Additional Information:\n"
#     f"• Loss Type: {loss_type}\n"
#     f"• Project Manager: {project_manager}\n"
#     f"• Vehicle: {vehicle}\n"
#     f"• Special Instructions: {special_instructions}\n\n"
#     f"Please be on time and follow the instructions carefully.\n\n"
#     f"– Prabhat Thakur"
# )



#     email_msg = {
#         "message": {
#             "subject": subject,
#             "body": {
#                 "contentType": "Text",
#                 "content": body
#             },
#             "toRecipients": [
#                 {"emailAddress": {"address": email}}
#                 for email in to_emails
#             ]
#         }
#     }

#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json"
#     }

#     resp = requests.post(url, headers=headers, json=email_msg)
#     resp.raise_for_status()

#     print(f"Assignment email sent to: {staff_line}")




def send_today_jobs_email(to_emails: list, jobs: list, job_date):
    # ✅ SAFETY CHECK (Graph fails if recipients empty)
    if not to_emails:
        raise ValueError("No recipient emails provided")

    access_token = get_access_token()
    url = f"https://graph.microsoft.com/v1.0/users/{SENDER_EMAIL}/sendMail"

    formatted_date = job_date.strftime("%Y-%m-%d")
    rows_html = ""

    for i, job in enumerate(jobs, start=1):
        start_time = job.get("start_time", "")
        end_time = job.get("end_time", "")
        time_range = f"{start_time} - {end_time}" if start_time or end_time else ""

        rows_html += f"""
        <tr>
            <td>{i}</td>
            <td>{html.escape(str(job.get('team_lead', '')))}</td>
            <td>{html.escape(str(job.get('assigned_staffs', ''))).replace(chr(10), '<br/>')}</td>
            <td>{html.escape(str(job.get('address', '')))}</td>
            <td>{time_range}</td>
            <td>{html.escape(str(job.get('type', '')))}</td>
            <td>{html.escape(str(job.get('client', '')))}</td>
            <td>{html.escape(str(job.get('project_manager', '')))}</td>
            <td>{html.escape(str(job.get('special_instructions', '')))}</td>
            <td>{html.escape(str(job.get('vehicle', '')))}</td>
        </tr>
        """

    body = f"""
    <html>
    <head>
    <style>
        table {{
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 12px;
        }}
        th {{
            background-color: #2f5597;
            color: white;
            padding: 8px;
            border: 1px solid #1f3d7a;
            text-align: center;
        }}
        td {{
            border: 1px solid #cccccc;
            padding: 6px;
            vertical-align: top;
            text-align: center;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        td:nth-child(3),
        td:nth-child(4) {{
            text-align: left;
        }}
    </style>
    </head>

    <body>
        <p><b>Hello Team</b></p>
        <p>Below is the job schedule for <b>{formatted_date}</b>:</p>

        <table>
            <tr>
                <th>S NO</th>
                <th>TEAM LEAD</th>
                <th>ASSIGNED STAFF</th>
                <th>ADDRESS</th>
                <th>TIME</th>
                <th>TYPE</th>
                <th>CLIENT</th>
                <th>PROJECT MANAGER</th>
                <th>SPECIAL INSTRUCTIONS</th>
                <th>VEHICLE</th>
            </tr>
            {rows_html}
        </table>

        <br/>
        {SIGNATURE_HTML}
    </body>
    </html>
    """

    # ✅ GRAPH-COMPLIANT PAYLOAD
    email_msg = {
        "message": {
            "subject": f"Today's Job Schedule – {formatted_date}",
            "body": {
                "contentType": "HTML",
                "content": body
            },
            "toRecipients": [
                {"emailAddress": {"address": email.strip()}}
                for email in to_emails if email
            ]
        },
        "saveToSentItems": True   # ✅ IMPORTANT (fixes 400 in many tenants)
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=email_msg)

    # ✅ BETTER ERROR VISIBILITY
    if not response.ok:
        raise Exception(
            f"Graph sendMail failed: {response.status_code} - {response.text}"
        )
