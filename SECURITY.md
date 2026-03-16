# Security Policy – CogniCore™

## Supported Versions

Only the latest release of CogniCore™ receives security patches.

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅ Yes             |
| < latest| ❌ No              |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

We take security seriously. If you discover a vulnerability, please report it responsibly:

### Contact

- **Email:** security@atmedical.de
- **PGP Key:** _(publish key fingerprint here once available)_
- **Response SLA:** We aim to acknowledge reports within **48 hours** and provide an initial
  assessment within **5 business days**.

### What to Include

Please include as much of the following as possible:

- Description of the vulnerability and potential impact
- Steps to reproduce (proof-of-concept code, screenshots, logs)
- Affected version(s) / component(s)
- Any suggested mitigations

### Responsible Disclosure

We follow the principle of [Responsible / Coordinated Disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure):

1. Report the vulnerability privately via the contact above.
2. We will investigate and work on a fix.
3. Once a patch is released, we will publicly acknowledge the reporter (with permission).
4. Please allow us a **reasonable remediation window** before any public disclosure.

---

## Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials to the repository.
- Use `.env` for local secrets and ensure `.env` is listed in `.gitignore`.
- Validate and sanitize all external inputs.
- Keep dependencies up to date – Dependabot is enabled on this repository.
- Follow the principle of least privilege for all service accounts and API scopes.

---

| Field | Value |
|---|---|
| **Document** | SECURITY.md |
| **Repository** | AT-Medical / DIG-cognicore |
| **Type** | Project – Private |
| **Owner** | @AT-Medical/admin-team |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-03-16 |
| **Standard** | AT Medical Enterprise Standard v1 |

---

_© AT Medical GmbH® – All rights reserved._
