# 🔒 Security Policy - Campus Careers Mate

We take the security of Campus Careers Mate and the privacy of university students seriously. This document outlines our supported versions, reporting policies, and fundamental security design patterns.

## Supported Versions

Only the latest release version is actively supported with security updates.

| Version | Supported          | Notes |
| ------- | ------------------ | ----- |
| 1.0.x   | :white_check_mark: | Active production and development release |
| < 1.0.x | :x:                | Pre-release / development versions (not supported) |

## Security Foundations

Campus Careers Mate is designed with modern security practices in place:
1. **Authentication & Session Management**: Handled securely via **Clerk** (MFA, session token validation, and RS256 JWT validation for WebSocket connections).
2. **AI Data Privacy**: Frontend interactions with Groq SDK are routed securely through the NestJS backend to keep the `GROQ_API_KEY` hidden and to prevent prompt injection or credential leaks.
3. **Double-Submit CSRF Protection**: Enabled for cookie-based state-changing HTTP requests.
4. **Data Sanitization**: Input fields for user-generated content are sanitized using `isomorphic-dompurify` to protect against XSS (Cross-Site Scripting).
5. **Secure Headers & CORS**: Uses Helmet middleware and strict CORS origins whitelist in development and production environments.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it to us immediately. 

**Do NOT open a public issue on GitHub.**

Please report security bugs by email to **security@campuscareersmate.org** (or contact the senior security team lead).

When reporting a vulnerability, please include:
- A description of the issue.
- Step-by-step instructions or a Proof of Concept (PoC) to reproduce the behavior.
- The potential impact of the vulnerability.

We aim to:
- Acknowledge receipt of your report within 48 hours.
- Provide a detailed status update and resolution plan within 7 days.
- Coordinate a public disclosure once a patch is implemented and deployed.
