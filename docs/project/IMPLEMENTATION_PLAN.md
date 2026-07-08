# SignalOps - Implementation Plan

> **Purpose**
>
> This document is the master implementation roadmap for SignalOps Version 1.
>
> Every feature should be implemented according to this sequence unless an architectural decision explicitly changes the order.
>
> This roadmap is optimized for:
>
> - Solo development
> - Incremental delivery
> - Continuous testing
> - AI-assisted development

---

# Development Strategy

SignalOps should be developed **vertically**, not horizontally.

Instead of building all controllers first, then all services, then all entities...

❌ Don't do this

```
Authentication

↓

Projects

↓

Servers

↓

Incidents

↓

AI
```

Instead build one complete feature at a time.

Example

```
Authentication

Entity

↓

Repository

↓

Service

↓

Controller

↓

Tests

↓

Documentation
```

Then move to the next feature.

Every milestone should produce working software.

---

# Current Progress

Overall Progress

```
████░░░░░░░░░░░░░░░░ 20%
```

Architecture & Documentation

✅ Complete

Implementation

⬜ Not Started

---

# Phase 0 — Repository Foundation

Status

⬜ Not Started

Goal

Bootstrap the entire development environment.

---

## Tasks

### Repository

- [ ] Initialize Git Repository
- [ ] Configure PNPM Workspace
- [ ] Configure TypeScript
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Configure Husky
- [ ] Configure Commitlint

---

### Applications

- [ ] Create API Application
- [ ] Create Worker Application
- [ ] Create shared packages

---

### Docker

- [ ] PostgreSQL
- [ ] Redis
- [ ] ClickHouse
- [ ] Fluent Bit

---

### Backend

- [ ] Configure NestJS
- [ ] Configure TypeORM
- [ ] Configure Config Module
- [ ] Configure Validation
- [ ] Configure Logging

---

### Testing

- [ ] Vitest
- [ ] Supertest

---

## Exit Criteria

- Applications start successfully
- Docker stack runs
- Database connection works
- Redis connection works
- Worker starts
- Health endpoint returns success

---

# Phase 1 — Identity

Status

⬜ Not Started

Goal

Authentication & authorization.

---

## Tasks

### User

- [ ] Entity
- [ ] Repository
- [ ] Service
- [ ] Controller

---

### Authentication

- [ ] Register
- [ ] Login
- [ ] Refresh Token
- [ ] Logout

---

### Security

- [ ] JWT
- [ ] Password Hashing
- [ ] Guards

---

### Tests

- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests

---

## Exit Criteria

Users can:

- Register
- Login
- Access protected routes

---

# Phase 2 — Projects

Status

⬜ Not Started

Goal

Project management.

---

## Tasks

- [ ] Project Entity
- [ ] Repository
- [ ] CRUD API
- [ ] Validation
- [ ] Tests

---

## Exit Criteria

Projects can be created and managed.

---

# Phase 3 — Infrastructure

Status

⬜ Not Started

Goal

Manage monitored servers.

---

## Tasks

### Servers

- [ ] Entity
- [ ] Repository
- [ ] CRUD

---

### SSH

- [ ] Credentials
- [ ] Encryption
- [ ] Connection Test

---

### Tests

- [ ] Unit
- [ ] Integration

---

## Exit Criteria

Server registration is complete.

SSH connection test passes.

---

# Phase 4 — Telemetry

Status

⬜ Not Started

Goal

Receive logs.

---

## Tasks

### Ingestion

- [ ] Fluent Bit Endpoint
- [ ] Validation
- [ ] Normalization

---

### Queue

- [ ] BullMQ
- [ ] Queue Producer
- [ ] Queue Consumer

---

### Storage

- [ ] ClickHouse

---

## Exit Criteria

Logs reach BullMQ.

---

# Phase 5 — Detection Engine

Status

⬜ Not Started

Goal

Detect anomalies.

---

## Tasks

- [ ] Rule Engine
- [ ] Pattern Matching
- [ ] Severity Assignment
- [ ] Incident Creation

---

## Exit Criteria

Incident created from matching log.

---

# Phase 6 — Incident Management

Status

⬜ Not Started

Goal

Native incident system.

---

## Tasks

- [ ] Incident Entity
- [ ] Timeline
- [ ] Status Flow
- [ ] CRUD API

---

## Exit Criteria

Incidents visible through API.

---

# Phase 7 — Notifications

Status

⬜ Not Started

Goal

Notify engineers.

---

## Tasks

### Email

- [ ] SMTP
- [ ] Templates

---

### Slack

- [ ] Webhook
- [ ] Templates

---

## Exit Criteria

Notifications received.

---

# Phase 8 — AI Investigation

Status

⬜ Not Started

Goal

Generate AI investigations.

---

## Tasks

### Context Builder

- [ ] Recent Logs
- [ ] Server Details
- [ ] Incident Summary

---

### AI

- [ ] Prompt Builder
- [ ] LLM Client
- [ ] JSON Parser

---

### Investigation

- [ ] Summary
- [ ] Root Cause
- [ ] Confidence
- [ ] Resolution Plan

---

## Exit Criteria

Incident receives AI investigation.

---

# Phase 9 — Automation

Status

⬜ Not Started

Goal

Execute approved plans.

---

## Tasks

### Policy

- [ ] Auto Execute
- [ ] Approval Required
- [ ] Allowed Tools

---

### Execution

- [ ] Tool Registry
- [ ] SSH Executor

---

### Verification

- [ ] Success Check
- [ ] Incident Resolution

---

## Exit Criteria

Approved plan executes successfully.

---

# Phase 10 — Dashboard

Status

⬜ Not Started

Goal

Basic UI.

---

## Pages

- [ ] Login
- [ ] Projects
- [ ] Servers
- [ ] Incidents
- [ ] Incident Details

---

## Exit Criteria

Entire workflow accessible through UI.

---

# MVP Completion Checklist

Authentication

- [ ] Complete

Projects

- [ ] Complete

Servers

- [ ] Complete

Telemetry

- [ ] Complete

Detection

- [ ] Complete

Incident Management

- [ ] Complete

Notifications

- [ ] Complete

AI Investigation

- [ ] Complete

Automation

- [ ] Complete

Dashboard

- [ ] Complete

---

# Definition of Done

A feature is considered complete only if:

- [ ] Business logic implemented
- [ ] API completed
- [ ] Validation implemented
- [ ] Tests written
- [ ] Documentation updated
- [ ] No critical TODOs remain
- [ ] Lint passes
- [ ] Build succeeds

---

# Development Rules

Every implementation session should follow this order:

1. Read `PROJECT_STATUS.md`
2. Pick the highest priority incomplete task.
3. Implement one feature completely.
4. Write tests.
5. Update documentation.
6. Update `PROJECT_STATUS.md`.
7. Commit changes.

Never begin a new feature while the current one is incomplete unless blocked by an architectural dependency.

---

# Version 1 Success Criteria

SignalOps Version 1 is complete when the following workflow succeeds end-to-end:

```
Linux Server

↓

Fluent Bit

↓

Telemetry API

↓

BullMQ

↓

Detection Engine

↓

Incident Created

↓

Email / Slack Notification

↓

AI Investigation

↓

Policy Validation

↓

SSH Execution

↓

Verification

↓

Incident Resolved
```

At that point, Version 1 is considered feature complete and future development should move to Version 2 enhancements rather than expanding the MVP scope.
