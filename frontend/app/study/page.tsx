"use client";

import { useState } from "react";
import Link from "next/link";

type StudySession = {
    id: number;
    day: string;
    date: string;
    subject: string;
    topic: string;
    duration: number;
    completed: boolean;
};

const initialSessions: StudySession[] = [
    {
        id: 1,
        day: "Mon",
        date: "17 Aug",
        subject: "Criminal Law",
        topic: "Homicide",
        duration: 2,
        completed: true,
    },
    {
        id: 2,
        day: "Tue",
        date: "18 Aug",
        subject: "Evidence",
        topic: "Admissibility",
        duration: 2,
        completed: false,
    },
    {
        id: 3,
        day: "Wed",
        date: "19 Aug",
        subject: "Civil Litigation",
        topic: "Pre-action Protocols",
        duration: 2.5,
        completed: false,
    },
    {
        id: 4,
        day: "Thu",
        date: "20 Aug",
        subject: "Criminal Law",
        topic: "Defences",
        duration: 2,
        completed: false,
    },
    {
        id: 5,
        day: "Fri",
        date: "21 Aug",
        subject: "Advocacy",
        topic: "Opening submissions",
        duration: 1.5,
        completed: false,
    },
];

const days = [
    { day: "Mon", date: "17 Aug" },
    { day: "Tue", date: "18 Aug" },
    { day: "Wed", date: "19 Aug" },
    { day: "Thu", date: "20 Aug" },
    { day: "Fri", date: "21 Aug" },
    { day: "Sat", date: "22 Aug" },
    { day: "Sun", date: "23 Aug" },
];

export default function StudyPage() {
    const [sessions, setSessions] = useState(initialSessions);
    const [showForm, setShowForm] = useState(false);

    const [day, setDay] = useState("Mon");
    const [subject, setSubject] = useState("Criminal Law");
    const [topic, setTopic] = useState("");
    const [duration, setDuration] = useState("2");

    const plannedHours = sessions.reduce(
        (total, session) => total + session.duration,
        0
    );

    const completedHours = sessions
        .filter((session) => session.completed)
        .reduce((total, session) => total + session.duration, 0);

    function addSession(e: React.FormEvent) {
        e.preventDefault();

        if (!topic || !duration) return;

        const selectedDay = days.find((item) => item.day === day);

        setSessions((current) => [
            ...current,
            {
                id: Date.now(),
                day,
                date: selectedDay?.date || "",
                subject,
                topic,
                duration: Number(duration),
                completed: false,
            },
        ]);

        setTopic("");
        setDuration("2");
        setShowForm(false);
    }

    function toggleSession(id: number) {
        setSessions((current) =>
            current.map((session) =>
                session.id === id
                    ? { ...session, completed: !session.completed }
                    : session
            )
        );
    }

    function deleteSession(id: number) {
        setSessions((current) =>
            current.filter((session) => session.id !== id)
        );
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
                            <NavItem href="/exams" label="Exams" icon="□" />
                            <NavItem href="/study" label="Study Planner" icon="◷" active />
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
                            <h2 className="text-xl font-semibold">Study Planner</h2>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            + Add study session
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Weekly planning
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Study planner
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Plan your study sessions and keep track of the time you've
                                actually completed.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-3">
                            <Stat
                                label="Planned"
                                value={`${plannedHours}h`}
                                detail="This week"
                            />

                            <Stat
                                label="Completed"
                                value={`${completedHours}h`}
                                detail="Study completed"
                            />

                            <Stat
                                label="Progress"
                                value={
                                    plannedHours
                                        ? `${Math.round((completedHours / plannedHours) * 100)}%`
                                        : "0%"
                                }
                                detail="Of planned study"
                            />
                        </div>

                        {/* Add session */}
                        {showForm && (
                            <form
                                onSubmit={addSession}
                                className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="font-semibold">Plan a study session</h2>

                                <div className="mt-5 grid gap-4 md:grid-cols-4">

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Day
                                        </label>

                                        <select
                                            value={day}
                                            onChange={(e) => setDay(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                        >
                                            {days.map((item) => (
                                                <option key={item.day}>{item.day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Subject
                                        </label>

                                        <select
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                        >
                                            <option>Criminal Law</option>
                                            <option>Civil Litigation</option>
                                            <option>Evidence</option>
                                            <option>Professional Conduct</option>
                                            <option>Advocacy</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Topic
                                        </label>

                                        <input
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="e.g. Homicide"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Duration
                                        </label>

                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                        >
                                            <option value="0.5">30 minutes</option>
                                            <option value="1">1 hour</option>
                                            <option value="1.5">1.5 hours</option>
                                            <option value="2">2 hours</option>
                                            <option value="2.5">2.5 hours</option>
                                            <option value="3">3 hours</option>
                                            <option value="4">4 hours</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
                                    >
                                        Add session
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

                        {/* Week */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="mb-6">
                                <h2 className="font-semibold">Week of 17 August</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Your planned study sessions
                                </p>
                            </div>

                            <div className="space-y-3">

                                {days.map((dayItem) => {
                                    const daySessions = sessions.filter(
                                        (session) => session.day === dayItem.day
                                    );

                                    return (
                                        <div
                                            key={dayItem.day}
                                            className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 md:grid-cols-[100px_1fr]"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {dayItem.day}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {dayItem.date}
                                                </p>
                                            </div>

                                            <div className="space-y-2">

                                                {daySessions.length === 0 ? (
                                                    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                                                        No study sessions planned
                                                    </div>
                                                ) : (
                                                    daySessions.map((session) => (
                                                        <div
                                                            key={session.id}
                                                            className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${session.completed
                                                                ? "border-emerald-100 bg-emerald-50/50"
                                                                : "border-slate-200"
                                                                }`}
                                                        >

                                                            <div className="flex min-w-0 items-center gap-3">

                                                                <button
                                                                    onClick={() =>
                                                                        toggleSession(session.id)
                                                                    }
                                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${session.completed
                                                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                                                        : "border-slate-300 text-transparent"
                                                                        }`}
                                                                >
                                                                    ✓
                                                                </button>

                                                                <div className="min-w-0">
                                                                    <p
                                                                        className={`text-sm font-medium ${session.completed
                                                                            ? "text-slate-400 line-through"
                                                                            : "text-slate-700"
                                                                            }`}
                                                                    >
                                                                        {session.topic}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-400">
                                                                        {session.subject}
                                                                    </p>
                                                                </div>

                                                            </div>

                                                            <div className="flex shrink-0 items-center gap-4">
                                                                <span className="text-sm font-semibold text-slate-600">
                                                                    {session.duration}h
                                                                </span>

                                                                <button
                                                                    onClick={() =>
                                                                        deleteSession(session.id)
                                                                    }
                                                                    className="text-xs text-slate-400 hover:text-rose-500"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>

                                                        </div>
                                                    ))
                                                )}

                                            </div>
                                        </div>
                                    );
                                })}

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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span className="flex w-5 justify-center">{icon}</span>
            {label}
        </Link>
    );
}

function Stat({
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
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{detail}</p>
        </div>
    );
}
