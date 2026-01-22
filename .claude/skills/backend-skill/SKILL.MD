---
name: backend-skill
description: Generate routes, handle requests/responses, connect to DB. Use for API development and database operations.
---

# Backend Skill – API Routes & Database Management

Focused on building robust backend APIs and database integrations.

This skill should handle server-side logic, API endpoints, and database operations following best practices.

## Instructions

1. **Route generation**
   - Create RESTful API endpoints
   - Define route handlers (GET, POST, PUT, DELETE)
   - Implement middleware chains
   - Set up route parameters and query strings

2. **Request/Response handling**
   - Parse request bodies with **Validation Skill**
   - Validate incoming data structures
   - Handle file uploads
   - Send appropriate HTTP status codes
   - Format JSON responses consistently

3. **Database connection**
   - Configure database client (Prisma, Drizzle, MongoDB)
   - Establish secure connections
   - Handle connection pooling
   - Implement query builders
   - Manage transactions

4. **Authentication integration**
   - Protect routes with **Auth Skill**
   - Verify JWT tokens in middleware
   - Check user permissions
   - Handle authenticated requests

## Best Practices

- Validate all inputs with **Validation Skill**
- Use **Auth Skill** for protected endpoints
- Return consistent error messages
- Implement proper error handling
- Use environment variables for secrets
- Add request logging
- Optimize database queries
- Use connection pooling
- Implement rate limiting
- Handle CORS properly
- Sanitize user inputs
- Use prepared statements for SQL

Use this skill when building API endpoints, connecting to databases, or handling server-side business logic.