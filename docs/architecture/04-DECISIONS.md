# Architecture Decisions

> **Document Version:** 1.0
>
> This document records the major architectural decisions made during the design of SignalOps Version 1.
>
> Instead of maintaining dozens of separate Architecture Decision Records (ADRs), Version 1 consolidates all major decisions into a single document. This keeps the project lightweight while preserving the reasoning behind every significant technology choice.

---

# Table of Contents

- Guiding Principles
- Architecture
- Backend
- Frontend
- Database
- Queue
- AI
- Integrations
- Security
- Deployment
- Future Evolution

---

# Guiding Principles

Every architectural decision should satisfy the following principles.

- Simplicity over complexity
- Build only what Version 1 requires
- Optimize for maintainability
- Favor extensibility over premature optimization
- Infrastructure should be replaceable
- Business logic should remain framework-independent
- AI assists workflows rather than controlling them

---

# ADR-001 — Monorepo

## Decision

Use **PNPM Workspaces**.

## Why?

- Excellent TypeScript support
- Fast dependency installation
- Shared packages
- Easy future expansion
- Perfect for API + Worker + Dashboard

## Alternatives

- npm workspaces
- Turborepo
- Nx

PNPM provides the simplest setup for a solo developer.

---

# ADR-002 — Backend Framework

## Decision

NestJS

## Why?

- Modular architecture
- Dependency Injection
- Excellent TypeScript support
- Mature ecosystem
- BullMQ integration
- Testing support

## Alternatives

- Express
- Fastify
- Hono

NestJS aligns best with Domain-Driven Design and Clean Architecture.

---

# ADR-003 — Architecture Style

## Decision

Domain-Driven Design + Clean Architecture

## Why?

Business logic should not depend on:

- NestJS
- typeorm
- BullMQ
- Redis
- OpenAI

This makes the application easier to test, maintain, and evolve.

---

# ADR-004 — Event-Driven Processing

## Decision

Use asynchronous processing with BullMQ.

## Why?

Log analysis is computationally expensive.

The ingestion API should return immediately while background workers process telemetry independently.

## Future

BullMQ can later be replaced with Kafka or NATS without changing business logic.

---

# ADR-005 — Database

## Decision

PostgreSQL

## Why?

Stores operational data:

- Users
- Projects
- Servers
- Incidents
- Policies
- Executions

PostgreSQL provides strong consistency and excellent typeorm support.

---

# ADR-006 — ORM

## Decision

typeorm

## Why?

- Type-safe queries
- Great developer experience
- Reliable migrations
- Excellent TypeScript support

---

# ADR-007 — Log Storage

## Decision

ClickHouse

## Why?

Raw logs are append-only, high-volume data.

ClickHouse is optimized for:

- Time-series analytics
- Fast aggregations
- Compression
- Large datasets

PostgreSQL is intentionally not used for raw telemetry.

---

# ADR-008 — Cache & Queue Backend

## Decision

Redis

## Why?

Redis powers:

- BullMQ
- Caching
- Distributed locks
- Future rate limiting

One technology serves multiple responsibilities while remaining operationally simple.

---

# ADR-009 — AI Integration

## Decision

AI generates structured plans instead of shell commands.

Example

Instead of

```
sudo systemctl restart nginx
```

the AI returns

```json
{
  "tool": "restart_service",
  "parameters": {
    "service": "nginx"
  }
}
```

## Why?

This dramatically improves security and allows the backend to validate every requested action before execution.

---

# ADR-010 — Tool Registry

## Decision

Every executable operation is implemented as a predefined tool.

Examples

- restart_service
- restart_container
- restart_pm2

## Why?

Never execute arbitrary LLM output.

Every tool is:

- validated
- audited
- testable
- reusable

---

# ADR-011 — Human Approval

## Decision

Automation policies determine whether approval is required.

Modes

- Automatic
- Manual

## Why?

Production environments often require human oversight before executing operational actions.

---

# ADR-012 — Telemetry Abstraction

## Decision

Internally, every telemetry source becomes a **Signal**.

Supported later

- Logs
- Metrics
- Traces
- Events

## Why?

The Incident Engine should not know whether data originated from Fluent Bit, OpenTelemetry, Prometheus, or the future SignalOps Agent.

---

# ADR-013 — Native Incident System

## Decision

SignalOps owns incidents.

External ticketing systems become optional integrations.

## Why?

The platform should remain useful even without Jira or ServiceNow.

---

# ADR-014 — Plugin Architecture

## Decision

Every external system implements a provider interface.

Examples

- TelemetryProvider
- NotificationProvider
- TicketProvider
- ExecutionProvider

## Why?

New integrations should not require modifications to core business logic.

---

# ADR-015 — API Design

## Decision

REST API for Version 1.

## Why?

Simple to consume.

Well understood.

Excellent NestJS support.

GraphQL is intentionally deferred.

---

# ADR-016 — Deployment

## Decision

Docker Compose

Services

- API
- Worker
- PostgreSQL
- Redis
- ClickHouse

## Why?

Simple local development.

Easy onboarding.

Kubernetes is intentionally deferred.

---

# ADR-017 — Authentication

## Decision

JWT Access Tokens with Refresh Tokens.

## Future

- OAuth
- OIDC
- SSO

---

# ADR-018 — Testing

## Decision

Three-layer testing strategy.

- Unit Tests
- Integration Tests
- End-to-End Tests

Domain logic receives the highest test coverage.

---

# ADR-019 — AI Philosophy

The AI is an assistant.

The AI does **not** own the workflow.

Workflow ownership belongs to the platform.

This allows SignalOps to continue operating even if the AI provider is unavailable.

---

# ADR-020 — Version 1 Scope

The project intentionally prioritizes a complete end-to-end workflow over supporting many infrastructure providers.

Supported

- Linux
- Fluent Bit
- BullMQ
- PostgreSQL
- Redis
- ClickHouse
- Email
- Slack
- SSH

Deferred

- Kubernetes
- Prometheus
- OpenTelemetry
- SignalOps SDK
- Kafka
- Multi-Agent AI

---

# Summary

SignalOps Version 1 intentionally favors a clean, modular architecture over feature breadth. Every major decision optimizes for long-term extensibility while avoiding unnecessary complexity for a solo developer. The architecture provides a solid foundation for future capabilities without introducing enterprise-level operational overhead into the initial implementation.
