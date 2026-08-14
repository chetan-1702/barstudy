"use client";

import Link from "next/link";

const subjects = [
    {
        name: "Criminal Law",
        code: "CRIM",
        exam: "28 Aug 2026",
        days: 14,
        progress: 72,
        hours: "6.5h",
        topics: "12 / 17",
        tasks: 4,
    },
    {
        name: "Civil Litigation",
        code: "CIVIL",
        exam: "10 Sep 2026",
        days: 27,
        progress: 65,
        hours: "4.5h",
        topics: "9 / 14",
        tasks: 3,
    },
    {
        name: "Evidence",
        code: "EVID",
        exam: "18 Sep 2026",
        days: 35,
        progress: 50,
        hours: "3.5h",
        topics: "7 / 14",
        tasks: 5,
    },
    {
        name: "Professional Conduct",
        code: "PROF",
        exam: "25 Sep 2026",
        days: 42,
        progress: 80,
        hours: "2.0h",
        topics: "16 / 20",
        tasks: 2,
    },
    {
        name: "Advocacy",
        code: "ADV",
        exam: "2 Oct 2026",
        days: 49,
        progress: 60,
        hours: "2.0h",
        topics: "6 / 10",
        tasks: 3,
    },
];

export default function SubjectsPage() {
    return (
        <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <aside className="hidden w-64 flex-col bg-[#171b3a] text-white md:flex">
                    <div className="border-b border-white/10 px-6 py-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#171b3a]">
                                B
                            </div>

                            <div>
                                <h1 className="text-lg font-semibold tracking-tight">
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
                            <NavItem href="/" label="Dashboard" icon="⌂" />
                            <NavItem href="/subjects" label="Subjects" icon="▤" active />
                            <NavItem href="/exams" label="Exams" icon="□" />
                            <NavItem href="/study" label="Study Planner" icon="◷" />
                            <NavItem href="/tasks" label="Tasks" icon="✓" />
                            <NavItem href="/resources" label="Resources" icon="▱" />
                            <NavItem href="/inn" label="Inn of Court" icon="⚖" />
                        </div>
                    </nav>

                    <div className="border-t border-white/10 p-4">
                        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                                C
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">Chetan</p>
                                <p className="truncate text-xs text-slate-500">
                                    Bar Course Student
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section className="flex-1">

                    {/* Header */}
                    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">
                                Your course
                            </p>

                            <h2 className="text-xl font-semibold tracking-tight">
                                Subjects
                            </h2>
                        </div>

                        <button className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#222750]">
                            + Add subject
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

                        {/* Intro */}
                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Course overview
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your subjects
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Track your preparation, study time, topics and upcoming
                                assessments for each subject.
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            <SummaryCard
                                label="Subjects"
                                value="5"
                                detail="Currently enrolled"
                            />

                            <SummaryCard
                                label="Average progress"
                                value="65%"
                                detail="Across all subjects"
                            />

                            <SummaryCard
                                label="Study this week"
                                value="18.5h"
                                detail="Across all subjects"
                            />
                        </div>

                        {/* Subject cards */}
                        <div className="grid gap-5 lg:grid-cols-2">

                            {subjects.map((subject) => (
                                <article
                                    key={subject.code}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                >

                                    {/* Subject header */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                                {subject.code}
                                            </div>

                                            <div>
                                                <h2 className="font-semibold">
                                                    {subject.name}
                                                </h2>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Exam: {subject.exam}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold">
                                                {subject.progress}%
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                prepared
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-5">
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-indigo-500"
                                                style={{ width: `${subject.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-6 grid grid-cols-3 gap-3">

                                        <Detail
                                            label="Exam"
                                            value={`${subject.days} days`}
                                        />

                                        <Detail
                                            label="Study"
                                            value={subject.hours}
                                        />

                                        <Detail
                                            label="Topics"
                                            value={subject.topics}
                                        />

                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                                        <p className="text-xs text-slate-400">
                                            {subject.tasks} active tasks
                                        </p>

                                        <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                                            Open subject →
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>

                        {/* Future import */}
                        <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">

                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                                <div>
                                    <h2 className="font-semibold">
                                        Import your timetable
                                    </h2>

                                    <p className="mt-1 max-w-xl text-sm text-slate-500">
                                        Later, you&apos;ll be able to import your course timetable
                                        and automatically populate your subjects and study
                                        schedule.
                                    </p>
                                </div>

                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400"
                                >
                                    Coming later
                                </button>

                            </div>

                        </section>

                    </div>
                </section>
            </div>
        </main>
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

function Detail({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
}
