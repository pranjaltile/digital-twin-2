/**
 * Database Migration Script (JavaScript)
 * Initializes all necessary tables for the Digital Twin
 * 
 * Run this with: node scripts/migrate.js
 */

require('dotenv').config({ path: '.env.local' });

const { createPool } = require('@vercel/postgres');
const pg = require('pg');

async function migrate() {
  console.log('🔄 Starting database migration...\n');

  let client;
  try {
    // Use DATABASE_URL directly with pg pool
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const pool = new pg.Pool({ connectionString: dbUrl });
    client = await pool.connect();

    // 1. Create projects table
    console.log('📦 Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ projects table created/verified\n');

    // 2. Create conversations table
    console.log('📦 Creating conversations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
        visitor_session_id VARCHAR(255),
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ conversations table created/verified\n');

    // Add visitor_id column if it doesn't exist (migration support)
    try {
      await client.query(`
        ALTER TABLE conversations ADD COLUMN IF NOT EXISTS visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL;
      `);
    } catch (err) {
      // Column might already exist, continue
    }

    // 3. Create messages table
    console.log('📦 Creating messages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ messages table created/verified\n');

    // 4. Create visitors table
    console.log('📦 Creating visitors table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        session_id VARCHAR(255) UNIQUE,
        email VARCHAR(255),
        name VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ visitors table created/verified\n');

    // 5. Create bookings table
    console.log('📦 Creating bookings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
        visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        preferred_time TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ bookings table created/verified\n');

    // 6. Create tool_calls table for logging Claude tool usage
    console.log('📦 Creating tool_calls table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_calls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        tool_name VARCHAR(255) NOT NULL,
        input JSONB,
        output JSONB,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ tool_calls table created/verified\n');

    // Create indexes for performance
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_conversations_visitor_session_id ON conversations(visitor_session_id);',
      'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);',
      'CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_visitors_project_id ON visitors(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors(email);',
      'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);',
      'CREATE INDEX IF NOT EXISTS idx_tool_calls_conversation_id ON tool_calls(conversation_id);',
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }
    console.log('✅ All indexes created/verified\n');

    // Create default project
    console.log('🎯 Creating default project...');
    const projectResult = await client.query(
      `INSERT INTO projects (name, description) 
       VALUES ($1, $2)
       RETURNING id;`,
      ['Digital Twin', 'Primary AI-powered professional presence']
    );
    
    if (projectResult.rows.length > 0) {
      console.log(`✅ Default project created: ${projectResult.rows[0].id}\n`);
    } else {
      console.log('✅ Default project already exists\n');
    }

    console.log('✨ Database migration completed successfully!');
    console.log('📝 All tables and indexes are ready.\n');

    // Summary
    const tables = await client.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`
    );
    console.log('📋 Tables created:', tables.rows.map(r => r.tablename).join(', '));

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

migrate();
