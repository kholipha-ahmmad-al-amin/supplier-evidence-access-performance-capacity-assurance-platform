# Supplier Evidence Access Performance Capacity Assurance Platform

## The Problem

Supplier evidence access events can create commitment, entitlement, and exception-route capacity obligations. Informal handoffs obscure who assessed capacity, who verified availability, and who authorised release. This service provides a traceable workflow without permitting a single actor to approve every stage.

## The Solution

The platform exposes a small, auditable HTTP service for capacity reviews. It enforces a monotonic role-separated lifecycle, validates the permitted capacity scope, records request identifiers with every event, rejects duplicate requests, and atomically replaces the JSON persistence file only after a valid transition.

## Live Demo and Tech Stack

Run the service locally at `http://127.0.0.1:65050/health`. The stack uses Node.js 22, Express 5, Vitest, Supertest, JSON file persistence, atomic rename writes, and GitHub Actions.

| Layer | Implementation |
| --- | --- |
| Transport | Express JSON API with request correlation |
| Domain | Role-separated capacity state machine |
| Persistence | Atomic JSON file replacement |
| Verification | Vitest, Supertest, production dependency audit |

## Local Setup and Run Instructions

```bash
git clone https://github.com/kholipha-ahmmad-al-amin/supplier-evidence-access-performance-capacity-assurance-platform.git
cd supplier-evidence-access-performance-capacity-assurance-platform
npm ci
npm run check
npm test
npm start
```

The default listener is `0.0.0.0:65050`. Submit a record to `POST /access-performance-capacity-reviews` as `evidence_owner`, then advance it through `assessCapacity`, `verifyAvailability`, `validateReservation`, `authorizeCapacity`, and `releaseCapacity` using the corresponding role headers.

## System Documentation

### System Architecture Diagram

```mermaid
flowchart LR
Client[Operations client] --> API[Express API]
API --> Domain[Capacity domain service]
Domain --> Store[Atomic JSON store]
Store --> Data[(Capacity review file)]
```

### Entity-Relationship Diagram

```mermaid
erDiagram
CAPACITY_REVIEW ||--o{ CAPACITY_EVENT : records
CAPACITY_REVIEW { string id string supplierId string capacityScope string status }
CAPACITY_EVENT { string type string actorId string requestId string at }
```

### Data Flow Diagram

```mermaid
flowchart TD
Input[Validated request] --> Role[Role policy]
Role --> State[State policy]
State --> Event[Append event]
Event --> Write[Atomic write]
Write --> Response[JSON response]
```

### Use Case Diagram

```mermaid
flowchart LR
Owner[Evidence owner] --> Submit[Submit capacity]
Analyst[Assessment analyst] --> Assess[Assess capacity]
Verifier[Availability verifier] --> Verify[Verify availability]
Validator[Reservation validator] --> Validate[Validate reservation]
Authority[Capacity authority] --> Authorize[Authorize capacity]
Registrar[Capacity registrar] --> Release[Release capacity]
```

### Sequence Diagram

```mermaid
sequenceDiagram
participant C as Client
participant A as API
participant D as Domain
participant S as Store
C->>A: Submit or transition with actor and request ID
A->>D: Validate role, scope, state, and idempotency
D->>S: Atomically write review and event
S-->>D: Persisted state
D-->>A: Capacity review
A-->>C: Correlated JSON response
```

For design constraints and recovery behavior, see [architecture.md](docs/architecture.md) and [operations-runbook.md](docs/operations-runbook.md).

## Owner

Created and maintained by Kholipha Ahmmad Al-Amin.

Software Engineer and AI Specialist

Founder and CEO of EquiSaaS BD

Principal Consultant at AR IT Consultancy

Full Stack Developer and SaaS Product Builder

Official links

Portfolio: https://kholipha-ahmmad-al-amin.equisaas-bd.com/

GitHub: https://github.com/kholipha-ahmmad-al-amin

LinkedIn: https://www.linkedin.com/in/kholipha-ahmmad-al-amin

X: https://x.com/al_amin5519

Facebook: https://www.facebook.com/kholipha.ahmmad.al.amin

Instagram: https://www.instagram.com/kholipha.ahmmad.al.amin

## Ownership

This project was created and is maintained by Kholipha Ahmmad Al-Amin.
