'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '@/components/DashboardCard';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { TrendingUp, Share2, Printer, Users } from 'lucide-react';
import { useFetch } from '@/hooks';
import { useAuth } from '@/context/AuthContext';

// sentiment distribution calculated from ratings
// (positive: >=4, neutral: 3-<4, negative: <3)

export default function TeacherResults() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const { data: analyticsData, loading: analyticsLoading } = useFetch<any>('/analytics');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations?role=evaluatee');
  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');

  const isBusy = analyticsLoading || evalLoading || coursesLoading;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isBusy) {
    return <DashboardSkeleton />;
  }

  const trend = analyticsData?.analytics?.performanceTrend || [];
  const deptTrend = analyticsData?.analytics?.departmentTrend || [];
  const criteriaBreakdown = analyticsData?.analytics?.criteriaBreakdown || [];
  const peerCompleted = analyticsData?.analytics?.peerCompleted || 0;



  const printResults = () => {
    window.print();
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Evaluation Results',
        text: 'Check out my evaluation results!',
        url: window.location.href,
      }).catch(() => {
        alert('Results copied to clipboard for sharing');
      });
    } else {
      alert('Results summary copied. Share the link with your department head.');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  // Helper to compute average rating from an evaluation's responses array
  const evalAvg = (e: any): number => {
    const ratings = (e.responses || []).map((r: any) => Number(r.rating ?? 0)).filter((v: number) => v > 0);
    if (ratings.length) return ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
    return Number(e.overall_score ?? 0);
  };

  // derive live teacher metrics
  // The API already filters by evaluatee_id since we pass ?role=evaluatee
  const allReceivedEvals = evalData?.evaluations || [];
  const teacherEvals = allReceivedEvals.filter((e: any) => evalAvg(e) > 0);

  const overallRating = teacherEvals.length
    ? teacherEvals.reduce((s: number, e: any) => s + evalAvg(e), 0) / teacherEvals.length
    : 0;

  const assignedCourses = (coursesData?.courses || []).filter((c: any) => c.teacher_id === user?.id);
  const totalStudents = assignedCourses.reduce(
    (s: number, c: any) => s + (c.enrolled || c.enrolledStudents || c.students?.length || 0),
    0
  );

  // For completion rate, we use ALL evaluations (submitted or not) vs total students
  const completionRate = totalStudents ? Math.round((allReceivedEvals.length / totalStudents) * 100) : (analyticsData?.analytics?.completionRate || 0);

  const sentimentData = (() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    teacherEvals.forEach((e: any) => {
      const s = evalAvg(e);
      if (s >= 4) counts.positive++;
      else if (s >= 3) counts.neutral++;
      else if (s > 0) counts.negative++;
    });
    const total = teacherEvals.length;
    if (!total) return [];
    return [
      { name: 'Positive', value: Math.round((counts.positive / total) * 100), fill: '#10B981' },
      { name: 'Neutral', value: Math.round((counts.neutral / total) * 100), fill: '#F59E0B' },
      { name: 'Negative', value: Math.round((counts.negative / total) * 100), fill: '#EF4444' },
    ];
  })();

  // Build results per course the teacher teaches
  const courseResults = (assignedCourses || []).map((c: any) => {
    const evals = teacherEvals.filter((e: any) => e.course_id === c.id);
    const responses = evals.length;
    const avgScore = responses
      ? Math.round((evals.reduce((acc: number, e: any) => acc + evalAvg(e), 0) / responses) * 100) / 100
      : 0;
    const status = responses ? 'Completed' : 'Pending';
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      section: c.section || '',
      responses,
      avgScore,
      status,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Evaluation Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your comprehensive evaluation results and detailed analytics
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={printResults}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={shareResults}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Overall Rating"
          value={
            <span>
              <AnimatedCounter endValue={Number.isFinite(overallRating) ? overallRating : 0} decimals={1} suffix="/5" />
            </span>
          }
          footer={`Based on ${teacherEvals.length || '0'} responses`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={4}
        />
        <DashboardCard
          title="Completion Rate"
          value={<AnimatedCounter endValue={completionRate} suffix="%" />}
          footer="Students evaluated"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          trend={2}
        />
        <DashboardCard
          title="Peer Reviews Completed"
          value={<AnimatedCounter endValue={peerCompleted} />}
          footer="By you"
          icon={<Users className="w-6 h-6" />}
          color="red"
        />
        <DashboardCard
          title="Department Avg Score"
          value={
            <span>
              <AnimatedCounter endValue={deptTrend.length ? deptTrend[deptTrend.length-1].score : 0} decimals={1} suffix="/5" />
            </span>
          }
          footer="Latest month"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
      </div>



      {/* Data Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criteria Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Criteria Performance</CardTitle>
            <CardDescription>Your average score by evaluation criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {criteriaBreakdown.length ? (
              criteriaBreakdown.map((item: any, index: number) => (
                <div key={`${item.criteriaName}-${index}`} className="flex justify-between text-sm">
                  <span className="text-gray-900 dark:text-white">{item.criteriaName}</span>
                  <span className="font-semibold text-blue-600">{item.score?.toFixed(1) ?? 'N/A'}/5</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No criteria data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Feedback Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Sentiment</CardTitle>
            <CardDescription>Distribution of positive, neutral, and negative comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sentimentData.length ? (
              sentimentData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-gray-900 dark:text-white">{item.name}</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{item.value}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No sentiment data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results by Course */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Results by Course</CardTitle>
          <CardDescription>Detailed breakdown of evaluation results for each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courseResults.map((course) => (
              <div
                key={course.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCourse(selectedCourse === course.id ? null : course.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCourse(selectedCourse === course.id ? null : course.id);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{course.code} - {course.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Section {course.section} • {course.responses} responses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{course.avgScore}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/5.0</p>
                  </div>
                  <Badge variant="success" className="ml-4">{course.status}</Badge>
                </div>
                {selectedCourse === course.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <p><strong>Course Code:</strong> {course.code}</p>
                    <p><strong>Student Responses:</strong> {course.responses}</p>
                    <p><strong>Average Score:</strong> {course.avgScore}/5.0</p>
                    <p><strong>Completion Status:</strong> {course.status}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={(e) => e.stopPropagation()}>
                      View Detailed Report
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Key Insights */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-base">💡 Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            ✓ Your overall rating of {(overallRating || 0).toFixed(1)}/5 is {overallRating > (deptTrend.slice(-1)[0]?.score || 0) ? 'above' : 'below'} the department average of {deptTrend.slice(-1)[0]?.score?.toFixed(1) || 'N/A'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ✓ Highest criterion: {criteriaBreakdown.length ? `${[...criteriaBreakdown].sort((a: any,b: any)=>b.score-a.score)[0]?.criteriaName} (${[...criteriaBreakdown].sort((a: any,b: any)=>b.score-a.score)[0]?.score?.toFixed(1)}/5)` : 'N/A'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ✓ {courseResults.length ? `${[...courseResults].sort((a,b)=>b.avgScore-a.avgScore)[0]?.code} has the highest avg score (${[...courseResults].sort((a,b)=>b.avgScore-a.avgScore)[0]?.avgScore}/5)` : 'No course data available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
