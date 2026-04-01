import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Criteria is public - everyone can view evaluation criteria
    const criteria: any = await query(
      'SELECT id, name, description, weight FROM evaluation_criteria ORDER BY weight DESC, created_at ASC'
    );

    return NextResponse.json({
      success: true,
      criteria: criteria || [],
      total: (criteria || []).length,
    });
  } catch (error) {
    console.error('Criteria GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
