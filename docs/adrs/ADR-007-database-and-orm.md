# ADR-007: Database and ORM

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
CogniCore™ requires a relational database for session metadata, user records, tenant configuration, and recording artefact references, with a type-safe ORM to reduce runtime SQL errors.

## Decision
Use **PostgreSQL 15** as the primary database and **Prisma ORM** for schema management, migrations, and type-safe queries. CogniCell LocalLink uses the same Prisma schema with a SQLite provider for offline operation.

## Rationale
- PostgreSQL offers mature JSON support (for xAPI payloads), full-text search, and logical replication (required for LocalLink sync).
- Prisma generates TypeScript types from the schema, eliminating a class of runtime errors.
- Prisma Migrate provides version-controlled, repeatable migrations.
- The same Prisma schema targets both PostgreSQL (cloud) and SQLite (LocalLink) via the `provider` field.

## Alternatives Considered
- **MySQL:** Lacks logical replication and advanced JSON operators needed for CogniChronicle.
- **TypeORM:** More verbose, decorator-based; schema drift risk.
- **Drizzle ORM:** Lighter weight but smaller ecosystem and fewer migration tools at time of decision.
- **MongoDB:** Schema-less flexibility not needed; joins are required for relational session data.

## Consequences
- **Positive:** Type safety, clean migrations, dual-provider (Postgres/SQLite) support.
- **Negative:** Prisma Client generation step adds ~2 s to cold build; raw SQL escape hatch is verbose.

## Implementation Notes
- Prisma schema at `packages/database/prisma/schema.prisma`.
- Migrations in `packages/database/prisma/migrations/`.
- `DATABASE_URL` env var selects provider at runtime.
- `npx prisma migrate deploy` runs as part of Docker entrypoint.
