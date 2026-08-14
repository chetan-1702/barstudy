"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getSubjects, type Subject } from "../src/services/subjects";
import {
  getStudySessions,
  type StudySession,
} from "../src/services/study-sessions";

interface Exam {
  id: number;
  subject_id: number;
  name: string;
  exam_date: string;
  exam_type: string | null;
  notes: string | null;
  created_at: string;
}

interface Task {
  id: number;
  title?: string;
  name?: string;
  status?: string;
}

interface Resource {
  id: number;
}

const API_URL = "http://localhost:8000";

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [
        subjectData,
        examResponse,
        taskResponse,
        sessionData,
      ] = await Promise.all([
        getSubjects(),
        fetch(`${API_URL}/api/exams`, {
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/tasks`, {
          cache: "no-store",
        }),
        getStudySessions(),
      ]);

      if (!examResponse.ok) {
        throw new Error("Failed to load exams");
      }

      if (!taskResponse.ok) {
        throw new Error("Failed to load tasks");
      }

      const examData = await examResponse.json();
      const taskData = await taskResponse.json();

      setSubjects(subjectData);
      setExams(examData);
      setTasks(taskData);
      setSessions(sessionData);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const upcomingExams = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return exams
      .filter((exam) => {
        const examDate = new Date(
          `${exam.exam_date}T00:00:00`
        );

        return examDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(
            `${a.exam_date}T00:00:00`
          ).getTime() -
          new Date(
            `${b.exam_date}T00:00:00`
          ).getTime()
      )
      .slice(0, 4);
  }, [exams]);

  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort(
        (a, b) =>
          new Date(b.session_date).getTime() -
          new Date(a.session_date).getTime()
      )
      .slice(0, 4);
  }, [sessions]);

  const totalStudyMinutes = useMemo(() => {
    return sessions.reduce(
      (total, session) =>
        total + session.duration_minutes,
      0
    );
  }, [sessions]);

  const totalStudyHours = Math.floor(
    totalStudyMinutes / 60
  );

  const remainingStudyMinutes =
    totalStudyMinutes % 60;

  function getSubjectName(subjectId: number) {
    return (
      subjects.find(
        (subject) => subject.id === subjectId
      )?.name || "Unknown subject"
    );
  }

  function daysUntil(date: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const examDate = new Date(
      `${date}T00:00:00`
    );

    const difference =
      examDate.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) {
      return `${remaining}m`;
    }

    if (remaining === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remaining}m`;
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-[#171b3a] text-white md:flex">

          <div className="border-b border-white/10 px-6 py-6">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#171b3a]">
                B
              </div>

              <div>
                <h1 className="text-lg font-semibold">
                  BarStudy
                </h1>

                <p className="text-xs text-slate-400">
                  Bar Course Hub
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Workspace
            </p>

            <div className="space-y-1">
              <NavItem
                href="/"
                label="Dashboard"
                icon="⌂"
                active
              />

              <NavItem
                href="/subjects"
                label="Subjects"
                icon="▤"
              />

              <NavItem
                href="/exams"
                label="Exams"
                icon="□"
              />

              <NavItem
                href="/study"
                label="Study Planner"
                icon="◷"
              />

              <NavItem
                href="/tasks"
                label="Tasks"
                icon="✓"
              />

              <NavItem
                href="/resources"
                label="Resources"
                icon="▱"
              />

              <NavItem
                href="/inn"
                label="Inn of Court"
                icon="⚖"
              />
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                C
              </div>

              <div>
                <p className="text-sm font-medium">
                  Chetan
                </p>

                <p className="text-xs text-slate-500">
                  Bar Course Student
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1">

          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">
                Overview
              </p>

              <h2 className="text-xl font-semibold">
                Dashboard
              </h2>
            </div>

            <Link
              href="/study"
              className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
            >
              + Log study session
            </Link>
          </header>

          <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

            {/* Welcome */}
            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                Your Bar Course
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Good afternoon
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Here's an overview of your subjects,
                exams, tasks and study activity.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                label="Subjects"
                value={
                  loading
                    ? "—"
                    : String(subjects.length)
                }
                href="/subjects"
              />

              <StatCard
                label="Upcoming exams"
                value={
                  loading
                    ? "—"
                    : String(upcomingExams.length)
                }
                href="/exams"
              />

              <StatCard
                label="Open tasks"
                value={
                  loading
                    ? "—"
                    : String(tasks.length)
                }
                href="/tasks"
              />

              <StatCard
                label="Study time"
                value={
                  loading
                    ? "—"
                    : `${totalStudyHours}h ${remainingStudyMinutes}m`
                }
                href="/study"
              />

            </div>

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Exams */}
              <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                  <div>
                    <h2 className="font-semibold">
                      Upcoming exams
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Your next assessments
                    </p>
                  </div>

                  <Link
                    href="/exams"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View all
                  </Link>

                </div>

                <div className="divide-y divide-slate-100">

                  {loading ? (
                    <div className="px-6 py-8 text-sm text-slate-500">
                      Loading exams...
                    </div>
                  ) : upcomingExams.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <p className="font-medium">
                        No upcoming exams
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add your next assessment to start
                        planning.
                      </p>
                    </div>
                  ) : (
                    upcomingExams.map((exam) => {
                      const days = daysUntil(
                        exam.exam_date
                      );

                      return (
                        <div
                          key={exam.id}
                          className="flex items-center gap-4 px-6 py-5"
                        >

                          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <span className="text-[10px] font-semibold uppercase">
                              {new Date(
                                `${exam.exam_date}T00:00:00`
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  month: "short",
                                }
                              )}
                            </span>

                            <span className="text-sm font-bold">
                              {new Date(
                                `${exam.exam_date}T00:00:00`
                              ).getDate()}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-sm font-semibold">
                              {exam.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {getSubjectName(
                                exam.subject_id
                              )}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-sm font-semibold">
                              {formatDate(
                                exam.exam_date
                              )}
                            </p>

                            <p
                              className={`mt-1 text-xs ${days <= 7
                                ? "font-semibold text-red-600"
                                : "text-slate-500"
                                }`}
                            >
                              {days === 0
                                ? "Today"
                                : days === 1
                                  ? "Tomorrow"
                                  : `${days} days`}
                            </p>

                          </div>

                        </div>
                      );
                    })
                  )}

                </div>
              </section>

              {/* Quick actions */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="font-semibold">
                  Quick actions
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your course
                </p>

                <div className="mt-5 space-y-3">

                  <QuickAction
                    href="/study"
                    label="Log study session"
                    description="Record revision time"
                    icon="◷"
                  />

                  <QuickAction
                    href="/tasks"
                    label="Add task"
                    description="Create something to do"
                    icon="✓"
                  />

                  <QuickAction
                    href="/exams"
                    label="Add exam"
                    description="Track an assessment"
                    icon="□"
                  />

                  <QuickAction
                    href="/resources"
                    label="Add resource"
                    description="Save course material"
                    icon="▱"
                  />

                </div>
              </section>

            </div>

            {/* Recent study */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>
                  <h2 className="font-semibold">
                    Recent study activity
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest revision sessions
                  </p>
                </div>

                <Link
                  href="/study"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View study planner
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="px-6 py-8 text-sm text-slate-500">
                    Loading study activity...
                  </div>
                ) : recentSessions.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="font-medium">
                      No study sessions yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your study activity will appear here.
                    </p>
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        ◷
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {session.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {getSubjectName(
                            session.subject_id
                          )}{" "}
                          ·{" "}
                          {formatDate(
                            session.session_date
                          )}
                        </p>

                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        {formatDuration(
                          session.duration_minutes
                        )}
                      </p>

                    </div>
                  ))
                )}

              </div>
            </section>

          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </Link>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
        ? "bg-white/10 text-white"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      <span className="flex w-5 justify-center text-base">
        {icon}
      </span>

      {label}
    </Link>
  );
}
