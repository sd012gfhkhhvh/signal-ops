# SignalOps - Decision Log

> **Purpose**
>
> This document records all significant architectural, technical, and product decisions made throughout the development of SignalOps.
>
> Unlike `docs/architecture/DECISIONS.md`, which documents long-term architectural principles, this file is a chronological journal of decisions made during implementation.
>
> Every significant decision should answer:
>
> - What changed?
> - Why was it changed?
> - What alternatives were considered?
> - What impact does it have?
>
> This document is intended to help both human developers and AI agents understand the evolution of the project.

---

# Decision Template

Every new entry should follow this format.

```markdown
## DEC-XXXX

**Date**

YYYY-MM-DD

**Status**

Accepted | Proposed | Superseded | Rejected

**Category**

Architecture | Backend | Database | AI | API | Security | Infrastructure | Frontend | Documentation

**Decision**

...

**Context**

...

**Alternatives Considered**

...

**Reason**

...

**Impact**

...

**Affected Documents**

...

**Affected Code**

...
```

---

# Decision History

---

## DEC-0001

**Date**

2026-07-08

**Status**

Accepted

**Category**

Architecture

### Decision

SignalOps will be developed as an **AI-native Incident Response Platform** rather than a traditional monitoring dashboard.

### Context

The original idea focused primarily on log monitoring and automated issue resolution.

During architecture planning, the project vision expanded to include incident management, AI-assisted investigations, secure automation, and future support for multiple telemetry sources.

### Alternatives Considered

- AI Log Analyzer
- Monitoring Dashboard
- Log Management Platform

### Reason

The broader architecture provides significantly more room for future growth while remaining achievable as a Version 1 portfolio project.

### Impact

Changed overall product direction.

Future versions can naturally support:

- Metrics
- Traces
- OpenTelemetry
- SignalOps Agent
- AI SRE

### Affected Documents

- README.md
- PROJECT_VISION.md
- OVERVIEW.md

---

## DEC-0002

**Date**

2026-07-08

**Status**

Accepted

**Category**

Architecture

### Decision

Use **Domain-Driven Design** and **Clean Architecture**.

### Context

The project is expected to grow over multiple versions.

Keeping business logic independent from frameworks reduces future maintenance costs.

### Alternatives Considered

- Layered Architecture
- Feature Modules Only
- MVC

### Reason

DDD aligns naturally with the business domains of SignalOps.

### Impact

Business logic is isolated from infrastructure.

Each domain owns:

- Entities
- Services
- Repositories
- Events

---

## DEC-0003

**Date**

2026-07-08

**Status**

Accepted

**Category**

Architecture

### Decision

Use an event-driven workflow with BullMQ.

### Context

Log analysis and AI processing are asynchronous operations.

Blocking HTTP requests would reduce throughput and increase latency.

### Alternatives Considered

- Synchronous Processing
- NestJS EventEmitter Only
- RabbitMQ

### Reason

BullMQ provides a simple yet scalable queueing solution for Version 1 while leaving a migration path to Kafka or NATS in the future.

### Impact

API and Worker applications are separated.

---

## DEC-0004

**Date**

2026-07-08

**Status**

Accepted

**Category**

Backend

### Decision

Use **TypeORM** as the ORM.

### Context

The initial design referenced Prisma.

### Alternatives Considered

- Prisma
- MikroORM

### Reason

TypeORM integrates naturally with NestJS and offers mature support for decorators, repositories, and entity-based development.

### Impact

Future implementation should use:

- TypeORM Entities
- TypeORM Migrations
- Repository Pattern

All future documentation and implementation should assume TypeORM.

---

## DEC-0005

**Date**

2026-07-08

**Status**

Accepted

**Category**

Database

### Decision

Use polyglot persistence.

### Context

Operational data and telemetry have different storage requirements.

### Decision Summary

PostgreSQL

Stores

- Users
- Projects
- Servers
- Policies
- Incidents
- Executions

ClickHouse

Stores

- Logs

Redis

Stores

- Queue Jobs
- Cache

### Reason

Each technology is optimized for its workload.

---

## DEC-0006

**Date**

2026-07-08

**Status**

Accepted

**Category**

AI

### Decision

The AI must never execute arbitrary shell commands.

### Context

Direct shell execution is insecure and difficult to audit.

### Decision Summary

AI generates structured execution plans.

Example

```json
{
  "tool": "restart_service",
  "parameters": {
    "service": "nginx"
  }
}
```

The backend validates and executes predefined tools only.

### Impact

A Tool Registry and Policy Engine become mandatory components.

---

## DEC-0007

**Date**

2026-07-08

**Status**

Accepted

**Category**

Project Scope

### Decision

Version 1 intentionally targets Linux servers using Fluent Bit for log ingestion.

### Context

Supporting Kubernetes, OpenTelemetry, Prometheus, and custom agents in Version 1 would significantly increase implementation complexity.

### Reason

A narrow but complete workflow provides better engineering quality and a stronger portfolio project.

### Deferred Features

- Kubernetes
- Metrics
- Traces
- SignalOps Agent
- Correlation Engine
- Multi-Agent AI

---

## DEC-0008

**Date**

2026-07-08

**Status**

Accepted

**Category**

Project Management

### Decision

The repository documentation is the single source of truth.

### Context

AI conversations have finite context windows.

### Decision Summary

Every development session must begin by reading:

- PROJECT_STATUS.md
- IMPLEMENTATION_PLAN.md
- PROJECT_INSTRUCTIONS.md

Documentation must always be updated together with implementation.

### Impact

Future AI agents can continue development without relying on previous chat history.

---

# Future Decisions

Add new decisions below this line.

---

## DEC-0009

**Status**

Reserved

---

## DEC-0010

**Status**

Reserved

---

# Maintenance Rules

Update this document whenever:

- A technology changes
- A major dependency changes
- A database design changes
- A module is added or removed
- The architecture changes
- Version scope changes
- AI workflow changes

Do **not** update this file for:

- Bug fixes
- Refactoring
- Minor implementation details
- Formatting changes
- Documentation wording changes

Only record decisions that affect the long-term evolution of the project.

---

# Summary

This document serves as the historical record of SignalOps' evolution.

It explains not only **what** changed, but **why** it changed.

Whenever implementation diverges from the original design, this log should be updated immediately so that future contributors and AI agents always understand the reasoning behind the current architecture.
