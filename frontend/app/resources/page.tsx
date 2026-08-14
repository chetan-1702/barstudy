"use client";

import { useState } from "react";
import Link from "next/link";

type Resource = {
    id: number;
    title: string;
    subject: string;
    type: "PDF" | "Link" | "Video" | "Notes";
    url: string;
    description: string;
};

const initialResources: Resource[] = [
    {
        id: 1,
        title: "Criminal Law Revision Guide",
        subject: "Criminal Law",
        type: "PDF",
        url: "#",
        description: "Revision notes covering the main criminal offences.",
    },
    {
        id: 2,
        title: "Civil Procedure Notes",
        subject: "Civil Litigation",
        type: "Notes",
        url: "#",
        description: "Personal notes on civil procedure and case management.",
    },
    {
        id: 3,
        title: "Evidence Practice Questions",
        subject: "Evidence",
        type: "Link",
        url: "https://example.com",
        description: "Practice questions for evidence revision.",
    },
    {
        id: 4,
        title: "Advocacy Demonstration",
        subject: "Advocacy",
        type: "Video",
        url: "https://example.com",
        description: "Advocacy demonstration for practice.",
    },
];

const subjects = [
    "All subjects",
    "Criminal Law",
    "Civil Litigation",
    "Evidence",
    "Professional Conduct",
    "Advocacy",
];

export default function ResourcesPage() {
    const [resources, setResources] = useState(initialResources);
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All subjects");
    const [typeFilter, setTypeFilter] = useState("All types");
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Criminal Law");
    const [type, setType] = useState<Resource["type"]>("PDF");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title.toLowerCase().includes(search.toLowerCase()) ||
            resource.description.toLowerCase().includes(search.toLowerCase());

        const matchesSubject =
            subjectFilter === "All subjects" ||
            resource.subject === subjectFilter;

        const matchesType =
            typeFilter === "All types" ||
            resource.type === typeFilter;

        return matchesSearch && matchesSubject && matchesType;
    });

    function addResource(e: React.FormEvent) {
        e.preventDefault();

        if (!title) return;

        setResources((current) => [
            ...current,
            {
                id: Date.now(),
                title,
                subject,
                type,
                url: url || "#",
                description,
            },
        ]);

        setTitle("");
        setUrl("");
        setDescription("");
        setType("PDF");
        setSubject("Criminal Law");
        setShowForm(false);
    }

    function deleteResource(id: number) {
        setResources((current) =>
            current.filter((resource) => resource.id !== id)
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
                            <NavItem href="/subjects" label="Subjects" icon="▤" />
                            <NavItem href="/exams" label="Exams" icon="□" />
                            <NavItem href="/study" label="Study Planner" icon="◷" />
                            <NavItem href="/tasks" label="Tasks" icon="✓" />
                            <NavItem
                                href="/resources"
                                label="Resources"
                                icon="▱"
                                active
                            />
                            <NavItem href="/inn" label="Inn of Court" icon="⚖" />
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
                                Resources
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222750]"
                        >
                            + Add resource
                        </button>

                    </header>

                    <div className="mx-auto max-w-[1500px] p-6 lg:p-10">

                        <div className="mb-8">

                            <p className="text-sm font-medium text-indigo-600">
                                Course library
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Resources
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Keep your course materials, notes and useful links
                                organised by subject.
                            </p>

                        </div>

                        {/* Add resource */}
                        {showForm && (
                            <form
                                onSubmit={addResource}
                                className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >

                                <h2 className="font-semibold">
                                    Add a resource
                                </h2>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Title
                                        </label>

                                        <input
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="e.g. Criminal Law Revision Guide"
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
                                            {subjects
                                                .filter(
                                                    (item) => item !== "All subjects"
                                                )
                                                .map((item) => (
                                                    <option key={item}>{item}</option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            Type
                                        </label>

                                        <select
                                            value={type}
                                            onChange={(e) =>
                                                setType(
                                                    e.target.value as Resource["type"]
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                        >
                                            <option>PDF</option>
                                            <option>Link</option>
                                            <option>Video</option>
                                            <option>Notes</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600">
                                            URL
                                        </label>

                                        <input
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            placeholder="https://..."
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                                        />
                                    </div>

                                </div>

                                <div className="mt-4">

                                    <label className="text-xs font-medium text-slate-600">
                                        Description
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Short description..."
                                        rows={3}
                                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                                    />

                                </div>

                                <div className="mt-5 flex gap-3">

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
                                    >
                                        Add resource
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

                        {/* Search and filters */}
                        <div className="mb-6 flex flex-col gap-3 lg:flex-row">

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search resources..."
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                            />

                            <select
                                value={subjectFilter}
                                onChange={(e) =>
                                    setSubjectFilter(e.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            >
                                {subjects.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(e.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            >
                                <option>All types</option>
                                <option>PDF</option>
                                <option>Link</option>
                                <option>Video</option>
                                <option>Notes</option>
                            </select>

                        </div>

                        {/* Resource list */}
                        <div className="grid gap-4 md:grid-cols-2">

                            {filteredResources.map((resource) => (
                                <article
                                    key={resource.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex min-w-0 gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                                                {resource.type}
                                            </div>

                                            <div className="min-w-0">

                                                <h2 className="font-semibold">
                                                    {resource.title}
                                                </h2>

                                                <p className="mt-1 text-xs text-indigo-600">
                                                    {resource.subject}
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                                deleteResource(resource.id)
                                            }
                                            className="shrink-0 text-xs text-slate-400 hover:text-rose-500"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-slate-500">
                                        {resource.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="mt-5 border-t border-slate-100 pt-4">

                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            Open resource →
                                        </a>

                                    </div>

                                </article>
                            ))}

                        </div>

                        {filteredResources.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <p className="font-medium">
                                    No resources found
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Try changing your search or filters.
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
