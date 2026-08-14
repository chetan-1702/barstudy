"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    createExam,
    deleteExam,
    getExams,
    type Exam,
} from "../../src/services/exams";

import {
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

export default function ExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [examDate, setExamDate] = useState("");
    const [examType, setExamType] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [examData, subjectData] = await Promise.all([
                getExams(),
                getSubjects(),
            ]);

            setExams(examData);
            setSubjects(subjectData);

            if (subjectData.length > 0) {
                setSubjectId(String(subjectData[0].id));
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load exams.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddExam(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim() || !subjectId || !examDate) {
            setError(
                "Please provide a subject, exam name and exam date."
            );
            return;
        }

        try {
            setError(null);

            const newExam = await createExam({
                subject_id: Number(subjectId),
                name: name.trim(),
                exam_date: examDate,
                exam_type: examType.trim() || undefined,
                notes: notes.trim() || undefined,
            });

            setExams((current) =>
                [...current, newExam].sort(
                    (a, b) =>
                        new Date(a.exam_date).getTime() -
                        new Date(b.exam_date).getTime()
                )
            );

            setName("");
            setExamDate("");
            setExamType("");
            setNotes("");
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create exam.");
        }
    }

    async function handleDeleteExam(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exam?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError(null);

            await deleteExam(id);

            setExams((current) =>
                current.filter((exam) => exam.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete exam.");
        }
    }

    function getSubjectName(subjectId: number) {
        return (
            subjects.find(
                (subject) => subject.id === subjectId
            )?.name || "Unknown subject"
        );
    }

    function getDaysUntil(date: string) {
        const today = new Date();
        const exam = new Date(date);

        today.setHours(0, 0, 0, 0);
        exam.setHours(0, 0, 0, 0);

        return Math.ceil(
            (exam.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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
                            <NavItem
                                href="/subjects"
                                label="Subjects"
                                icon="▤"
                            />
                            <NavItem
                                href="/exams"
                                label="Exams"
                                icon="□"
                                active
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

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    Chetan
                                </p>

                                <p className="truncate text-xs text-slate-500">
                                    Bar Course Student
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <section className="flex-1">

                    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">
                                Assessments
                            </p>

                            <h2 className="text-xl font-semibold tracking-tight">
                                Exams
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                setShowForm((current) => !current)
                            }
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#222750]"
                        >
                            {showForm
                                ? "Cancel"
                                : "+ Add exam"}
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Assessment schedule
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your exams
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Keep track of upcoming assessments and
                                how they fit into your study schedule.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Add exam */}
                        {showForm && (
                            <form
                                onSubmit={handleAddExam}
                                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold">
                                    Add an exam
                                </h2>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Subject
                                        </label>

                                        <select
                                            value={subjectId}
                                            onChange={(e) =>
                                                setSubjectId(
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        >
                                            {subjects.map(
                                                (subject) => (
                                                    <option
                                                        key={
                                                            subject.id
                                                        }
                                                        value={
                                                            subject.id
                                                        }
                                                    >
                                                        {
                                                            subject.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Exam name
                                        </label>

                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Criminal Law Final Examination"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Exam date
                                        </label>

                                        <input
                                            type="date"
                                            value={examDate}
                                            onChange={(e) =>
                                                setExamDate(
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Exam type
                                        </label>

                                        <input
                                            value={examType}
                                            onChange={(e) =>
                                                setExamType(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Written, oral, advocacy..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Notes
                                        </label>

                                        <textarea
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            placeholder="Optional notes..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Save exam
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <p className="text-sm text-slate-500">
                                    Loading exams...
                                </p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && exams.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <h2 className="font-semibold text-slate-800">
                                    No exams yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Add your first assessment to
                                    start building your exam schedule.
                                </p>
                            </div>
                        )}

                        {/* Exams */}
                        {!loading && exams.length > 0 && (
                            <div className="space-y-4">
                                {exams.map((exam) => {
                                    const days = getDaysUntil(
                                        exam.exam_date
                                    );

                                    const upcoming = days >= 0;

                                    return (
                                        <article
                                            key={exam.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                        □
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                                                            {getSubjectName(
                                                                exam.subject_id
                                                            )}
                                                        </p>

                                                        <h2 className="mt-1 text-lg font-semibold">
                                                            {exam.name}
                                                        </h2>

                                                        {exam.exam_type && (
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {
                                                                    exam.exam_type
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Exam date
                                                        </p>

                                                        <p className="mt-1 font-semibold">
                                                            {formatDate(
                                                                exam.exam_date
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Status
                                                        </p>

                                                        <p
                                                            className={`mt-1 font-semibold ${upcoming
                                                                ? "text-indigo-600"
                                                                : "text-slate-500"
                                                                }`}
                                                        >
                                                            {upcoming
                                                                ? days === 0
                                                                    ? "Today"
                                                                    : `${days} days`
                                                                : "Past"}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteExam(
                                                                exam.id
                                                            )
                                                        }
                                                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {exam.notes && (
                                                <div className="mt-5 border-t border-slate-100 pt-4">
                                                    <p className="text-sm text-slate-500">
                                                        {exam.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
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
