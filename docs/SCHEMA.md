# Database Schema

Complete definition of all database tables and their relationships.

## Overview

The Digital Twin uses Neon Postgres as the primary data store. Tables are organized by functional domain:

- **Core**: `projects`, `conversations`, `messages`
- **Lead Management**: `visitors`, `bookings`
- **Audit**: `tool_calls`
- **Analytics**: `analytics_events`

## Table Definitions

### `projects`

Container for grouping conversations. Useful for managing multiple Digital Twin instances or projects.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` — Unique identifier (UUID)
- `name` — Project display name
- `description` — Optional project description
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Indexes:**
- Primary key on `id`

**Example usage:**
- Single project per Digital Twin instance
- Multiple projects for managing different AI personas

---

### `conversations`

Represents a conversation session between a visitor and the AI.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_session_id VARCHAR(255),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_visitor_session_id ON conversations(visitor_session_id);
```

**Columns:**
- `id` — Unique conversation identifier
- `project_id` — Foreign key to projects table
- `visitor_session_id` — Optional visitor browser session ID for multi-turn tracking
- `title` — Optional conversation title/summary
- `created_at` — Conversation start time
- `updated_at` — Last message time

**Indexes:**
- Primary key on `id`
- Index on `project_id` (frequent lookups)
- Index on `visitor_session_id` (session-based retrieval)

**Relationships:**
- Has many `messages`
- References one `project`

**Example usage:**
- Each chat session creates one conversation
- Multiple conversations per project

---

### `messages`

Individual messages within a conversation (both user and assistant).

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

**Columns:**
- `id` — Unique message identifier
- `conversation_id` — Foreign key to conversations
- `role` — Either 'user' or 'assistant' (enforced by CHECK constraint)
- `content` — The actual message text
- `metadata` — Optional JSON metadata (token count, model info, etc.)
- `created_at` — Message timestamp (used for ordering)

**Indexes:**
- Primary key on `id`
- Index on `conversation_id` (fast history retrieval)
- Index on `created_at` (analytics queries)

**Constraints:**
- `role` must be 'user' or 'assistant'
- `content` cannot be NULL
- Cascade delete on conversation removal

**Example metadata:**
```json
{
  "token_count": 156,
  "model": "claude-3-5-sonnet-20241022",
  "source": "web"
}
```

---

### `visitors`

Contact information for people who interact with the Digital Twin (Milestone 4+).

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50), -- 'recruiter', 'hiring_manager', 'founder', 'other'
  context TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitors_email ON visitors(email);
```

**Columns:**
- `id` — Unique visitor identifier
- `email` — Email address (UNIQUE, used for deduplication)
- `name` — Visitor's name
- `role` — Their role (recruiter, hiring manager, etc.)
- `context` — Optional notes about their inquiry
- `created_at` — When visitor profile was created
- `updated_at` — Last modification timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `email` (prevent duplicates, fast lookups)

**Unique constraints:**
- Email must be unique (one profile per email)

**Example data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "recruiter@techfirm.com",
  "name": "Sarah Chen",
  "role": "recruiter",
  "context": "Looking for senior full-stack engineers",
  "created_at": "2025-12-18T14:32:00Z"
}
```

---

### `bookings`

Meeting/interview requests from visitors (Milestone 4+).

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  requested_datetime TIMESTAMP NOT NULL,
  meeting_type VARCHAR(100), -- '30_min_call', 'technical_discussion', etc.
  notes TEXT,
  status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_visitor_id ON bookings(visitor_id);
CREATE INDEX idx_bookings_requested_datetime ON bookings(requested_datetime);
CREATE INDEX idx_bookings_status ON bookings(status);
```

**Columns:**
- `id` — Unique booking identifier
- `visitor_id` — Foreign key to visitors
- `requested_datetime` — Proposed meeting time
- `meeting_type` — Type of meeting (30 min call, technical discussion, etc.)
- `notes` — Optional notes from visitor
- `status` — Current booking status (requested → confirmed → completed/cancelled)
- `created_at` — When booking was requested
- `updated_at` — Last status update

**Indexes:**
- Primary key on `id`
- Index on `visitor_id` (find bookings by visitor)
- Index on `requested_datetime` (calendar queries, availability checking)
- Index on `status` (find pending bookings)

**Relationships:**
- Belongs to one `visitor`

**Example data:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
  "requested_datetime": "2025-12-20T14:00:00Z",
  "meeting_type": "technical_discussion",
  "notes": "Want to discuss system design experience",
  "status": "requested",
  "created_at": "2025-12-18T14:35:00Z"
}
```

---

### `tool_calls`

Audit log of tool execution by the AI agent (Milestone 6+).

```sql
CREATE TABLE tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  input JSONB,
  output JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tool_calls_conversation_id ON tool_calls(conversation_id);
CREATE INDEX idx_tool_calls_status ON tool_calls(status);
```

**Columns:**
- `id` — Unique tool call identifier
- `conversation_id` — Which conversation triggered this tool
- `tool_name` — Name of tool called (captureVisitor, checkAvailability, etc.)
- `input` — Input parameters passed to tool (JSON)
- `output` — Result returned by tool (JSON)
- `status` — Execution status (pending, completed, failed)
- `error_message` — If failed, error details
- `created_at` — When tool was called
- `updated_at` — When status was last updated

**Indexes:**
- Primary key on `id`
- Index on `conversation_id` (trace tool calls in a conversation)
- Index on `status` (find pending, failed calls)

**Example data:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440222",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "tool_name": "captureVisitor",
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "hiring_manager"
  },
  "output": {
    "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Visitor captured successfully"
  },
  "status": "completed",
  "created_at": "2025-12-18T14:40:00Z"
}
```

---

### `analytics_events`

High-level analytics events for tracking patterns (Milestone 9+).

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

**Columns:**
- `id` — Unique event identifier
- `event_type` — Type of event (visitor_arrived, booking_created, email_sent, etc.)
- `visitor_id` — Optional reference to visitor
- `conversation_id` — Optional reference to conversation
- `metadata` — Event-specific data (JSON)
- `created_at` — When event occurred

**Indexes:**
- Primary key on `id`
- Index on `event_type` (group events by type)
- Index on `created_at` (time-series queries)

**Event types:**
- `visitor_arrived` — New conversation started
- `booking_created` — Visitor booked meeting
- `email_sent` — Summary email sent
- `lead_captured` — Visitor contact info captured
- `conversation_ended` — Visitor left

---

## Data Relationships

```
projects (1) ──────→ (many) conversations
                          ↓
                      messages
                      
conversations (1) ──────→ (many) tool_calls

visitors (1) ──────→ (many) bookings
           ↓
    (referenced in analytics)
    
conversations (referenced in analytics_events)
```

## Migration Strategy

### Milestone 1
- Create: `projects`, `conversations`, `messages`
- Run initial schema setup

### Milestone 3
- Tables already exist from M1
- Add indexes if needed
- Test data retrieval

### Milestone 4
- Create: `visitors`, `bookings`
- Add foreign key constraints

### Milestone 6
- Create: `tool_calls`
- Add audit trail for tool execution

### Milestone 9
- Create: `analytics_events`
- Aggregate insights from other tables

## Querying Examples

### Get conversation history
```sql
SELECT role, content, created_at 
FROM messages 
WHERE conversation_id = $1 
ORDER BY created_at ASC;
```

### Find visitor by email
```sql
SELECT * FROM visitors 
WHERE email = $1;
```

### Get pending bookings
```sql
SELECT b.*, v.name, v.email 
FROM bookings b 
JOIN visitors v ON b.visitor_id = v.id 
WHERE b.status = 'requested' 
ORDER BY b.requested_datetime ASC;
```

### Count visitors by role
```sql
SELECT role, COUNT(*) as count 
FROM visitors 
GROUP BY role;
```

### Get today's bookings
```sql
SELECT * FROM bookings 
WHERE DATE(requested_datetime) = CURRENT_DATE 
ORDER BY requested_datetime ASC;
```

---

*Last updated: Milestone 2*
*Next update: After Milestone 4 (visitors & bookings tables)*
