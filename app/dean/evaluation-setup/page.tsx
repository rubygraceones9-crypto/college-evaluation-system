'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { useFetch } from '@/hooks';
import { curriculum } from '@/data/curriculum';
import {
  Save,
  Play,
  Trash2,
  FileText,
  RefreshCw,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

type SubjectAssignment = {
  code: string;
  name: string;
  instructorId: string;
};

type AssignmentGroup = {
  id: string;
  program: CurriculumProgram | '';
  yearLevel: string;
  defaultSection: string;
  assignments: Record<string, string>;
  sectionAssignments: Record<string, string>;
  selectedCodes: string[];
  collapsed: boolean;
};

const createGroupId = () => Math.random().toString(36).slice(2, 9);

const createEmptyGroup = (): AssignmentGroup => ({
  id: createGroupId(),
  program: '',
  yearLevel: '',
  defaultSection: 'A',
  assignments: {},
  sectionAssignments: {},
  selectedCodes: [],
  collapsed: false,
});

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

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formTypeLabel: Record<string, string> = {
  'student-to-teacher': 'Student to Teacher',
  'peer-review': 'Peer Review',
};

type CurriculumProgram = keyof typeof curriculum;

function getSubjectsForGroup(program: string, yearLevel: string, semester: string) {
  if (!program || !yearLevel || !semester) return [];
  const programData = (curriculum as any)[program];
  if (!programData) return [];
  const yearData = programData[yearLevel];
  if (!yearData) return [];
  return yearData[semester] || [];
}

export default function EvaluationSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPeriodId = searchParams.get('periodId');

  // ── Section 1: Evaluation Details & Form Selection ──
  const [selectedAcademicPeriodId, setSelectedAcademicPeriodId] = useState('');
  const [namePrefix, setNamePrefix] = useState('');
  const [evalStartDate, setEvalStartDate] = useState('');
  const [evalEndDate, setEvalEndDate] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');

  // ── Section 2: Multi-group assignment state ──
  const [groups, setGroups] = useState<AssignmentGroup[]>([createEmptyGroup()]);

  // ── Section 3: Save & Start ──
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [savedPeriodId, setSavedPeriodId] = useState<number | null>(null);

  // ── Per-section feedback ──
  type FeedbackEntry = { type: 'success' | 'error'; message: string };
  const [sectionFeedback, setSectionFeedback] = useState<Record<string, FeedbackEntry | null>>({});
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const showFeedback = (section: string, entry: FeedbackEntry) => {
    setSectionFeedback(prev => ({ ...prev, [section]: entry }));
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      section1: section1Ref, section2: section2Ref, section3: section3Ref,
    };
    const ref = refMap[section];
    requestAnimationFrame(() => {
      ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (entry.type === 'success') {
      setTimeout(() => setSectionFeedback(prev => ({ ...prev, [section]: null })), 5000);
    }
  };

  const clearFeedback = (section: string) => {
    setSectionFeedback(prev => ({ ...prev, [section]: null }));
  };

  // ── Drafts ──
  const [drafts, setDrafts] = useState<any[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const resumingRef = useRef(false);

  // ── API data ──
  const { data: usersData } = useFetch<any>('/users');
  const { data: formsData } = useFetch<any>('/forms');
  const { data: academicPeriodsData } = useFetch<any>('/academic_periods');

  // Fetch drafts
  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
    const base = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${base}/evaluation_periods?status=draft`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    })
      .then(r => r.json())
      .then(data => { if (data.success) setDrafts(data.periods || []); })
      .catch(() => {})
      .finally(() => setDraftsLoading(false));
  }, []);

  // Academic period options
  const academicPeriodOptions = useMemo(() => {
    if (!academicPeriodsData?.periods) return [];
    return academicPeriodsData.periods.map((p: any) => ({
      value: String(p.id),
      label: `${p.name} (${p.academic_year} — Sem ${p.semester})`,
    }));
  }, [academicPeriodsData]);

  // Auto-select the active academic period
  useEffect(() => {
    if (!selectedAcademicPeriodId && academicPeriodsData?.periods) {
      const active = academicPeriodsData.periods.find((p: any) => p.is_active);
      if (active) setSelectedAcademicPeriodId(String(active.id));
    }
  }, [academicPeriodsData, selectedAcademicPeriodId]);

  // Derived academic year + semester from selected period
  const selectedAcademicPeriod = useMemo(() => {
    if (!selectedAcademicPeriodId || !academicPeriodsData?.periods) return null;
    return academicPeriodsData.periods.find((p: any) => String(p.id) === selectedAcademicPeriodId) || null;
  }, [selectedAcademicPeriodId, academicPeriodsData]);

  const academicYear = selectedAcademicPeriod?.academic_year || '';
  const semesterFromPeriod = selectedAcademicPeriod?.semester;
  const semester = useMemo(() => {
    if (!semesterFromPeriod) return '';
    if (semesterFromPeriod === 1) return '1st Semester';
    if (semesterFromPeriod === 2) return '2nd Semester';
    if (semesterFromPeriod === 3) return 'Summer';
    return String(semesterFromPeriod);
  }, [semesterFromPeriod]);

  // Derive instructor options (teachers only)
  const instructorOptions = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users
      .filter((u: any) => u.role === 'teacher')
      .map((u: any) => ({ value: u.id, label: u.name }));
  }, [usersData]);

  // Instructor name lookup
  const instructorNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const opt of instructorOptions) {
      map[opt.value] = opt.label;
    }
    return map;
  }, [instructorOptions]);

  // Derive saved forms options (with type badge)
  const formOptions = useMemo(() => {
    if (!formsData?.forms) return [];
    return formsData.forms.map((f: any) => ({
      value: String(f.id),
      label: `${f.name} — ${formTypeLabel[f.type] || f.type}`,
    }));
  }, [formsData]);

  // Selected form details (for preview + conditional logic)
  const selectedForm = useMemo(() => {
    if (!selectedFormId || !formsData?.forms) return null;
    const form = formsData.forms.find((f: any) => String(f.id) === selectedFormId);
    if (!form) return null;
    return { ...form, criteria: Array.isArray(form.criteria) ? form.criteria : [] };
  }, [selectedFormId, formsData]);

  const showInstructorAssignment = selectedForm?.type === 'student-to-teacher';

  // ── Year levels for a given program ──
  const getYearLevels = useCallback((program: string) => {
    if (!program) return [];
    const programData = (curriculum as any)[program];
    if (!programData) return [];
    return Object.keys(programData).map(y => ({ value: y, label: y }));
  }, []);

  // Auto-generated evaluation name
  const generatedName = useMemo(() => {
    const prefix = namePrefix.trim() || 'Evaluation';
    const datePart = evalStartDate && evalEndDate
      ? ` (${formatShortDate(evalStartDate)} - ${formatShortDate(evalEndDate)})`
      : '';
    const ayPart = academicYear ? ` — ${academicYear}` : '';
    const semPart = semester ? ` ${semester}` : '';
    return `${prefix}${ayPart}${semPart}${datePart}`;
  }, [namePrefix, academicYear, semester, evalStartDate, evalEndDate]);

  // Date validation
  useEffect(() => {
    if (evalStartDate && evalEndDate) {
      setDateWarning(new Date(evalEndDate) < new Date(evalStartDate) ? 'End date cannot be earlier than start date.' : '');
    }
  }, [evalStartDate, evalEndDate]);

  // ── Group management ──
  const updateGroup = (groupId: string, updates: Partial<AssignmentGroup>) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g));
  };

  const addGroup = () => {
    setGroups(prev => [...prev, createEmptyGroup()]);
  };

  const removeGroup = (groupId: string) => {
    if (groups.length <= 1) return;
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const toggleGroupCollapse = (groupId: string) => {
    updateGroup(groupId, { collapsed: !groups.find(g => g.id === groupId)?.collapsed });
  };

  const toggleSubject = (groupId: string, code: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const newSelected = group.selectedCodes.includes(code)
      ? group.selectedCodes.filter(c => c !== code)
      : [...group.selectedCodes, code];
    updateGroup(groupId, { selectedCodes: newSelected });
  };

  const toggleAllSubjects = (groupId: string, subjects: any[]) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    if (group.selectedCodes.length === subjects.length && subjects.length > 0) {
      updateGroup(groupId, { selectedCodes: [] });
    } else {
      updateGroup(groupId, { selectedCodes: subjects.map((s: any) => s.code) });
    }
  };

  const assignInstructor = (groupId: string, code: string, instructorId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const newAssignments = { ...group.assignments, [code]: instructorId };
    const newSelected = instructorId && !group.selectedCodes.includes(code)
      ? [...group.selectedCodes, code]
      : group.selectedCodes;
    updateGroup(groupId, { assignments: newAssignments, selectedCodes: newSelected });
  };

  const assignSection = (groupId: string, code: string, sec: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    updateGroup(groupId, { sectionAssignments: { ...group.sectionAssignments, [code]: sec } });
  };

  const getSection = (group: AssignmentGroup, code: string) => group.sectionAssignments[code] || group.defaultSection;

  // ── Assignment Summary for preview ──
  const assignmentSummary = useMemo(() => {
    const rows: { code: string; name: string; section: string; teacherName: string; program: string; yearLevel: string }[] = [];
    for (const group of groups) {
      if (!group.program || !group.yearLevel) continue;
      const subjects = getSubjectsForGroup(group.program, group.yearLevel, semester);
      const subjectMap: Record<string, string> = {};
      for (const s of subjects) subjectMap[s.code] = s.name;

      for (const code of group.selectedCodes) {
        const instructorId = group.assignments[code];
        if (!instructorId) continue;
        rows.push({
          code,
          name: subjectMap[code] || code,
          section: getSection(group, code),
          teacherName: instructorNameMap[instructorId] || instructorId,
          program: group.program,
          yearLevel: group.yearLevel,
        });
      }
    }
    return rows;
  }, [groups, semester, instructorNameMap]);

  // ── Save / Start logic ──
  const buildAssignmentsJson = () => {
    const groupsData = groups
      .filter(g => g.program && g.yearLevel)
      .map(g => {
        const filteredAssignments: Record<string, string> = {};
        const filteredSections: Record<string, string> = {};
        g.selectedCodes.forEach(code => {
          filteredAssignments[code] = g.assignments[code] || '';
          filteredSections[code] = getSection(g, code);
        });
        return {
          program: g.program,
          yearLevel: g.yearLevel,
          defaultSection: g.defaultSection,
          sections: filteredSections,
          selectedCodes: g.selectedCodes,
          assignments: filteredAssignments,
        };
      });

    return JSON.stringify({
      namePrefix,
      groups: groupsData,
    });
  };

  const saveSetup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedFormId || !selectedAcademicPeriodId) {
      showFeedback('section1', { type: 'error', message: 'Please select an academic period and evaluation form.' });
      return;
    }

    if (showInstructorAssignment) {
      const validGroups = groups.filter(g => g.program && g.yearLevel && g.selectedCodes.length > 0);
      if (validGroups.length === 0) {
        showFeedback('section2', { type: 'error', message: 'Add at least one group with a program, year level, and selected subjects.' });
        return;
      }
    }

    setSaving(true);
    clearFeedback('section3');
    try {
      const payload: any = {
        name: generatedName,
        academic_year: academicYear,
        semester,
        start_date: evalStartDate || null,
        end_date: evalEndDate || null,
        form_id: Number(selectedFormId),
        academic_period_id: Number(selectedAcademicPeriodId),
        assignments_json: buildAssignmentsJson(),
      };

      if (savedPeriodId) {
        // Preserve current status when updating an existing period
        await fetchApi('/evaluation_periods', {
          method: 'PATCH',
          body: JSON.stringify({ ...payload, id: savedPeriodId }),
        });
      } else {
        payload.status = 'draft';
        const periodData = await fetchApi('/evaluation_periods', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSavedPeriodId(periodData.period.id);
      }
      showFeedback('section3', { type: 'success', message: savedPeriodId ? 'Setup updated!' : 'Setup saved as draft!' });
    } catch (err) {
      showFeedback('section3', { type: 'error', message: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  // Shared logic: populate form from a period object
  const loadPeriodData = (period: any) => {
    resumingRef.current = true;

    setEvalStartDate(period.start_date ? period.start_date.split('T')[0] : '');
    setEvalEndDate(period.end_date ? period.end_date.split('T')[0] : '');
    if (period.form_id) setSelectedFormId(String(period.form_id));
    if (period.academic_period_id) setSelectedAcademicPeriodId(String(period.academic_period_id));
    setSavedPeriodId(period.id);
    setStatus(period.status || 'draft');

    let restoredPrefix = '';
    if (period.assignments_json) {
      try {
        const parsed = typeof period.assignments_json === 'string'
          ? JSON.parse(period.assignments_json) : period.assignments_json;
        if (parsed.namePrefix !== undefined) restoredPrefix = parsed.namePrefix;

        if (parsed.groups && Array.isArray(parsed.groups)) {
          // New multi-group format
          const restoredGroups: AssignmentGroup[] = parsed.groups.map((g: any) => ({
            id: createGroupId(),
            program: g.program || '',
            yearLevel: g.yearLevel || '',
            defaultSection: g.defaultSection || 'A',
            assignments: g.assignments || {},
            sectionAssignments: g.sections || {},
            selectedCodes: g.selectedCodes || Object.keys(g.assignments || {}),
            collapsed: false,
          }));
          if (restoredGroups.length > 0) {
            setGroups(restoredGroups);
          }
        } else if (parsed.program) {
          // Legacy single-group format
          setGroups([{
            id: createGroupId(),
            program: parsed.program || '',
            yearLevel: parsed.yearLevel || '',
            defaultSection: parsed.defaultSection || parsed.section || 'A',
            assignments: parsed.assignments || {},
            sectionAssignments: parsed.sections || {},
            selectedCodes: parsed.selectedCodes || Object.keys(parsed.assignments || {}),
            collapsed: false,
          }]);
        }
      } catch {}
    }
    setNamePrefix(restoredPrefix);

    setTimeout(() => { resumingRef.current = false; }, 500);
  };

  // Resume a draft from the drafts table
  const resumeDraft = (draft: any) => loadPeriodData(draft);

  // Load an existing period via ?periodId= query param (edit mode)
  const [editLoading, setEditLoading] = useState(!!editPeriodId);
  useEffect(() => {
    if (!editPeriodId) return;
    setEditLoading(true);
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
    const base = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${base}/evaluation_periods`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.periods) {
          const period = data.periods.find((p: any) => String(p.id) === editPeriodId);
          if (period) loadPeriodData(period);
        }
      })
      .catch(() => {})
      .finally(() => setEditLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPeriodId]);

  // Delete a draft
  const deleteDraft = async (id: number) => {
    if (!confirm('Delete this draft?')) return;
    try {
      await fetchApi(`/evaluation_periods?id=${id}`, { method: 'DELETE' });
      setDrafts(drafts.filter(d => d.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // ── Start Evaluation ──
  const startEvaluation = async () => {
    if (!evalStartDate || !evalEndDate) {
      showFeedback('section1', { type: 'error', message: 'Set evaluation dates before starting.' });
      return;
    }
    if (dateWarning) {
      showFeedback('section1', { type: 'error', message: 'Fix date issues before starting.' });
      return;
    }
    if (!selectedFormId) {
      showFeedback('section1', { type: 'error', message: 'Select an evaluation form before starting.' });
      return;
    }
    if (showInstructorAssignment) {
      for (const group of groups) {
        if (!group.program || !group.yearLevel) continue;
        const missing = group.selectedCodes.filter(code => !group.assignments[code]);
        if (missing.length > 0) {
          showFeedback('section2', { type: 'error', message: `Assign instructors to all selected subjects in ${group.program} ${group.yearLevel}. Missing: ${missing.join(', ')}` });
          return;
        }
      }
    }

    // If status is draft, just save as draft instead of activating
    if (status === 'draft') {
      await saveSetup();
      return;
    }

    setStarting(true);
    clearFeedback('section3');
    try {
      let periodId = savedPeriodId;
      if (!periodId) {
        if (!selectedFormId || !selectedAcademicPeriodId) {
          throw new Error('Please select an academic period and evaluation form.');
        }
        const payload: any = {
          name: generatedName,
          academic_year: academicYear,
          semester,
          start_date: evalStartDate || null,
          end_date: evalEndDate || null,
          form_id: Number(selectedFormId),
          academic_period_id: Number(selectedAcademicPeriodId),
          status: 'draft',
          assignments_json: buildAssignmentsJson(),
        };
        const periodData = await fetchApi('/evaluation_periods', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        periodId = periodData.period.id;
        setSavedPeriodId(periodId);
      }
      if (!periodId) throw new Error('Failed to save setup before starting.');

      // Build full payload so date/assignment changes are persisted alongside the status update
      const updatePayload: any = {
        id: periodId,
        name: generatedName,
        academic_year: academicYear,
        semester,
        start_date: evalStartDate || null,
        end_date: evalEndDate || null,
        form_id: Number(selectedFormId),
        academic_period_id: Number(selectedAcademicPeriodId),
        assignments_json: buildAssignmentsJson(),
        status,
      };

      await fetchApi('/evaluation_periods', {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
      });

      if (status === 'active') {
        await fetchApi('/evaluations', {
          method: 'POST',
          body: JSON.stringify({ action: 'generate', periodId: periodId }),
        });
      }

      showFeedback('section3', { type: 'success', message: status === 'active' ? 'Evaluation started! Assignments have been generated.' : `Evaluation status set to ${status}.` });
    } catch (err) {
      showFeedback('section3', { type: 'error', message: `Failed to start: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setStarting(false);
    }
  };

  const isEditMode = !!editPeriodId;

  if (editLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Evaluation' : 'Evaluation Setup'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isEditMode
            ? 'Update evaluation details, assignments, and status.'
            : 'Select a form, assign subjects, and launch.'}
        </p>
      </div>

      {/* ── DRAFTS SECTION (hidden in edit mode) ── */}
      {!isEditMode && !draftsLoading && drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Evaluation Drafts</CardTitle>
            <CardDescription>Resume or delete previously saved draft evaluations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Academic Year</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Semester</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Dates</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {drafts.map((draft: any) => (
                    <tr key={draft.id}>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{draft.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{draft.academic_year || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{draft.semester || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {draft.start_date?.split('T')[0]} to {draft.end_date?.split('T')[0]}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => resumeDraft(draft)} className="gap-1">
                          <RefreshCw className="w-3 h-3" /> Resume
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => deleteDraft(draft.id)} className="gap-1">
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── SECTION 1: Evaluation Details & Form Selection ── */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">1. Evaluation Details & Form Selection</CardTitle>
              <CardDescription>The active academic period is used automatically. Choose an evaluation form, name, and schedule.</CardDescription>
            </div>
            <Link href="/dean/forms">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="w-4 h-4" /> Manage Forms
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Period (read-only, from active period) */}
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Academic Period</div>
              {selectedAcademicPeriod ? (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                  <span>{selectedAcademicPeriod.name}</span>
                  <Badge variant="success">Active</Badge>
                </div>
              ) : (
                <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm">
                  No active academic period.{' '}
                  <Link href="/dean/academic" className="text-blue-600 hover:underline">Set one up</Link>.
                </div>
              )}
            </div>

            {/* Evaluation Form Dropdown */}
            <div>
              <Select
                label="Evaluation Form"
                value={selectedFormId}
                onChange={e => setSelectedFormId(e.target.value)}
                options={formOptions}
                placeholder="Select an evaluation form..."
                disabled={isEditMode && status !== 'draft'}
              />
              {selectedForm && (
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant={selectedForm.type === 'student-to-teacher' ? 'default' : 'secondary'}>
                    {formTypeLabel[selectedForm.type] || selectedForm.type}
                  </Badge>
                  {isEditMode && status !== 'draft' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Locked — form cannot be changed after leaving draft</span>
                  )}
                </div>
              )}
            </div>

            {/* Derived AY + Semester (read-only) */}
            {selectedAcademicPeriod && (
              <>
                <div>
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Academic Year</div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                    {academicYear}
                  </div>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Semester</div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                    {semester}
                  </div>
                </div>
              </>
            )}

            <Input
              label="Evaluation Name Prefix"
              value={namePrefix}
              onChange={e => setNamePrefix(e.target.value)}
              placeholder="e.g. Midterm Evaluation"
              helperText="Optional custom prefix for the evaluation name"
            />
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name Preview</div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                {generatedName}
              </div>
            </div>
            <Input
              label="Start Date"
              type="date"
              value={evalStartDate}
              onChange={e => setEvalStartDate(e.target.value)}
            />
            <div>
              <Input
                label="End Date"
                type="date"
                value={evalEndDate}
                onChange={e => setEvalEndDate(e.target.value)}
              />
              {dateWarning && <Alert variant="error" title="Date Warning">{dateWarning}</Alert>}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Students can only answer during this period.</p>
            </div>
          </div>

          {/* Form preview */}
          {selectedForm && selectedForm.criteria.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Form Preview</span>
              </div>
              {selectedForm.criteria.map((c: any) => (
                <div key={c.id} className="border-l-2 border-blue-400 pl-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</span>
                    <Badge variant="outline">{c.weight}%</Badge>
                  </div>
                  {c.questions?.length > 0 && (
                    <ol className="list-decimal list-inside mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                      {c.questions.map((q: any) => (
                        <li key={q.id}>{q.text}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          )}

          {formOptions.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No forms created yet.{' '}
              <Link href="/dean/forms" className="text-blue-600 hover:underline">Create one first</Link>.
            </p>
          )}

          {sectionFeedback.section1 && (
            <div ref={section1Ref}>
              <Alert variant={sectionFeedback.section1.type === 'success' ? 'success' : 'error'} title={sectionFeedback.section1.type === 'success' ? 'Success' : 'Error'}>
                {sectionFeedback.section1.message}
              </Alert>
            </div>
          )}

        </CardContent>
      </Card>

      {/* ── SECTION 2: Assign Instructor and Subjects (multi-group, only for student-to-teacher) ── */}
      {showInstructorAssignment && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">2. Assign Instructor and Subjects</CardTitle>
                <CardDescription>
                  Add one or more program/year level groups. Subjects auto-populate from the curriculum based on the academic period semester.
                </CardDescription>
              </div>
              <Button variant="primary" size="sm" className="gap-1" onClick={addGroup}>
                <Plus className="w-4 h-4" /> Add Group
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {groups.map((group, groupIndex) => {
              const subjects = getSubjectsForGroup(group.program, group.yearLevel, semester);
              const yearLevels = getYearLevels(group.program);
              const assignedCount = group.selectedCodes.filter(c => group.assignments[c]).length;

              return (
                <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Group Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => toggleGroupCollapse(group.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { toggleGroupCollapse(group.id); } }}
                  >
                    <div className="flex items-center gap-3">
                      {group.collapsed
                        ? <ChevronDown className="w-4 h-4 text-gray-500" />
                        : <ChevronUp className="w-4 h-4 text-gray-500" />}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Group {groupIndex + 1}
                        {group.program && group.yearLevel
                          ? ` — ${group.program} ${group.yearLevel}`
                          : ''}
                      </span>
                      {group.selectedCodes.length > 0 && (
                        <Badge variant="secondary">
                          {assignedCount}/{group.selectedCodes.length} assigned
                        </Badge>
                      )}
                    </div>
                    {groups.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="gap-1"
                        onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    )}
                  </div>

                  {/* Group Body */}
                  {!group.collapsed && (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                          label="Course Program"
                          value={group.program}
                          onChange={e => {
                            updateGroup(group.id, {
                              program: e.target.value as CurriculumProgram | '',
                              yearLevel: '',
                              assignments: {},
                              sectionAssignments: {},
                              selectedCodes: [],
                            });
                          }}
                          options={[
                            { value: 'BSIT', label: 'BSIT' },
                            { value: 'BSEMC', label: 'BSEMC' },
                          ]}
                          placeholder="Select Program"
                        />
                        <Select
                          label="Year Level"
                          value={group.yearLevel}
                          onChange={e => {
                            updateGroup(group.id, {
                              yearLevel: e.target.value,
                              assignments: {},
                              sectionAssignments: {},
                              selectedCodes: [],
                            });
                          }}
                          options={yearLevels}
                          placeholder="Select Year"
                        />
                        <Select
                          label="Default Section"
                          value={group.defaultSection}
                          onChange={e => updateGroup(group.id, { defaultSection: e.target.value })}
                          options={[
                            { value: 'A', label: 'A' },
                            { value: 'B', label: 'B' },
                            { value: 'C', label: 'C' },
                            { value: 'D', label: 'D' },
                          ]}
                          placeholder="Select Section"
                        />
                        <Select
                          label="Assign All Instructor"
                          value=""
                          onChange={e => {
                            const teacherId = e.target.value;
                            if (!teacherId) return;
                            const codes = group.selectedCodes.length > 0
                              ? group.selectedCodes
                              : subjects.map((s: any) => s.code);
                            const newAssignments = { ...group.assignments };
                            for (const code of codes) {
                              newAssignments[code] = teacherId;
                            }
                            updateGroup(group.id, {
                              assignments: newAssignments,
                              selectedCodes: codes,
                            });
                          }}
                          options={instructorOptions}
                          placeholder="Select to assign all..."
                        />
                      </div>

                      {/* Subjects table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={group.selectedCodes.length === subjects.length && subjects.length > 0}
                                  onChange={() => toggleAllSubjects(group.id, subjects)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject Code</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject Name</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Instructor</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Section</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {subjects.length > 0 ? subjects.map((s: any) => (
                              <tr key={s.code} className={group.selectedCodes.includes(s.code) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}>
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={group.selectedCodes.includes(s.code)}
                                    onChange={() => toggleSubject(group.id, s.code)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.code}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.name}</td>
                                <td className="px-4 py-3">
                                  <select
                                    value={group.assignments[s.code] || ''}
                                    onChange={e => assignInstructor(group.id, s.code, e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    disabled={!group.selectedCodes.includes(s.code)}
                                  >
                                    <option value="">Select...</option>
                                    {instructorOptions.map((opt: any) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={getSection(group, s.code)}
                                    onChange={e => assignSection(group.id, s.code, e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    disabled={!group.selectedCodes.includes(s.code)}
                                  >
                                    {['A', 'B', 'C', 'D'].map(sec => (
                                      <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-8">
                                  {!group.program || !group.yearLevel
                                    ? 'Select a program and year level to load subjects.'
                                    : !semester
                                    ? 'Select an academic period to determine the semester.'
                                    : 'No subjects found for this combination.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Group button (bottom) */}
            <div className="flex justify-center">
              <Button variant="outline" className="gap-2" onClick={addGroup}>
                <Plus className="w-4 h-4" /> Add Program / Year Level Group
              </Button>
            </div>

            {/* Assignment Summary */}
            {assignmentSummary.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Assignment Summary</h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject Code</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Section</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Instructor</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Program</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Year Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {assignmentSummary.map((row, idx) => (
                        <tr key={`${row.code}-${row.program}-${row.yearLevel}-${idx}`}>
                          <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.code}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.name}</td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.section}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.teacherName}</td>
                          <td className="px-4 py-2">
                            <Badge variant="outline">{row.program}</Badge>
                          </td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.yearLevel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {assignmentSummary.length} subject{assignmentSummary.length !== 1 ? 's' : ''} across {groups.filter(g => g.program && g.yearLevel).length} group{groups.filter(g => g.program && g.yearLevel).length !== 1 ? 's' : ''} will be generated.
                </p>
              </div>
            )}

            {sectionFeedback.section2 && (
              <div ref={section2Ref}>
                <Alert variant={sectionFeedback.section2.type === 'success' ? 'success' : 'error'} title={sectionFeedback.section2.type === 'success' ? 'Success' : 'Error'}>
                  {sectionFeedback.section2.message}
                </Alert>
              </div>
            )}

          </CardContent>
        </Card>
      )}

      {/* ── SECTION 3: Save & Start ── */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">{showInstructorAssignment ? '3' : '2'}. Save & Start Evaluation</CardTitle>
          <CardDescription>Save as draft or start the evaluation immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evaluation Status</div>
              <div className="flex gap-4 mb-3">
                {(['draft', 'active', 'closed'] as const).map(s => (
                  <label key={s} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="accent-rose-900"
                    />
                    <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{s}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                <p><strong>Draft</strong> — saved but not visible to students</p>
                <p><strong>Active</strong> — students can start evaluating immediately</p>
                <p><strong>Closed</strong> — evaluation completed, no more submissions</p>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <Button variant="outline" className="gap-2" onClick={saveSetup} disabled={saving} isLoading={saving}>
                <Save className="w-4 h-4" />
                {savedPeriodId ? 'Save Changes' : 'Save as Draft'}
              </Button>
              <Button variant="primary" className="gap-2" onClick={startEvaluation} disabled={starting} isLoading={starting}>
                <Play className="w-4 h-4" />
                {isEditMode ? 'Update & Apply' : 'Start Evaluation'}
              </Button>
            </div>
          </div>

          {sectionFeedback.section3 && (
            <div ref={section3Ref} className="mt-4">
              <Alert variant={sectionFeedback.section3.type === 'success' ? 'success' : 'error'} title={sectionFeedback.section3.type === 'success' ? 'Success' : 'Error'}>
                {sectionFeedback.section3.message}
              </Alert>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
