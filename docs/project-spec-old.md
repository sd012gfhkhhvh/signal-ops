# Project Specification: AI-Powered Server Monitoring & Auto-Resolution System

## 1. Project Overview

This project is a production-grade AI-driven server monitoring and auto-resolution system designed to ingest server logs, detect anomalies using an analysis engine, and automatically resolve issues via LLM-suggested tooling while managing incident lifecycles in a ticketing system (e.g., Service Now).

## 2. Core Architecture

The system is built using NestJS and TypeScript, following Domain-Driven Design (DDD) and Clean Architecture principles to ensure infrastructure decoupling.

### High-Level Flow:

1. **Log Ingestion**: Remote servers generate logs, which are collected via Fluent Bit and pushed to the application's ingestion endpoint.
2. **Log Analysis**: An asynchronous job processes ingested logs to detect anomalous patterns.
3. **Event-Driven Processing**: Detected anomalies trigger an internal event-driven architecture using NestJS Event Emitter.
4. **Incident Management**: The system automatically initializes a ticket in a configured ticketing provider upon anomaly detection.
5. **Auto-Resolution**: An LLM agent analyzes the anomaly and suggests remediation tools, which are executed via SSH to resolve the issue, followed by ticket closure.

## 3. Key Components

### Entities:

1. **User**: Manages authentication and resource ownership.
2. **RemoteServer**: Defines the target infrastructure to monitor.
3. **LogSource**: Manages log broker configurations.
4. **LogAnalysisJob**: Tracks periodic log processing tasks.
5. **Anomaly**: Stores detected issues identified within logs.
6. **Ticket**: Manages the lifecycle of an issue in the ticketing system.

### Technological Stack:

1. **Backend**: NestJS (Modular architecture based on features).
2. **Monorepo**: Managed via PNPM Workspaces.
3. **Testing**: Vitest for unit tests; Supertest for E2E testing with in-memory SQLite.
4. **Log Handling**: Fluent Bit (Docker-based) for filtering and forwarding logs.

## 4. Development Standards

1. **Modularization**: Feature-based folder structure rather than technical layering.
2. **Abstraction**: Repository pattern is used to decouple business logic from the database/infrastructure layer.
3. **Testing Strategy**: Test-Driven Development (TDD) approach using Unit tests for services and E2E tests for critical paths like ticket creation.
4. **AI Integration**: Use of Cursor and LLMs for drafting code, writing tests, and optimizing infrastructure scripts.

## 5. Scope for Further Development

### Current State:

Fully functional log ingestion, anomaly detection, event triggering, and initial ticketing system infrastructure.

### Future Focus:

1. Refining the LLM agent's resolution logic.
2. Expanding the ticketing provider abstraction to support multiple platforms (e.g., Jira, ServiceNow).
3. Implementing persistent queue management for heavy-load log analysis.
4. Developing the Frontend dashboard for monitoring and manual ticket oversight.
