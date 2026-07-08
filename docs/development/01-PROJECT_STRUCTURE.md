# Project Structure

> **Document Version:** 1.0
>
> **Status:** Draft (Version 1)
>
> This document defines the repository structure, monorepo organization, package boundaries, coding conventions, and architectural layering used throughout SignalOps.

---

# Table of Contents

- Introduction
- Design Goals
- Repository Layout
- Monorepo Structure
- Applications
- Packages
- Internal Architecture
- Feature Module Structure
- Shared Libraries
- Import Rules
- Naming Conventions
- Configuration
- Testing Structure
- Future Evolution

---

# Introduction

SignalOps is built as a **modular monorepo** using **PNPM Workspaces**.

The project is intentionally organized around **business domains** rather than technical layers to improve maintainability, scalability, and developer experience.

Instead of this:

```
controllers/
services/
repositories/
```

SignalOps follows:

```
Identity

Infrastructure

Telemetry

Incident

AI

Automation

Integration
```

Each domain owns its business logic and is internally structured using Clean Architecture.

---

# Design Goals

The repository structure should:

- Be easy for a solo developer to navigate
- Support future extraction into microservices
- Encourage domain ownership
- Avoid circular dependencies
- Promote code reuse
- Keep infrastructure separate from business logic
- Be friendly to AI coding assistants (Cursor, Claude Code, GitHub Copilot)

---

# Repository Layout

```
signalops/

├── apps/
├── packages/
├── infrastructure/
├── docs/
├── scripts/
├── .github/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── docker-compose.yml
└── README.md
```

---

# Monorepo Structure

```
signalops/

apps/
packages/
infrastructure/
docs/
scripts/
```

Each directory has a clearly defined responsibility.

---

# apps/

Applications that can run independently.

```
apps/

├── api/
├── worker/
└── dashboard/
```

---

## apps/api

Main HTTP API.

Responsibilities

- Authentication
- REST APIs
- Webhooks
- Telemetry ingestion
- Dashboard APIs

Technology

- NestJS

---

## apps/worker

Background workers.

Responsibilities

- BullMQ Workers
- AI Jobs
- Notifications
- Incident Processing
- Automation

Technology

- NestJS
- BullMQ

Separating workers from the API prevents long-running jobs from blocking HTTP requests.

---

## apps/dashboard

Future frontend.

Technology

- Next.js

Version 1 may start with only basic pages.

---

# packages/

Shared libraries.

```
packages/

core/

shared/

config/

database/

ai/

sdk/
```

---

## core

Contains business-independent utilities.

Examples

```
Result

Either

Errors

Base Entity

Aggregate Root

Value Object

Domain Event
```

This package contains no framework-specific code.

---

## shared

Common utilities.

Examples

```
Logger

Date Helpers

Validation

Constants

Utilities

Decorators
```

---

## config

Centralized configuration.

```
Environment Variables

Validation

Feature Flags

Configuration Loaders
```

---

## database

Database layer.

Contains

```
typeorm Schema

Migrations

Seeders

Database Client
```

---

## ai

Shared AI utilities.

Examples

```
Prompt Builder

Model Client

JSON Parser

Output Validation

Prompt Templates
```

The AI package contains reusable infrastructure only.

Business logic remains inside feature modules.

---

## sdk

Reserved for future SignalOps SDK.

Not implemented in Version 1.

---

# infrastructure/

Infrastructure configuration.

```
docker/

fluent-bit/

grafana/

prometheus/

clickhouse/
```

Version 1

Only

```
docker/

fluent-bit/
```

will exist.

---

# docs/

Project documentation.

```
product/

architecture/

backend/

development/
```

---

# scripts/

Developer utilities.

Examples

```
seed.ts

create-admin.ts

generate-api-key.ts

cleanup.ts
```

---

# API Internal Structure

The API application is organized by business domain.

```
apps/api/src/

identity/

infrastructure/

telemetry/

incident/

ai/

automation/

integration/

shared/

main.ts

app.module.ts
```

Notice

There is **no**

```
controllers/

services/
```

at the root.

Everything belongs to a domain.

---

# Feature Module Structure

Every domain follows the same internal layout.

Example

```
incident/

application/

domain/

infrastructure/

presentation/

incident.module.ts
```

---

# application/

Coordinates business use cases.

Contains

```
Commands

Queries

Handlers

DTOs

Use Cases
```

Examples

```
CreateIncident

ResolveIncident

UpdateSeverity
```

Application services orchestrate work but do not contain business rules.

---

# domain/

Contains pure business logic.

```
entities/

value-objects/

repositories/

services/

events/

exceptions/
```

This layer has zero NestJS dependencies.

---

## entities/

Examples

```
Incident

Anomaly

Timeline
```

---

## value-objects/

Examples

```
Severity

Status

Confidence

RiskLevel
```

---

## repositories/

Interfaces only.

Example

```
IncidentRepository.ts
```

Never typeorm implementations.

---

## services/

Domain services.

Examples

```
DetectionService

SeverityService
```

---

## events/

Domain events.

Example

```
IncidentCreated

IncidentResolved
```

---

# infrastructure/

Contains implementation details.

Examples

```
typeorm

BullMQ

Redis

OpenAI

Repositories

External APIs
```

Example

```
typeorm/

repositories/

queue/

clients/
```

---

# presentation/

External interfaces.

Contains

```
Controllers

Request DTOs

Response DTOs

Guards

Interceptors
```

Nothing else.

---

# Dependency Rule

Dependencies always point inward.

```
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

The Domain layer never depends on:

- NestJS
- typeorm
- BullMQ
- Redis
- OpenAI

---

# Shared Module

```
shared/

config/

logger/

exceptions/

filters/

guards/

decorators/

constants/
```

Everything here should be generic.

---

# Import Rules

Allowed

```
Presentation

↓

Application

↓

Domain
```

Infrastructure may implement domain interfaces.

Forbidden

```
Incident

↓

Telemetry Internals
```

Instead

Use interfaces or events.

---

# Naming Conventions

Folders

```
kebab-case
```

Files

```
incident.repository.ts

create-incident.usecase.ts

severity.vo.ts
```

Classes

```
PascalCase
```

Interfaces

```
IncidentRepository
```

Enums

```
IncidentStatus
```

---

# Configuration

Environment variables are validated at startup.

```
DATABASE_URL

REDIS_URL

OPENAI_API_KEY

JWT_SECRET

SMTP_URL
```

Configuration should never be accessed directly.

Use

```
ConfigService
```

---

# Testing Structure

Each feature owns its tests.

```
incident/

application/

domain/

infrastructure/

presentation/

tests/
```

Examples

```
incident.service.spec.ts

create-incident.usecase.spec.ts

incident.controller.e2e.ts
```

---

# Future Evolution

The repository structure is intentionally designed so that applications can later be extracted into independent services without changing business logic.

Possible future services

```
API

↓

Worker

↓

AI Service

↓

Telemetry Gateway

↓

Notification Service
```

Because business logic remains isolated inside domains, these extractions become straightforward.

---

# Summary

SignalOps follows a domain-oriented monorepo architecture optimized for a solo developer while remaining scalable for future growth.

Key principles:

- Business domains over technical layers
- Clean Architecture inside every module
- Shared packages for reusable infrastructure
- Independent API and worker applications
- Infrastructure isolated from business logic
- Consistent folder conventions across the entire repository

This structure provides a solid foundation for Version 1 while keeping the codebase ready for future expansion into a larger AI-powered operations platform.
