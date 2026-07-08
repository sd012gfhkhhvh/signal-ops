# Project: SignalOps - AI-Powered Server Monitoring & Auto-Resolution

## Architecture Diagram (Mermaid)

mermaid
graph TD
subgraph "Target Infrastructure"
RS[Remote Servers] -->|Logs| FB[Fluent Bit Agent]
end

    FB -->|HTTP/gRPC Stream| API[NestJS Ingestion API]

    subgraph "SignalOps Backend"
        API --> DB[(Primary Postgres DB)]
        DB --> LAJ[Log Analysis Engine & Job Queue]
        LAJ -->|Analyse| LLM[LLM Agent]
        LLM -->|Resolution Commands| SSH[Remote SSH Executor]
    end

    LAJ -->|Event Trigger| EM[Event Emitter]
    EM -->|Incident Event| TS[Ticketing Service]
    TS -->|Create/Update Ticket| Ext[ServiceNow / Jira API]
    TS -->|Resolve Status| DB

## Project README

### Overview

**signalOps** is a production-grade monitoring system that moves beyond simple alerting. It integrates log ingestion, AI-driven analysis, and automated remediation to reduce Mean Time To Resolution (MTTR).

### Key Features

- **Smart Log Ingestion:** Uses _Fluent Bit_ for high-performance log forwarding with regex filtering.
- **Event-Driven Pipeline:** Decoupled architecture using _NestJS Event Emitter_ ensures that anomaly detection and ticket creation run asynchronously.
- **Agentic Remediation:** Integrates LLMs to interpret logs and suggest actionable tools to fix server-side issues automatically.
- **Abstraction Layer:** Implements the **Repository Pattern** and **Factory Pattern** (for ticketing providers), allowing easy swaps between platforms like _ServiceNow_ or _Jira_.

### Infrastructure Improvements

- **Queueing System:** Integrated a worker-based queue (BullMQ/Redis recommended) to handle high-throughput log analysis without blocking the ingestion API.
- **Secure Execution:** Moved resolution logic to an isolated SSH executor to ensure secure, audited command execution on remote infrastructure.
- **Observability:** Added explicit status tracking for "Unknown" -> "Anomaly Detected" -> "Ticket Created" -> "Resolved" lifecycles.

### Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL with TypeORM
- **Infrastructure:** Docker, Fluent Bit
- **Testing:** Vitest (Unit), Supertest (E2E)
