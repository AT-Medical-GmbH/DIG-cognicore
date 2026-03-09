# BigBlueButton (BBB) Companion Scenario

CogniCore™ can operate alongside an existing **BigBlueButton** deployment, adding AI captioning, analytics, and LMS integration without replacing BBB.

## Architecture

```
LMS (Moodle / Canvas)
        │ LTI 1.3
        ▼
CogniCore™ (CogniCoordinator)
        │  BBB API call (create/join)
        ▼
BigBlueButton Server
        │  Recording webhook
        ▼
CogniCapture ──► Object Storage
        │
CogniChronicle (xAPI)
```

## How It Works

1. Instructor schedules a session in CogniCoordinator.
2. CogniCoordinator calls the **BBB API** (`/bigbluebutton/api/create`) to provision a BBB room.
3. Participants receive a CogniCore™ join link; CogniCore™ generates a BBB join URL and redirects them.
4. CogniCaption connects to the BBB room's audio stream via the BBB internal API and streams ASR results back to CogniCore™ participants.
5. On session end, BBB fires a **recording-ready webhook**; CogniCapture downloads and re-packages the recording.

## Configuration

In `apps/api/.env`:

```env
BBB_URL=https://bbb.institution.edu/bigbluebutton/
BBB_SECRET=your_bbb_shared_secret
BBB_WEBHOOK_SECRET=your_webhook_secret
```

In CogniControl → Integrations → BigBlueButton, enter the same values.

## BBB API Compatibility

Tested with BBB **2.6** and **3.0**. Uses the standard BBB Checksum API (SHA-256).

## Limitations

- Screen-sharing recording from BBB is not re-processed by CogniCapture (BBB's native recording is used).
- CogniCoach engagement metrics are derived from CogniCaption data only (no BBB telemetry).
