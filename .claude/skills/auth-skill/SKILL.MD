---
name: auth-skill
description: Handle user authentication flows securely. Signup, signin, password hashing, JWT tokens, Better Auth integration. Use for authentication and user management features.
---

# Auth Skill – Authentication & User Management

Focused on secure authentication implementation.

This skill should handle all aspects of user authentication and authorization following industry security standards.

## Instructions

1. **Signup Implementation**
   - Validate user input with **Validation Skill**
   - Hash passwords with bcrypt/argon2
   - Generate verification tokens
   - Send confirmation emails

2. **Signin Implementation**
   - Verify credentials with **Validation Skill**
   - Compare password hashes
   - Generate JWT access tokens
   - Create refresh tokens
   - Set secure cookies

3. **Better Auth Integration**
   - Configure Better Auth instance
   - Set up email/OAuth providers
   - Implement session handling
   - Configure middleware protection

4. **Token Management**
   - Generate secure JWT tokens
   - Implement token refresh flow
   - Handle token expiration
   - Store tokens in HTTP-only cookies

## Best Practices

- Never store plain text passwords
- Use strong hashing algorithms (bcrypt rounds >= 12)
- Implement rate limiting on auth endpoints
- Enable CSRF protection
- Set appropriate token expiration times
- Validate all inputs with **Validation Skill**
- Log authentication attempts
- Implement account lockout after failed attemptsd
dh
Use this skill when building signup, signin, password reset, or any authentication-related features in your application.
