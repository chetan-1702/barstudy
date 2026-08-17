"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    getSubjects,
    type Subject,
} from "../../../src/services/subjects";

import {
    getTasks,
    type Task,
} from "../../../src/services/tasks";

export default function SubjectDetailPage() {
    const params = useParams();

    const subjectId = Number(params.id);

    const [subject, setSubject] = useState<Subject | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [subjectId]);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [subjects, allTasks] = await Promise.all([
                getSubjects(),
                getTasks(),
            ]);

            const currentSubject = subjects.find(
                (item) => item.id === subjectId
            );

            if (!currentSubject) {
                setError("Subject not found.");
                return;
            }

            setSubject(currentSubject);

            setTasks(
                allTasks.filter(
                    (task) =>
                        task.subject_id === subjectId
                )
            );
        } catch (err) {
            console.error(err);
            setError("Unable to load subject.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f6f7fb] p-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm text-slate-500">
                        Loading subject...
                    </p>
                </div>
            </main>
        );
    }

    if (!subject) {
        return (
            <main className="min-h-screen bg-[#f6f7fb] p-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm text-red-600">
                        {error || "Subject not found."}
                    </p>

                    <Link
                        href="/subjects"
                        className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
                    >
                        ← Back to subjects
                    </Link>
                </div>
            </main>
        );
    }

    const completedTasks = tasks.filter(
        (task) =>
            task.status.toLowerCase() ===
            "completed"
    );

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
            <div className="mx-auto max-w-6xl p-6 lg:p-10">

                <Link
                    href="/subjects"
                    className="text-sm text-slate-500 hover:text-slate-900"
                >
                    ← Back to subjects
                </Link>

                {/* Header */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                                {subject.code || "LAW"}
                            </div>

                            <div>
                                <p className="text-sm text-indigo-600">
                                    Subject
                                </p>

                                <h1 className="mt-1 text-2xl font-bold">
                                    {subject.name}
                                </h1>

                                {subject.code && (
                                    <p className="mt-1 text-sm text-slate-400">
                                        {subject.code}
                                    </p>
                                )}
                            </div>

                        </div>

                        <Link
                            href="/tasks"
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            View all tasks
                        </Link>

                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">

                        <Stat
                            label="Tasks"
                            value={String(tasks.length)}
                        />

                        <Stat
                            label="Completed"
                            value={String(
                                completedTasks.length
                            )}
                        />

                        <Stat
                            label="Remaining"
                            value={String(
                                tasks.length -
                                completedTasks.length
                            )}
                        />

                    </div>
                </div>

                {/* Tasks */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">
                        <h2 className="font-semibold">
                            Subject tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Tasks associated with {subject.name}.
                        </p>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-sm text-slate-500">
                                No tasks have been associated
                                with this subject yet.
                            </p>

                            <Link
                                href="/tasks"
                                className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                            >
                                Go to Tasks →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <h3 className="font-medium text-slate-900">
                                                {task.title}
                                            </h3>

                                            {task.description && (
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">

                                                {task.due_date && (
                                                    <span>
                                                        Due{" "}
                                                        {
                                                            task.due_date
                                                        }
                                                    </span>
                                                )}

                                                <span>
                                                    ·
                                                </span>

                                                <span>
                                                    {
                                                        task.priority
                                                    }
                                                </span>

                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${task.status.toLowerCase() ===
                                                "completed"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {task.status}
                                        </span>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold">
                {value}
            </p>
        </div>
    );
}
