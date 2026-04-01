import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Dean/admin gets all users; others get their own profile
    if (decoded.role === 'dean' || decoded.role === 'admin') {
      const users: any = await query(
        'SELECT id, email, course, name, role, year_level, section FROM users WHERE is_active = TRUE ORDER BY name'
      );
      return NextResponse.json({
        success: true,
        users: users || [],
      });
    } else {
      // Get current user profile
      const user: any = await queryOne(
        'SELECT id, email, name, role FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (!user) {
        // If no database or no user exists, fall back to decoded token info
        return NextResponse.json({
          success: true,
          user: {
            id: decoded.userId,
            name: decoded.userId,
            email: '',
            role: decoded.role,
          },
        });
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, year_level, section, course, password } = body;

    // Get current user from database
    const user: any = await queryOne(
      'SELECT id, name, email, role, course, year_level, section FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build dynamic update
    const updates: string[] = [];
    const params: any[] = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (year_level !== undefined) { updates.push('year_level = ?'); params.push(year_level); }
    if (section !== undefined) { updates.push('section = ?'); params.push(section); }
    if (course !== undefined) { updates.push('course = ?'); params.push(course); }
    if (password !== undefined && password.trim() !== '') { updates.push('password = ?'); params.push(password); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    params.push(decoded.userId);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    // Auto-enroll if student updated year_level or section
    let enrolledCount = 0;
    if (user.role === 'student' && (year_level !== undefined || section !== undefined)) {
      const finalYearLevel = year_level ?? user.year_level;
      const finalSection = section ?? user.section;
      const program = user.course; // e.g. 'BSIT'

      if (program && finalYearLevel && finalSection) {
        // Find the active academic period to get semester
        const activePeriod: any = await queryOne(
          'SELECT id, semester FROM academic_periods WHERE is_active = 1 LIMIT 1'
        );

        if (activePeriod) {
          // Remove old block enrollments for this student in courses matching the program + active period
          await query(
            `DELETE ce FROM course_enrollments ce
             JOIN courses c ON ce.course_id = c.id
             WHERE ce.student_id = ?
               AND c.course_program = ?
               AND c.semester = ?`,
            [decoded.userId, program, activePeriod.semester]
          );

          // Enroll in matching courses
          const result: any = await query(
            `INSERT IGNORE INTO course_enrollments (course_id, student_id)
             SELECT c.id, ?
             FROM courses c
             WHERE c.course_program = ?
               AND c.year_level = ?
               AND c.section = ?
               AND c.semester = ?`,
            [decoded.userId, program, finalYearLevel, finalSection, activePeriod.semester]
          );
          enrolledCount = result?.affectedRows || 0;
        }
      }
    }

    const updated: any = await queryOne(
      'SELECT id, name, email, role, course, year_level, section FROM users WHERE id = ?',
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      user: updated,
      enrolledCount,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
