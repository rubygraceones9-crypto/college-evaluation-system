'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useConfirmModal } from '@/components/ui/ConfirmModal';
import { useFetch } from '@/hooks';
import {
  Search, Eye, ArrowLeft, Lock, Unlock,
  Pencil, Trash2, XCircle, PlayCircle, UserCheck, RotateCcw,
} from 'lucide-react';

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

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
    active: 'success',
    draft: 'secondary',
    upcoming: 'warning',
    closed: 'destructive',
  };
  return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
};

const formatDate = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Evaluations() {
  const router = useRouter();
  const { confirm, modalProps, ConfirmModal } = useConfirmModal();

  // ── Top level: periods list ──
  const { data: periodsData, loading: periodsLoading } = useFetch<any>('/evaluation_periods');
  const [periods, setPeriods] = useState<any[]>([]);

  // Sync from fetch
  useEffect(() => {
    if (periodsData?.periods) setPeriods(periodsData.periods);
  }, [periodsData]);

  // ── Drill-down state ──
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [periodEvals, setPeriodEvals] = useState<any[]>([]);
  const [evalsLoading, setEvalsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEval, setSelectedEval] = useState<any>(null);

  // ── Dean evaluation state ──
  const [deanModalOpen, setDeanModalOpen] = useState(false);
  const [deanTeacher, setDeanTeacher] = useState('');
  const [deanCourse, setDeanCourse] = useState('');
  const [deanCreating, setDeanCreating] = useState(false);

  // Derive unique teachers and their courses from current period evals
  const deanTeachers = useMemo(() => {
    const map: Record<string, { id: string; name: string; courses: { id: string; name: string }[] }> = {};
    for (const e of periodEvals) {
      const tid = e.evaluatee_id || e.evaluatee?.id;
      const tname = e.evaluatee?.name || e.evaluatee_name;
      if (!tid || !tname) continue;
      if (!map[tid]) map[tid] = { id: tid, name: tname, courses: [] };
      const cid = e.course_id || e.course?.id;
      const cname = e.course?.name || e.course_name;
      if (cid && cname && !map[tid].courses.some(c => c.id === String(cid))) {
        map[tid].courses.push({ id: String(cid), name: cname });
      }
    }
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [periodEvals]);

  const selectedDeanTeacher = deanTeachers.find(t => t.id === deanTeacher);
  const isPeerPeriod = selectedPeriod?.form_type === 'peer-review';

  const handleDeanCreate = async () => {
    if (!deanTeacher || (!isPeerPeriod && !deanCourse)) return;
    setDeanCreating(true);
    try {
      const data = await fetchApi('/evaluations/dean', {
        method: 'POST',
        body: JSON.stringify({
          period_id: selectedPeriod.id,
          evaluatee_id: deanTeacher,
          course_id: isPeerPeriod ? null : Number(deanCourse),
        }),
      });
      setDeanModalOpen(false);
      setDeanTeacher('');
      setDeanCourse('');
      router.push(`/dean/evaluations/fill/${data.evaluationId}`);
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Failed to create dean evaluation');
    } finally {
      setDeanCreating(false);
    }
  };

  // ── Feedback ──
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    if (type === 'success') setTimeout(() => setFeedback(null), 4000);
  };

  // ── Progress from all evaluations ──
  const [allEvals, setAllEvals] = useState<any[]>([]);
  const [allEvalsLoaded, setAllEvalsLoaded] = useState(false);

  const refreshAllEvals = () => {
    fetchApi('/evaluations')
      .then(data => setAllEvals(data.evaluations || []))
      .catch(() => { });
  };

  useEffect(() => {
    if (periods.length > 0 && !allEvalsLoaded) {
      refreshAllEvals();
      setAllEvalsLoaded(true);
    }
  }, [periods, allEvalsLoaded]);

  const periodProgress = useMemo(() => {
    const map: Record<number, { total: number; submitted: number }> = {};
    for (const e of allEvals) {
      const pid = e.period_id;
      if (!pid) continue;
      if (e.status === 'locked') continue;
      if (!map[pid]) map[pid] = { total: 0, submitted: 0 };
      map[pid].total++;
      if (e.status === 'submitted') map[pid].submitted++;
    }
    return map;
  }, [allEvals]);

  // ── Drill-down actions ──
  const viewPeriod = async (period: any) => {
    setSelectedPeriod(period);
    setEvalsLoading(true);
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    try {
      const data = await fetchApi(`/evaluations?period_id=${period.id}`);
      setPeriodEvals(data.evaluations || []);
    } catch {
      setPeriodEvals([]);
    } finally {
      setEvalsLoading(false);
    }
  };

  const goBack = () => {
    setSelectedPeriod(null);
    setPeriodEvals([]);
    setSelectedEval(null);
  };

  const handleToggleLock = async (evalId: number, lock: boolean) => {
    try {
      await fetchApi('/evaluations', {
        method: 'PATCH',
        body: JSON.stringify({ id: evalId, status: lock ? 'locked' : 'submitted' }),
      });
      if (selectedPeriod) viewPeriod(selectedPeriod);
    } catch {
      alert('Failed to update lock status');
    }
  };

  const handleEvalDelete = (evalItem: any) => {
    const isGhost = evalItem.is_ghost;
    const label = isGhost ? 'Delete Dean Evaluation' : 'Reset to Pending';
    const message = isGhost
      ? 'This will permanently delete this dean evaluation and all its responses.'
      : 'This will clear all responses and reset this evaluation to pending, requiring the evaluator to submit again.';

    confirm({
      title: label,
      message,
      confirmLabel: isGhost ? 'Delete' : 'Reset',
      variant: isGhost ? 'danger' : 'warning',
      onConfirm: async () => {
        try {
          await fetchApi(`/evaluations?id=${evalItem.id}`, { method: 'DELETE' });
          showFeedback('success', isGhost ? 'Dean evaluation deleted.' : 'Evaluation reset to pending.');
          if (selectedPeriod) viewPeriod(selectedPeriod);
          refreshAllEvals();
        } catch (err) {
          showFeedback('error', err instanceof Error ? err.message : 'Operation failed');
        }
      },
    });
  };

  // ── Period CRUD actions ──
  const handleStatusChange = (period: any, newStatus: string) => {
    const labels: Record<string, string> = { active: 'reopen', closed: 'close' };
    const label = labels[newStatus] || newStatus;
    confirm({
      title: `${label === 'close' ? 'Close' : 'Reopen'} Period`,
      message: `Are you sure you want to ${label} "${period.name}"?`,
      confirmLabel: label === 'close' ? 'Close Period' : 'Reopen Period',
      variant: label === 'close' ? 'warning' : 'default',
      onConfirm: async () => {
        try {
          const data = await fetchApi('/evaluation_periods', {
            method: 'PATCH',
            body: JSON.stringify({ id: period.id, status: newStatus }),
          });
          setPeriods(prev => prev.map(p => p.id === period.id ? data.period : p));
          if (selectedPeriod?.id === period.id) setSelectedPeriod(data.period);
          showFeedback('success', `Period ${label === 'close' ? 'closed' : 'reopened'} successfully.`);
        } catch (err) {
          showFeedback('error', err instanceof Error ? err.message : 'Failed to update status');
        }
      },
    });
  };

  const handleDelete = (period: any) => {
    confirm({
      title: 'Delete Period',
      message: `Delete "${period.name}" and all its evaluations? This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await fetchApi(`/evaluation_periods?id=${period.id}`, { method: 'DELETE' });
          setPeriods(prev => prev.filter(p => p.id !== period.id));
          refreshAllEvals();
          showFeedback('success', 'Period deleted.');
        } catch (err) {
          showFeedback('error', err instanceof Error ? err.message : 'Failed to delete');
        }
      },
    });
  };

  // ── Filtered evaluations ──
  const filteredEvals = useMemo(() => {
    return periodEvals.filter((e: any) => {
      const evaluatorName = e.evaluator?.name || e.evaluator_name || '';
      const evaluateeName = e.evaluatee?.name || e.evaluatee_name || '';
      const courseName = e.course?.name || e.course_name || '';
      const courseCode = e.course?.code || e.course_code || '';
      const matchSearch = searchTerm === '' ||
        evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluateeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || e.evaluation_type === filterType;
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [periodEvals, searchTerm, filterType, filterStatus]);

  if (periodsLoading) return <DashboardSkeleton />;

  // ── DRILL-DOWN VIEW ──
  if (selectedPeriod) {
    const avgScore = filteredEvals.length > 0
      ? (filteredEvals.reduce((sum: number, e: any) => {
        const ratings = (e.responses || []).map((r: any) => r.rating || 0);
        return sum + (ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0);
      }, 0) / filteredEvals.length).toFixed(2)
      : '—';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goBack} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPeriod.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {formatDate(selectedPeriod.start_date)} — {formatDate(selectedPeriod.end_date)} {statusBadge(selectedPeriod.status)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedPeriod.status === 'active' && (
              <Button variant="primary" size="sm" className="gap-1" onClick={() => { setDeanTeacher(''); setDeanCourse(''); setDeanModalOpen(true); }}>
                <UserCheck className="w-3 h-3" /> Dean Evaluate
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push(`/dean/evaluation-setup?periodId=${selectedPeriod.id}`)}>
              <Pencil className="w-3 h-3" /> Edit
            </Button>
            {selectedPeriod.status === 'active' && (
              <Button variant="danger" size="sm" className="gap-1" onClick={() => handleStatusChange(selectedPeriod, 'closed')}>
                <XCircle className="w-3 h-3" /> Close
              </Button>
            )}
            {selectedPeriod.status === 'closed' && (
              <Button variant="primary" size="sm" className="gap-1" onClick={() => handleStatusChange(selectedPeriod, 'active')}>
                <PlayCircle className="w-3 h-3" /> Reopen
              </Button>
            )}
          </div>
        </div>

        {feedback && (
          <Alert variant={feedback.type === 'success' ? 'success' : 'error'} title={feedback.type === 'success' ? 'Success' : 'Error'}>
            {feedback.message}
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{periodEvals.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Submitted</p>
              <p className="text-3xl font-bold text-green-600">
                {periodEvals.filter((e: any) => e.status === 'submitted').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Locked</p>
              <p className="text-3xl font-bold text-red-600">
                {periodEvals.filter((e: any) => e.status === 'locked').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {periodEvals.filter((e: any) => e.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Score</p>
              <p className="text-3xl font-bold text-blue-600">{avgScore}/5</p>
            </CardContent>
          </Card>
        </div>

        {/* Evaluations table */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Evaluations</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2 flex-col md:flex-row md:items-end mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by evaluator, evaluatee, or course..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="teacher">Student to Teacher</option>
                <option value="peer">Peer Review</option>
              </select>
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="locked">Locked</option>
                <option value="draft">Draft/Pending</option>
              </select>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredEvals.length} of {periodEvals.length} evaluations
            </p>

            {evalsLoading ? (
              <p className="text-center text-gray-500 py-8">Loading evaluations...</p>
            ) : filteredEvals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No evaluations found for this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Evaluator</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Evaluatee</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Score</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEvals.map((e: any) => {
                      const evaluatorName = e.evaluator?.name || e.evaluator_name || '—';
                      const evaluateeName = e.evaluatee?.name || e.evaluatee_name || '—';
                      const courseName = e.course?.name || e.course_name || '—';
                      const courseCode = e.course?.code || e.course_code || '';
                      const ratings = (e.responses || []).map((r: any) => r.rating || 0);
                      const avg = ratings.length > 0
                        ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
                        : '—';
                      const isLocked = e.status === 'locked';
                      const isSubmitted = e.status === 'submitted';

                      return (
                        <tr key={e.id}>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {evaluatorName}
                            {e.is_ghost && <Badge variant="outline" className="ml-1 text-xs">Dean</Badge>}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{evaluateeName}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {courseCode ? `${courseCode} — ${courseName}` : courseName}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">
                              {e.evaluation_type === 'teacher' ? 'Student\u2192Teacher' : e.evaluation_type === 'peer' ? 'Peer' : e.evaluation_type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={isSubmitted ? 'success' : isLocked ? 'destructive' : 'secondary'}>
                              {e.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{avg === '—' ? '—' : `${avg}/5`}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 flex-wrap">
                              {/* View responses (submitted or locked) */}
                              {(isSubmitted || isLocked) && (
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedEval(e)}>
                                  <Eye className="w-3 h-3" /> View
                                </Button>
                              )}
                              {/* Ghost: Resume (pending) or Edit (submitted) */}
                              {e.is_ghost && e.status === 'pending' && (
                                <Button variant="primary" size="sm" className="gap-1" onClick={() => router.push(`/dean/evaluations/fill/${e.id}`)}>
                                  <UserCheck className="w-3 h-3" /> Resume
                                </Button>
                              )}
                              {e.is_ghost && isSubmitted && (
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push(`/dean/evaluations/fill/${e.id}`)}>
                                  <Pencil className="w-3 h-3" /> Edit
                                </Button>
                              )}
                              {/* Lock/Unlock (submitted or locked, non-ghost) */}
                              {!e.is_ghost && (isSubmitted || isLocked) && (
                                <Button
                                  variant={isLocked ? 'danger' : 'secondary'}
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleToggleLock(e.id, !isLocked)}
                                >
                                  {isLocked ? <><Unlock className="w-3 h-3" /> Unlock</> : <><Lock className="w-3 h-3" /> Lock</>}
                                </Button>
                              )}
                              {/* Delete (ghost) or Reset (normal) */}
                              {(e.is_ghost || isSubmitted) && !isLocked && (
                                <Button variant="danger" size="sm" className="gap-1" onClick={() => handleEvalDelete(e)}>
                                  {e.is_ghost ? <><Trash2 className="w-3 h-3" /> Delete</> : <><RotateCcw className="w-3 h-3" /> Reset</>}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedEval && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEval(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedEval(null); } }}>
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <CardHeader className="border-b flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Evaluation Details</CardTitle>
                  <CardDescription>
                    {selectedEval.evaluator?.name || selectedEval.evaluator_name} {'\u2192'} {selectedEval.evaluatee?.name || selectedEval.evaluatee_name}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedEval(null)}>Close</Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Course</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {(selectedEval.course?.code || selectedEval.course_code)
                        ? `${selectedEval.course?.code || selectedEval.course_code} — ${selectedEval.course?.name || selectedEval.course_name}`
                        : selectedEval.course?.name || selectedEval.course_name || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedEval.evaluation_type}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Responses:</p>
                  {(selectedEval.responses || []).length === 0 ? (
                    <p className="text-sm text-gray-500">No responses recorded.</p>
                  ) : (
                    selectedEval.responses.map((r: any, idx: number) => (
                      <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-800 rounded mb-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {r.question_text || `Question ${idx + 1}`}
                          </span>
                          <span className="font-semibold text-blue-600 ml-2 whitespace-nowrap">{r.rating}/5</span>
                        </div>
                        {r.criteria_name && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">{r.criteria_name}</span>
                        )}
                        {r.comment && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">{r.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {selectedEval.comments && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Overall Comment:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{selectedEval.comments}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dean Evaluate Modal */}
        <Modal isOpen={deanModalOpen} onClose={() => setDeanModalOpen(false)} title="Dean Evaluation" size="md">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submit an evaluation that blends in anonymously with regular results.
            </p>
            <Select
              label="Select Teacher"
              value={deanTeacher}
              onChange={e => { setDeanTeacher(e.target.value); setDeanCourse(''); }}
              options={deanTeachers.map(t => ({ value: t.id, label: t.name }))}
              placeholder="Choose a teacher..."
            />
            {deanTeacher && !isPeerPeriod && selectedDeanTeacher && selectedDeanTeacher.courses.length > 0 && (
              <Select
                label="Select Subject"
                value={deanCourse}
                onChange={e => setDeanCourse(e.target.value)}
                options={selectedDeanTeacher.courses.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Choose a subject..."
              />
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeanModalOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleDeanCreate}
                disabled={deanCreating || !deanTeacher || (!isPeerPeriod && !deanCourse)}
                isLoading={deanCreating}
              >
                Start Evaluation
              </Button>
            </div>
          </div>
        </Modal>

        <ConfirmModal {...modalProps} />
      </div>
    );
  }

  // ── TOP-LEVEL: Periods list ──
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View evaluation periods and drill down into individual evaluations.
        </p>
      </div>

      {feedback && (
        <Alert variant={feedback.type === 'success' ? 'success' : 'error'} title={feedback.type === 'success' ? 'Success' : 'Error'}>
          {feedback.message}
        </Alert>
      )}

      {periods.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No evaluation periods found.</p>
            <p className="text-sm text-gray-400">Create one in Evaluation Setup to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Academic Year</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Semester</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Dates</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {periods.map((p: any) => {
                const prog = periodProgress[p.id] || { total: 0, submitted: 0 };
                const pct = prog.total > 0 ? Math.round((prog.submitted / prog.total) * 100) : 0;

                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.form_type === 'peer-review' ? 'warning' : 'default'}>
                        {p.form_type === 'peer-review' ? 'Peer Review' : p.form_type === 'student-to-teacher' ? 'Student\u2192Teacher' : p.form_type || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.academic_year || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.semester || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(p.start_date)} — {formatDate(p.end_date)}
                    </td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[160px]">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{prog.submitted}/{prog.total} ({pct}%)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => viewPeriod(p)}>
                          <Eye className="w-3 h-3" /> View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push(`/dean/evaluation-setup?periodId=${p.id}`)}>
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                        {p.status === 'active' && (
                          <Button variant="danger" size="sm" className="gap-1" onClick={() => handleStatusChange(p, 'closed')}>
                            <XCircle className="w-3 h-3" /> Close
                          </Button>
                        )}
                        {p.status === 'closed' && (
                          <Button variant="primary" size="sm" className="gap-1" onClick={() => handleStatusChange(p, 'active')}>
                            <PlayCircle className="w-3 h-3" /> Reopen
                          </Button>
                        )}
                        {p.status !== 'active' && (
                          <Button variant="danger" size="sm" className="gap-1" onClick={() => handleDelete(p)}>
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal {...modalProps} />
    </div>
  );
}
