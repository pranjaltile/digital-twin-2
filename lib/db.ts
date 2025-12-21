/**
 * Database utilities for Neon Postgres
 * All database operations go through this module
 */

import { sql } from '@vercel/postgres';

// Get or create default project
let defaultProjectId: string | null = null;

async function getDefaultProject(): Promise<string> {
  if (defaultProjectId !== null) return defaultProjectId;

  try {
    // Try to get existing project
    const existing = await sql`
      SELECT id FROM projects WHERE name = 'Digital Twin' LIMIT 1;
    `;

    if (existing.rows.length > 0) {
      defaultProjectId = existing.rows[0].id as string;
      return defaultProjectId;
    }

    // Create new project if doesn't exist
    const created = await sql`
      INSERT INTO projects (name, description)
      VALUES ('Digital Twin', 'Primary Digital Twin instance')
      RETURNING id;
    `;

    defaultProjectId = created.rows[0].id as string;
    return defaultProjectId;
  } catch (error) {
    console.error('Error getting default project:', error);
    throw error;
  }
}

/**
 * Test the database connection
 * Returns true if connection successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT NOW() as timestamp`;
    console.log('✅ Database connected:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Create a new conversation
 * Automatically uses the default project
 */
export async function createConversation(
  visitorSessionId?: string
): Promise<string> {
  try {
    const projectId = await getDefaultProject();

    const result = await sql`
      INSERT INTO conversations (project_id, visitor_session_id)
      VALUES (${projectId}, ${visitorSessionId || null})
      RETURNING id;
    `;

    console.log('✅ Conversation created:', result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  try {
    // Validate inputs
    if (!conversationId) throw new Error('conversationId is required');
    if (!['user', 'assistant'].includes(role)) throw new Error('Invalid role');
    if (!content) throw new Error('content is required');

    const result = await sql`
      INSERT INTO messages (conversation_id, role, content, metadata)
      VALUES (
        ${conversationId},
        ${role},
        ${content},
        ${metadata ? JSON.stringify(metadata) : null}
      )
      RETURNING id;
    `;

    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

/**
 * Get conversation history (messages)
 */
export async function getConversationHistory(
  conversationId: string
): Promise<Array<{ id: string; role: string; content: string; createdAt: string }>> {
  try {
    const result = await sql`
      SELECT 
        id,
        role,
        content,
        created_at as "createdAt"
      FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC;
    `;

    return result.rows as Array<{ id: string; role: string; content: string; createdAt: string }>;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(
  conversationId: string
): Promise<any> {
  try {
    const result = await sql`
      SELECT * FROM conversations
      WHERE id = ${conversationId};
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

/**
 * Update conversation title (when conversation completes)
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<void> {
  try {
    await sql`
      UPDATE conversations
      SET title = ${title}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${conversationId};
    `;
  } catch (error) {
    console.error('Error updating conversation title:', error);
    throw error;
  }
}

/**
 * Get bookings for a conversation
 */
export async function getConversationBookings(
  conversationId: string
): Promise<Array<any>> {
  try {
    const result = await sql`
      SELECT * FROM bookings
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

/**
 * Get visitor information
 */
export async function getVisitor(visitorId: string): Promise<any> {
  try {
    const result = await sql`
      SELECT * FROM visitors
      WHERE id = ${visitorId};
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching visitor:', error);
    throw error;
  }
}
