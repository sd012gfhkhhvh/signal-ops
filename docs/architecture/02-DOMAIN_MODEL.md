# Domain Model

> **Document Version:** 1.0
>
> **Status:** Draft (Version 1)
>
> This document defines the Domain-Driven Design (DDD) model for SignalOps, including bounded contexts, aggregates, entities, value objects, repositories, domain services, and domain events.

---

# Table of Contents

- Why Domain-Driven Design?
- Domain Overview
- Bounded Contexts
- Context Map
- Shared Kernel
- Aggregates
- Entities
- Value Objects
- Domain Services
- Repositories
- Domain Events
- Aggregate Lifecycle
- Version 1 Scope

---

# Why Domain-Driven Design?

SignalOps is an operational platform with multiple business domains.

Instead of organizing the application around technical layers such as:

```
controllers/
services/
repositories/
```

the system is organized around business capabilities.

```
Identity

Infrastructure

Telemetry

Incident

Automation

Integration

AI
```

Each domain owns:

- Business rules
- Entities
- Services
- Repositories
- Events

No domain should directly manipulate another domain's internal state.

Communication happens through well-defined interfaces or domain events.

---

# Domain Overview

```text
                    +----------------------+
                    |      Identity        |
                    +----------+-----------+
                               |
                               |
                               v
+-------------+      +----------------------+      +--------------+
|Infrastructure| ---> |     Telemetry       | ---> |   Incident   |
+-------------+      +----------------------+      +--------------+
                                                         |
                     +-----------------------------------+
                     |
         +-----------+-----------+
         |                       |
         v                       v
+----------------+      +----------------+
|      AI        |      |  Integration   |
+----------------+      +----------------+
         |
         v
+----------------+
|  Automation    |
+----------------+
```

---

# Bounded Contexts

SignalOps Version 1 consists of seven bounded contexts.

| Context        | Responsibility                       |
| -------------- | ------------------------------------ |
| Identity       | Authentication, Organizations, Users |
| Infrastructure | Servers and infrastructure resources |
| Telemetry      | Signal ingestion and normalization   |
| Incident       | Detection and incident lifecycle     |
| AI             | Investigation and planning           |
| Automation     | Policy validation and execution      |
| Integration    | External providers                   |

---

# Context Map

```text
                   Identity
                       |
                       |
                       v

Infrastructure ---> Telemetry ---> Incident

                                 |
               +-----------------+----------------+
               |                                  |
               v                                  v

              AI                          Integration

               |
               v

          Automation
```

Each context has a clearly defined responsibility.

---

# Shared Kernel

A small number of concepts are shared across multiple contexts.

Examples:

```
ProjectId

OrganizationId

ServerId

UserId

Timestamp

Severity

Environment
```

These are immutable value objects shared across domains.

---

# Identity Context

## Responsibility

Manages authentication and ownership.

This context knows nothing about telemetry or incidents.

---

## Aggregate

### Organization

Root Aggregate

```
Organization

├── Projects

├── Members

└── Settings
```

---

## Entities

Organization

Project

User

Membership

APIKey

---

## Value Objects

Email

PasswordHash

Role

Permission

JWTToken

---

## Repositories

OrganizationRepository

ProjectRepository

UserRepository

APIKeyRepository

---

## Domain Services

AuthenticationService

AuthorizationService

InvitationService

---

# Infrastructure Context

## Responsibility

Represents monitored infrastructure.

---

## Aggregate

### Server

```
Server

├── Credentials

├── Environment

├── Tags

└── Telemetry Sources
```

---

## Entities

Server

ServerCredential

SSHKey

Environment

ServerTag

---

## Value Objects

IPAddress

Hostname

OperatingSystem

ServerStatus

EnvironmentType

---

## Repositories

ServerRepository

CredentialRepository

---

## Domain Services

ServerRegistrationService

CredentialValidationService

---

# Telemetry Context

## Responsibility

Collects and normalizes telemetry.

Important:

Telemetry does **NOT** detect anomalies.

It only transforms raw telemetry into normalized signals.

---

## Aggregate

### Signal

```
Signal

├── Metadata

├── Payload

└── Source
```

---

## Entities

Signal

TelemetrySource

IngestionRequest

---

## Value Objects

SignalType

SignalSource

LogLevel

Timestamp

Payload

---

## Repositories

SignalRepository

TelemetrySourceRepository

---

## Domain Services

NormalizationService

ValidationService

RoutingService

---

# Incident Context

## Responsibility

This is the core business domain.

Responsible for

- Detection
- Incidents
- Severity
- Lifecycle
- Timeline

---

## Aggregate

### Incident

```
Incident

├── Timeline

├── Resolution

├── Notifications

└── External Ticket
```

---

## Entities

Incident

Anomaly

IncidentTimeline

Resolution

Comment

Attachment

---

## Value Objects

Severity

Status

ConfidenceScore

Category

IncidentSource

---

## Repositories

IncidentRepository

AnomalyRepository

TimelineRepository

---

## Domain Services

DetectionService

IncidentService

SeverityService

IncidentLifecycleService

---

# AI Context

## Responsibility

Assist engineers during investigations.

The AI never owns infrastructure.

---

## Aggregate

### Investigation

```
Investigation

├── Summary

├── Root Cause

├── Resolution Plan

└── Confidence
```

---

## Entities

Investigation

ResolutionPlan

Recommendation

Prompt

---

## Value Objects

ConfidenceScore

ModelName

PromptVersion

Summary

---

## Repositories

InvestigationRepository

---

## Domain Services

ContextBuilder

PromptBuilder

PlanningService

RootCauseAnalysisService

---

# Automation Context

## Responsibility

Safely execute approved actions.

---

## Aggregate

### Execution

```
Execution

├── Policy

├── Approval

├── Tool

└── Verification
```

---

## Entities

Execution

Approval

Policy

ToolExecution

Verification

---

## Value Objects

ExecutionStatus

ApprovalStatus

ExecutionMode

RiskLevel

---

## Repositories

ExecutionRepository

PolicyRepository

ApprovalRepository

---

## Domain Services

PolicyEngine

ApprovalService

ExecutionService

VerificationService

---

# Integration Context

## Responsibility

Communication with external systems.

---

## Aggregate

Provider

```
Provider

├── Configuration

├── Credentials

└── Status
```

---

## Entities

NotificationProvider

TicketProvider

TelemetryProvider

ExecutionProvider

---

## Value Objects

ProviderType

ProviderStatus

ProviderConfiguration

---

## Repositories

ProviderRepository

---

## Domain Services

NotificationService

TicketService

TelemetryGateway

ProviderFactory

---

# Aggregate Relationships

```text
Organization

└── Project

      ├── Server

      │      │

      │      └────── Telemetry Source

      │

      └────── Incident

                    │

                    ├── Investigation

                    │

                    ├── Execution

                    │

                    └── Notification
```

---

# Aggregate Rules

## Organization

Owns

- Projects
- Members

Cannot directly own incidents.

---

## Project

Owns

- Servers
- Integrations
- Policies

---

## Server

Owns

- Credentials
- Tags
- Environment

Cannot own incidents.

Incidents reference servers.

---

## Incident

Owns

- Timeline
- Resolution
- Investigation
- Notifications

This is the most important aggregate in Version 1.

---

## Investigation

Cannot exist without an Incident.

---

## Execution

Cannot exist without

- Incident
- Policy

---

# Repository Rules

Repositories only manage aggregate roots.

Good

```
IncidentRepository

save()

findById()

findActive()

updateStatus()
```

Bad

```
TimelineRepository.update()

ResolutionRepository.save()
```

These belong inside the Incident aggregate.

---

# Domain Events

Every important business action emits an event.

## Identity

```
UserRegistered

OrganizationCreated

ProjectCreated

APIKeyGenerated
```

---

## Infrastructure

```
ServerRegistered

CredentialUpdated

ServerConnected
```

---

## Telemetry

```
SignalReceived

SignalValidated

SignalNormalized

SignalQueued
```

---

## Incident

```
AnalysisStarted

AnalysisCompleted

AnomalyDetected

IncidentCreated

IncidentUpdated

IncidentResolved

IncidentClosed
```

---

## AI

```
InvestigationStarted

SummaryGenerated

RootCauseGenerated

PlanGenerated
```

---

## Automation

```
ApprovalRequested

ApprovalGranted

ExecutionStarted

ExecutionSucceeded

ExecutionFailed

VerificationPassed

VerificationFailed
```

---

## Integration

```
NotificationSent

TicketCreated

TicketUpdated

SlackMessageSent

EmailSent
```

---

# Aggregate Lifecycle

The primary aggregate lifecycle in Version 1 is the Incident lifecycle.

```text
Signal

↓

Analysis

↓

Anomaly

↓

Incident

↓

Investigation

↓

Resolution Plan

↓

Approval

↓

Execution

↓

Verification

↓

Resolved

↓

Closed
```

Every state transition emits a domain event.

---

# Version 1 Scope

Only the following aggregates will be fully implemented in Version 1.

| Aggregate     | Status |
| ------------- | ------ |
| Organization  | ✅     |
| Project       | ✅     |
| Server        | ✅     |
| Signal        | ✅     |
| Incident      | ✅     |
| Investigation | ✅     |
| Execution     | ✅     |

The following are defined architecturally but will be implemented in later versions.

- Kubernetes Cluster
- SignalOps Agent
- Metrics
- Traces
- Correlation Engine
- Knowledge Base
- AI Memory
- Runbooks

---

# Folder Mapping

Each bounded context should map directly to a feature module in the backend.

```text
src/

identity/
infrastructure/
telemetry/
incident/
ai/
automation/
integration/

shared/
```

Each context follows the same internal structure.

```text
incident/

application/
domain/
infrastructure/
presentation/

incident.module.ts
```

This ensures consistency across the codebase and keeps business logic isolated from infrastructure concerns.

---

# Summary

SignalOps is organized around business domains rather than technical layers. Each bounded context owns its own aggregates, entities, services, repositories, and events, while communication between contexts occurs through well-defined interfaces and domain events. This approach keeps the architecture modular, testable, and extensible, allowing new telemetry providers, AI capabilities, and execution mechanisms to be introduced with minimal impact on the core system.
