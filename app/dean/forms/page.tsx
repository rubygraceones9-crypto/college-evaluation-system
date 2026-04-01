'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { useFetch } from '@/hooks';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

type Question = {
  id: string;
  text: string;
  type: 'rating' | 'yesno' | 'comment';
  maxScore: number;
};

type CriteriaRow = {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  questions: Question[];
};

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

const FORM_TYPES = [
  { value: 'student-to-teacher', label: 'Student to Teacher' },
  { value: 'peer-review', label: 'Peer Review' },
  { value: 'self-evaluation', label: 'Self Evaluation' },
  { value: 'admin-evaluation', label: 'Admin Evaluation' },
];

export default function EvaluationFormsPage() {
  // View state
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingFormId, setEditingFormId] = useState<number | null>(null);

  // Form editor state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('student-to-teacher');
  const [formDescription, setFormDescription] = useState('');
  const [criteria, setCriteria] = useState<CriteriaRow[]>([]);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  // Question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [activeCriteriaId, setActiveCriteriaId] = useState<string | null>(null);
  const [questionInput, setQuestionInput] = useState('');

  // Feedback
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch forms
  const { data: formsData, loading } = useFetch<any>('/forms');
  const [formsRefreshKey, setFormsRefreshKey] = useState(0);
  const forms = formsData?.forms || [];

  const totalWeight = useMemo(() => criteria.reduce((sum, c) => sum + c.weight, 0), [criteria]);

  const resetEditor = () => {
    setFormName('');
    setFormType('student-to-teacher');
    setFormDescription('');
    setCriteria([]);
    setEditingFormId(null);
    setError('');
    setSuccess('');
  };

  const openNewForm = () => {
    resetEditor();
    setView('editor');
  };

  const openEditForm = (form: any) => {
    setFormName(form.name);
    setFormType(form.type);
    setFormDescription(form.description || '');
    const sanitizedCriteria = (Array.isArray(form.criteria) ? form.criteria : []).map((c: any) => ({
      ...c,
      questions: Array.isArray(c.questions) ? c.questions : [],
    }));
    setCriteria(sanitizedCriteria);
    setEditingFormId(form.id);
    setError('');
    setSuccess('');
    setView('editor');
  };

  const deleteForm = async (id: number) => {
    if (!confirm('Delete this form? This cannot be undone.')) return;
    try {
      await fetchApi(`/forms?id=${id}`, { method: 'DELETE' });
      window.location.reload();
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Criteria management
  const addCriteria = () => {
    setCriteria([...criteria, {
      id: crypto.randomUUID(),
      name: '',
      weight: 0,
      maxScore: 5,
      questions: [],
    }]);
  };

  const updateCriteria = (id: string, field: keyof CriteriaRow, value: any) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  // Question management
  const openQuestions = (criteriaId: string) => {
    setActiveCriteriaId(criteriaId);
    setQuestionInput('');
    setQuestionModalOpen(true);
  };

  const addQuestion = () => {
    if (!questionInput.trim() || !activeCriteriaId) return;
    setCriteria(criteria.map(c => {
      if (c.id !== activeCriteriaId) return c;
      return {
        ...c,
        questions: [...c.questions, {
          id: crypto.randomUUID(),
          text: questionInput.trim(),
          type: 'rating' as const,
          maxScore: 5,
        }],
      };
    }));
    setQuestionInput('');
  };

  const removeQuestion = (criteriaId: string, questionId: string) => {
    setCriteria(criteria.map(c => {
      if (c.id !== criteriaId) return c;
      return { ...c, questions: c.questions.filter(q => q.id !== questionId) };
    }));
  };

  // Save form
  const saveForm = async () => {
    if (!formName.trim()) { setError('Form name is required.'); return; }
    if (!criteria.length) { setError('Add at least one criteria.'); return; }
    if (totalWeight !== 100) { setError('Total weight must equal 100%.'); return; }
    const emptyNames = criteria.filter(c => !c.name.trim());
    if (emptyNames.length) { setError('All criteria must have a name.'); return; }

    setSaving(true);
    setError('');
    try {
      if (editingFormId) {
        await fetchApi('/forms', {
          method: 'PATCH',
          body: JSON.stringify({
            id: editingFormId,
            name: formName,
            type: formType,
            description: formDescription,
            criteria,
          }),
        });
      } else {
        await fetchApi('/forms', {
          method: 'POST',
          body: JSON.stringify({
            name: formName,
            type: formType,
            description: formDescription,
            criteria,
          }),
        });
      }
      setSuccess('Form saved successfully!');
      setTimeout(() => {
        setView('list');
        resetEditor();
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const activeCriteria = criteria.find(c => c.id === activeCriteriaId);

  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evaluation Forms</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage evaluation forms with criteria and questions.</p>
          </div>
          <Button variant="primary" className="gap-2" onClick={openNewForm}>
            <Plus className="w-4 h-4" /> New Form
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading forms...</p>
        ) : forms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No evaluation forms yet.</p>
              <Button variant="primary" onClick={openNewForm}>Create Your First Form</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {forms.map((form: any) => {
              const criteriaArr = Array.isArray(form.criteria) ? form.criteria : [];
              const criteriaCount = criteriaArr.length;
              const questionCount = criteriaArr.reduce((s: number, c: any) => s + (c.questions?.length || 0), 0);
              return (
                <Card key={form.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{form.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {FORM_TYPES.find(t => t.value === form.type)?.label || form.type}
                          {' '} &middot; {criteriaCount} criteria &middot; {questionCount} questions
                        </p>
                        {form.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{form.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditForm(form)} className="gap-1">
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => deleteForm(form.id)} className="gap-1">
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── EDITOR VIEW ──
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => { setView('list'); resetEditor(); }} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {editingFormId ? 'Edit Form' : 'New Evaluation Form'}
        </h1>
      </div>

      {error && <Alert variant="error" title="Error">{error}</Alert>}
      {success && <Alert variant="success" title="Success">{success}</Alert>}

      {/* Form Details */}
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Form Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="e.g. Teaching Effectiveness Form"
          />
          <Select
            label="Form Type"
            value={formType}
            onChange={e => setFormType(e.target.value)}
            options={FORM_TYPES}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Description (Optional)"
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Brief description of this evaluation form..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Criteria Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>Add criteria with weights that total 100%. Expand each to manage questions.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addCriteria} className="gap-1">
              <Plus className="w-4 h-4" /> Add Criteria
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {criteria.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No criteria added yet. Click "Add Criteria" to begin.</p>
          )}
          {criteria.map((c) => (
            <div key={c.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Criteria row */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => setExpandedCriteria(expandedCriteria === c.id ? null : c.id)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {expandedCriteria === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={c.name}
                  onChange={e => updateCriteria(c.id, 'name', e.target.value)}
                  placeholder="Criteria name"
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Weight:</span>
                  <input
                    type="number"
                    value={c.weight}
                    onChange={e => updateCriteria(c.id, 'weight', Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                    min={0}
                    max={100}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <Badge variant={(c.questions?.length || 0) > 0 ? 'success' : 'secondary'}>
                  {c.questions?.length || 0} Q
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => openQuestions(c.id)} className="gap-1">
                  <Plus className="w-3 h-3" /> Questions
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeCriteria(c.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              {/* Expanded questions */}
              {expandedCriteria === c.id && c.questions.length > 0 && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <ol className="list-decimal list-inside space-y-2 mt-3">
                    {c.questions.map((q) => (
                      <li key={q.id} className="flex items-start justify-between text-sm text-gray-700 dark:text-gray-300">
                        <span className="flex-1">{q.text}</span>
                        <button
                          onClick={() => removeQuestion(c.id, q.id)}
                          className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}

          {/* Weight total */}
          {criteria.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <span className="font-semibold">Total Weight:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                totalWeight === 100
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {totalWeight}% {totalWeight === 100 ? '✓' : '— Must equal 100%'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setView('list'); resetEditor(); }}>Cancel</Button>
        <Button variant="primary" onClick={saveForm} disabled={saving} isLoading={saving}>
          {editingFormId ? 'Update Form' : 'Create Form'}
        </Button>
      </div>

      {/* Question Modal */}
      <Modal
        isOpen={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        title={`Add Questions — ${activeCriteria?.name || 'Criteria'}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. The instructor explains concepts clearly."
              value={questionInput}
              onChange={e => setQuestionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addQuestion(); }}
            />
            <Button variant="primary" onClick={addQuestion}>Add</Button>
          </div>

          {activeCriteria && activeCriteria.questions.length > 0 && (
            <ol className="list-decimal list-inside space-y-2 mt-4">
              {activeCriteria.questions.map((q) => (
                <li key={q.id} className="flex items-start justify-between py-1">
                  <span className="text-gray-700 dark:text-gray-300">{q.text}</span>
                  <button
                    onClick={() => removeQuestion(activeCriteria.id, q.id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={() => setQuestionModalOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
