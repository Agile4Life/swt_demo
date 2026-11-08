# ADR 0001: Modular monolith for MVP

## Decision

Use one Spring Boot application organized by business feature (`auth`, `classes`, `membership`, `reception`, `reporting`) and one React portal with role-based routes.

## Consequences

The MVP has simple local development and one deployable API. Module boundaries remain explicit so a later team can extract a service only when a real operational need exists.
