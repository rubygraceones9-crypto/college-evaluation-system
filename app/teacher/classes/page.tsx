'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useFetch } from '@/hooks';
import { Users, BookOpen, Search } from 'lucide-react';

export default function TeacherClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');

  const { user } = useAuth();
  const teacherId = user?.id;
  const teacherCourses = (coursesData?.courses || []).filter((c:any) => c.teacher_id === teacherId);

  const filteredCourses = teacherCourses.filter((c: any) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (coursesLoading) return <DashboardSkeleton />;

  // Group courses by semester for better organization
  const coursesBySemester = filteredCourses.reduce((acc: any, course: any) => {
    const sem = course.semester ? `${course.semester}${course.semester === 1 ? 'st' : course.semester === 2 ? 'nd' : 'rd'} Semester` : 'Unassigned';
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(course);
    return acc;
  }, {});

  const totalStudents = teacherCourses.reduce((sum: number, course: any) => sum + (course.student_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all your assigned classes, manage subjects, and track student performance
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by subject code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{teacherCourses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/30">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/30">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-8">
        {Object.keys(coursesBySemester).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No classes found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(coursesBySemester).map(([semester, courses]: [string, any]) => (
            <div key={semester} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                {semester}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {courses.map((course: any) => (
                  <Card key={course.id} className="hover:shadow-md transition duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {course.code}
                            </Badge>
                            {course.section && (
                              <Badge variant="secondary" className="text-xs">
                                Section {course.section}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-1" title={course.name}>
                            {course.name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                            {course.course_program && (
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {course.course_program}
                              </span>
                            )}
                            {course.year_level && (
                              <span>Year {course.year_level}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-center pl-4 border-l dark:border-gray-700 min-w-[80px]">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {course.student_count || 0}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Students</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
