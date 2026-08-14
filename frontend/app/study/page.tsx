"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    createStudySession,
    deleteStudySession,
    getStudySessions,
    type StudySession,
} from "../../src/services/study-sessions";

import {
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

export default function StudyPage() {
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [sessionDate, setSessionDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [sessionData, subjectData] =
                await Promise.all([
                    getStudySessions(),
                    getSubjects(),
                ]);

            setSessions(sessionData);
            setSubjects(subjectData);

            if (subjectData.length > 0) {
                setSubjectId(String(subjectData[0].id));
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load study sessions.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSession(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !title.trim() ||
            !subjectId ||
            !sessionDate ||
            !duration
        ) {
            setError(
                "Please provide a subject, title, date and duration."
            );
            return;
        }

        const durationMinutes = Number(duration);

        if (durationMinutes <= 0) {
            setError("Duration must be greater than zero.");
            return;
        }

        try {
            setError(null);

            const newSession = await createStudySession({
                subject_id: Number(subjectId),
                title: title.trim(),
                session_date: sessionDate,
                duration_minutes: durationMinutes,
                notes: notes.trim() || undefined,
            });

            setSessions((current) => [
                newSession,
                ...current,
            ]);

            setTitle("");
            setDuration("");
            setNotes("");
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create study session.");
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Delete this study session?")) {
            return;
        }

        try {
            setError(null);

            await deleteStudySession(id);

            setSessions((current) =>
                current.filter((session) => session.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete study session.");
        }
    }

    function getSubjectName(subjectId: number) {
        return (
            subjects.find(
                (subject) => subject.id === subjectId
            )?.name || "Unknown subject"
        );
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatDuration(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes}m`;
        }

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    }

    const totalMinutes = useMemo(
        () =>
            sessions.reduce(
                (total, session) =>
                    total + session.duration_minutes,
                0
            ),
        [sessions]
    );

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

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
                                active
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

                {/* Main */}
                <section className="flex-1">

                    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">
                                Study management
                            </p>

                            <h2 className="text-xl font-semibold">
                                Study Planner
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                setShowForm((current) => !current)
                            }
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            {showForm ? "Cancel" : "+ Log study session"}
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Study activity
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your study sessions
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Keep a record of your revision and see how
                                much time you are putting into your studies.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="mb-8 grid gap-4 md:grid-cols-3">

                            <StatCard
                                label="Total study time"
                                value={`${totalHours}h ${remainingMinutes}m`}
                            />

                            <StatCard
                                label="Study sessions"
                                value={String(sessions.length)}
                            />

                            <StatCard
                                label="Average session"
                                value={
                                    sessions.length > 0
                                        ? formatDuration(
                                            Math.round(
                                                totalMinutes /
                                                sessions.length
                                            )
                                        )
                                        : "0m"
                                }
                            />

                        </div>

                        {/* Add session */}
                        {showForm && (
                            <form
                                onSubmit={handleAddSession}
                                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold">
                                    Log a study session
                                </h2>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Subject
                                        </label>

                                        <select
                                            value={subjectId}
                                            onChange={(e) =>
                                                setSubjectId(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        >
                                            {subjects.map((subject) => (
                                                <option
                                                    key={subject.id}
                                                    value={subject.id}
                                                >
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Session title
                                        </label>

                                        <input
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Criminal Law revision"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Date
                                        </label>

                                        <input
                                            type="date"
                                            value={sessionDate}
                                            onChange={(e) =>
                                                setSessionDate(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Duration (minutes)
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={duration}
                                            onChange={(e) =>
                                                setDuration(e.target.value)
                                            }
                                            placeholder="90"
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
                                                setNotes(e.target.value)
                                            }
                                            rows={3}
                                            placeholder="What did you study?"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Save session
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Sessions */}
                        {loading ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <p className="text-sm text-slate-500">
                                    Loading study sessions...
                                </p>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <h2 className="font-semibold">
                                    No study sessions yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Log your first study session to start
                                    tracking your progress.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sessions.map((session) => (
                                    <article
                                        key={session.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-start gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                ◷
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold">
                                                        {session.title}
                                                    </h3>

                                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                                        {getSubjectName(
                                                            session.subject_id
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {formatDate(
                                                        session.session_date
                                                    )}
                                                </p>

                                                {session.notes && (
                                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                                        {session.notes}
                                                    </p>
                                                )}

                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold text-slate-800">
                                                    {formatDuration(
                                                        session.duration_minutes
                                                    )}
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(session.id)
                                                    }
                                                    className="mt-2 text-xs font-medium text-slate-400 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                    </div>
                </section>
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
