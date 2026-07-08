# API Specification

> **Document Version:** 1.0  
> **Status:** Draft (Version 1)

This document defines the REST API for SignalOps Version 1.

The API follows REST principles, uses JSON for request/response payloads, and is versioned to ensure future compatibility.

---

# Table of Contents

- API Principles
- Base URL
- Authentication
- API Conventions
- Error Handling
- Pagination
- Resource Model
- Identity APIs
- Project APIs
- Server APIs
- Telemetry APIs
- Incident APIs
- Investigation APIs
- Policy APIs
- Execution APIs
- Health APIs
- Future APIs

---

# API Principles

SignalOps follows these principles:

- RESTful resource design
- Versioned APIs
- Stateless authentication
- Predictable error responses
- Cursor/Page based pagination
- Consistent response structure

---

# Base URL

```
/api/v1
```

Examples

```
POST /api/v1/auth/login

GET /api/v1/projects

GET /api/v1/incidents
```

---

# Authentication

Version 1 uses

- JWT Access Token
- Refresh Token

Authentication Header

```
Authorization: Bearer <access_token>
```

Protected endpoints require a valid access token.

---

# Standard Response Format

Success

```json
{
  "success": true,
  "message": "Incident created successfully.",
  "data": {}
}
```

---

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email."
    }
  ]
}
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Pagination

Version 1 uses page-based pagination.

Example

```
GET /incidents?page=1&limit=20
```

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 143,
    "totalPages": 8
  }
}
```

---

# Resource Model

```
User

↓

Project

↓

Server

↓

Incident

↓

Investigation

↓

Execution
```

---

# Authentication APIs

## Register

```
POST /auth/register
```

Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}
```

Response

```json
{
  "user": {},
  "accessToken": "",
  "refreshToken": ""
}
```

---

## Login

```
POST /auth/login
```

---

## Refresh Token

```
POST /auth/refresh
```

---

## Logout

```
POST /auth/logout
```

---

## Current User

```
GET /auth/me
```

---

# Project APIs

## List Projects

```
GET /projects
```

---

## Create Project

```
POST /projects
```

Request

```json
{
  "name": "Production",
  "description": "Main production environment"
}
```

---

## Get Project

```
GET /projects/:projectId
```

---

## Update Project

```
PATCH /projects/:projectId
```

---

## Delete Project

```
DELETE /projects/:projectId
```

Soft delete.

---

# Server APIs

## Register Server

```
POST /servers
```

Request

```json
{
  "projectId": "uuid",
  "hostname": "prod-01",
  "ipAddress": "192.168.1.10",
  "environment": "PRODUCTION"
}
```

---

## List Servers

```
GET /servers
```

Supports

```
projectId

environment

status
```

---

## Server Details

```
GET /servers/:serverId
```

---

## Update Server

```
PATCH /servers/:serverId
```

---

## Delete Server

```
DELETE /servers/:serverId
```

---

## Test SSH Connection

```
POST /servers/:serverId/test-connection
```

Response

```json
{
  "connected": true
}
```

---

# Telemetry APIs

Version 1 primarily supports Fluent Bit.

---

## Ingest Logs

```
POST /telemetry/logs
```

Authentication

```
API Key
```

Request

```json
{
  "serverId": "uuid",
  "logs": []
}
```

Response

```json
{
  "accepted": true
}
```

The endpoint acknowledges receipt only.

Heavy processing occurs asynchronously.

---

# Incident APIs

## List Incidents

```
GET /incidents
```

Supports filtering

```
projectId

serverId

severity

status

date range
```

---

## Incident Details

```
GET /incidents/:incidentId
```

Returns

- Incident
- Investigation
- Timeline
- Executions

---

## Update Incident

```
PATCH /incidents/:incidentId
```

Fields

- Severity
- Status

---

## Close Incident

```
POST /incidents/:incidentId/close
```

---

## Incident Timeline

```
GET /incidents/:incidentId/timeline
```

---

# Investigation APIs

## Investigation Details

```
GET /investigations/:incidentId
```

Returns

```json
{
  "summary": "",
  "rootCause": "",
  "confidence": 0.92,
  "resolutionPlan": []
}
```

---

## Regenerate Investigation

```
POST /investigations/:incidentId/regenerate
```

Queues a new AI investigation.

---

# Policy APIs

## Get Policy

```
GET /policies/:projectId
```

---

## Update Policy

```
PATCH /policies/:projectId
```

Request

```json
{
  "autoExecute": false,
  "approvalRequired": true,
  "allowedTools": ["restart_service", "restart_container"]
}
```

---

# Execution APIs

## Execute Plan

```
POST /executions
```

Request

```json
{
  "incidentId": "uuid"
}
```

Execution is validated by the Policy Engine before starting.

---

## List Executions

```
GET /executions
```

---

## Execution Details

```
GET /executions/:executionId
```

Returns

- Tool
- Status
- Output
- Started At
- Finished At

---

## Approve Execution

```
POST /executions/:executionId/approve
```

---

## Reject Execution

```
POST /executions/:executionId/reject
```

---

# Health APIs

## Health Check

```
GET /health
```

Returns

```json
{
  "status": "healthy"
}
```

---

## Readiness

```
GET /health/ready
```

Checks

- PostgreSQL
- Redis
- Worker

---

## Liveness

```
GET /health/live
```

---

# Error Codes

| Code                  | Description              |
| --------------------- | ------------------------ |
| AUTH_INVALID_TOKEN    | Invalid JWT              |
| AUTH_EXPIRED_TOKEN    | Expired Token            |
| PROJECT_NOT_FOUND     | Project missing          |
| SERVER_NOT_FOUND      | Server missing           |
| INCIDENT_NOT_FOUND    | Incident missing         |
| POLICY_DENIED         | Policy blocked execution |
| SSH_CONNECTION_FAILED | SSH failed               |
| AI_PROVIDER_ERROR     | LLM unavailable          |
| VALIDATION_ERROR      | Validation failed        |

---

# Versioning Strategy

Version 1

```
/api/v1
```

Future

```
/api/v2
```

Breaking changes will never be introduced into an existing API version.

---

# Security

All protected endpoints require JWT authentication.

Telemetry ingestion uses API Keys instead of JWT because it is intended for machine-to-machine communication.

Sensitive information such as SSH private keys and AI provider credentials are never returned by any API.

---

# Future APIs

The following endpoints are intentionally excluded from Version 1.

```
/metrics

/traces

/agents

/tickets

/notifications

/integrations

/webhooks

/runbooks

/knowledge-base
```

These resources will be introduced incrementally as the platform evolves.

---

# API Design Guidelines

- Use nouns for resources (`/servers`, `/incidents`)
- Use plural resource names
- Prefer `PATCH` over `PUT` for partial updates
- Keep request and response DTOs separate from database entities
- Never expose internal database identifiers beyond resource IDs
- Validation should occur at the API boundary using DTOs
- Long-running operations should return immediately and execute asynchronously through BullMQ

---

# Summary

The SignalOps API is intentionally designed around business resources rather than implementation details. It exposes a clean, versioned REST interface for managing infrastructure, ingesting telemetry, investigating incidents, and executing approved remediation workflows. By keeping asynchronous operations behind queues and maintaining stable resource contracts, the API remains scalable, predictable, and easy to consume from the future dashboard or external integrations.
