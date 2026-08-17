"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    createSubject,
    deleteSubject,
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

import {
    getTasks,
    type Task,
} from "../../src/services/tasks";

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectCode, setNewSubjectCode] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [subjectsData, tasksData] = await Promise.all([
                getSubjects(),
                getTasks(),
            ]);

            setSubjects(subjectsData);
            setTasks(tasksData);
        } catch (err) {
            console.error(err);
            setError("Unable to load subjects.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSubject(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!newSubjectName.trim()) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const newSubject = await createSubject({
                name: newSubjectName.trim(),
                code: newSubjectCode.trim() || undefined,
            });

            setSubjects((current) => [
                ...current,
                newSubject,
            ]);

            setNewSubjectName("");
            setNewSubjectCode("");
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create subject.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteSubject(
        id: number,
        name: string
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${name}"?\n\nAny tasks associated with this subject will also be removed.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError(null);

            await deleteSubject(id);

            setSubjects((current) =>
                current.filter(
                    (subject) => subject.id !== id
                )
            );

            setTasks((current) =>
                current.filter(
                    (task) => task.subject_id !== id
                )
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete subject.");
        }
    }

    function getTaskCount(subjectId: number) {
        return tasks.filter(
            (task) => task.subject_id === subjectId
        ).length;
    }

    function getCompletedTaskCount(subjectId: number) {
        return tasks.filter(
            (task) =>
                task.subject_id === subjectId &&
                task.status.toLowerCase() === "completed"
        ).length;
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
                            <NavItem
                                href="/"
                                label="Dashboard"
                                icon="⌂"
                            />

                            <NavItem
                                href="/subjects"
                                label="Subjects"
                                icon="▤"
                                active
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

                    {/* Header */}
                    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">
                                Your course
                            </p>

                            <h2 className="text-xl font-semibold tracking-tight">
                                Subjects
                            </h2>
                        </div>

                        <button
                            onClick={() => {
                                setNewSubjectName("");
                                setNewSubjectCode("");
                                setShowAddModal(true);
                            }}
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
                                Track your preparation, study time,
                                tasks and upcoming assessments for
                                each subject.
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
                                value={
                                    loading
                                        ? "—"
                                        : String(subjects.length)
                                }
                                detail="Currently enrolled"
                            />

                            <SummaryCard
                                label="Tasks"
                                value={
                                    loading
                                        ? "—"
                                        : String(tasks.length)
                                }
                                detail="Across all subjects"
                            />

                            <SummaryCard
                                label="Completed"
                                value={
                                    loading
                                        ? "—"
                                        : String(
                                            tasks.filter(
                                                (task) =>
                                                    task.status
                                                        .toLowerCase() ===
                                                    "completed"
                                            ).length
                                        )
                                }
                                detail="Completed tasks"
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

                        {/* Empty */}
                        {!loading &&
                            subjects.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                                    <h2 className="font-semibold text-slate-800">
                                        No subjects yet
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Add your first Bar course
                                        subject to get started.
                                    </p>

                                    <button
                                        onClick={() =>
                                            setShowAddModal(true)
                                        }
                                        className="mt-5 rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                                    >
                                        + Add subject
                                    </button>

                                </div>
                            )}

                        {/* Subject cards */}
                        {!loading &&
                            subjects.length > 0 && (
                                <div className="grid gap-5 lg:grid-cols-2">

                                    {subjects.map((subject) => {
                                        const taskCount =
                                            getTaskCount(
                                                subject.id
                                            );

                                        const completedCount =
                                            getCompletedTaskCount(
                                                subject.id
                                            );

                                        const progress =
                                            taskCount > 0
                                                ? Math.round(
                                                    (completedCount /
                                                        taskCount) *
                                                    100
                                                )
                                                : 0;

                                        return (
                                            <Link
                                                key={subject.id}
                                                href={`/subjects/${subject.id}`}
                                                className="group block"
                                            >
                                                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition group-hover:border-indigo-200 group-hover:shadow-md">

                                                    {/* Header */}
                                                    <div className="flex items-start justify-between gap-4">

                                                        <div className="flex items-center gap-4">

                                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                                                {subject.code ||
                                                                    "LAW"}
                                                            </div>

                                                            <div>
                                                                <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                                                                    {
                                                                        subject.name
                                                                    }
                                                                </h2>

                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    Click to view subject
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-xl font-bold">
                                                                {progress}%
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
                                                                className="h-full rounded-full bg-indigo-500 transition-all"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
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
                                                            label="Tasks"
                                                            value={String(
                                                                taskCount
                                                            )}
                                                        />

                                                        <Detail
                                                            label="Completed"
                                                            value={`${completedCount}`}
                                                        />

                                                    </div>

                                                    {/* Footer */}
                                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                                                        <p className="text-xs text-slate-400">
                                                            {taskCount ===
                                                                0
                                                                ? "No tasks yet"
                                                                : `${taskCount} task${taskCount ===
                                                                    1
                                                                    ? ""
                                                                    : "s"
                                                                } associated`}
                                                        </p>

                                                        <div className="flex items-center gap-2">

                                                            <span className="text-xs font-medium text-indigo-600">
                                                                View subject →
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();

                                                                    handleDeleteSubject(
                                                                        subject.id,
                                                                        subject.name
                                                                    );
                                                                }}
                                                                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                </article>
                                            </Link>
                                        );
                                    })}

                                </div>
                            )}

                        {/* Future timetable */}
                        <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                                <div>
                                    <h2 className="font-semibold">
                                        Import your timetable
                                    </h2>

                                    <p className="mt-1 max-w-xl text-sm text-slate-500">
                                        Later, you&apos;ll be able to import
                                        your course timetable and automatically
                                        populate your subjects and study schedule.
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

            {/* Add Subject Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowAddModal(false);
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Add subject
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a subject to your Bar course workspace.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={handleAddSubject}
                            className="mt-6 space-y-5"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Subject name
                                </label>

                                <input
                                    autoFocus
                                    type="text"
                                    value={newSubjectName}
                                    onChange={(event) =>
                                        setNewSubjectName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Criminal Law"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Subject code
                                    <span className="ml-1 font-normal text-slate-400">
                                        (optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={newSubjectCode}
                                    onChange={(event) =>
                                        setNewSubjectCode(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. CRIM"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        !newSubjectName.trim()
                                    }
                                    className="rounded-xl bg-[#171b3a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#222750] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Adding..."
                                        : "Add subject"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
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
