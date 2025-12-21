/**
 * Tool Execution Logger
 * Milestone 6: Tool-Calling & Agentic Logic
 * 
 * Audit trail for all tool executions
 */

import { sql } from '@vercel/postgres';

export interface ToolExecutionRecord {
  conversationId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: 'success' | 'error';
  timestamp: Date;
}

/**
 * Log a tool execution to database
 */
export async function logToolExecution(
  toolName: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>,
  conversationId: string
): Promise<void> {
  try {
    const statusValue = (output as any).status || 'success';
    await sql`
      INSERT INTO tool_calls (
        conversation_id,
        tool_name,
        input,
        output,
        status,
        created_at
      )
      VALUES (
        ${conversationId},
        ${toolName},
        ${JSON.stringify(input)},
        ${JSON.stringify(output)},
        ${statusValue},
        CURRENT_TIMESTAMP
      )
    `;

    console.log(`✅ Tool executed: ${toolName}`, {
      conversationId,
      toolName,
      status: output.status || 'success',
    });
  } catch (error) {
    console.error('Failed to log tool execution:', error);
    // Don't throw - logging shouldn't block conversation flow
  }
}

/**
 * Get all tool calls for a conversation
 */
export async function getToolExecutionHistory(
  conversationId: string
): Promise<ToolExecutionRecord[]> {
  try {
    const result = await sql`
      SELECT
        conversation_id as "conversationId",
        tool_name as "toolName",
        input,
        output,
        status,
        created_at as "timestamp"
      FROM tool_calls
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    return result.rows.map((row: any) => ({
      conversationId: row.conversationId,
      toolName: row.toolName,
      input: typeof row.input === 'string' ? JSON.parse(row.input) : row.input,
      output: typeof row.output === 'string' ? JSON.parse(row.output) : row.output,
      status: row.status,
      timestamp: new Date(row.timestamp),
    }));
  } catch (error) {
    console.error('Failed to fetch tool execution history:', error);
    return [];
  }
}

/**
 * Get tool execution stats
 */
export async function getToolExecutionStats(): Promise<{
  total: number;
  byTool: Record<string, number>;
  successRate: number;
}> {
  try {
    const result = await sql`
      SELECT
        tool_name,
        status,
        COUNT(*) as count
      FROM tool_calls
      GROUP BY tool_name, status
    `;

    const byTool: Record<string, number> = {};
    let totalSuccess = 0;
    let totalExecutions = 0;

    result.rows.forEach((row: any) => {
      const toolName = row.tool_name;
      const count = parseInt(row.count);

      if (!byTool[toolName]) {
        byTool[toolName] = 0;
      }
      byTool[toolName] += count;

      if (row.status === 'success') {
        totalSuccess += count;
      }
      totalExecutions += count;
    });

    return {
      total: totalExecutions,
      byTool,
      successRate: totalExecutions > 0 ? (totalSuccess / totalExecutions) * 100 : 0,
    };
  } catch (error) {
    console.error('Failed to get tool execution stats:', error);
    return { total: 0, byTool: {}, successRate: 0 };
  }
}
