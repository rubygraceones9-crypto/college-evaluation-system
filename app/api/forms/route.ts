import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

import { verifyToken, getAuthToken } from '@/lib/auth';

// Load criteria + questions for a form and return as structured array
async function loadFormCriteria(formId: number) {
  const criteriaRows: any = await query(
    'SELECT id, name, description, weight, max_score FROM evaluation_criteria WHERE form_id = ? ORDER BY id',
    [formId]
  );

  if (!criteriaRows || criteriaRows.length === 0) return [];

  const criteriaIds = criteriaRows.map((c: any) => c.id);
  const questionRows: any = await query(
    `SELECT id, criteria_id, text FROM evaluation_questions WHERE criteria_id IN (${criteriaIds.map(() => '?').join(',')}) ORDER BY criteria_id, id`,
    criteriaIds
  );

  return criteriaRows.map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    weight: Number(c.weight),
    maxScore: c.max_score,
    questions: (questionRows || [])
      .filter((q: any) => q.criteria_id === c.id)
      .map((q: any) => ({
        id: q.id,
        text: q.text,
        type: 'rating',
        maxScore: 5,
      })),
  }));
}

// Insert criteria + questions for a form
async function saveFormCriteria(formId: number, criteria: any[]) {
  for (const c of criteria) {
    const critResult: any = await query(
      'INSERT INTO evaluation_criteria (form_id, name, description, weight, max_score) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [formId, c.name, c.description || null, c.weight, c.maxScore || 5]
    );
    const criteriaId = critResult[0]?.id;

    if (Array.isArray(c.questions)) {
      for (const q of c.questions) {
        await query(
          'INSERT INTO evaluation_questions (criteria_id, text) VALUES (?, ?)',
          [criteriaId, q.text]
        );
      }
    }
  }
}

/**
 * Handles the HTTP GET request securely.
 * Verifies the authorization bearer token natively via abstract logic.
 * Prevents access if user does not match the scoped role mapping.
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Fetch a specific form with its criteria and questions
      const form: any = await queryOne('SELECT * FROM evaluation_forms WHERE id = ?', [id]);
      if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

      const criteria = await loadFormCriteria(form.id);
      return NextResponse.json({ success: true, form: { ...form, criteria } });
    }

    // List all forms (dean only)
    if (decoded.role !== 'dean') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const forms: any = await query('SELECT * FROM evaluation_forms ORDER BY created_at DESC');

    // Attach criteria to each form
    const formsWithCriteria = await Promise.all(
      (forms || []).map(async (form: any) => {
        const criteria = await loadFormCriteria(form.id);
        return { ...form, criteria };
      })
    );

    return NextResponse.json({ success: true, forms: formsWithCriteria });
  } catch (error) {
    console.error('Forms GET error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

/**
 * Handles the HTTP POST request securely.
 * Mutates system state through parametric execution safely.
 * Asserts strict JSON structural types directly.
 */
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (decoded?.role !== 'dean') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { name, description, type, criteria } = body;
    if (!name || !type || !criteria || !Array.isArray(criteria)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Insert the form
    const result: any = await query(
      'INSERT INTO evaluation_forms (name, description, type) VALUES (?, ?, ?) RETURNING id',
      [name, description || '', type]
    );
    const formId = result[0]?.id;

    // 2. Insert criteria + questions
    await saveFormCriteria(formId, criteria);

    // 3. Return the complete form
    const form = await queryOne('SELECT * FROM evaluation_forms WHERE id = ?', [formId]);
    const savedCriteria = await loadFormCriteria(formId);

    return NextResponse.json({ success: true, form: { ...form, criteria: savedCriteria } });
  } catch (error) {
    console.error('Forms POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

/**
 * Handles the HTTP PATCH request securely.
 * Applies partial structural updates reliably over database.
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (decoded?.role !== 'dean') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { id, name, description, type, criteria } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Update form fields
    const updates: string[] = [];
    const values: any[] = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (type !== undefined) { updates.push('type = ?'); values.push(type); }

    if (updates.length > 0) {
      values.push(id);
      await query(`UPDATE evaluation_forms SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    // Replace criteria + questions if provided
    if (criteria && Array.isArray(criteria)) {
      // Delete old criteria (CASCADE deletes questions too)
      await query('DELETE FROM evaluation_criteria WHERE form_id = ?', [id]);
      // Re-insert
      await saveFormCriteria(id, criteria);
    }

    const form = await queryOne('SELECT * FROM evaluation_forms WHERE id = ?', [id]);
    const savedCriteria = await loadFormCriteria(id);

    return NextResponse.json({ success: true, form: { ...form, criteria: savedCriteria } });
  } catch (error) {
    console.error('Forms PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

/**
 * Handles the HTTP DELETE request securely.
 * Ensures isolated teardowns leveraging foreign cascaded keys securely.
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (decoded?.role !== 'dean') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id query param required' }, { status: 400 });

    // CASCADE deletes criteria and questions automatically
    await query('DELETE FROM evaluation_forms WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forms DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
