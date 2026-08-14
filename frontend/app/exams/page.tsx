"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = "http://localhost:8000";

interface Exam {
  id: number;
  subject_id: number;
  name: string;
  exam_date: string;
  exam_type: string | null;
  notes: string | null;
  created_at: string;
}

interface Subject {
  id: number;
  name: string;
  code: string | null;
}

interface Task {
  id: number;
  title?: string;
  name?: string;
  status?: string;
  completed?: boolean;
}

interface StudySession {
  id: number;
  subject_id: number;
  title: string;
  session_date: string;
  duration_minutes: number;
  notes?: string | null;
}

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id;

  const [exam, setExam] = useState<Exam | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) return;

    loadExam();
  }, [examId]);

  async function loadExam() {
    try {
      setLoading(true);
      setError("");

      const examResponse = await fetch(
        `${API_URL}/api/exams/${examId}`,
        {
          cache: "no-store",
        }
      );

      if (!examResponse.ok) {
        throw new Error("Exam not found");
      }

      const examData: Exam =
        await examResponse.json();

      setExam(examData);

      const [
        subjectResponse,
        tasksResponse,
        sessionsResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/subjects/${examData.subject_id}`,
          {
            cache: "no-store",
          }
        ),

        fetch(`${API_URL}/api/tasks`, {
          cache: "no-store",
        }),

        fetch(`${API_URL}/api/study-sessions`, {
          cache: "no-store",
        }),
      ]);

      if (subjectResponse.ok) {
        setSubject(await subjectResponse.json());
      }

      if (tasksResponse.ok) {
        const taskData = await tasksResponse.json();

        setTasks(
          taskData.filter(
            (task: Task) =>
              task.subject_id ===
              examData.subject_id
          )
        );
      }

      if (sessionsResponse.ok) {
        const sessionData =
          await sessionsResponse.json();

        setSessions(
          sessionData.filter(
            (session: StudySession) =>
              session.subject_id ===
              examData.subject_id
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load this exam.");
    } finally {
      setLoading(false);
    }
  }

  const totalStudyMinutes = useMemo(() => {
    return sessions.reduce(
      (total, session) =>
        total + session.duration_minutes,
      0
    );
  }, [sessions]);

  const completedTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.completed === true ||
        task.status?.toLowerCase() === "completed"
    ).length;
  }, [tasks]);

  const daysRemaining = useMemo(() => {
    if (!exam) return 0;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const examDate = new Date(
      `${exam.exam_date}T00:00:00`
    );

    return Math.ceil(
      (examDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [exam]);

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] p-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-slate-500">
            Loading exam...
          </p>
        </div>
      </main>
    );
  }

  if (error || !exam) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] p-10">
        <div className="mx-auto max-w-5xl">

          <Link
            href="/exams"
            className="text-sm text-indigo-600"
          >
            ← Back to exams
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error || "Exam not found."}
            </p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">

          <Link
            href="/exams"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to exams
          </Link>

          <div className="mt-6">

            <p className="text-sm font-medium text-indigo-600">
              {subject?.name || "Subject"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {exam.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {formatDate(exam.exam_date)}
              {exam.exam_type
                ? ` · ${exam.exam_type}`
                : ""}
            </p>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Countdown */}
        <section className="rounded-2xl bg-[#171b3a] p-6 text-white shadow-sm">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-slate-300">
                Time remaining
              </p>

              <p className="mt-1 text-3xl font-bold">
                {daysRemaining < 0
                  ? "Exam passed"
                  : daysRemaining === 0
                  ? "Today"
                  : daysRemaining === 1
                  ? "1 day"
                  : `${daysRemaining} days`}
              </p>
            </div>

            <div className="flex gap-3">

              <Link
                href={`/tasks?subject=${exam.subject_id}`}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/20"
              >
                Add task
              </Link>

              <Link
                href={`/study?subject=${exam.subject_id}`}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#171b3a] hover:bg-slate-100"
              >
                Log study
              </Link>

            </div>

          </div>

        </section>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <StatCard
            label="Study time"
            value={formatDuration(
              totalStudyMinutes
            )}
          />

          <StatCard
            label="Tasks"
            value={`${completedTasks}/${tasks.length}`}
          />

          <StatCard
            label="Study sessions"
            value={String(sessions.length)}
          />

        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Tasks */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="font-semibold">
                  Study tasks
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Tasks related to {subject?.name}
                </p>
              </div>

              <Link
                href={`/tasks?subject=${exam.subject_id}`}
                className="text-sm font-medium text-indigo-600"
              >
                Add
              </Link>

            </div>

            <div className="divide-y divide-slate-100">

              {tasks.length === 0 ? (
                <div className="px-6 py-10 text-center">

                  <p className="font-medium">
                    No tasks yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add study tasks to plan your
                    preparation.
                  </p>

                </div>
              ) : (
                tasks.map((task) => {

                  const completed =
                    task.completed === true ||
                    task.status?.toLowerCase() ===
                      "completed";

                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-6 py-4"
                    >

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          completed
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {completed && (
                          <span className="text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-sm ${
                          completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {task.title ||
                          task.name ||
                          "Untitled task"}
                      </span>

                    </div>
                  );
                })
              )}

            </div>

          </section>

          {/* Study sessions */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="font-semibold">
                  Recent study
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your latest preparation
                </p>
              </div>

              <Link
                href={`/study?subject=${exam.subject_id}`}
                className="text-sm font-medium text-indigo-600"
              >
                Log study
              </Link>

            </div>

            <div className="divide-y divide-slate-100">

              {sessions.length === 0 ? (
                <div className="px-6 py-10 text-center">

                  <p className="font-medium">
                    No study sessions yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Start recording your revision.
                  </p>

                </div>
              ) : (
                sessions
                  .slice(0, 5)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        ◷
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {session.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            session.session_date
                          ).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>

                      </div>

                      <p className="text-sm font-semibold">
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

        {/* Notes */}
        {exam.notes && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-semibold">
              Exam notes
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {exam.notes}
            </p>

          </section>
        )}

      </div>

    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}
