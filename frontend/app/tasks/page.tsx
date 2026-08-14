"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
    type Task,
} from "../../src/services/tasks";

import {
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [taskData, subjectData] = await Promise.all([
                getTasks(),
                getSubjects(),
            ]);

            setTasks(taskData);
            setSubjects(subjectData);

            if (subjectData.length > 0) {
                setSubjectId(String(subjectData[0].id));
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load tasks.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddTask(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!title.trim() || !subjectId) {
            setError("Please provide a subject and task title.");
            return;
        }

        try {
            setError(null);

            const newTask = await createTask({
                subject_id: Number(subjectId),
                title: title.trim(),
                description: description.trim() || undefined,
                due_date: dueDate || undefined,
                priority,
                status: "Pending",
            });

            setTasks((current) =>
                [...current, newTask].sort(sortTasks)
            );

            setTitle("");
            setDescription("");
            setDueDate("");
            setPriority("Medium");
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create task.");
        }
    }

    async function handleToggleTask(task: Task) {
        const newStatus =
            task.status === "Completed"
                ? "Pending"
                : "Completed";

        try {
            setError(null);

            const updatedTask = await updateTask(task.id, {
                status: newStatus,
            });

            setTasks((current) =>
                current.map((item) =>
                    item.id === updatedTask.id
                        ? updatedTask
                        : item
                )
            );
        } catch (err) {
            console.error(err);
            setError("Unable to update task.");
        }
    }

    async function handleDeleteTask(id: number) {
        if (!window.confirm("Delete this task?")) {
            return;
        }

        try {
            setError(null);

            await deleteTask(id);

            setTasks((current) =>
                current.filter((task) => task.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete task.");
        }
    }

    function getSubjectName(subjectId: number) {
        return (
            subjects.find(
                (subject) => subject.id === subjectId
            )?.name || "Unknown subject"
        );
    }

    function formatDate(date: string | null) {
        if (!date) {
            return "No due date";
        }

        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function sortTasks(a: Task, b: Task) {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;

        return (
            new Date(a.due_date).getTime() -
            new Date(b.due_date).getTime()
        );
    }

    const pendingTasks = tasks.filter(
        (task) => task.status !== "Completed"
    );

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    );

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
                                Study management
                            </p>

                            <h2 className="text-xl font-semibold">
                                Tasks
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                setShowForm((current) => !current)
                            }
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            {showForm ? "Cancel" : "+ Add task"}
                        </button>
                    </header>

                    <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Study workload
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your tasks
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Keep track of readings, practice questions,
                                revision and other work for your course.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Add form */}
                        {showForm && (
                            <form
                                onSubmit={handleAddTask}
                                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold">
                                    Add a task
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
                                            Task
                                        </label>

                                        <input
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Read chapter on homicide"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Due date
                                        </label>

                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) =>
                                                setDueDate(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Priority
                                        </label>

                                        <select
                                            value={priority}
                                            onChange={(e) =>
                                                setPriority(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">
                                                Medium
                                            </option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Description
                                        </label>

                                        <textarea
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Optional details..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Save task
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <p className="text-sm text-slate-500">
                                    Loading tasks...
                                </p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <h2 className="font-semibold">
                                    No tasks yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Add your first study task to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">

                                {/* Pending */}
                                <TaskSection
                                    title="To do"
                                    count={pendingTasks.length}
                                >
                                    {pendingTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            subjectName={getSubjectName(
                                                task.subject_id
                                            )}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            formatDate={formatDate}
                                        />
                                    ))}
                                </TaskSection>

                                {/* Completed */}
                                {completedTasks.length > 0 && (
                                    <TaskSection
                                        title="Completed"
                                        count={completedTasks.length}
                                    >
                                        {completedTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                subjectName={getSubjectName(
                                                    task.subject_id
                                                )}
                                                onToggle={handleToggleTask}
                                                onDelete={handleDeleteTask}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </TaskSection>
                                )}

                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function TaskSection({
    title,
    count,
    children,
}: {
    title: string;
    count: number;
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="mb-3 flex items-center gap-3">
                <h2 className="font-semibold">{title}</h2>

                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {count}
                </span>
            </div>

            <div className="space-y-3">
                {children}
            </div>
        </section>
    );
}

function TaskCard({
    task,
    subjectName,
    onToggle,
    onDelete,
    formatDate,
}: {
    task: Task;
    subjectName: string;
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    formatDate: (date: string | null) => string;
}) {
    const completed = task.status === "Completed";

    return (
        <article
            className={`rounded-2xl border bg-white p-5 shadow-sm ${completed
                ? "border-slate-200 opacity-70"
                : "border-slate-200"
                }`}
        >
            <div className="flex items-start gap-4">

                <button
                    onClick={() => onToggle(task)}
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${completed
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 text-transparent hover:border-indigo-500"
                        }`}
                    aria-label={
                        completed
                            ? "Mark task as pending"
                            : "Mark task as completed"
                    }
                >
                    ✓
                </button>

                <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className={`font-semibold ${completed
                                ? "text-slate-400 line-through"
                                : "text-slate-800"
                                }`}
                        >
                            {task.title}
                        </h3>

                        <PriorityBadge
                            priority={task.priority}
                        />
                    </div>

                    <p className="mt-1 text-xs font-medium text-indigo-600">
                        {subjectName}
                    </p>

                    {task.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {task.description}
                        </p>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                        Due: {formatDate(task.due_date)}
                    </p>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

function PriorityBadge({
    priority,
}: {
    priority: string;
}) {
    const classes =
        priority === "High"
            ? "bg-red-50 text-red-600"
            : priority === "Low"
                ? "bg-slate-100 text-slate-500"
                : "bg-amber-50 text-amber-600";

    return (
        <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${classes}`}
        >
            {priority}
        </span>
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
