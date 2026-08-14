"use client";

import { useState } from "react";
import Link from "next/link";

type Exam = {
    id: number;
    subject: string;
    type: string;
    date: string;
    progress: number;
};

const initialExams: Exam[] = [
    {
        id: 1,
        subject: "Criminal Law",
        type: "Written Exam",
        date: "2026-08-28",
        progress: 72,
    },
    {
        id: 2,
        subject: "Civil Litigation",
        type: "Written Exam",
        date: "2026-09-10",
        progress: 65,
    },
    {
        id: 3,
        subject: "Evidence",
        type: "Written Exam",
        date: "2026-09-18",
        progress: 50,
    },
    {
        id: 4,
        subject: "Professional Conduct",
        type: "Written Exam",
        date: "2026-09-25",
        progress: 80,
    },
    {
        id: 5,
        subject: "Advocacy",
        type: "Practical Assessment",
        date: "2026-10-02",
        progress: 60,
    },
];

function daysUntil(date: string) {
    const today = new Date("2026-08-14");
    const examDate = new Date(date);

    return Math.ceil(
        (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ExamsPage() {
    const [exams, setExams] = useState(initialExams);
    const [filter, setFilter] = useState<"all" | "upcoming">("all");
    const [showForm, setShowForm] = useState(false);

    const [subject, setSubject] = useState("");
    const [type, setType] = useState("Written Exam");
    const [date, setDate] = useState("");

    const visibleExams =
        filter === "upcoming"
            ? exams.filter((exam) => daysUntil(exam.date) >= 0)
            : exams;

    function addExam(e: React.FormEvent) {
        e.preventDefault();

        if (!subject || !date) return;

        setExams((current) => [
            ...current,
            {
                id: Date.now(),
                subject,
                type,
                date,
                progress: 0,
            },
        ]);

        setSubject("");
        setDate("");
        setType("Written Exam");
        setShowForm(false);
    }

    function deleteExam(id: number) {
        setExams((current) => current.filter((exam) => exam.id !== id));
    }

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
                                <h1 className="text-lg font-semibold">BarStudy</h1>
                                <p className="text-xs text-slate-400">Bar Course Hub</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-6">
                        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                            Workspace
                        </p>

                        <div className="space-y-1">
                            <NavItem href="/" label="Dashboard" icon="⌂" />
                            <NavItem href="/subjects" label="Subjects" icon="▤" />
                            <NavItem href="/exams" label="Exams" icon="□" active />
                            <NavItem href="/study" label="Study Planner" icon="◷" />
                            <NavItem href="/tasks" label="Tasks" icon="✓" />
                            <NavItem href="/resources" label="Resources" icon="▱" />
                            <NavItem href="/inn" label="Inn of Court" icon="⚖" />
                        </div>
                    </nav>
                </aside>

                {/* Main */}
                <section className="flex-1">
                    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">Your course</p>
                            <h2 className="text-xl font-semibold">Exams</h2>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            + Add exam
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Assessment tracking
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your exams
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Keep your assessment dates and preparation progress in one
                                place.
                            </p>
                        </div>

                        {/* Add exam form */}
                        {showForm && (
                            <form
                                onSubmit={addExam}
                                className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="font-semibold">Add an exam</h2>

                                <div className="mt-5 grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Subject
                                        </label>

                                        <input
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Contract Law"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Assessment type
                                        </label>

                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option>Written Exam</option>
                                            <option>Practical Assessment</option>
                                            <option>Oral Assessment</option>
                                            <option>Mock Exam</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Exam date
                                        </label>

                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Add exam
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Filters */}
                        <div className="mb-5 flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${filter === "all"
                                    ? "bg-[#171b3a] text-white"
                                    : "bg-white text-slate-500"
                                    }`}
                            >
                                All exams
                            </button>

                            <button
                                onClick={() => setFilter("upcoming")}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${filter === "upcoming"
                                    ? "bg-[#171b3a] text-white"
                                    : "bg-white text-slate-500"
                                    }`}
                            >
                                Upcoming
                            </button>
                        </div>

                        {/* Exams */}
                        <div className="space-y-4">
                            {visibleExams.map((exam) => {
                                const days = daysUntil(exam.date);

                                return (
                                    <article
                                        key={exam.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    □
                                                </div>

                                                <div>
                                                    <h2 className="font-semibold">
                                                        {exam.subject}
                                                    </h2>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {exam.type} · {formatDate(exam.date)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p
                                                        className={`text-xl font-bold ${days <= 14
                                                            ? "text-rose-500"
                                                            : "text-slate-900"
                                                            }`}
                                                    >
                                                        {days >= 0 ? `${days} days` : "Past"}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {days >= 0 ? "remaining" : "completed"}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => deleteExam(exam.id)}
                                                    className="text-xs text-slate-400 hover:text-rose-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-2 flex justify-between text-xs">
                                                <span className="text-slate-500">
                                                    Preparation
                                                </span>

                                                <span className="font-medium text-slate-700">
                                                    {exam.progress}%
                                                </span>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500"
                                                    style={{ width: `${exam.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {visibleExams.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <p className="font-medium">No exams found</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Add an exam to start tracking it.
                                </p>
                            </div>
                        )}
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span className="flex w-5 justify-center">{icon}</span>
            {label}
        </Link>
    );
}
