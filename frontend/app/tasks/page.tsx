"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Subject {
    id: number;
    name: string;
    code: string | null;
    description?: string | null;
}

interface Exam {
    id: number;
    subject_id: number;
    name: string;
    exam_date: string;
    exam_type: string | null;
}

interface Task {
    id: number;
    subject_id: number;
    exam_id: number | null;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: string;
    status: string;
    created_at: string;
}

export default function TasksPage() {
    const searchParams = useSearchParams();

    const subjectFromUrl = searchParams.get("subject");
    const examFromUrl = searchParams.get("exam");

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [selectedSubject, setSelectedSubject] =
        useState(subjectFromUrl || "");

    const [selectedExam, setSelectedExam] =
        useState(examFromUrl || "");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (subjectFromUrl) {
            setSelectedSubject(subjectFromUrl);
        }

        if (examFromUrl) {
            setSelectedExam(examFromUrl);
        }
    }, [subjectFromUrl, examFromUrl]);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                subjectsResponse,
                examsResponse,
                tasksResponse,
            ] = await Promise.all([
                fetch(`${API_URL}/api/subjects`, {
                    cache: "no-store",
                }),

                fetch(`${API_URL}/api/exams`, {
                    cache: "no-store",
                }),

                fetch(`${API_URL}/api/tasks`, {
                    cache: "no-store",
                }),
            ]);

            if (!subjectsResponse.ok) {
                throw new Error("Failed to load subjects");
            }

            if (!examsResponse.ok) {
                throw new Error("Failed to load exams");
            }

            if (!tasksResponse.ok) {
                throw new Error("Failed to load tasks");
            }

            const subjectData =
                await subjectsResponse.json();

            const examData =
                await examsResponse.json();

            const taskData =
                await tasksResponse.json();

            setSubjects(subjectData);
            setExams(examData);
            setTasks(taskData);
        } catch (err) {
            console.error(err);
            setError("Unable to load tasks.");
        } finally {
            setLoading(false);
        }
    }

    async function createTask(event: FormEvent) {
        event.preventDefault();

        if (!selectedSubject) {
            setError("Please select a subject.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a task title.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `${API_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject_id: Number(selectedSubject),
                        exam_id: selectedExam
                            ? Number(selectedExam)
                            : null,
                        title: title.trim(),
                        description:
                            description.trim() || null,
                        due_date: dueDate || null,
                        priority,
                        status: "Pending",
                    }),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                console.error(message);

                throw new Error("Failed to create task");
            }

            const newTask: Task =
                await response.json();

            setTasks((current) => [
                newTask,
                ...current,
            ]);

            setTitle("");
            setDescription("");
            setDueDate("");
            setPriority("Medium");

            setSuccess("Task created successfully.");
        } catch (err) {
            console.error(err);
            setError("Unable to create task.");
        } finally {
            setSaving(false);
        }
    }

    async function updateTaskStatus(
        task: Task
    ) {
        const newStatus =
            task.status === "Completed"
                ? "Pending"
                : "Completed";

        try {
            const response = await fetch(
                `${API_URL}/api/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask: Task =
                await response.json();

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

    function getSubjectName(subjectId: number) {
        return (
            subjects.find(
                (subject) => subject.id === subjectId
            )?.name || "Unknown subject"
        );
    }

    function getExamName(
        examId: number | null
    ) {
        if (!examId) {
            return null;
        }

        return (
            exams.find(
                (exam) => exam.id === examId
            )?.name || "Unknown exam"
        );
    }

    const filteredExams = selectedSubject
        ? exams.filter(
            (exam) =>
                exam.subject_id ===
                Number(selectedSubject)
        )
        : exams;

    const visibleTasks = selectedExam
        ? tasks.filter(
            (task) =>
                task.exam_id ===
                Number(selectedExam)
        )
        : selectedSubject
            ? tasks.filter(
                (task) =>
                    task.subject_id ===
                    Number(selectedSubject)
            )
            : tasks;

    return (
        <main className="min-h-screen bg-[#f6f7fb]">

            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-6">

                    <Link
                        href="/"
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Dashboard
                    </Link>

                    <div className="mt-5">

                        <h1 className="text-3xl font-bold tracking-tight">
                            Tasks
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage your study tasks and preparation.
                        </p>

                    </div>

                </div>
            </header>

            <div className="mx-auto max-w-6xl px-6 py-8">

                {/* Context banner */}
                {examFromUrl && selectedExam && (
                    <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                            Adding task for exam
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                            {getExamName(
                                Number(selectedExam)
                            )}
                        </p>

                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                        <p className="text-sm text-green-700">
                            {success}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

                    {/* Create task */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="font-semibold">
                            Add task
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Create a task for your study plan.
                        </p>

                        <form
                            onSubmit={createTask}
                            className="mt-6 space-y-4"
                        >

                            {/* Subject */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Subject
                                </label>

                                <select
                                    value={selectedSubject}
                                    onChange={(event) => {
                                        setSelectedSubject(
                                            event.target.value
                                        );

                                        /*
                                         * Changing subject invalidates
                                         * the currently selected exam.
                                         */
                                        setSelectedExam("");
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    required
                                >
                                    <option value="">
                                        Select subject
                                    </option>

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

                            {/* Exam */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Exam
                                </label>

                                <select
                                    value={selectedExam}
                                    onChange={(event) =>
                                        setSelectedExam(
                                            event.target.value
                                        )
                                    }
                                    disabled={!selectedSubject}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-indigo-500"
                                >
                                    <option value="">
                                        No specific exam
                                    </option>

                                    {filteredExams.map((exam) => (
                                        <option
                                            key={exam.id}
                                            value={exam.id}
                                        >
                                            {exam.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Optionally associate this task
                                    with an examination.
                                </p>

                            </div>

                            {/* Title */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Task
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="e.g. Review mens rea"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    required
                                />

                            </div>

                            {/* Description */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Optional details..."
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* Due date */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Due date
                                </label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) =>
                                        setDueDate(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* Priority */}
                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(event) =>
                                        setPriority(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                >
                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>
                                </select>

                            </div>

                            <button
                                type="submit"
                                disabled={saving || loading}
                                className="w-full rounded-xl bg-[#171b3a] px-4 py-3 text-sm font-medium text-white hover:bg-[#222750] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Creating..."
                                    : "Create task"}
                            </button>

                        </form>

                    </section>

                    {/* Task list */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="font-semibold">
                                        {selectedExam
                                            ? "Exam tasks"
                                            : selectedSubject
                                                ? "Subject tasks"
                                                : "All tasks"}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {visibleTasks.length}{" "}
                                        {visibleTasks.length === 1
                                            ? "task"
                                            : "tasks"}
                                    </p>

                                </div>

                                {selectedExam && (
                                    <Link
                                        href={`/exams/${selectedExam}`}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        View exam
                                    </Link>
                                )}

                            </div>

                        </div>

                        {loading ? (
                            <div className="px-6 py-10 text-center">

                                <p className="text-sm text-slate-500">
                                    Loading tasks...
                                </p>

                            </div>
                        ) : visibleTasks.length === 0 ? (
                            <div className="px-6 py-12 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    ✓
                                </div>

                                <p className="mt-4 font-medium">
                                    No tasks yet
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create your first study task using
                                    the form.
                                </p>

                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">

                                {visibleTasks.map((task) => {

                                    const completed =
                                        task.status.toLowerCase() ===
                                        "completed";

                                    return (
                                        <div
                                            key={task.id}
                                            className="flex items-start gap-4 px-6 py-5"
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateTaskStatus(task)
                                                }
                                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${completed
                                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                                    : "border-slate-300 bg-white"
                                                    }`}
                                                title={
                                                    completed
                                                        ? "Mark as pending"
                                                        : "Mark as completed"
                                                }
                                            >
                                                {completed && (
                                                    <span className="text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>

                                            <div className="min-w-0 flex-1">

                                                <p
                                                    className={`text-sm font-medium ${completed
                                                        ? "text-slate-400 line-through"
                                                        : "text-slate-800"
                                                        }`}
                                                >
                                                    {task.title}
                                                </p>

                                                {task.description && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="mt-2 flex flex-wrap gap-2">

                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                                        {getSubjectName(
                                                            task.subject_id
                                                        )}
                                                    </span>

                                                    {task.exam_id && (
                                                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                                                            {getExamName(
                                                                task.exam_id
                                                            )}
                                                        </span>
                                                    )}

                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                                        {task.priority}
                                                    </span>

                                                    {task.due_date && (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                                            Due{" "}
                                                            {new Date(
                                                                `${task.due_date}T00:00:00`
                                                            ).toLocaleDateString(
                                                                "en-GB",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                }
                                                            )}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}
