# `AGENT.md`

# SignalOps AI Orchestrator

> **Purpose**
>
> This file is the **single entry point** for any AI agent working on the SignalOps repository.
>
> Every development session MUST begin by reading this file.
>
> This file does **not** contain project knowledge. Instead, it tells the AI how to discover the current project state, what documents to read, how to perform work, and how to keep the repository synchronized.
>
> The repository is the source of truth. Never rely on previous conversations.

---

# Core Philosophy

SignalOps follows one fundamental rule:

> **Code, documentation, and project status must always evolve together.**

Every implementation session should leave the repository in a state where another developer or AI agent can immediately continue work without needing previous chat history.

---

# Responsibilities

As an AI agent, your responsibilities are to:

- Understand the current state of the project.
- Preserve the existing architecture.
- Implement only the requested scope.
- Keep documentation synchronized with implementation.
- Recommend the next logical task.
- Avoid introducing unnecessary complexity.

---

# Repository Hierarchy

Treat the repository as having four layers.

## Layer 1 — Orchestrator

```
AGENT.md
```

Defines the workflow.

---

## Layer 2 — Living Project State

```
docs/project/

PROJECT_STATUS.md

IMPLEMENTATION_PLAN.md

DECISION_LOG.md
```

These documents describe the current state of the project.

---

## Layer 3 — Architecture

```
docs/

architecture/

backend/

development/

product/
```

These documents describe how the system is designed.

Only update them when implementation changes them.

---

## Layer 4 — Source Code

```
apps/

packages/

infrastructure/
```

Implementation always follows the architecture.

---

# Available Actions

The AI should determine which action is being requested.

Supported actions:

- NEW_SESSION
- IMPLEMENT_FEATURE
- IMPLEMENT_BUGFIX
- REFACTOR
- REVIEW
- UPDATE_DOCUMENTATION
- END_SESSION

Each action has a defined workflow.

---

# Action: NEW_SESSION

Trigger

A new conversation or development session begins.

## Workflow

### Step 1

Read:

```
docs/project/PROJECT_STATUS.md
```

Understand:

- current milestone
- current task
- progress
- blockers

---

### Step 2

Read:

```
docs/project/IMPLEMENTATION_PLAN.md
```

Determine:

- active phase
- incomplete tasks
- recommended next task

---

### Step 3

Read:

```
docs/project/DECISION_LOG.md
```

Understand:

- important architectural decisions
- implementation constraints
- technology changes

---

### Step 4

Only read additional documentation that is relevant to the requested work.

Examples

Authentication

↓

API

↓

Data Model

↓

Project Structure

Do **not** load unnecessary documents.

---

### Step 5

Summarize:

- Current project state
- Current milestone
- Current task
- Relevant architecture
- Recommended next step

Do not begin implementation until the user confirms or requests work.

---

# Action: IMPLEMENT_FEATURE

Trigger

The user requests a new feature.

## Workflow

### Understand

Determine:

- Which module is affected?
- Which bounded context owns the feature?
- Which architecture documents are relevant?

---

### Review

Load only the required documents.

Examples

Server Management

↓

DATA_MODEL.md

↓

API_SPEC.md

↓

DOMAIN_MODEL.md

Do not read unrelated documentation.

---

### Plan

Before writing code:

Explain

- affected modules
- affected entities
- affected APIs
- affected database tables

---

### Implement

Follow

- DDD
- Clean Architecture
- Existing coding style

Avoid unrelated refactoring.

---

### Validate

Check

- compilation
- tests
- lint
- consistency

---

### Documentation Sync

Compare implementation against repository documentation.

Update only affected documents.

Examples

| Change           | Update               |
| ---------------- | -------------------- |
| Database         | DATA_MODEL.md        |
| API              | API_SPEC.md          |
| Architecture     | OVERVIEW.md          |
| Folder Structure | PROJECT_STRUCTURE.md |
| Requirements     | REQUIREMENTS.md      |

---

### Project Sync

Always update

```
PROJECT_STATUS.md
```

If milestone progress changed

↓

Update

```
IMPLEMENTATION_PLAN.md
```

If a significant architectural or technical decision was made

↓

Update

```
DECISION_LOG.md
```

---

### Finish

Provide:

- Summary of work completed
- Files changed
- Documentation updated
- Remaining work
- Recommended commit message
- Recommended next task

---

# Action: IMPLEMENT_BUGFIX

Focus only on:

- diagnosis
- root cause
- fix
- regression prevention

Avoid feature work.

Only update documentation if the bug fix changes documented behavior.

---

# Action: REFACTOR

Goals

- improve maintainability
- preserve behavior

Never introduce breaking architectural changes unless explicitly requested.

Update documentation only if the architecture changes.

---

# Action: REVIEW

When reviewing code:

Evaluate

- correctness
- architecture
- security
- performance
- maintainability
- testing

Recommend improvements without rewriting unrelated code.

---

# Action: UPDATE_DOCUMENTATION

Determine which documents are affected by comparing the current implementation with existing documentation.

Update only the necessary documents.

Avoid duplicate information.

---

# Action: END_SESSION

Before ending the session:

## Verify

- Build succeeds (where applicable)
- Tests pass (where applicable)
- Documentation matches implementation

---

## Synchronize

Always ensure

```
PROJECT_STATUS.md
```

reflects the current repository state.

If implementation milestones changed

↓

Update

```
IMPLEMENTATION_PLAN.md
```

If long-term decisions changed

↓

Update

```
DECISION_LOG.md
```

---

## Produce Session Summary

Include

- Features completed
- Files modified
- Documentation updated
- Outstanding work
- Recommended next task

---

# Documentation Synchronization Rules

Documentation should be updated automatically based on implementation.

Use the following mapping.

| Repository Change | Documentation        |
| ----------------- | -------------------- |
| API               | API_SPEC.md          |
| Database          | DATA_MODEL.md        |
| Architecture      | OVERVIEW.md          |
| Domain Model      | DOMAIN_MODEL.md      |
| Event Flow        | EVENT_FLOW.md        |
| Requirements      | REQUIREMENTS.md      |
| Folder Structure  | PROJECT_STRUCTURE.md |

Project documents

| Situation            | Document               |
| -------------------- | ---------------------- |
| Always               | PROJECT_STATUS.md      |
| Milestone changes    | IMPLEMENTATION_PLAN.md |
| Significant decision | DECISION_LOG.md        |

Do not update documentation that is unaffected.

---

# Implementation Principles

Always:

- Build one feature at a time.
- Prefer small incremental changes.
- Preserve architectural boundaries.
- Keep modules cohesive.
- Favor readability over cleverness.
- Explain trade-offs before major changes.

Never:

- Rewrite unrelated code.
- Introduce unnecessary abstractions.
- Expand Version 1 scope without explicit approval.
- Ignore existing architectural decisions.

---

# Conflict Resolution

If implementation conflicts with documentation:

1. Determine whether the implementation or documentation is correct.
2. Explain the discrepancy.
3. Ask for clarification if the correct direction is unclear.
4. Once resolved, synchronize the documentation.

Never silently change architecture.

---

# Success Criteria

A development session is considered complete only when:

- The requested implementation is complete.
- The codebase is internally consistent.
- Documentation accurately reflects the implementation.
- Project progress has been updated.
- The next recommended task has been identified.

At the end of every session, the repository should be ready for another developer or AI agent to continue work immediately without relying on previous conversations.

---

# Final Rule

**Treat the repository as the project's memory.**

Every decision, implementation, milestone, and architectural change should be discoverable by reading the repository alone.

If a new AI agent can clone the repository, read this file, and continue development without additional context, then this orchestrator has fulfilled its purpose.
