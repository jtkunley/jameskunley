---
title: 'Reference Data Cache'
description: 'A design for reusing frequently read, rarely changed reference data across operations, with per-process memory backed by an optional shared cache.'
pubDate: 2026-11-09
tags: ['design', 'caching', 'distributed-systems']
draft: false
---

**Status:** Proposed design.

**Contents**

- [1. Problem Summary](#1-problem-summary)
- [2. Acceptance Criteria](#2-acceptance-criteria)
- [3. Out of Scope](#3-out-of-scope)
- [4. Glossary](#4-glossary)
- [5. Design](#5-design)
- [6. Rejected Alternatives](#6-rejected-alternatives)

## 1. Problem Summary

Reference data supplies shared definitions and lookup values used to interpret, validate, classify, or enrich other data. It includes codes, labels, categories, units, supported values, and their relationships. It is usually read often and changed infrequently.

It is useful across a system:

- **Database queries:** Joins, identifier resolution, filtering, sorting, and grouping.
- **Application logic:** Validation, eligibility, calculations, and rule inputs.
- **APIs:** Response enrichment, supported-value lists, and representation mapping.
- **Consumers:** Common definitions for services, workers, scripts, and command-line tools.
- **User interfaces:** Labels, controls, selection validation, and value interpretation.
- **Background processing:** Message, import, export, and batch enrichment.
- **Search and read models:** Index attributes, projections, and aggregates.
- **Reporting and analytics:** Consistent classification, grouping, and descriptions.

Without reuse, database queries repeatedly join reference tables, servers build the same values in memory for each request, and consumers repeatedly fetch them from endpoints. Each operation then discards its copy. Database buffering may reduce disk reads, but query execution, transfer, encoding, parsing, and allocation still recur as demand grows.

Expiry also creates an availability problem: a dependency may fail while the process still holds useful data. The cache must balance freshness with continued service, bound acquisition and recovery work, and let applications choose whether to wait or use retained data.

## 2. Acceptance Criteria

### Public API

- Provide a local reader with `register`, `get`, `getWithMetadata`, and `invalidate`. An owner also uses a caller-supplied shared-cache adapter. Registration is synchronous; reads and invalidation are asynchronous.
- Cache complete values by exact, case-sensitive domain name. Loaders receive operational context, not request-specific selectors.
- Keep shared reads, writes with expiry, and deletion independent of backend, protocol, client library, and encoding.
- `get` returns a value; `getWithMetadata` uses the same acquisition and includes freshness, age bounds, and delivery reason.
- Reject unknown domains, duplicate registration, and invalid settings explicitly. Registration performs no source/network I/O and leaves no partial state on failure.
- Support domain overrides of client defaults, capture settings at registration, and resolve every applicable timeout to a finite positive duration.

### Reads and Failure Recovery

- Fresh local reads avoid dependency access. Concurrent requests share one current refresh per domain and client; separate domains have independent coordination.
- Support blocking, stale-if-error, and stale-while-revalidate reads. Blocking is the default; stale serving requires a finite age limit.
- Preserve the previous successful value during expiry and refresh. Serve stale data only within its policy and age bounds; never invent defaults or extend age because an operation failed.
- Stale-while-revalidate delivers eligible stale data before external refresh code runs. During cooldown, return an allowed fallback or recorded failure without waiting for cooldown to end.
- Shared-cache failure leaves time for a loader attempt. A miss goes directly to the loader.
- Apply cache-owned timeouts to every loader call and shared read/write/delete, including background writes and cleanup. Transport timeouts do not replace them.
- Bound retries by attempt count, time, and backoff. A current non-fresh refresh starts cooldown; a later request may retry after it, even if old I/O never settles.
- Every read and invalidation settles within its original budget while the runtime remains responsive. Timeout, cancellation, and supersession release cache-owned state without waiting for physical cancellation.
- Late work cannot replace newer state or schedule obsolete side effects. Caller cancellation affects only that caller, not other waiters or newer work.
- Shared-write, cleanup, and reporting failures do not undo successful local delivery. Background jobs and pending notifications remain bounded.
- Accept valid empty datasets and falsy values; reject null/undefined values and invalid cache envelopes. Domain-schema validation remains application-owned.
- Preserve snapshot provenance through copying and apply the defined ordering and age rules. Only fresh acquisition counts as recovery or permits shared population.

### Invalidation and Responsibilities

- Reader invalidation clears its local value, fallback, and obsolete work without I/O. Owner invalidation also attempts bounded shared deletion and reports its result.
- Subsequent reads use the configured loader under normal policy. Invalidation never requires a new source capability, a later observation timestamp, or proof that the underlying value changed.
- Owner shared bypass lasts only through pending deletion and one post-invalidation refresh cycle; it cannot become a permanent gate.
- Other clients follow their TTL and stale-age policies. Immediate cross-client notification and coordinated invalidation belong to application-owned eventing.
- Loaders, adapters, and reporting sinks own physical resources, cancellation, and transport repair. Callers preserve local values against mutation and maintain query semantics when replacing joins.

## 3. Out of Scope

- Arbitrary query/response caching, unbounded per-record keys, source writes, or automatic query rewriting.
- Cross-process loading locks, event publication/subscriptions, invalidation broadcasts, or globally synchronized freshness.
- Scheduled refresh and prewarming without a request. Request-triggered background refresh is included.
- Cache-value memory budgets, size-based eviction, and eager expiry cleanup. Limits on cache-owned tasks remain in scope.
- Durable storage, confirmed shared persistence, and draining background writes on shutdown.
- Provisioning, credentials, pools, hidden transport queues, reconnection, and physical cancellation. The cache still bounds its own I/O waits.
- Application authorization, tenant resolution, and automatic isolation boundaries.

## 4. Glossary

| Term                            | Meaning                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| Domain                          | One named complete value loaded and cached as a unit.                                        |
| Snapshot / envelope             | A value with provenance / the structure carrying that value and metadata.                    |
| Validation time                 | A conservative timestamp for the source observation behind a snapshot.                       |
| Reader / owner                  | A local caching client / one that also uses shared storage. Both support local invalidation. |
| Adapter                         | The implementation connecting the shared-cache interface to a backend.                       |
| Fresh / stale                   | Eligible for normal reuse / due for refresh and requiring stale-serving permission.          |
| TTL / hard age limit            | Normal reuse or storage duration / the latest age at which a value may be returned.          |
| Promotion                       | Copying a shared snapshot into local memory.                                                 |
| Logical refresh / single-flight | One coordinated acquisition, including retries / sharing it among callers.                   |
| Stale-if-error                  | Wait for refresh, then return eligible stale data after an allowed non-fresh outcome.        |
| Stale-while-revalidate          | Return eligible stale data immediately and refresh in the background.                        |
| Cooldown / retryAfter           | Suppression of new refreshes after a non-fresh outcome / its monotonic end time.             |
| Generation / refresh identity   | Tokens identifying invalidation state / a particular acquisition and its writes.             |
| Supersession                    | Ending old logical work so it cannot update newer state.                                     |
| Logical completion              | Releasing cache-owned work even when external I/O continues.                                 |
| Deadline / backoff / jitter     | Waiting cutoff / increasing retry delay / random variation of that delay.                    |

## 5. Design

### 5.1 Cache Reader

Create a reader once and reuse it across requests. Each registered loader supplies one complete domain value from a database, endpoint, or another configured source.

![Cache reader read path: a fresh local value is returned; otherwise stale delivery may return a stale value and schedule a deferred refresh, an active cooldown yields an allowed fallback or recorded error, and otherwise the caller joins or runs a bounded loader refresh before the acquisition outcome is applied.](../../assets/designs/reference-data-cache/cache-reader.svg)

The client records a background task before returning but runs its body in a later scheduler turn, after delivering the immediate result. Concurrent reads reuse that task. No read sleeps through cooldown.

### 5.2 Cache Owner

An owner applies the reader's delivery policy, then checks shared storage when refresh is needed.

![Cache owner refresh path: after the reader policy gate allows a refresh, the owner either skips the shared cache or performs a bounded shared read; an admissible fresh snapshot is promoted, otherwise bounded loader attempts run, and a fresh result replaces local state and is written to the shared cache in the background if still current.](../../assets/designs/reference-data-cache/cache-owner.svg)

Shared population never delays successful delivery. Every promotion, retry, and write must pass the current-work checks in §5.5.

### 5.3 Values, Metadata, and Admission

These contracts describe logical data, independent of language or backend:

| Contract        | Fields                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loader context  | `{ attemptStartedAt, deadline, signal }`: UTC attempt start, monotonic logical deadline, and per-attempt cancellation signal.                                 |
| Source result   | `{ kind: source, value, observedAt?, sourceVersion? }`.                                                                                                       |
| Cached result   | `{ kind: cached, result }`, carrying the upstream read result below.                                                                                          |
| Stored snapshot | `{ value, validatedAt, sourceVersion?, upstream? }`. Optional `upstream` contains `{ stale, freshUntil, serveUntil, reason }`.                                |
| Read result     | `{ value, validatedAt, freshness, freshUntil, serveUntil, sourceVersion?, reason }`. `freshness` is `fresh` or `stale`; `serveUntil: null` means no hard cap. |
| Failure         | `{ domain, stage, code, attempts, cause?, operationId }`. Public delivery reasons contain only `{ code, stage }`; original exceptions stay local.             |

`upstream.stale` is boolean; `reason` is null or `{ code, stage }`. Deadlines are finite UTC times, except nullable `serveUntil`. Envelope validation checks these fields, not the value's application schema.

For source results, set `validatedAt` to the attempt start or an earlier supplied `observedAt`. Do not use completion time to make a slow read appear younger. This records an observation of the configured source, not proof of the newest global revision. Replicas remain supported; a known older source observation must be reported accurately, and applications needing origin freshness must obtain that guarantee from their loader.

Cached results preserve validation time and version. Set `upstream.stale` from the returned freshness and copy its deadlines/reason; direct source snapshots omit `upstream`. Endpoint success does not justify a new timestamp. Shared adapters store the envelope unchanged. Local values are neither cloned nor frozen; callers must avoid mutation and use adapter-compatible encodings.

All portable times are finite UTC epoch milliseconds. Local waits, TTL intervals, and cooldown use a monotonic clock. Client-stamped local observations need no cross-host allowance; supplied observation times and cached/shared metadata require an explicit finite `clockSkewAllowanceMs` (zero is allowed).

Reject wrong field types, non-finite times, validation times too far in the future, and freshness deadlines later than hard deadlines. Past deadlines indicate expiry, not corruption. Subtract the skew allowance when converting incoming age limits and deadlines to remaining local time. Portable age guarantees depend on the declared clock bound.

| Shared result                                                                         | Action                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Valid, not upstream-stale, within inherited freshness/age bounds, and not known older | Promote as fresh.                                       |
| Valid stale data within the age allowance                                             | Keep as a fallback candidate and try the loader.        |
| Hard-expired, missing, or adapter-reported error                                      | Try the loader; never serve the hard-expired candidate. |
| Invalid envelope                                                                      | Report, attempt bounded cleanup, and try the loader.    |

When both source versions are comparable, use the optional domain comparator. Otherwise prefer the later observation, retaining the existing candidate on a tie. Observation time does not order data revisions. An older shared candidate cannot replace a newer retained one; try the loader instead. Comparator errors fail as policy errors. The same rules select among offered stale candidates.

Backend storage TTL does not override these bounds. Expiry of an earlier local copy alone does not disqualify a shared snapshot; promotion can start a local interval within the preserved restrictions.

### 5.4 Policies and Read Outcomes

A source-only reader needs effective `ttlMs` and `refreshTimeoutMs`. Domain settings override client defaults. Shared-storage settings fall back to adapter defaults. Copy policies at registration.

| Setting                                        | Rule or default                                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ttlMs`                                        | Required finite, nonnegative local reuse interval.                                                                       |
| `readMode`                                     | `blocking` by default; also `stale-if-error` and `stale-while-revalidate`.                                               |
| `maxValueAgeMs`                                | Finite positive bound required for stale serving; optional for blocking.                                                 |
| `clockSkewAllowanceMs`                         | Implicit zero only for client-stamped local observations; explicit before portable metadata is accepted.                 |
| `refreshTimeoutMs`                             | Required finite positive read/refresh budget.                                                                            |
| `invalidateTimeoutMs`                          | Owner deletion budget; defaults to the refresh budget. Reader invalidation has no I/O.                                   |
| `loaderReserveMs`                              | Required owner reserve, positive and no greater than the refresh budget.                                                 |
| `retryCooldownMs`                              | Defaults to the refresh budget; finite nonnegative override, with zero disabling suppression.                            |
| `loaderRetry`, `sharedRetry.read/write/delete` | Default one attempt. Effective attempt/total timeouts are finite; extra attempts require finite base/max backoff delays. |
| `reportTimeoutMs`                              | Notification lifetime, defaulting to the refresh budget.                                                                 |
| `classifyFailure`, `compareSourceVersions`     | Optional synchronous callbacks.                                                                                          |
| `sharedPolicy.ttlMs`                           | Adapter-supported storage lifetime, at least the local TTL.                                                              |

A reader's loader attempt and total limits default to its refresh budget. For owners, the loader attempt defaults to the reserve and its total to the refresh budget; shared-read limits default to the budget minus reserve. Zero shared allowance bypasses that stage. Shared writes default to the refresh budget; deletes and cleanup default to the owner invalidation budget. The loader attempt must fit the reserve.

Overrides replace a complete retry-policy object; omitted fields use these derived defaults. Attempt counts are positive integers; one disables retries. Reject missing required settings, infinite budgets, negative/reversed backoff limits, and unsupported timer durations. Explicit timeouts remain clipped by their operation and parent limits. Every job's budget starts at creation, including deferred/pending time. Values are workload settings, not universal latency targets.

At population, calculate remaining lifetimes:

```text
hard remaining = min(
    validatedAt + maxValueAgeMs - UTC now - skew allowance, if configured,
    upstream serveUntil - UTC now - skew allowance, if present)

fresh remaining = min(
    ttlMs,
    upstream freshUntil - UTC now - skew allowance, if present,
    hard remaining)
```

Keep monotonic deadlines locally and expose conservative UTC bounds in results. Upstream-stale data cannot become fresh through promotion. Without a hard bound, blocking mode provides TTL reuse without an end-to-end age guarantee. Check the hard limit when selecting a response, including after waiting for refresh.

Zero TTL disables normal local reuse: a newly observed source result may satisfy its waiting read once, within any hard age limit. Acquisition completion never recursively refreshes it. For example, data observed and populated at 12:00 with a ten-minute TTL, one-hour age limit, and zero skew becomes due at 12:10 and unusable at 13:00. Failures move only the next-attempt time.

| Current acquisition result | State change                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Fresh                      | Replace eligible local state, clear failure/cooldown, and permit shared population.                           |
| Upstream stale             | Select an eligible candidate, record `upstream-stale`, and start cooldown; no shared write or recovery claim. |
| Failure                    | Retain the previous value, record the failure, and start cooldown.                                            |

Blocking waits and rejects non-fresh results. Stale-if-error waits, then may use a candidate when classification permits. Stale-while-revalidate returns an eligible candidate first; the later result governs subsequent reads. No candidate, denied permission, or a hard age limit means explicit failure. A denied fallback failure disables further stale delivery until fresh recovery.

Supersession terminates old work without updating newer state or cooldown. Caller cancellation ends only its waiter. These are control outcomes, not acquisition results. The separate stale modes resemble [stale-while-revalidate](https://www.rfc-editor.org/rfc/rfc5861.html#section-3) and [stale-if-error](https://www.rfc-editor.org/rfc/rfc5861.html#section-4), without requiring HTTP.

### 5.5 Timeouts, Retries, and Recovery

The cache owns current tasks, retry timers, pending candidates, and waiters. Loaders/adapters own physical requests, pools, cancellation, and transport repair.

Before every loader or adapter invocation, arm a client-owned timeout, including background writes and cleanup deletes. Use the shortest remaining attempt, operation, and parent budget. A separate watchdog covers the whole refresh or owner invalidation. Joining callers keep their original deadlines; nothing restarts a budget.

One completion path closes the attempt token, clears timers and logical ownership, and settles waiters exactly once. Timeout does not await cancellation, old I/O, reporting, or cleanup. Request cancellation separately and ignore late outcomes. Minimal late observers must not retain active locks, waiter lists, or snapshot payloads.

End owner shared reads by the earlier operation cutoff or `refresh deadline - loaderReserveMs`. If no shared time remains, go directly to the loader. Adapter saturation is a classified failure, not a cache-owned capacity lock.

`maxAttempts` includes the initial call. Before retry `n`, starting at one, use full jitter:

```text
delay = random(0, min(maxDelayMs, baseDelayMs * 2^(n - 1)))
```

Yield even for zero delay; check monotonic deadlines before dispatch. Misses do not retry, and malformed shared data goes to cleanup/loader. Bound SDK retries within the same effective limits; otherwise attempts multiply across layers ([AWS retry guidance](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)).

Every current non-fresh acquisition sets `retryAfter = completion + retryCooldownMs`. During cooldown, return allowed fallback or the recorded error immediately. The first later request can start a new bounded refresh even if the old dependency promise never settles. There are no request-independent recovery loops. A fresh result clears cooldown; a stale upstream result does not.

Each domain has one current refresh, one logical writer with one replaceable latest candidate, and at most one cleanup job. Generation and refresh identity checks stop obsolete population, retries, and writes. A newer accepted snapshot supersedes older write identities. All jobs release their cache-owned slots at deadline/supersession; pending candidates keep their original budgets. Already-issued remote effects cannot be retracted.

An already-aborted read rejects before scheduling. Later cancellation removes only that waiter; recursion and cross-domain loader cycles still obey the original watchdog. External refresh, cancellation, and reporting bodies run after immediate response delivery. Synchronous callbacks must remain nonblocking: timers cannot preempt them or promise exact scheduling ([Node.js timers](https://nodejs.org/api/timers.html#settimeoutcallback-delay-args), [event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)).

Timeout releases cache coordination, not physical resources. When loader calls never finish, continuous demand adds roughly `actual attempts ÷ (actual cycle duration + cooldown) × active domains` stalled calls per unit time, until dependency limits or effective cancellation stop further accumulation. This is a rate, not a fixed ceiling: outstanding calls grow with outage duration. The configured attempt count caps one cycle; timeouts are not minimum cycle durations. Adapters must limit their own queues/resources and recover transports; the cache cannot contain arbitrary supplied code.

### 5.6 Invalidation and Change Visibility

Invalidation clears what this client holds; it does not prove what a source will return.

1. Advance the generation, discard local value/fallback/cooldown, and supersede old work. Settle affected waiters with `superseded` without waiting for I/O.
2. A reader completes locally. Its next read uses its normal loader and admission rules.
3. An owner also deletes the shared entry under its original timeout/retry budget. While owner deletions are pending, reads bypass shared storage.
4. Each owner deletion finalizes once, advances the generation again, clears refills and intermediate failure/cooldown state, and supersedes affected work. Report its own success or failure. After the last pending deletion, mark one post-invalidation refresh to bypass shared storage.

Consume that one-cycle bypass when the next current refresh starts. It invokes the configured loader under normal rules; completion or failure ends the preference. A later invalidation creates a new generation and its own marker. No authority-proof flag or timestamp threshold can remain latched after this cycle.

A cached endpoint or replica result remains acceptable under normal policy, even with a validation time older than invalidation. The discarded local copy cannot be used as fallback, but newly acquired data may have the same value. Failed shared deletion is reported; after the bounded bypass, an old shared entry may be encountered until its storage expiry. Strong read-after-write requirements belong in the application's loader/version contract.

Other clients discover changes on subsequent reads under their TTL, refresh, and stale-age limits. Expiry makes acquisition due; it does not synchronously update every client. Stale delivery stays within the hard age bound.

Applications needing immediate notification publish their own change events and call `invalidate` on affected clients. They own source-update ordering, delivery, duplicates, authorization, and any claim that every client has changed. Invalidation is lazy: loader spikes require correlated reads afterward, not merely receiving events. Applications can coordinate or spread refresh work; delaying invalidation itself weakens an immediate-invalidation requirement.

The cache supplies no event bus, cross-process loading lock, or global freshness barrier. Already-dispatched writes/deletes can still alter shared storage after local invalidation. Strong remote ordering requires backend conditions or application coordination.

### 5.7 Failure Policy and Reporting

Normalize backend exceptions into the codes below; unmapped errors remain `unknown`. A synchronous classifier receives the failure and stage, returning `retryable` and `canServeStale`. A thrown, invalid, or promise-valued decision becomes `policy-error`. Cooldown is independent of either boolean.

| Code                                              | Retry default      | Stale default / action                                                             |
| ------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `timeout`, `transport`, `unavailable`, `capacity` | Within budgets     | Allowed by read mode; physical recovery stays with the dependency owner.           |
| `throttled`                                       | No immediate retry | Allowed; apply cooldown. HTTP statuses/Retry-After require explicit normalization. |
| `upstream-stale`                                  | No                 | Allowed by read mode; it is not recovery.                                          |
| `corrupt`, `invalid-data`                         | No                 | Denied; shared corruption may fall through to a valid loader result.               |
| `unauthorized`, `configuration`, `unknown`        | No                 | Denied by default.                                                                 |
| `policy-error`                                    | No                 | Denied; cannot classify itself permissively.                                       |
| `aborted`, `superseded`                           | No                 | Denied; affect only their calls, not newer cooldown/state.                         |

Domain overrides may change ordinary error eligibility, not policy errors or cancellation/supersession controls. Intermediate shared failures do not start domain cooldown when loading succeeds. Valid empty data is success. Shared-write and cleanup errors cannot undo local delivery.

Report terminal operations once with identity, domain, stage, attempts, code, and local cause. Distinguish optional attempt events; coalesce stale/recovery transitions instead of reporting every read. Per-read metadata carries delivery status.

Reporting is deferred and never awaited by a data operation. Keep one current notification and one replaceable pending item per domain. `reportTimeoutMs` closes the logical gate even if the sink never settles; later notifications can try again without renewing old deadlines. Drop expired items, catch late rejection, and do not report sink errors recursively through itself. The sink owns physical resources and remains subject to the nonblocking-callback rule.

### 5.8 Integration and Verification

For join replacement, load the domain once per operation and enrich selected records in memory. Preserve existence, filtering, ordering, grouping, pagination, and response meaning. Blocking cache mode is not a substitute for authoritative validation when the application requires current truth.

Reuse clients across requests and forward envelopes through cached endpoints. Loaders keep their normal contract after invalidation; the cache neither forces a bypass of every upstream cache nor certifies a global update. Applications set freshness bounds and implement immediate notification outside the library.

Use controlled clocks/scheduling and dependency fakes, then real adapter tests. Verify the following without treating this plan as measured or implemented behavior:

| Scenario                                                                               | Required observation                                                                                         |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| All read modes; cold, fresh, stale, hard-expired, empty, and falsy values              | Correct value or explicit error; no invented fallback or false miss.                                         |
| Same-domain concurrency and independent domains                                        | One current refresh per domain; joiners do not extend deadlines or block another domain's coordination.      |
| Any loader/shared read/write/delete/cleanup never settles                              | Cache-owned deadlines complete the job without physical-cancellation acknowledgment.                         |
| First load hangs; next load succeeds after cooldown; old work later settles            | Recovery without restart; no late population, retries, state changes, or unhandled rejection.                |
| Shared read hangs while loader is healthy                                              | Reserved time reaches the loader.                                                                            |
| Immediate stale delivery; slow external setup                                          | Caller receives data before refresh/reporting code executes.                                                 |
| Every error class, malformed decisions, recursion, retry delay, and cancellation       | Correct retry/fallback/cooldown; original budgets hold, timers clear, and other waiters continue.            |
| Upstream stale, older candidates, source recovery, and invalid data                    | Correct candidate selection; only fresh outcomes replace recovery state or reach shared storage.             |
| Reporting never settles                                                                | Data calls continue; notification gate expires and later delivery is possible.                               |
| Reader/owner invalidation; failed/hung/overlapping deletes                             | Correct local clearing, bounded one-cycle owner bypass, and exactly-once finalization.                       |
| Invalidate then load from a cached endpoint or replica                                 | Normal eligible result accepted without new authoritative-proof capability or a later timestamp requirement. |
| Invalidation during load/backoff/write; repeated writer replacement                    | Superseded callers settle; no obsolete new effects or unlimited task queue.                                  |
| Change with no event, then an application event; correlated client reads               | Normal TTL/stale behavior until local invalidation; no inferred broadcast; potential stampede visible.       |
| Zero TTL, long acquisition, exact boundaries, skew, clock shifts, and metadata copying | No recursive refresh or age reset; waits remain monotonic and admission conservative.                        |
| Adapter saturation, broken cancellation, restart, and no accessible snapshot           | Bounded cache outcome; transport repair and memory durability are not falsely guaranteed.                    |

Measure calls, latency, attempts, stale age, cooldown suppression, pending cache jobs, and retained memory under normal and outage loads. Observe physical dependency resources separately; a completed cache call does not prove its remote work stopped.

## 6. Rejected Alternatives

| Alternative                                         | Reason and accepted trade-off                                                                                   |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Fetch the source every time                         | Repeats unchanged acquisition; still appropriate for operations needing current authoritative truth.            |
| Shared cache only                                   | Retains network work per read; local copies accept duplicated memory and independently timed updates.           |
| Await shared-write confirmation                     | Couples successful acquisition to another I/O result; best-effort writes accept later shared misses.            |
| Arbitrary record/query caching                      | Adds key cardinality, query identity, and fine-grained invalidation; this design targets bounded whole domains. |
| Distributed loading/invalidation inside the library | Adds locks and event-delivery obligations; applications own immediate cross-client coordination.                |
| Renew TTL on failure                                | Can retain old data indefinitely; fixed age bounds separate freshness from retry timing.                        |
| Hold physical permits until calls end               | Can permanently park a domain; cache state releases at timeout while adapters own resources.                    |
| Require authoritative proof after invalidation      | Excludes ordinary cached/replica loaders; applications enforce stronger source/version guarantees when needed.  |
| Queue readers until cooldown/capacity recovers      | Adds waiting state; return permitted stale data or a bounded outcome instead.                                   |
| Full circuit breaker                                | Adds thresholds/hysteresis beyond cooldown and single recovery acquisition; applications may wrap dependencies. |
| Mandatory version-conditional writes                | Requires backend/version semantics beyond read/write/delete; stronger remote ordering is an extension.          |
| Scheduled refresh/prewarming                        | Adds idle work and lifecycle scheduling; the first request may wait when no retained value is eligible.         |
