---
name: database-skill
description: Create tables, migrations, schema design. Use for database structure and data modeling.
---

# Database Skill – Schema Design & Migrations

Focused on database architecture and data modeling.

This skill should handle all aspects of database design, from table creation to migration management, following best practices for data integrity and performance.

## Instructions

1. **Schema design**
   - Design normalized table structures
   - Define primary and foreign keys
   - Create indexes for performance
   - Set up relationships (one-to-many, many-to-many)

2. **Migration management**
   - Create incremental migration files
   - Write reversible up/down migrations
   - Handle data transformations safely
   - Version control database changes

3. **Data validation integration**
   - Apply **Validation Skill** for data constraints
   - Set up NOT NULL, UNIQUE, CHECK constraints
   - Define default values and auto-increment fields
   - Validate data types and formats

4. **Authentication tables**
   - Design user authentication tables with **Auth Skill**
   - Create sessions and tokens tables
   - Set up password reset and verification tables
   - Implement user roles and permissions schema

## Best Practices

- Use descriptive table and column names
- Always add timestamps (created_at, updated_at)
- Index foreign keys and frequently queried columns
- Use appropriate data types for storage efficiency
- Document schema changes in migration files
- Test migrations on staging before production
- Keep migrations small and focused
- Use transactions for data integrity
- Apply **Validation Skill** constraints at database level
- Design auth tables with **Auth Skill** security requirements

Use this skill when creating database schemas, writing migrations, or designing data models for your application.