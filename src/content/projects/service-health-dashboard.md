---
# PLACEHOLDER project: replace with a real one.
title: Service Health Dashboard
summary: A lightweight status dashboard that aggregates health checks and latency metrics across microservices.
tech: [TypeScript, Node.js, PostgreSQL, Docker]
repo: https://github.com/jtkunley/service-health-dashboard
featured: true
order: 1
---

**Problem.** On-call engineers had to check several tools to answer a simple question: is everything healthy right now?

**Approach.** A small Node.js service polls each service's health endpoint on a schedule, stores results in PostgreSQL, and renders a server-side dashboard with per-service uptime and p95 latency. Checks are declared in a single config file so adding a service is a one-line change.

**Outcome.** Reduced the time to triage incidents and gave the team a shared view of system health.
