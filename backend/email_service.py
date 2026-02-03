import os
import requests
from datetime import datetime

# --------------------------
# Sender email (hardcoded)
# --------------------------
SENDER_EMAIL = "prabhat@trinitycontents.com"

# --------------------------
# Azure credentials
# --------------------------
CLIENT_ID = os.getenv("CLIENT_ID")
TENANT_ID = os.getenv("TENANT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

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
def send_assignment_email(
    to_emails: list,
    employee_names: list,
    team_lead_name: str,   # 👈 ADD THIS
    job_id: str,
    job_type: str,
    job_date,
    client: str,
    address: str,
    loss_type: str = None,
    project_manager: str = None,
    vehicle: str = None,
    special_instructions: str = None
):


    access_token = get_access_token()
    url = f"https://graph.microsoft.com/v1.0/users/{SENDER_EMAIL}/sendMail"

    staff_line = ", ".join(employee_names)
    formatted_date = (
        job_date.strftime("%Y-%m-%d %H:%M")
        if isinstance(job_date, datetime)
        else str(job_date)
        
    )
    team_lead_name = team_lead_name or "N/A"

    loss_type = loss_type or "N/A"
    project_manager = project_manager or "N/A"
    vehicle = vehicle or "N/A"
    special_instructions = special_instructions or "None"

    

    subject = f"Job Assigned – {job_type} | {job_id}"

    body = (
    f"Hi {staff_line},\n\n"
    f"You have been assigned a job with the following details:\n\n"
    f"Team Lead: {team_lead_name}\n\n"
    f"Job ID: {job_id}\n"

    f"Job Type: {job_type}\n"
    f"Date & Time: {formatted_date}\n"
    f"Client: {client}\n"
    f"Address: {address}\n\n"
    f"Additional Information:\n"
    f"• Loss Type: {loss_type}\n"
    f"• Project Manager: {project_manager}\n"
    f"• Vehicle: {vehicle}\n"
    f"• Special Instructions: {special_instructions}\n\n"
    f"Please be on time and follow the instructions carefully.\n\n"
    f"– Prabhat Thakur"
)


    email_msg = {
        "message": {
            "subject": subject,
            "body": {
                "contentType": "Text",
                "content": body
            },
            "toRecipients": [
                {"emailAddress": {"address": email}}
                for email in to_emails
            ]
        }
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    resp = requests.post(url, headers=headers, json=email_msg)
    resp.raise_for_status()

    print(f"Assignment email sent to: {staff_line}")
