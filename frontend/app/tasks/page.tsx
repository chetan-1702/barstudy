"use client";

import { useState } from "react";
import Link from "next/link";

type Task = {
    id: number;
    title: string;
    subject: string;
    dueDate: string;
    priority: "High" | "Medium" | "Low";
    completed: boolean;
};

const initialTasks: Task[] = [
    {
        id: 1,
        title: "Revise homicide offences",
        subject: "Criminal Law",
        dueDate: "2026-08-17",
        priority: "High",
        completed: false,
    },
    {
        id: 2,
        title: "Complete civil procedure notes",
        subject: "Civil Litigation",
        dueDate: "2026-08-19",
        priority: "Medium",
        completed: false,
    },
    {
        id: 3,
        title: "Practice evidence MCQs",
        subject: "Evidence",
        dueDate: "2026-08-20",
        priority: "High",
        completed: false,
    },
    {
        id: 4,
        title: "Review professional conduct rules",
        subject: "Professional Conduct",
        dueDate: "2026-08-22",
        priority: "Low",
        completed: true,
    },
];

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

function isOverdue(task: Task) {
    if (task.completed) return false;

    const today = new Date("2026-08-14");
    const due = new Date(task.dueDate);

    return due < today;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<
        "all" | "active" | "completed"
    >("all");

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Criminal Law");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] =
        useState<Task["priority"]>("Medium");

    const visibleTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    const overdueCount = tasks.filter(isOverdue).length;

    function addTask(e: React.FormEvent) {
        e.preventDefault();

        if (!title || !dueDate) return;

        setTasks((current) => [
            ...current,
            {
                id: Date.now(),
                title,
                subject,
                dueDate,
                priority,
                completed: false,
            },
        ]);

        setTitle("");
        setDueDate("");
        setPriority("Medium");
        setShowForm(false);
    }

    function toggleTask(id: number) {
        setTasks((current) =>
            current.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    function deleteTask(id: number) {
        setTasks((current) =>
            current.filter((task) => task.id !== id)
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
                            <NavItem href="/" label="Dashboard" icon="⌂" />
                            <NavItem
                                href="/subjects"
                                label="Subjects"
                                icon="▤"
                            />
                            <NavItem href="/exams" label="Exams" icon="□" />
                            <NavItem
                                href="/study"
                                label="Study Planner"
                                icon="◷"
                            />
                            <NavItem
                                href="/tasks"
                                label="Tasks"
                                icon="✓"
                                active
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
                </aside>

                {/* Main */}
                <section className="flex-1">

                    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10">
                        <div>
                            <p className="text-sm text-slate-500">
                                Your course
                            </p>

                            <h2 className="text-xl font-semibold">
                                Tasks
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            + Add task
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Work management
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Tasks
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Keep track of revision, assignments, practice and
                                other course work.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-3">

                            <Stat
                                label="Active"
                                value={String(
                                    tasks.filter((task) => !task.completed).length
                                )}
                                detail="Tasks remaining"
                            />

                            <Stat
                                label="Completed"
                                value={String(completedCount)}
                                detail="Tasks finished"
                            />

                            <Stat
                                label="Overdue"
                                value={String(overdueCount)}
                                detail="Need attention"
                            />

                        </div>

                        {/* Add task */}
                        {showForm && (
                            <form
                                onSubmit={addTask}
                                className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="font-semibold">
                                    Create a task
                                </h2>

                                <div className="mt-5 grid gap-4 md:grid-cols-4">

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-slate-600">
                                            Task
                                        </label>

                                        <input
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="e.g. Complete homicide revision"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Subject
                                        </label>

                                        <select
                                            value={subject}
                                            onChange={(e) =>
                                                setSubject(e.target.value)
                                            }
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
                                            Due date
                                        </label>

                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) =>
                                                setDueDate(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                                        />
                                    </div>

                                </div>

                                <div className="mt-4 max-w-xs">
                                    <label className="text-xs font-medium text-slate-600">
                                        Priority
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(
                                                e.target.value as Task["priority"]
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                    >
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>

                                <div className="mt-5 flex gap-3">

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
                                    >
                                        Create task
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

                            {(
                                [
                                    ["all", "All"],
                                    ["active", "Active"],
                                    ["completed", "Completed"],
                                ] as const
                            ).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => setFilter(value)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium ${filter === value
                                        ? "bg-[#171b3a] text-white"
                                        : "bg-white text-slate-500"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}

                        </div>

                        {/* Task list */}
                        <div className="space-y-3">

                            {visibleTasks.map((task) => (
                                <article
                                    key={task.id}
                                    className={`rounded-2xl border bg-white p-5 shadow-sm ${task.completed
                                        ? "border-emerald-100"
                                        : isOverdue(task)
                                            ? "border-rose-200"
                                            : "border-slate-200"
                                        }`}
                                >

                                    <div className="flex items-center gap-4">

                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${task.completed
                                                ? "border-emerald-500 bg-emerald-500 text-white"
                                                : "border-slate-300 text-transparent"
                                                }`}
                                        >
                                            ✓
                                        </button>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h2
                                                    className={`font-medium ${task.completed
                                                        ? "text-slate-400 line-through"
                                                        : "text-slate-700"
                                                        }`}
                                                >
                                                    {task.title}
                                                </h2>

                                                <PriorityBadge
                                                    priority={task.priority}
                                                />

                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {task.subject} · Due{" "}
                                                {formatDate(task.dueDate)}

                                                {isOverdue(task) && (
                                                    <span className="ml-2 font-medium text-rose-500">
                                                        Overdue
                                                    </span>
                                                )}
                                            </p>

                                        </div>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-xs text-slate-400 hover:text-rose-500"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>

                        {visibleTasks.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <p className="font-medium">
                                    No tasks here
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Create a task to start tracking your work.
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span className="flex w-5 justify-center">
                {icon}
            </span>

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
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-3 text-2xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {detail}
            </p>
        </div>
    );
}

function PriorityBadge({
    priority,
}: {
    priority: Task["priority"];
}) {
    const classes = {
        High: "bg-rose-50 text-rose-600",
        Medium: "bg-amber-50 text-amber-600",
        Low: "bg-slate-100 text-slate-500",
    };

    return (
        <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${classes[priority]}`}
        >
            {priority}
        </span>
    );
}
