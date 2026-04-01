'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useConfirmModal } from '@/components/ui/ConfirmModal';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';

interface AcademicPeriod {
  id: number;
  name: string;
  academic_year: string;
  semester: number;
  start_date: string;
  end_date: string;
  is_active: number | boolean;
}

const fetchApi = async (url: string, options?: RequestInit) => {
  const base = process.env.NEXT_PUBLIC_API_URL || '/api';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
  const res = await fetch(`${base}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function AcademicPage() {
  const { confirm: showConfirm, modalProps, ConfirmModal } = useConfirmModal();
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formAY, setFormAY] = useState('');
  const [formSemester, setFormSemester] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formActive, setFormActive] = useState(false);

  const loadPeriods = async () => {
    try {
      const data = await fetchApi('/academic_periods');
      setPeriods(data.periods || []);
    } catch (err) {
      setFeedback({ type: 'error', message: `Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPeriods(); }, []);

  const openCreate = () => {
    setEditingPeriod(null);
    setFormName('');
    setFormAY('');
    setFormSemester('');
    setFormStart('');
    setFormEnd('');
    setFormActive(false);
    setModalOpen(true);
  };

  const openEdit = (p: AcademicPeriod) => {
    setEditingPeriod(p);
    setFormName(p.name);
    setFormAY(p.academic_year);
    setFormSemester(String(p.semester));
    setFormStart(p.start_date ? p.start_date.split('T')[0] : '');
    setFormEnd(p.end_date ? p.end_date.split('T')[0] : '');
    setFormActive(!!p.is_active);
    setModalOpen(true);
  };

  const doSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      if (editingPeriod) {
        await fetchApi('/academic_periods', {
          method: 'PATCH',
          body: JSON.stringify({
            id: editingPeriod.id,
            name: formName,
            academic_year: formAY,
            semester: Number(formSemester),
            start_date: formStart,
            end_date: formEnd,
            is_active: formActive ? 1 : 0,
          }),
        });
      } else {
        await fetchApi('/academic_periods', {
          method: 'POST',
          body: JSON.stringify({
            name: formName,
            academic_year: formAY,
            semester: Number(formSemester),
            start_date: formStart,
            end_date: formEnd,
            is_active: formActive,
          }),
        });
      }
      setModalOpen(false);
      setFeedback({ type: 'success', message: editingPeriod ? 'Period updated.' : 'Period created.' });
      await loadPeriods();
    } catch (err) {
      setFeedback({ type: 'error', message: `Failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!formName || !formAY || !formSemester || !formStart || !formEnd) {
      setFeedback({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (formActive) {
      const currentActive = periods.find(p => p.is_active && p.id !== editingPeriod?.id);
      if (currentActive) {
        showConfirm({
          title: 'Activate Academic Period',
          message: `Setting this period as active will deactivate "${currentActive.name}".\n\nThis will close all active evaluation periods under the old academic period and lock any pending evaluations, preventing students from submitting them.`,
          confirmLabel: 'Activate',
          variant: 'warning',
          onConfirm: doSave,
        });
        return;
      }
    }

    doSave();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this academic period?')) return;
    try {
      await fetchApi(`/academic_periods?id=${id}`, { method: 'DELETE' });
      setPeriods(prev => prev.filter(p => p.id !== id));
      setFeedback({ type: 'success', message: 'Period deleted.' });
    } catch (err) {
      setFeedback({ type: 'error', message: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleSetActive = async (id: number) => {
    const currentActive = periods.find(p => p.is_active);
    if (currentActive && currentActive.id !== id) {
      const confirmed = confirm(
        `Activating this period will deactivate "${currentActive.name}".\n\n` +
        `This will close all active evaluation periods under the old academic period and lock any pending evaluations, ` +
        `preventing students from submitting them.\n\nAre you sure you want to proceed?`
      );
      if (!confirmed) return;
    }
    try {
      await fetchApi('/academic_periods', {
        method: 'PATCH',
        body: JSON.stringify({ id, is_active: 1 }),
      });
      setFeedback({ type: 'success', message: 'Period set as active. Previous evaluation periods have been closed.' });
      await loadPeriods();
    } catch (err) {
      setFeedback({ type: 'error', message: `Failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Periods</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage academic years and semesters.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> New Period
        </Button>
      </div>

      {feedback && (
        <Alert variant={feedback.type === 'success' ? 'success' : 'error'} title={feedback.type === 'success' ? 'Success' : 'Error'}>
          {feedback.message}
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : periods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No academic periods yet.</p>
              <Button variant="primary" onClick={openCreate}>Create Your First Period</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Academic Year</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Semester</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Start</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">End</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {periods.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.academic_year}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.semester}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(p.start_date)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(p.end_date)}</td>
                      <td className="px-4 py-3">
                        {p.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {!p.is_active && (
                            <Button variant="outline" size="sm" onClick={() => handleSetActive(p.id)} className="gap-1" title="Set as active">
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="gap-1">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)} className="gap-1">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPeriod ? 'Edit Academic Period' : 'New Academic Period'} size="lg">
        <div className="space-y-4">
          <Input
            label="Period Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="e.g. 1st Semester AY 2025-2026"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              value={formAY}
              onChange={e => setFormAY(e.target.value)}
              placeholder="2025-2026"
            />
            <Select
              label="Semester"
              value={formSemester}
              onChange={e => setFormSemester(e.target.value)}
              options={[
                { value: '1', label: '1st Semester' },
                { value: '2', label: '2nd Semester' },
                { value: '3', label: 'Summer' },
              ]}
              placeholder="Select..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formStart} onChange={e => setFormStart(e.target.value)} />
            <Input label="End Date" type="date" value={formEnd} onChange={e => setFormEnd(e.target.value)} />
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formActive}
              onChange={e => setFormActive(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Set as active period</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving} isLoading={saving}>
              {editingPeriod ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
