"use client";

import { useState } from "react";

const exams = [
  {
    subject: "Criminal Law",
    type: "Written Exam",
    date: "28 Aug 2026",
    days: 14,
    progress: 72,
  },
  {
    subject: "Civil Litigation",
    type: "Written Exam",
    date: "10 Sep 2026",
    days: 27,
    progress: 65,
  },
  {
    subject: "Evidence",
    type: "Written Exam",
    date: "18 Sep 2026",
    days: 35,
    progress: 50,
  },
];

const subjects = [
  { name: "Criminal Law", progress: 72, color: "bg-indigo-500" },
  { name: "Civil Litigation", progress: 65, color: "bg-violet-500" },
  { name: "Evidence", progress: 50, color: "bg-blue-500" },
  { name: "Professional Conduct", progress: 80, color: "bg-emerald-500" },
  { name: "Advocacy", progress: 60, color: "bg-amber-500" },
];

const initialTasks = [
  { id: 1, title: "Complete Criminal Law past paper", subject: "Criminal Law", done: false },
  { id: 2, title: "Review Evidence cases", subject: "Evidence", done: false },
  { id: 3, title: "Complete Civil Litigation notes", subject: "Civil Litigation", done: true },
  { id: 4, title: "Practice advocacy exercise", subject: "Advocacy", done: false },
];

const navItems = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Subjects", icon: "▤" },
  { label: "Exams", icon: "□" },
  { label: "Study Planner", icon: "◷" },
  { label: "Tasks", icon: "✓" },
  { label: "Resources", icon: "▱" },
  { label: "Inn of Court", icon: "⚖" },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [innRegistered, setInnRegistered] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);

  const completedTasks = tasks.filter((task) => task.done).length;

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-[#171b3a] text-white md:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#171b3a]">
                B
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">BarStudy</h1>
                <p className="text-xs text-slate-400">Bar Course Hub</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Workspace
            </p>

            <div className="space-y-1">
              {navItems.map((item) => {
                const active = activeNav === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveNav(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="flex w-5 justify-center text-base">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => setActiveNav("Settings")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <span>⚙</span>
              Settings
            </button>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                C
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Chetan</p>
                <p className="truncate text-xs text-slate-500">Bar Course Student</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Top bar */}
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">Friday, 14 August 2026</p>
              <h2 className="text-xl font-semibold tracking-tight">
                Good morning, Chetan
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 sm:block">
                Search
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                ♧
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171b3a] text-sm font-semibold text-white">
                C
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 p-6 lg:p-10">

            {/* Page title */}
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Your Bar Course
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Study overview
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of your exams, study progress and tasks.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Upcoming exams"
                value="5"
                detail="Next exam in 14 days"
                icon="□"
              />
              <StatCard
                label="Study hours"
                value="18.5h"
                detail="12% more than last week"
                icon="◷"
              />
              <StatCard
                label="Tasks"
                value={`${completedTasks}/${tasks.length}`}
                detail="Completed this week"
                icon="✓"
              />
              <StatCard
                label="Overall progress"
                value="64%"
                detail="Across all subjects"
                icon="↗"
              />
            </div>

            {/* Exams + weekly study */}
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

              {/* Exams */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Upcoming exams</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Your next assessments
                    </p>
                  </div>

                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View all
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {exams.map((exam) => (
                    <div key={exam.subject}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">{exam.subject}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {exam.type} · {exam.date}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {exam.days} days
                          </p>
                          <p className="text-xs text-slate-400">
                            {exam.progress}% prepared
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${exam.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weekly study */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Study this week</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      18.5 of 25 planned hours
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    74%
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex h-36 items-end justify-between gap-3">
                    {[2.5, 4, 3, 5, 4, 0, 0].map((hours, index) => {
                      const days = ["M", "T", "W", "T", "F", "S", "S"];

                      return (
                        <div
                          key={`${days[index]}-${index}`}
                          className="flex flex-1 flex-col items-center gap-2"
                        >
                          <div className="flex h-28 w-full items-end">
                            <div
                              className="w-full rounded-lg bg-indigo-100 transition-all"
                              style={{
                                height: `${Math.max(hours * 18, 8)}px`,
                              }}
                            >
                              {hours > 0 && (
                                <div
                                  className="w-full rounded-lg bg-indigo-500"
                                  style={{
                                    height: `${Math.max(hours * 18, 8)}px`,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            {days[index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>

            {/* Subject progress + Tasks */}
            <div className="grid gap-6 xl:grid-cols-2">

              {/* Subjects */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Subject progress</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Keep an eye on your preparation
                    </p>
                  </div>

                  <button className="text-sm font-medium text-indigo-600">
                    Subjects
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  {subjects.map((subject) => (
                    <div key={subject.name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {subject.name}
                        </span>
                        <span className="text-slate-400">
                          {subject.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${subject.color}`}
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tasks */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Today's tasks</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {completedTasks} of {tasks.length} completed
                    </p>
                  </div>

                  <button className="text-sm font-medium text-indigo-600">
                    View all
                  </button>
                </div>

                <div className="mt-5 divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-center gap-3 py-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${task.done
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-slate-300 bg-white text-transparent"
                          }`}
                      >
                        ✓
                      </span>

                      <div className="min-w-0">
                        <p
                          className={`text-sm ${task.done
                              ? "text-slate-400 line-through"
                              : "font-medium text-slate-700"
                            }`}
                        >
                          {task.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {task.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Inn */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">Inn of Court</h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${innRegistered
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {innRegistered ? "Registered" : "Not registered"}
                    </span>
                  </div>

                  {innRegistered ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Middle Temple · Your Inn information and activities are
                      available here.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      You haven't registered with an Inn yet. Information about
                      the Inns and registration will be shown here.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Registered
                  </span>

                  <button
                    onClick={() => setInnRegistered(!innRegistered)}
                    className={`relative h-7 w-12 rounded-full transition ${innRegistered ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    aria-label="Toggle Inn registration"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${innRegistered ? "left-6" : "left-1"
                        }`}
                    />
                  </button>
                </div>
              </div>

              {innRegistered && (
                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <InfoBox title="Inn" value="Middle Temple" />
                  <InfoBox title="Qualifying sessions" value="4 completed" />
                  <InfoBox title="Upcoming" value="1 session" />
                </div>
              )}

              {!innRegistered && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  You can enable this section when you register with an Inn.
                  Your Inn-specific information will then appear here.
                </div>
              )}
            </section>

            <p className="pb-4 text-center text-xs text-slate-400">
              BarStudy · Your Bar Course Study Hub
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-sm text-indigo-600">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
