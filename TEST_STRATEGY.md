# Chubb QA Assessment - Test Strategy

## Highest-risk areas

1. Authentication and authorization:
   Keycloak JWT validation, role-based access and claimant ownership.

2. Claims lifecycle:
   Claim creation, retrieval, updates, status transitions and validation.

3. Inter-service communication:
   BFF to Claims Service API integration.

4. Event-driven processing:
   Kafka event publication, consumption and WebSocket updates.

5. Persistence:
   PostgreSQL repositories, data integrity and transaction behaviour.

6. Frontend:
   Claim submission, validation, admin workflows and error handling.

## Test prioritisation

- Unit tests for business logic and domain rules.
- Component tests for user-visible frontend behaviour.
- Controller tests for API contracts and HTTP responses.
- Integration tests for persistence, messaging and security.
- End-to-end tests for critical user journeys.

## Deliberately deferred

- Large-scale performance and load testing.
- Visual regression across all browsers.
- Exhaustive cross-browser combinations.
- Full production-scale resilience testing.

## Security observation requiring verification

A claimant-role JWT previously received HTTP 200 from the admin claims API,
although the controller has an ADMIN role restriction.

Rebuild the service and repeat the negative authorization test.
If it persists, report it as a critical authorization defect.

## Environment concern

The project specifies Java 21. Java 25 caused Mockito/Byte Buddy
agent initialization errors during test execution.
