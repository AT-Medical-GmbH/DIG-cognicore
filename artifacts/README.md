# Artifacts Directory

This directory stores generated build artifacts, release packages, and deployment bundles
produced by the CI/CD pipeline for **CogniCore™**.

## Contents

| Subdirectory | Description |
|---|---|
| `builds/` | Compiled application bundles (frontend & backend) |
| `releases/` | Tagged release archives |
| `reports/` | CI test coverage, audit, and governance reports |

## Usage

Artifacts in this directory are **generated automatically** by the CI/CD workflows.
Do not commit manually produced files here.

All artifacts are tracked via `.gitignore` (binary bundles) and archived in GitHub Actions
artifact storage for traceability.

---

_© AT Medical GmbH® – All rights reserved._
