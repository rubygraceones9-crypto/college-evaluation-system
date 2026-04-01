import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET() {
  try {
    // 1. Basic test: Get database version
    const version: any = await queryOne('SELECT version()', []);
    
    // 2. Data test: Count users
    const userCount: any = await queryOne('SELECT COUNT(*) as count FROM users', []);

    return NextResponse.json({
      status: 'OK',
      cloud: 'Neon PostgreSQL',
      version: version?.version,
      database_ready: !!version,
      users_synced: userCount?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: String(error),
      details: error.message || 'No connection string detected'
    }, { status: 500 });
  }
}
