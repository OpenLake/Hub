# OpenLake Hub API Specification — v1
Base URL: `https://hub.openlake.in/api/v1`
All requests require: `Authorization: Bearer <JWT>` (unless public)

## 1. Standard Response Format
**Success:**
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```
**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## 2. Authentication
- **Header:** `Authorization: Bearer <token>`
- **Token Claims:** `sub` (user_id), `role`, `scope`
- **Hub Forwarding Headers:**
  - `X-OpenLake-User-Id`
  - `X-OpenLake-Role`
  - `X-OpenLake-Scopes`
  - `X-OpenLake-Request-Id`

## 3. Endpoints

### 3.1 Events (CoSA)
- `GET /events` - List all events (Maps to CoSA `/api/events/events`) (Scope: `events:read`)
- `GET /events/latest` - List latest events (Maps to CoSA `/api/events/latest`) (Scope: `events:read`)
- `GET /events/:id` - Get event details (Maps to CoSA `/api/events/:id`) (Scope: `events:read`)
- `POST /events` - Create event (Maps to CoSA `/api/events/create`) (Scope: `events:write`)
- `POST /events/:id/register` - Register for event (Maps to CoSA `/api/events/:id/register`) (Scope: `events:read`)

### 3.2 Announcements (CoSA)
- `GET /announcements` - List announcements (Maps to CoSA `/api/announcements`) (Scope: `announcements:read`)
- `GET /announcements/:id` - Get announcement details (Maps to CoSA `/api/announcements/:id`) (Scope: `announcements:read`)
- `POST /announcements` - Create announcement (Maps to CoSA `/api/announcements`) (Scope: `announcements:write`)
- `PUT /announcements/:id` - Update announcement (Maps to CoSA `/api/announcements/:id`) (Scope: `announcements:write`)
- `DELETE /announcements/:id` - Delete announcement (Maps to CoSA `/api/announcements/:id`) (Scope: `announcements:write`)

### 3.3 Organizations (CoSA)
- `GET /organizations` - List all units (Maps to CoSA `/api/orgUnit/organizational-units`) (Scope: `orgs:read`)
- `GET /organizations/by-email/:email` - Get unit details by email (Maps to CoSA `/api/orgUnit/clubData/:email`) (Scope: `orgs:read`)
- `POST /organizations` - Create unit (Maps to CoSA `/api/orgUnit/create`) (Scope: `orgs:write`)

### 3.2 Marketplace
- `GET /marketplace/listings` - Browse listings (Scope: `marketplace:read`)
- `GET /marketplace/listings/:id` - Get listing details (Scope: `marketplace:read`)
- `POST /marketplace/listings` - Create listing (Scope: `marketplace:write`)

### 3.3 Academics (AcadMap)
- `GET /academics/courses` - Search courses (Scope: `academics:read`)
- `GET /academics/reviews` - Get recent reviews (Scope: `academics:read`)
- `POST /academics/reviews` - Submit review (Scope: `academics:write`)

### 3.4 Feedback (CoSA)
- `GET /feedback` - View all feedback (Maps to CoSA `/api/feedback/view-feedback`) (Scope: `feedback:read`)
- `POST /feedback` - Submit new feedback (Maps to CoSA `/api/feedback/add`) (Scope: `feedback:write`)

### 3.5 Jobs (CCPS)
- `GET /jobs` - List open positions (Scope: `jobs:read`)
- `POST /jobs/:id/apply` - Apply for job (Scope: `jobs:apply`)

### 3.6 Aggregation
- `GET /home` - Dashboard data
    - **Response:**
      ```json
      {
        "success": true,
        "data": {
          "events": [],
          "marketplace": [],
          "jobs": []
        },
        "meta": {
          "warnings": ["OPTIONAL_SERVICE_FAILURE"]
        }
      }
      ```

### 3.7 System
- `GET /health` - Service health status
    - **Response:**
      ```json
      {
        "status": "ok",
        "services": { "cosa": "ok", ... }
      }
      ```

## 4. Error Codes
| Code | Meaning |
|---|---|
| `UNAUTHORIZED` | Invalid token |
| `FORBIDDEN` | Scope missing |
| `SERVICE_DOWN` | Downstream unavailable |
| `TIMEOUT` | Downstream timeout |
| `INVALID_REQUEST` | Validation failed |
| `INTERNAL_ERROR` | Unexpected error |
