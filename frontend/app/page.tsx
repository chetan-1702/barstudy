"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "../src/components/layout/AppShell";

import {
  getSubjects,
  type Subject,
} from "../src/services/subjects";

import {
  getStudySessions,
  type StudySession,
} from "../src/services/study-sessions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  subject_id?: number;
  title?: string;
  name?: string;
  due_date?: string | null;
  priority?: string;
  status?: string;
}

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
      .sort((a, b) => {
        return (
          new Date(
            `${a.exam_date}T00:00:00`
          ).getTime() -
          new Date(
            `${b.exam_date}T00:00:00`
          ).getTime()
        );
      })
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

  const activeTasks = useMemo(() => {
    return tasks.filter((task) => {
      const status = task.status?.toLowerCase();

      return (
        status !== "completed" &&
        status !== "done" &&
        status !== "cancelled"
      );
    });
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...activeTasks]
      .filter((task) => task.due_date)
      .sort((a, b) => {
        return (
          new Date(a.due_date as string).getTime() -
          new Date(b.due_date as string).getTime()
        );
      })
      .slice(0, 5);
  }, [activeTasks]);

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

    const target = new Date(
      `${date}T00:00:00`
    );

    const difference =
      target.getTime() - today.getTime();

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
      year: "numeric",
    });
  }

  function formatSessionDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  function formatTaskDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Bar Course Hub
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Keep track of your exams, tasks and study
                progress.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/study"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Study Planner
              </Link>

              <Link
                href="/resources"
                className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
              >
                Resources
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Summary cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              label="Subjects"
              value={
                loading
                  ? "—"
                  : String(subjects.length)
              }
              detail="Active course subjects"
            />

            <SummaryCard
              label="Upcoming exams"
              value={
                loading
                  ? "—"
                  : String(upcomingExams.length)
              }
              detail="Next assessments"
            />

            <SummaryCard
              label="Active tasks"
              value={
                loading
                  ? "—"
                  : String(activeTasks.length)
              }
              detail="Tasks still to complete"
            />

            <SummaryCard
              label="Study time"
              value={
                loading
                  ? "—"
                  : `${totalStudyHours}h ${remainingStudyMinutes}m`
              }
              detail="Recorded study sessions"
            />

          </div>

          {/* Main grid */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Upcoming exams */}
            <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>
                  <h2 className="font-semibold">
                    Upcoming Exams
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your next assessments
                  </p>
                </div>

                <Link
                  href="/exams"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all →
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="p-6 text-sm text-slate-500">
                    Loading exams...
                  </div>
                ) : upcomingExams.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">
                    No upcoming exams recorded.
                  </div>
                ) : (
                  upcomingExams.map((exam) => {
                    const days = daysUntil(
                      exam.exam_date
                    );

                    return (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between gap-4 px-6 py-5"
                      >

                        <div className="min-w-0">

                          <p className="font-medium text-slate-900">
                            {exam.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {getSubjectName(
                              exam.subject_id
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(
                              exam.exam_date
                            )}
                          </p>

                        </div>

                        <div className="shrink-0 text-right">

                          <p className="text-lg font-bold text-slate-900">
                            {days}
                          </p>

                          <p className="text-xs text-slate-400">
                            {days === 1
                              ? "day"
                              : "days"}{" "}
                            remaining
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
                Study Workspace
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access the tools you need.
              </p>

              <div className="mt-5 space-y-3">

                <QuickAction
                  href="/subjects"
                  icon="📚"
                  title="Subjects"
                  description="Manage your areas of study"
                />

                <QuickAction
                  href="/resources"
                  icon="📄"
                  title="Resources"
                  description="Access your study materials"
                />

                <QuickAction
                  href="/study"
                  icon="⏱"
                  title="Study Sessions"
                  description="Track your study activity"
                />

                <QuickAction
                  href="/tasks"
                  icon="✓"
                  title="Tasks"
                  description="Review your outstanding work"
                />

              </div>

            </section>

          </div>

          {/* Lower grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Recent study */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>
                  <h2 className="font-semibold">
                    Recent Study Sessions
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest recorded study activity
                  </p>
                </div>

                <Link
                  href="/study"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all →
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="p-6 text-sm text-slate-500">
                    Loading study sessions...
                  </div>
                ) : recentSessions.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">
                    No study sessions recorded yet.
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between gap-4 px-6 py-5"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium text-slate-900">
                          {session.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {getSubjectName(
                            session.subject_id
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatSessionDate(
                            session.session_date
                          )}
                        </p>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="font-semibold text-slate-900">
                          {session.duration_minutes}m
                        </p>

                        <p className="text-xs text-slate-400">
                          study time
                        </p>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </section>

            {/* Tasks */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>
                  <h2 className="font-semibold">
                    Tasks
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Upcoming work
                  </p>
                </div>

                <Link
                  href="/tasks"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all →
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="p-6 text-sm text-slate-500">
                    Loading tasks...
                  </div>
                ) : upcomingTasks.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">
                    No upcoming tasks.
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4 px-6 py-5"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium text-slate-900">
                          {task.title ||
                            task.name ||
                            "Untitled task"}
                        </p>

                        {task.subject_id && (
                          <p className="mt-1 text-xs text-slate-500">
                            {getSubjectName(
                              task.subject_id
                            )}
                          </p>
                        )}

                        {task.priority && (
                          <p className="mt-1 text-xs text-slate-400">
                            Priority:{" "}
                            {task.priority}
                          </p>
                        )}

                      </div>

                      {task.due_date && (
                        <div className="shrink-0 text-right">

                          <p className="font-semibold text-slate-900">
                            {formatTaskDate(
                              task.due_date
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            due date
                          </p>

                        </div>
                      )}

                    </div>
                  ))
                )}

              </div>

            </section>

          </div>

          {/* Preparation overview */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <h2 className="font-semibold">
                  Preparation Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep building your study history as you
                  prepare for your assessments.
                </p>
              </div>

              <div className="flex gap-2">

                <Link
                  href="/exams"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Exams
                </Link>

                <Link
                  href="/tasks"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Tasks
                </Link>

                <Link
                  href="/resources"
                  className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                >
                  Resources
                </Link>

              </div>

            </div>

          </section>

        </div>
      </main>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {detail}
      </p>

    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>

    </Link>
  );
}
