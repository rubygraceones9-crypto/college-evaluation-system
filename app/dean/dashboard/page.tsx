'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Users, CheckCircle, Clock, Download, FilePlus, UserPlus, ClipboardList } from 'lucide-react';
import { useFetch } from '@/hooks';
import { downloadPdf } from '@/utils/helpers';

export default function DeanDashboard() {

  const router = useRouter();
  const [timerLoading, setTimerLoading] = useState(true);
  const { data: analyticsData, loading: analyticsLoading } = useFetch<any>('/analytics');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  const { data: auditData, loading: auditLoading } = useFetch<any>('/audit');
  const { data: periodData, loading: periodLoading } = useFetch<any>('/evaluation_periods?status=active');

  const isLoading = timerLoading || analyticsLoading || evalLoading || auditLoading || periodLoading;

  useEffect(() => {
    const timer = setTimeout(() => setTimerLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const downloadDepartmentReport = () => {
    try {
      const data = (analyticsData?.analytics?.performanceTrend || []).map((d: any) => ({
        period: d.period,
        score: d.score,
        completionRate: d.completionRate ?? undefined,
      }));
      const header = ['Period', 'Score', 'Completion Rate'];
      const csv = [header.join(','), ...data.map((d: any) => [d.period, d.score, d.completionRate].join(','))].join('\n');
      downloadPdf(csv, `department-performance-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const activePeriod = periodData?.periods?.[0];
  const deadline = activePeriod?.end_date;
  const totalStudents = analyticsData?.analytics?.totalStudents || 0;
  const totalTeachers = analyticsData?.analytics?.totalTeachers || 0;
  const completionPercentage = analyticsData?.analytics?.completionPercentage || 0;
  const pendingEvals = analyticsData?.analytics?.pendingEvals || 0;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span>Dean Dashboard</span>
        {/* Top dashboard buttons removed as requested */}
      </div>

      {/* System Alerts */}
      <Alert variant="warning" title="Active Evaluation Period">
        {activePeriod ? (
          `${activePeriod.name} evaluations are currently open. Deadline: ${deadline}`
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>No active evaluation period at the moment.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dean/evaluation-setup')}
            >
              Create One
            </Button>
          </div>
        )}
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Students"
          value={<AnimatedCounter endValue={totalStudents} />}
          footer="Registered students"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          title="Total Teachers"
          value={<AnimatedCounter endValue={totalTeachers} />}
          footer="Active instructors"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          title="Completion Rate"
          value={<AnimatedCounter endValue={completionPercentage} suffix="%" />}
          footer="Evaluations completed"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <DashboardCard
          title="Pending Actions"
          value={<AnimatedCounter endValue={pendingEvals} />}
          footer="Evaluations awaiting"
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {/* Top Instructors */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Top Instructors</CardTitle>
              <CardDescription>Highest average scores</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData?.analytics?.topInstructors?.length ? (
                <ol className="space-y-2">
                  {analyticsData.analytics.topInstructors.map((t:any) => (
                    <li key={t.rank} className="flex justify-between">
                      <span>{t.rank}. {t.instructor?.name}</span>
                      <span className="font-semibold">{t.overallScore}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No data yet</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
