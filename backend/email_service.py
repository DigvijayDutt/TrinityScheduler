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
def send_assignment_email(
    to_emails: list,
    employee_names: list,
    job_id: str,
    job_type: str,
    job_date,
    client: str,
    address: str
):
    access_token = get_access_token()
    url = f"https://graph.microsoft.com/v1.0/users/{SENDER_EMAIL}/sendMail"

    staff_line = ", ".join(employee_names)
    formatted_date = (
        job_date.strftime("%Y-%m-%d %H:%M")
        if isinstance(job_date, datetime)
        else str(job_date)
    )

    subject = f"Job Assigned – {job_type} | {job_id}"

    body = (
        f"Hi {staff_line},\n\n"
        f"You have been assigned a “{job_type}” job with Job ID “{job_id}” "
        f"scheduled on “{formatted_date}”.\n"
        f"Please meet the client “{client}” at “{address}”.\n\n"
        f"– Trinity Scheduler"
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
