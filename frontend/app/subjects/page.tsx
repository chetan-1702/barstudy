"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    createSubject,
    deleteSubject,
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSubjects();
    }, []);

    async function loadSubjects() {
        try {
            setLoading(true);
            setError(null);

            const data = await getSubjects();
            setSubjects(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load subjects.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSubject() {
        const name = window.prompt("Subject name:");

        if (!name?.trim()) {
            return;
        }

        const code = window.prompt("Subject code (optional):");

        try {
            setError(null);

            const newSubject = await createSubject({
                name: name.trim(),
                code: code?.trim() || undefined,
            });

            setSubjects((current) => [...current, newSubject]);
        } catch (err) {
            console.error(err);
            setError("Unable to create subject.");
        }
    }

    async function handleDeleteSubject(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this subject?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError(null);

            await deleteSubject(id);

            setSubjects((current) =>
                current.filter((subject) => subject.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete subject.");
        }
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

                        <button
                            onClick={handleAddSubject}
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#222750]"
                        >
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

                        {/* Error */}
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            <SummaryCard
                                label="Subjects"
                                value={loading ? "—" : String(subjects.length)}
                                detail="Currently enrolled"
                            />

                            <SummaryCard
                                label="Average progress"
                                value="—"
                                detail="Available once study tracking is connected"
                            />

                            <SummaryCard
                                label="Study this week"
                                value="—"
                                detail="Available once study sessions are connected"
                            />
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <p className="text-sm text-slate-500">
                                    Loading subjects...
                                </p>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && subjects.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <h2 className="font-semibold text-slate-800">
                                    No subjects yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Add your first Bar course subject to get started.
                                </p>

                                <button
                                    onClick={handleAddSubject}
                                    className="mt-5 rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                                >
                                    + Add subject
                                </button>
                            </div>
                        )}

                        {/* Subject cards */}
                        {!loading && subjects.length > 0 && (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {subjects.map((subject) => (
                                    <article
                                        key={subject.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                    >
                                        {/* Subject header */}
                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                                    {subject.code || "LAW"}
                                                </div>

                                                <div>
                                                    <h2 className="font-semibold">
                                                        {subject.name}
                                                    </h2>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Exam: Not set yet
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-bold">
                                                    —
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    progress
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mt-5">
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500"
                                                    style={{ width: "0%" }}
                                                />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="mt-6 grid grid-cols-3 gap-3">
                                            <Detail
                                                label="Exam"
                                                value="Not set"
                                            />

                                            <Detail
                                                label="Study"
                                                value="0h"
                                            />

                                            <Detail
                                                label="Topics"
                                                value="—"
                                            />
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                            <p className="text-xs text-slate-400">
                                                No tasks yet
                                            </p>

                                            <button
                                                onClick={() =>
                                                    handleDeleteSubject(subject.id)
                                                }
                                                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

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
