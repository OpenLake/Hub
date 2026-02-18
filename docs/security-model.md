# OpenLake Security & Permissions Model

## 1. Philosophy
OpenLake Hub uses a **Hybrid RBAC + Scope** model.
- **Roles** define "who you are".
- **Scopes** define "what you can do".

Hub enforces **Scopes**. Auth Service assigns **Roles** (which map to scopes).

## 2. User Roles
These are the standard roles issued by `openlake-auth`.

| Role | Description |
|---|---|
| `student` | Standard user. Can view feeds, courses, events. Can post marketplace items (personal) and reviews. |
| `coordinator` | Event manager. Can create official events and announcements. |
| `faculty` | Academic staff. Access to sensitive academic data. |
| `admin` | System administrator. Full access. |
| `system` | Internal service-to-service communication. |

## 3. Scope Registry
Scopes are namespaced by domain.

### Events (`events:*`)
- `events:read`: View events.
- `events:write`: Create, update, cancel events.
- `events:admin`: Delete any event, bypass checks.

### Marketplace (`marketplace:*`)
- `marketplace:read`: Browse listings.
- `marketplace:write`: Create listings.
- `marketplace:admin`: Moderate/delete listings.

### Academics (`academics:*`)
- `academics:read`: View courses/reviews.
- `academics:write`: Write course reviews.

### Jobs (`jobs:*`)
- `jobs:read`: View job openings.
- `jobs:apply`: Apply to jobs.
- `jobs:admin`: Post/Manage jobs.

### Users (`users:*`)
- `users:read_self`: View own profile.
- `users:read_public`: View public profiles.

## 4. Role-to-Scope Mapping (Default)
| Role | Assigned Scopes |
|---|---|
| `student` | `events:read`, `marketplace:read`, `marketplace:write`, `academics:read`, `academics:write`, `jobs:read`, `jobs:apply`, `users:read_self`, `users:read_public` |
| `coordinator` | *All `student` scopes* + `events:write` |
| `admin` | `*:*` (Wildcard access) |

## 5. Hub Enforcement Rules

### 5.1 Route Protection
Hub checks for scopes on protected routes.
**Examples:**
- `GET /events` → Requires `events:read`
- `POST /events` → Requires `events:write`

### 5.2 Context Propagation
Hub forwards these headers to downstream services:
- `X-OpenLake-User-Id`: `uuid`
- `X-OpenLake-Role`: `student`
- `X-OpenLake-Scopes`: `events:read events:write`

Downstream services **MUST** trust these headers if the request comes from the Hub IP/VPC (or mTLS).
