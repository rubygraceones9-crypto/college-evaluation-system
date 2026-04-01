
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Download, FileText, Trash2, Calendar, Search, BarChart2, Eye } from 'lucide-react';
import { useFetch } from '@/hooks';

// generate a CSV file containing the data
const generateCSVReport = (filename: string, data: any[], headers: string[]) => {
  try {
    const csv = [
      headers.join(','),
      ...data.map(d => headers.map(h => `"${String((d as any)[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if (!filename.toLowerCase().endsWith('.csv')) filename += '.csv';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Failed to generate report');
  }
};

const ReportsComponent = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const { data: analyticsData, loading: analyticsLoading } = useFetch<any>('/analytics');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  // persist report history in localStorage so we don't rely on hardcoded samples
  const [reportHistory, setReportHistory] = useState<{
    id: string;
    name: string;
    date: Date;
    type: string;
  }[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('reportHistory');
        if (stored) {
          return JSON.parse(stored).map((r: any) => ({
            ...r,
            date: new Date(r.date),
          }));
        }
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterInstructor, setFilterInstructor] = useState('all');

  const [previewReportId, setPreviewReportId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);

  const handleDepartmentReport = async () => {
    setGenerating('department');
    const dept = analyticsData?.analytics?.performanceTrend || [];
    generateCSVReport(
      `department-report-${new Date().toISOString().split('T')[0]}.csv`,
      dept,
      ['period', 'score']
    );
    addToHistory('Department Report ' + new Date().toLocaleDateString(), 'department');
    setGenerating(null);
  };

  const previewDepartmentReport = () => {
    const dept = analyticsData?.analytics?.performanceTrend || [];
    previewReport('Department Report Preview', ['period', 'score'], dept);
  };

  const handleInstructorReport = async () => {
    setGenerating('instructor');
    const instr = analyticsData?.analytics?.topInstructors || [];
    const rows = instr.map((r: any) => ({
      rank: r.rank,
      name: r.instructor?.name,
      overallScore: r.overallScore,
    }));
    generateCSVReport(
      `instructor-report-${new Date().toISOString().split('T')[0]}.csv`,
      rows,
      ['rank', 'name', 'overallScore']
    );
    addToHistory('Instructor Report ' + new Date().toLocaleDateString(), 'instructor');
    setGenerating(null);
  };

  const previewInstructorReport = () => {
    const instr = analyticsData?.analytics?.topInstructors || [];
    const rows = instr.map((r: any) => ({
      rank: r.rank,
      name: r.instructor?.name,
      overallScore: r.overallScore,
    }));
    previewReport('Instructor Report Preview', ['rank', 'name', 'overallScore'], rows);
  };

  const handleCourseReport = async () => {
    setGenerating('course');
    const courseData = evalData?.evaluations || [];
    generateCSVReport(
      `course-report-${new Date().toISOString().split('T')[0]}.csv`,
      courseData,
      ['course_id','course_name','responses']
    );
    addToHistory('Course Report ' + new Date().toLocaleDateString(), 'course');
    setGenerating(null);
  };

  const previewCourseReport = () => {
    const courseData = evalData?.evaluations || [];
    previewReport('Course Report Preview', ['course_id','course_name','responses'], courseData);
  };


  const addToHistory = (name: string, type: string) => {
    const next = [
      { id: String(Date.now()), name, date: new Date(), type },
      ...reportHistory.slice(0, 9),
    ];
    setReportHistory(next);
  };

  const previewReport = (title: string, headers: string[], rows: any[]) => {
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String((r as any)[h] ?? '')}"`).join(',')),
    ].join('\n');
    setPreviewReportId(title);
    setPreviewContent(csv);
    setPreviewHeaders(headers);
    setPreviewRows(rows);
  };

  const closePreview = () => {
    setPreviewReportId(null);
    setPreviewContent('');
  };

  // whenever history changes persist it
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reportHistory', JSON.stringify(reportHistory));
    }
  }, [reportHistory]);

  const deleteReport = (id: string) => {
    setReportHistory(reportHistory.filter(r => r.id !== id));
  };

  // computed metrics
  const totalEvals = evalData?.evaluations?.length || 0;
  const completedEvals = evalData?.evaluations?.filter((e: any) =>
    e.status === 'submitted' ||
    e.status === 'completed' ||
    (e.responses && e.responses > 0)
  ).length;
  const completionRateCalc = totalEvals
    ? Math.round((completedEvals / totalEvals) * 100)
    : analyticsData?.analytics?.completionRate || 0;
  const avgScoreCalc =
    typeof analyticsData?.analytics?.averageScore === 'number'
      ? analyticsData.analytics.averageScore
      : 0;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate comprehensive evaluation reports and analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>📊</span> Total Evaluations
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEvals}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Evaluations submitted</p>
              </div>
              <Badge variant="secondary">{totalEvals > 0 ? 'Live' : 'Empty'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>📈</span> Completion Rate
                </p>
                <p className="text-3xl font-bold text-green-600">{completionRateCalc}%</p>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.min(100, Math.max(0, completionRateCalc))}%` }}
                  />
                </div>
              </div>
              <Badge variant={completionRateCalc > 80 ? 'success' : completionRateCalc > 50 ? 'warning' : 'destructive'}>
                {completionRateCalc > 80 ? 'Good' : completionRateCalc > 50 ? 'Ok' : 'Low'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>⭐</span> Avg Score
                </p>
                <p className="text-3xl font-bold text-blue-600">{avgScoreCalc.toFixed(1)}/5.0</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={idx < Math.round(avgScoreCalc) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <Badge variant="success">{avgScoreCalc >= 4 ? 'Great' : avgScoreCalc >= 3 ? 'Good' : 'Needs work'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-150">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>📄</span> Reports Generated
                </p>
                <p className="text-3xl font-bold text-purple-600">{reportHistory.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recent downloads</p>
              </div>
              <Badge variant="secondary">{reportHistory.length > 0 ? 'Active' : 'None'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Search + Filters + Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            {(analyticsData?.analytics?.departments || []).map((dept: string) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            value={filterInstructor}
            onChange={(e) => setFilterInstructor(e.target.value)}
          >
            <option value="all">All Instructors</option>
            {(analyticsData?.analytics?.instructors || []).map((ins: string) => (
              <option key={ins} value={ins}>{ins}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-150">
            <CardHeader>
              <CardTitle>🏢 Department Report</CardTitle>
              <CardDescription>Overall department performance summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Performance trends over time<br />
                • Top performing instructors<br />
                • Improvement areas<br />
                • Completion statistics
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={previewDepartmentReport}
                  disabled={!analyticsData?.analytics?.performanceTrend?.length}
                >
                  <Eye className="w-4 h-4" />
                  Preview Report
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 gap-2"
                  onClick={handleDepartmentReport}
                  disabled={generating === 'department'}
                >
                  <Download className="w-4 h-4" />
                  {generating === 'department' ? 'Generating...' : 'Download Department Report'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-150">
            <CardHeader>
              <CardTitle>👩‍🏫 Instructor Report</CardTitle>
              <CardDescription>Individual teacher evaluation summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Individual ratings & rankings<br />
                • Strength areas<br />
                • Areas for improvement<br />
                • Year-over-year comparison
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={previewInstructorReport}
                  disabled={!analyticsData?.analytics?.topInstructors?.length}
                >
                  <Eye className="w-4 h-4" />
                  Preview Report
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 gap-2"
                  onClick={handleInstructorReport}
                  disabled={generating === 'instructor'}
                >
                  <Download className="w-4 h-4" />
                  {generating === 'instructor' ? 'Generating...' : 'Download Instructor Report'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-150">
            <CardHeader>
              <CardTitle>📚 Course Report</CardTitle>
              <CardDescription>Course-level evaluation analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Class feedback summary<br />
                • Enrollment data<br />
                • Engagement metrics<br />
                • Course-specific insights
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={previewCourseReport}
                  disabled={!evalData?.evaluations?.length}
                >
                  <Eye className="w-4 h-4" />
                  Preview Report
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 gap-2"
                  onClick={handleCourseReport}
                  disabled={generating === 'course'}
                >
                  <Download className="w-4 h-4" />
                  {generating === 'course' ? 'Generating...' : 'Generate Course Report'}
                </Button>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Report History */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Report History</CardTitle>
          <CardDescription>Recently generated reports</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {reportHistory.map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{report.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date.toLocaleDateString()} {report.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {report.type}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={!!previewReportId}
        onClose={closePreview}
        title={previewReportId || 'Report Preview'}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a preview of the report content. Click "Download" to save the generated CSV.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-72">
            <pre className="whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-200">{previewContent || 'No preview data available.'}</pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closePreview}
              className="gap-2"
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!previewReportId) return;
                generateCSVReport(
                  `${previewReportId.toLowerCase().replace(/\s+/g, '-')}.csv`,
                  previewRows,
                  previewHeaders
                );
              }}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsComponent;
