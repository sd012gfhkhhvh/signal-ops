# Data Model

> **Document Version:** 1.0
>
> **Status:** Draft (Version 1)
>
> This document defines the persistent data model for SignalOps Version 1, including entities, relationships, database responsibilities, indexing strategy, and persistence decisions.

---

# Table of Contents

- Introduction
- Storage Strategy
- Database Overview
- Entity Relationship Diagram
- Core Entities
- Entity Relationships
- Indexing Strategy
- Soft Deletes
- Audit Fields
- Future Tables
- typeorm Guidelines

---

# Introduction

SignalOps uses a **polyglot persistence** strategy.

Different data is stored in different storage systems depending on its access patterns.

| Data          | Storage    |
| ------------- | ---------- |
| Users         | PostgreSQL |
| Projects      | PostgreSQL |
| Servers       | PostgreSQL |
| Incidents     | PostgreSQL |
| Executions    | PostgreSQL |
| Configuration | PostgreSQL |
| Raw Logs      | ClickHouse |
| Queue Jobs    | Redis      |
| Cache         | Redis      |

Raw telemetry intentionally does **not** live inside PostgreSQL.

---

# Database Overview

Version 1 consists of two databases.

```
                SignalOps

        ┌────────────────────┐
        │    PostgreSQL      │
        └────────────────────┘

Users
Projects
Servers
Policies
Incidents
Executions

                +

        ┌────────────────────┐
        │    ClickHouse      │
        └────────────────────┘

Application Logs
System Logs
Container Logs
```

Redis is used only for BullMQ and caching.

---

# Entity Relationship Diagram

```text
Organization
      │
      │ 1:N
      ▼

Project
      │
      │ 1:N
      ▼

Server
      │
      │ 1:N
      ▼

Incident
      │
      ├──────────────┐
      │              │
      ▼              ▼

Investigation   Execution

      │              │

      └──────┬───────┘

             ▼

        Timeline
```

---

# Core Entities

Version 1 intentionally keeps the number of tables small.

| Entity        | Purpose                  |
| ------------- | ------------------------ |
| User          | Authentication           |
| Organization  | Multi-project owner      |
| Project       | Workspace                |
| Server        | Monitored infrastructure |
| Incident      | Operational issue        |
| Investigation | AI analysis              |
| Execution     | Automation history       |
| Policy        | Automation rules         |

---

# User

Represents an authenticated user.

## Fields

| Field        | Type     |
| ------------ | -------- |
| id           | UUID     |
| email        | String   |
| passwordHash | String   |
| name         | String   |
| createdAt    | DateTime |
| updatedAt    | DateTime |

Relationships

```
User

↓

Organizations
```

---

# Organization

Logical owner of projects.

## Fields

| Field     | Type     |
| --------- | -------- |
| id        | UUID     |
| name      | String   |
| createdAt | DateTime |

Relationships

```
Organization

↓

Projects
```

---

# Project

Represents a monitored workspace.

Examples

```
Production

Staging

Personal Lab
```

## Fields

| Field          | Type     |
| -------------- | -------- |
| id             | UUID     |
| organizationId | UUID     |
| name           | String   |
| description    | String   |
| createdAt      | DateTime |

Relationships

```
Project

↓

Servers

↓

Incidents

↓

Policies
```

---

# Server

Represents a monitored Linux machine.

## Fields

| Field             | Type     |
| ----------------- | -------- |
| id                | UUID     |
| projectId         | UUID     |
| hostname          | String   |
| ipAddress         | String   |
| operatingSystem   | String   |
| environment       | Enum     |
| monitoringEnabled | Boolean  |
| createdAt         | DateTime |

Version 1 only supports Linux.

---

# SSH Credential

Credentials are intentionally separated.

Never store credentials inside the Server table.

## Fields

| Field               | Type    |
| ------------------- | ------- |
| id                  | UUID    |
| serverId            | UUID    |
| username            | String  |
| privateKeyEncrypted | Text    |
| port                | Integer |

Future

Password authentication may be added.

---

# Policy

Controls automation.

## Fields

| Field            | Type    |
| ---------------- | ------- |
| id               | UUID    |
| projectId        | UUID    |
| autoExecute      | Boolean |
| approvalRequired | Boolean |
| allowedTools     | JSON    |

Policies are evaluated before execution.

---

# Incident

The primary aggregate.

## Fields

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| projectId  | UUID      |
| serverId   | UUID      |
| title      | String    |
| summary    | Text      |
| severity   | Enum      |
| status     | Enum      |
| createdAt  | DateTime  |
| resolvedAt | DateTime? |

Relationships

```
Incident

↓

Investigation

↓

Execution

↓

Timeline
```

---

# Investigation

Stores AI output.

## Fields

| Field          | Type   |
| -------------- | ------ |
| id             | UUID   |
| incidentId     | UUID   |
| summary        | Text   |
| rootCause      | Text   |
| confidence     | Float  |
| resolutionPlan | JSON   |
| model          | String |

Only one active investigation exists per incident.

---

# Execution

Stores automation history.

## Fields

| Field      | Type     |
| ---------- | -------- |
| id         | UUID     |
| incidentId | UUID     |
| tool       | String   |
| status     | Enum     |
| startedAt  | DateTime |
| finishedAt | DateTime |
| output     | Text     |

Every execution becomes part of the incident timeline.

---

# Timeline

Stores important events.

Examples

```
Incident Created

Investigation Started

Approval Granted

Execution Started

Execution Completed

Incident Closed
```

## Fields

| Field       | Type     |
| ----------- | -------- |
| id          | UUID     |
| incidentId  | UUID     |
| eventType   | String   |
| description | Text     |
| createdAt   | DateTime |

The Timeline acts as the audit history for an incident.

---

# Entity Relationships

```
Organization

1:N

Project

1:N

Server

1:N

Incident

1:1

Investigation

1:N

Execution

1:N

Timeline
```

---

# Enumerations

## Incident Status

```
OPEN

INVESTIGATING

WAITING_APPROVAL

EXECUTING

VERIFYING

RESOLVED

CLOSED
```

---

## Severity

```
LOW

MEDIUM

HIGH

CRITICAL
```

---

## Environment

```
DEVELOPMENT

STAGING

PRODUCTION
```

---

## Execution Status

```
PENDING

RUNNING

SUCCESS

FAILED

CANCELLED
```

---

# Indexing Strategy

Indexes should exist on frequently queried columns.

Examples

```
Incident.status

Incident.projectId

Incident.serverId

Server.projectId

Timeline.incidentId

Execution.incidentId
```

ClickHouse handles indexing independently for raw telemetry.

---

# Soft Deletes

Version 1 uses soft deletes for:

- Projects
- Servers

Incidents are never deleted.

Executions are never deleted.

Timeline entries are immutable.

---

# Audit Fields

Every PostgreSQL table should include

```
createdAt

updatedAt
```

Where appropriate

```
deletedAt
```

---

# ClickHouse Schema

Version 1 stores normalized logs.

Example fields

```
timestamp

projectId

serverId

hostname

service

level

message

source

metadata
```

No relational joins should be required.

---

# Persistence Rules

Business logic should never use typeorm directly.

Correct

```
Application

↓

Repository Interface

↓

typeorm Repository
```

Incorrect

```
Service

↓

typeorm Client
```

---

# Future Tables

The following tables are intentionally excluded from Version 1.

- Notification
- ExternalTicket
- Runbook
- KnowledgeBase
- AlertRule
- Metric
- Trace
- Correlation
- AI Memory
- Agent

The architecture already supports these additions without requiring major schema changes.

---

# typeorm Guidelines

- Use UUID primary keys for every entity.
- Use explicit relation names where needed.
- Keep enums in the typeorm schema aligned with domain enums.
- Never expose typeorm models directly to the application layer.
- Repositories are the only components allowed to interact with typeorm.

---

# Summary

The SignalOps data model is intentionally small and focused on the core incident-response workflow. PostgreSQL stores operational state, ClickHouse stores telemetry, and Redis supports asynchronous processing. The schema is designed to be easy to understand, straightforward to implement with typeorm, and extensible for future capabilities such as metrics, traces, external ticketing, and AI memory without requiring disruptive database redesigns.
