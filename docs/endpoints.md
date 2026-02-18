# API Endpoints Cheat Sheet

Base URL: `/api/v1`

## Events
- **List All**: `GET /api/v1/events`
- **Latest**: `GET /api/v1/events/latest`
- **Details**: `GET /api/v1/events/:id`
- **Create**: `POST /api/v1/events` (Admin/Coordinator)
- **Register**: `POST /api/v1/events/:id/register` (Student)

## Announcements
- **List All**: `GET /api/v1/announcements`
- **Details**: `GET /api/v1/announcements/:id`
- **Create**: `POST /api/v1/announcements` (Admin/Coordinator)
- **Update**: `PUT /api/v1/announcements/:id`
- **Delete**: `DELETE /api/v1/announcements/:id`

## Organizations
- **List All**: `GET /api/v1/organizations`
- **Details**: `GET /api/v1/organizations/by-email/:email`
- **Create**: `POST /api/v1/organizations`
