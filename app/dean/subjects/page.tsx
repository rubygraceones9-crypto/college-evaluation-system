'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { curriculum } from '@/data/curriculum';

type CurriculumProgram = keyof typeof curriculum;

export default function SubjectsPage() {
  const [program, setProgram] = useState<CurriculumProgram | ''>('');
  const [yearLevel, setYearLevel] = useState('');
  const [semester, setSemester] = useState('');

  const yearLevels = useMemo(() => {
    if (!program) return [];
    const programData = curriculum[program];
    if (!programData) return [];
    return Object.keys(programData).map(y => ({ value: y, label: y }));
  }, [program]);

  const semesters = useMemo(() => {
    if (!program || !yearLevel) return [];
    const programData = curriculum[program];
    if (!programData) return [];
    const yearData = programData[yearLevel as keyof typeof programData] as any;
    if (!yearData) return [];
    return Object.keys(yearData).map(s => ({ value: s, label: s }));
  }, [program, yearLevel]);

  const subjects = useMemo(() => {
    if (!program || !yearLevel || !semester) return [];
    const programData = curriculum[program];
    if (!programData) return [];
    const yearData = programData[yearLevel as keyof typeof programData] as any;
    if (!yearData) return [];
    return yearData[semester] || [];
  }, [program, yearLevel, semester]);

  // Flat list of all subjects for the selected program (when no filters)
  const allSubjectsForProgram = useMemo(() => {
    if (!program) return [];
    const programData = curriculum[program];
    if (!programData) return [];
    const all: { code: string; name: string; year: string; semester: string }[] = [];
    for (const [year, semesters] of Object.entries(programData)) {
      for (const [sem, subjectList] of Object.entries(semesters as any)) {
        for (const s of subjectList as any[]) {
          all.push({ ...s, year, semester: sem });
        }
      }
    }
    return all;
  }, [program]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse curriculum subjects by program, year level, and semester.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Subjects</CardTitle>
          <CardDescription>Select a program to view its curriculum subjects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Program"
              value={program}
              onChange={e => {
                setProgram(e.target.value as CurriculumProgram | '');
                setYearLevel('');
                setSemester('');
              }}
              options={[
                { value: 'BSIT', label: 'BSIT' },
                { value: 'BSEMC', label: 'BSEMC' },
              ]}
              placeholder="Select Program"
            />
            <Select
              label="Year Level"
              value={yearLevel}
              onChange={e => {
                setYearLevel(e.target.value);
                setSemester('');
              }}
              options={yearLevels}
              placeholder="All Years"
            />
            <Select
              label="Semester"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              options={semesters}
              placeholder="All Semesters"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subject Table */}
      {program && (
        <Card>
          <CardHeader>
            <CardTitle>
              {program} Subjects
              {yearLevel && ` — ${yearLevel}`}
              {semester && ` — ${semester}`}
            </CardTitle>
            <CardDescription>
              {semester
                ? `${subjects.length} subject${subjects.length !== 1 ? 's' : ''}`
                : `${allSubjectsForProgram.length} total subjects`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Code</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Subject Name</th>
                    {!semester && (
                      <>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Year</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Semester</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {semester ? (
                    subjects.length > 0 ? subjects.map((s: any) => (
                      <tr key={s.code}>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          <Badge variant="outline">{s.code}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.name}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No subjects found for this combination.
                        </td>
                      </tr>
                    )
                  ) : (
                    allSubjectsForProgram.length > 0 ? allSubjectsForProgram
                      .filter(s => !yearLevel || s.year === yearLevel)
                      .map((s) => (
                      <tr key={`${s.year}-${s.semester}-${s.code}`}>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          <Badge variant="outline">{s.code}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.year}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.semester}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          Select a program to view subjects.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!program && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
            Select a program above to browse its curriculum subjects.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
