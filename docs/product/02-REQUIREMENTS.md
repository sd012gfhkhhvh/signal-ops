# Requirements Specification

> **Document Version:** 1.0  
> **Status:** Draft (Version 1)

This document defines the functional and non-functional requirements for **SignalOps Version 1 (MVP)**.

The purpose of this document is to clearly define **what will be built**, **what will not be built**, and the acceptance criteria for each major feature.

---

# Table of Contents

- Introduction
- Product Scope
- User Roles
- Functional Requirements
- Non-Functional Requirements
- User Stories
- Acceptance Criteria
- Out of Scope
- Future Enhancements
- MVP Definition

---

# Introduction

SignalOps V1 is a focused AI-powered incident response platform.

The objective of V1 is **not** to compete with enterprise observability platforms like Datadog or New Relic.

Instead, the goal is to build a complete end-to-end system that demonstrates:

- Modern backend architecture
- Event-driven processing
- AI integration
- Secure automation
- Production-inspired engineering practices

---

# Product Scope

SignalOps V1 supports the following workflow:

```
Linux Server

↓

Fluent Bit

↓

SignalOps

↓

Log Analysis

↓

Incident Detection

↓

AI Investigation

↓

Notifications

↓

Human Approval (Optional)

↓

SSH Automation

↓

Verification

↓

Incident Resolution
```

Everything in Version 1 revolves around this workflow.

---

# User Roles

## Administrator

Responsible for:

- Creating projects
- Inviting members (future)
- Managing integrations
- Managing servers
- Configuring automation policies

---

## Engineer

Responsible for:

- Viewing incidents
- Investigating incidents
- Approving execution plans
- Executing manual actions
- Closing incidents

---

# Functional Requirements

---

# Identity

## Authentication

Users should be able to:

- Register
- Login
- Refresh JWT tokens
- Logout

---

## Projects

Users should be able to:

- Create Project
- Update Project
- Delete Project
- View Project

Every server belongs to a project.

---

# Infrastructure

## Server Management

Users should be able to:

- Register Linux servers
- Configure SSH credentials
- Tag servers
- Enable/Disable monitoring

Each server has:

- Name
- Host
- Environment
- SSH Configuration

---

# Telemetry

SignalOps should support telemetry ingestion through Fluent Bit.

Requirements

- Receive logs
- Validate payload
- Normalize logs
- Queue logs
- Persist metadata

Future providers are intentionally excluded.

---

# Log Analysis

The analysis engine should:

- Consume logs from BullMQ
- Apply rule-based detection
- Detect anomalies
- Ignore normal logs

Version 1 intentionally excludes Machine Learning.

---

# Incident Management

SignalOps must provide a native incident system.

Users should be able to:

- View incidents
- View incident timeline
- Update incident status
- Assign severity
- Resolve incidents

Incident states

```
Open

↓

Investigating

↓

Waiting Approval

↓

Executing

↓

Verifying

↓

Resolved

↓

Closed
```

---

# AI Investigation

For every detected incident the system should generate:

- Executive summary
- Root cause hypothesis
- Confidence score
- Suggested remediation plan

The AI must never execute commands directly.

---

# Notifications

Version 1 supports

Email

Slack

The system should notify users when:

- Incident created
- Incident resolved
- Execution failed

---

# Automation

SignalOps should support policy-controlled execution.

Supported tools

- Restart Linux Service
- Restart Docker Container
- Restart PM2 Process

Future tools are excluded.

---

# Policy Engine

Policies should define:

- Automation enabled
- Approval required
- Allowed tools

Every execution request must be validated.

---

# Approval Workflow

Projects should be able to configure:

```
Automatic

or

Manual Approval
```

Manual mode

```
AI Plan

↓

Engineer Approves

↓

Execute
```

---

# Execution

Execution provider

SSH

Supported actions

- Restart Service
- Restart Container
- Restart PM2

Execution history should be stored.

---

# Verification

After execution the system should verify:

- Process is running
- Command succeeded

Version 1 does not perform advanced health checks.

---

# Integrations

Version 1

Telemetry

- Fluent Bit

Notifications

- Email
- Slack

Execution

- SSH

External ticket providers are deferred.

---

# Dashboard

The dashboard should display:

- Projects
- Servers
- Incidents
- Incident Details
- Investigation Results
- Execution History

Dashboard analytics are excluded.

---

# Non-Functional Requirements

---

## Performance

The ingestion API should respond quickly by offloading heavy work to BullMQ.

Target

- API response under 200 ms for ingestion acknowledgement
- Background analysis handled asynchronously

---

## Scalability

Support horizontal scaling of workers.

Workers should remain stateless.

---

## Security

Requirements

- JWT authentication
- Password hashing
- Encrypted secrets
- Audit logging
- Policy validation before execution

---

## Maintainability

The project should follow:

- Domain-Driven Design
- Clean Architecture
- Repository Pattern
- Modular architecture

---

## Reliability

Failures should never block ingestion.

Failed jobs should be retried.

Critical failures should be logged.

---

## Observability

The platform should expose:

- Structured logs
- Queue statistics
- Worker status
- Execution history

---

## Testability

Version 1 should include:

- Unit tests for domain logic
- Integration tests for repositories
- End-to-end tests for critical workflows

---

# User Stories

---

## Authentication

**As a developer**

I want to login securely

so that I can manage my infrastructure.

---

## Server Registration

**As an engineer**

I want to register a Linux server

so that SignalOps can monitor it.

---

## Log Ingestion

**As the platform**

I want to receive logs asynchronously

so that ingestion remains fast.

---

## Incident Detection

**As an engineer**

I want incidents to be created automatically

so that I do not manually monitor logs.

---

## AI Investigation

**As an engineer**

I want AI to summarize incidents

so that I can understand the issue quickly.

---

## Approval

**As an administrator**

I want automation approval to be configurable

so that production systems remain safe.

---

## Execution

**As an engineer**

I want approved remediation plans to execute automatically

so that repetitive operational tasks are reduced.

---

## Verification

**As an engineer**

I want SignalOps to verify execution results

so that failed remediation attempts are detected.

---

# Acceptance Criteria

---

## Authentication

- User can register
- User can login
- JWT issued successfully
- Protected APIs require authentication

---

## Server Registration

- Server can be created
- SSH credentials validated
- Server appears in dashboard

---

## Log Ingestion

- Fluent Bit sends logs
- API accepts payload
- Log enters BullMQ
- Worker processes log

---

## Incident Detection

- Matching rule creates incident
- Timeline entry added
- Notifications triggered

---

## AI Investigation

- Summary generated
- Root cause returned
- Confidence score stored
- Resolution plan generated

---

## Execution

- Policy validated
- Tool executed
- Result stored
- Timeline updated

---

## Verification

- Verification completed
- Incident updated
- User notified

---

# Out of Scope

The following features are intentionally excluded from Version 1.

Telemetry

- OpenTelemetry
- Prometheus
- SignalOps SDK
- Kafka

Infrastructure

- Kubernetes
- Cloud Providers

AI

- Multi-Agent AI
- RAG
- AI Memory
- Self-learning

Integrations

- Jira
- ServiceNow
- PagerDuty
- Microsoft Teams
- Discord

Platform

- Multi-tenancy
- Billing
- Usage quotas
- SSO
- OAuth
- API rate limiting

Analytics

- Custom dashboards
- Correlation engine
- Metrics aggregation
- Historical reporting

---

# Future Enhancements

Version 2

- Metrics
- SignalOps Agent
- OpenTelemetry
- Native Alert Rules

Version 3

- Kubernetes
- Docker Swarm
- ClickHouse analytics
- Correlation engine

Version 4

- AI Memory
- RAG
- Multi-Agent AI
- Autonomous remediation

---

# MVP Definition

SignalOps Version 1 is considered complete when the following workflow succeeds:

```
1. Register a Linux Server

↓

2. Configure Fluent Bit

↓

3. Send Logs

↓

4. Detect Anomaly

↓

5. Create Incident

↓

6. Notify Engineer

↓

7. Generate AI Investigation

↓

8. Generate Remediation Plan

↓

9. Request Approval (if enabled)

↓

10. Execute via SSH

↓

11. Verify Execution

↓

12. Resolve Incident
```

This workflow represents the minimum viable product and the foundation upon which future versions of SignalOps will be built.

---

# Summary

Version 1 deliberately prioritizes **depth over breadth**. Instead of supporting every telemetry source or infrastructure platform, it delivers a complete, production-inspired incident response workflow for Linux servers using log-based detection. The architecture is designed to evolve incrementally, allowing future capabilities—such as metrics, OpenTelemetry, Kubernetes, and advanced AI—to be added without restructuring the core system.
