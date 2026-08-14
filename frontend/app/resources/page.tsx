"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    createResource,
    deleteResource,
    getResources,
    type Resource,
} from "../../src/services/resources";

import {
    getSubjects,
    type Subject,
} from "../../src/services/subjects";

const RESOURCE_TYPES = [
    "Lecture Notes",
    "Case",
    "Statute",
    "Textbook",
    "Article",
    "Practice Question",
    "Revision Notes",
    "Other",
];

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [resourceType, setResourceType] =
        useState("Lecture Notes");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [resourceData, subjectData] =
                await Promise.all([
                    getResources(),
                    getSubjects(),
                ]);

            setResources(resourceData);
            setSubjects(subjectData);

            if (subjectData.length > 0) {
                setSubjectId(String(subjectData[0].id));
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load resources.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddResource(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim() || !subjectId || !resourceType) {
            setError(
                "Please provide a resource name, subject and type."
            );
            return;
        }

        try {
            setError(null);

            const newResource = await createResource({
                subject_id: Number(subjectId),
                name: name.trim(),
                resource_type: resourceType,
                url: url.trim() || undefined,
                description:
                    description.trim() || undefined,
            });

            setResources((current) => [
                newResource,
                ...current,
            ]);

            setName("");
            setUrl("");
            setDescription("");
            setResourceType("Lecture Notes");
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create resource.");
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Delete this resource?")) {
            return;
        }

        try {
            setError(null);

            await deleteResource(id);

            setResources((current) =>
                current.filter((resource) => resource.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete resource.");
        }
    }

    function getSubjectName(subjectId: number) {
        return (
            subjects.find(
                (subject) => subject.id === subjectId
            )?.name || "Unknown subject"
        );
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
                                active
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
                                Course library
                            </p>

                            <h2 className="text-xl font-semibold">
                                Resources
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                setShowForm((current) => !current)
                            }
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            {showForm
                                ? "Cancel"
                                : "+ Add resource"}
                        </button>

                    </header>

                    <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

                        <div className="mb-8">

                            <p className="text-sm font-medium text-indigo-600">
                                Course library
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your resources
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Keep your notes, cases, statutes and
                                revision materials organised by subject.
                            </p>

                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Add resource form */}
                        {showForm && (
                            <form
                                onSubmit={handleAddResource}
                                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >

                                <h2 className="text-lg font-semibold">
                                    Add a resource
                                </h2>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Resource name
                                        </label>

                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Criminal Law Lecture Notes"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>

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
                                            Resource type
                                        </label>

                                        <select
                                            value={resourceType}
                                            onChange={(e) =>
                                                setResourceType(e.target.value)
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        >
                                            {RESOURCE_TYPES.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">
                                            Resource URL
                                        </label>

                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            placeholder="https://..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
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
                                            placeholder="What is this resource?"
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />

                                    </div>

                                </div>

                                <div className="mt-5 flex justify-end">

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Save resource
                                    </button>

                                </div>

                            </form>
                        )}

                        {/* Resources */}
                        {loading ? (

                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <p className="text-sm text-slate-500">
                                    Loading resources...
                                </p>
                            </div>

                        ) : resources.length === 0 ? (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                                <h2 className="font-semibold">
                                    No resources yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Add your first course resource.
                                </p>

                            </div>

                        ) : (

                            <div className="grid gap-4 md:grid-cols-2">

                                {resources.map((resource) => (

                                    <article
                                        key={resource.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >

                                        <div className="flex items-start gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                ▱
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h3 className="font-semibold">
                                                        {resource.name}
                                                    </h3>

                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        {resource.resource_type}
                                                    </span>

                                                </div>

                                                <p className="mt-2 text-sm text-indigo-600">
                                                    {getSubjectName(
                                                        resource.subject_id
                                                    )}
                                                </p>

                                                {resource.description && (
                                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                                        {resource.description}
                                                    </p>
                                                )}

                                                <div className="mt-4 flex items-center gap-4">

                                                    {resource.url && (
                                                        <a
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Open resource →
                                                        </a>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(resource.id)
                                                        }
                                                        className="text-xs font-medium text-slate-400 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

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
