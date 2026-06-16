# Multi-Tenant Marketing Operations & Lightweight Data Ingestion Platform

A production-adjacent, full-stack B2B SaaS architecture engineered to solve silo, integrity, and ingestion challenges common in growth marketing operations. The platform ingests raw Google ad campaign exports, strips system noise, sanitizes raw financial metrics through a strict runtime validation layer, and aggregates normalized data points into type-safe analytical dashboards.

## Live Environment & Deployment Architecture

* **Frontend:** React / TypeScript deployed via Vercel (Built in CDN)
* **Backend:** Node.js / Express API containerized inside Docker Compose
* **Database Layer:** Isolated PostgreSQL instance accessible exclusively via internal docker container networks
* **Reverse Proxy & TLS:** Linux (Ubuntu) VPS managed by Nginx with automated Certbot Let's Encrypt
* **Session Layer:** Same-domain `HTTP-Only` cookies utilizing `SameSite=Strict` to defend against XSS & CSRF attacks

## Core Technical Case Study

### 1. The Operational Problem

Marketing organizations handle daily data tracking by extracting ad performance data manually from siloed ad engines (e.g., Google Ads, Meta). Depending on the campaign or marketer, they may have to/prefer to manually enter some metrics as well. CSV exports are inherently messy and contain multi-row metadata headers at the top, variable currency symbols, mathematical summary aggregates at the bottom, etc. 

Manually parsing and transforming these data layouts introduces high risks of type-casting failures, duplicate records, data mutations, and runtime system exceptions.

### 2. System Architecture & Component Mapping

* **Ingestion Pipeline:** PapaParse + Custom Stream Sanitization Regex
* **API Boundary:** Express + Zod Schema Validation Guardrails
* **Database Storage:** PostgreSQL + `pg-format` For Multi-Row Transactions
* **AI Analysis Pipeline:** Decoupled 14-Day KPI Data + OpenAI Completion Model

## Engineering Deep Dives & Structural Solutions

### Stream Sanitization & Metadata cleansing

* **The Challenge:** Raw Google Ads CSV files exported directly from the platform contain non-tabular metadata lines that causes standard parsing to crash or cast improper column headers.
* **The Solution:** Leveraged PapaParse's `beforeFirstChunk` hook to scan file buffer segments. Implemented a regex slice utility to locate the true index of the relational column headers (`Day, Campaign, Cost...`), instantly throwing away the non-tabular top noise stream before compilation, reducing server load.

### 🧱 Structural API Input Validation Firewall
* **The Challenge:** Exposing ingestion routes to arbitrary client-side files risks raw database pollution, type mismatches, or malicious schema injections.
* **The Solution:** Configured a runtime validation layer utilizing strict Zod schemas at the ingress boundary of the server. Incoming rows are stripped of unmapped JSON fields, and financial metrics are coerced into primitive non-negative integers or exact floats. Malformed arrays are rejected with unified server validation errors before hitting memory heaps or storage drivers.

### 🏎️ Atomic Batch Bulk Ingestion
* **The Challenge:** Uploading data via a Google Ads CSV likely has multiple days worth of metrics. Utilizing a naive ForEach loop to insert each row would be slow and produce unreadable code.
* **The Solution:** Optimized ingestion by compiling rows into a relational layer. Utilized `pg-format` to formulate a single bulk `INSERT ... ON CONFLICT (metric_date, platform, campaign_id) DO UPDATE` statement. Wrapping the block inside an isolated transaction sequence (`BEGIN / COMMIT / ROLLBACK`) condensed backend round-trips to an atomic state—guaranteeing 100% data consistency operation.

### 📂 Decoupled Creative Media File Cloud Storage
* **The Challenge:** Associating A/B campaign variations with image files strains localized server disks and introduces serious application scaling limitations.
* **The Solution:** Implemented a decoupled object architecture by integrating the AWS S3 SDK. Large binary data blocks stream natively to secure AWS buckets, bypass server-side memory buffering entirely, and map back to campaigns using lightweight, reference keys stored in PostgreSQL.

### 🤖 Token-Efficient Predictive Performance Inferences
* **The Challenge:** Sending complete multi-month database records to Large Language Models for automated performance summaries causes massive token bloat, increases operational API bills, and risks context-window overflows.
* **The Solution:** Built an isolated internal data truncation filter that extracts key campaign KPIs spanning an explicit rolling 14-day window. This structured summary parses directly into a minified, space-optimized JSON string before transmission to the OpenAI API, minimizing operational expenditure while maximizing the accuracy of context-aware recommendations.

---

## 🔒 Hardened Production Security Profile

* **Network Perimeter Isolation:** The PostgreSQL storage container is bound to the server's local internal network adapter. External connections on the default Postgre port are rejected automatically, leaving Nginx as the single verified entry gateway.
* **Rate-Limiting & Gateway Defenses:** Implemented payload constraints and endpoint rate-limit policies to neutralize brute-force authorization and memory exhaustion attempts.

---

## 💾 Recruiter Safe-Mode & Seeding Infrastructure

To remove onboarding friction, the system features a dedicated initialization hook on user registration:
* **Pre-Seeded Sandbox Environment:** Every user profile is automatically connected to a pre-populated 3-month multi-platform campaign history file.
* **Immutable RBAC Control Rules:** Recruiter accounts are restricted to read-only capabilities within the core template. Users can fully interact with live charts, filter multi-platform tables, and trigger OpenAI insights without corrupting the master analytics dataset.