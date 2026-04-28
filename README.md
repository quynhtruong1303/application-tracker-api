# Job Application Tracker API

A RESTful API for managing job applications, built with Node.js, Express, and MongoDB. Secured with JWT authentication.

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register a new user, returns JWT |
| POST | /auth/login | Login with email and password, returns JWT |

### Applications
All routes require `Authorization: Bearer <token>` header.

| Method | Path | Description |
|--------|------|-------------|
| GET | /applications | Get all applications for the logged-in user |
| POST | /applications | Create a new application |
| GET | /applications/stats | Get application counts grouped by status |
| GET | /applications/:id | Get a single application |
| PUT | /applications/:id | Update an application |
| DELETE | /applications/:id | Delete an application |

## Postman

Postman collection is available in the [postman/](postman/) folder. 

## Deployment

The API is hosted on Render: [Application Tracker API](https://application-tracker-api-saz8.onrender.com)

## Frontend

The frontend client is currently in development and will be linked here once deployed.
