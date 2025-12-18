/**
 * Database Migration Script
 * Initializes all necessary tables for the Digital Twin
 * 
 * Run this to set up the database schema in Neon
 */

import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('🔄 Starting database migration...\n');

  try {
    // 1. Create projects table
    console.log('📦 Creating projects table...');
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ projects table created/verified\n');

    // 2. Create conversations table
    console.log('📦 Creating conversations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        visitor_session_id VARCHAR(255),
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ conversations table created/verified\n');

    // 3. Create messages table
    console.log('📦 Creating messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ messages table created/verified\n');

    // 4. Create visitors table
    console.log('📦 Creating visitors table...');
    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        context TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ visitors table created/verified\n');

    // 5. Create bookings table
    console.log('📦 Creating bookings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
        requested_datetime TIMESTAMP NOT NULL,
        meeting_type VARCHAR(100),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'requested',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ bookings table created/verified\n');

    // 6. Create tool_calls table
    console.log('📦 Creating tool_calls table...');
    await sql`
      CREATE TABLE IF NOT EXISTS tool_calls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        tool_name VARCHAR(100) NOT NULL,
        input JSONB,
        output JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ tool_calls table created/verified\n');

    // 7. Create indexes for performance
    console.log('🔍 Creating indexes...');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_project_id 
      ON conversations(project_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_visitor_session_id 
      ON conversations(visitor_session_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
      ON messages(conversation_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at 
      ON messages(created_at);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_visitors_email 
      ON visitors(email);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_visitor_id 
      ON bookings(visitor_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_status 
      ON bookings(status);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tool_calls_conversation_id 
      ON tool_calls(conversation_id);
    `;
    
    console.log('✅ All indexes created/verified\n');

    // 8. Create default project
    console.log('📦 Creating default project...');
    const result = await sql`
      INSERT INTO projects (name, description)
      VALUES ('Digital Twin', 'Primary Digital Twin instance')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    
    if (result.rows.length > 0) {
      console.log(`✅ Default project created: ${result.rows[0].id}\n`);
    } else {
      console.log('✅ Default project already exists\n');
    }

    console.log('✨ Database migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  ✅ 6 tables created/verified');
    console.log('  ✅ 8 indexes created/verified');
    console.log('  ✅ Default project initialized');
    console.log('\n🚀 Ready to start using the database!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
