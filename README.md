# Anvaya CRM — Frontend Application

Anvaya CRM is a sales pipeline and lead management single-page application built with React, React Router v6, and Bootstrap 5. It communicates with a backend REST API hosted at `https://anvaya-crm-phase-2.vercel.app/api`.

---

## Features

### 1. Dashboard (`/`)

- Summary cards showing lead counts per lifecycle stage (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Closed`).
- Quick-filter toggle buttons for all 5 stages.
- Recent leads preview cards linking directly to lead management details.

### 2. Lead List Overview (`/leads`)

- Full lead ledger displaying lead name, source, priority, turnaround days, status badge, and assigned sales agent.
- Filter by **Status**, **Source**, **Sales Agent**, and **Tags**.
- Sort by **Priority** (High to Low) and **Time to Close** (Ascending).
- **URL Parameter Synchronization:** Active filters and sort states are kept in sync with browser query params using `useSearchParams`.

### 3. Lead Management & Details (`/leads/:leadId`)

- View full lead metadata, including tag badges.
- In-place editing mode supporting lead name, sales agent assignment, lead source, status, priority, time to close, and comma-separated tags.
- Threaded activity/comment feed with author name and timestamp.
- Precise error messages on failed comment submissions.

### 4. Segmented Pipeline Views

- **Leads by Status (`/leads/status`):** Tabbed interface filtering leads by status stage with secondary agent and priority filters.
- **Sales Agent View (`/agents/view`):** Agent dropdown selector to inspect leads assigned to a specific representative.

### 5. Sales Agent Directory (`/agents`)

- Roster of all registered agents with unique email and date joined.
- Form to register new agents.

### 6. Reports & Analytics (`/reports`)

- KPI cards for active pipeline volume and total closed deals.
- Visual charts for:
  - Lead Status Distribution.
  - Closed Leads by Sales Agent.
  - Rolling 7-Day closure velocity.

### 7. Responsive Mobile Layout

- Collapsible hamburger menu on smaller viewports for seamless navigation across all views.
- Non-blocking toast notifications for success and error messages instead of browser alerts.

---

## Tech Stack

- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Bootstrap 5
- **Backend API:** `https://anvaya-crm-phase-2.vercel.app/api`

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
