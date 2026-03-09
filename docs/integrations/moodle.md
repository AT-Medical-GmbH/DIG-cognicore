# Moodle Integration

CogniCore™ integrates with Moodle via **LTI 1.3** and the **Moodle Web Services REST API**.

## Prerequisites

- Moodle 4.1 or later
- CogniCore™ LTI 1.3 credentials (Client ID, Deployment ID, JWKS URL)
- Moodle administrator access

## Setup Steps

### 1. Register CogniCore™ as an External Tool

1. In Moodle: **Site administration → Plugins → Activity modules → External tool → Manage tools**.
2. Click **Configure a tool manually**.
3. Fill in:
   - **Tool name:** CogniCore™
   - **Tool URL:** `https://<your-cognicore-domain>/lti/launch`
   - **LTI version:** LTI 1.3
   - **Client ID:** (provided by CogniCore™ CogniControl)
   - **Public keyset URL:** `https://<your-cognicore-domain>/lti/.well-known/jwks.json`
   - **Initiate login URL:** `https://<your-cognicore-domain>/lti/login`
   - **Redirection URI(s):** `https://<your-cognicore-domain>/lti/launch`

### 2. Configure Deep Linking

Enable **Content-item message** to allow instructors to embed CogniCore™ sessions directly in Moodle course pages.

### 3. Grade Passback

CogniCore™ supports **LTI Advantage Assignment and Grade Services (AGS)** for automatic grade passback to the Moodle gradebook.

## Course Sync

Optionally, use the Moodle Web Services REST API to sync course enrolments:

```bash
curl "https://<moodle>/webservice/rest/server.php" \
  -d "wstoken=<token>&wsfunction=core_enrol_get_enrolled_users&courseid=42&moodlewsrestformat=json"
```

CogniCoordinator maps Moodle `userid` to CogniCore™ participants automatically.

## Troubleshooting

| Symptom | Resolution |
|---|---|
| "Invalid client_id" on launch | Verify Client ID in CogniControl matches Moodle tool config |
| Grade not appearing in gradebook | Confirm AGS scope is enabled in CogniControl LTI settings |
| Session not loading in iframe | Add CogniCore™ domain to Moodle's `allowedsourceurl` list |
