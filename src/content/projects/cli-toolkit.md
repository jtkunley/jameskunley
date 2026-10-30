---
# PLACEHOLDER project: replace with a real one.
title: Developer CLI Toolkit
summary: A command-line tool that automates repetitive local development tasks such as environment setup and database seeding.
tech: [Go, Cobra, SQLite]
repo: https://github.com/jtkunley/dev-cli
featured: true
order: 2
---

**Problem.** New contributors spent most of their first day getting a working local environment.

**Approach.** A single Go binary with subcommands for bootstrapping dependencies, seeding a local database with realistic fixtures, and running common checks. Commands are idempotent and print exactly what they change.

**Outcome.** Onboarding went from hours to minutes, and the same commands now run in CI.
