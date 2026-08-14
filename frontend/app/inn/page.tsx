"use client";

import { useState } from "react";
import Link from "next/link";

const inns = [
    "Gray's Inn",
    "Lincoln's Inn",
    "Inner Temple",
    "Middle Temple",
];

export default function InnPage() {
    const [registered, setRegistered] = useState(false);
    const [selectedInn, setSelectedInn] = useState("");
    const [showForm, setShowForm] = useState(false);

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
                            <NavItem href="/resources" label="Resources" icon="▱" />
                            <NavItem
                                href="/inn"
                                label="Inn of Court"
                                icon="⚖"
                                active
                            />
                        </div>

                    </nav>
                </aside>

                {/* Main */}
                <section className="flex-1">

                    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10">

                        <div>
                            <p className="text-sm text-slate-500">
                                Professional development
                            </p>

                            <h2 className="text-xl font-semibold">
                                Inn of Court
                            </h2>
                        </div>

                    </header>

                    <div className="mx-auto max-w-[1200px] p-6 lg:p-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium text-indigo-600">
                                Inn management
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Your Inn
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Keep your Inn information, events and related
                                activities alongside your Bar course.
                            </p>
                        </div>

                        {/* Registration toggle */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <h2 className="font-semibold">
                                        Have you already registered with an Inn?
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        This determines which Inn information is shown
                                        to you.
                                    </p>
                                </div>

                                <div className="flex rounded-xl bg-slate-100 p-1">

                                    <button
                                        onClick={() => setRegistered(false)}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${!registered
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500"
                                            }`}
                                    >
                                        Not yet
                                    </button>

                                    <button
                                        onClick={() => setRegistered(true)}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${registered
                                            ? "bg-[#171b3a] text-white shadow-sm"
                                            : "text-slate-500"
                                            }`}
                                    >
                                        Yes
                                    </button>

                                </div>

                            </div>

                        </section>

                        {/* NOT REGISTERED */}
                        {!registered && (
                            <div className="mt-6 space-y-6">

                                <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                        Next step
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold">
                                        Choose an Inn
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                        If you haven't registered yet, you can use
                                        BarStudy to keep track of your decision and
                                        registration-related tasks.
                                    </p>

                                    <button
                                        onClick={() => setShowForm(!showForm)}
                                        className="mt-5 rounded-xl bg-[#171b3a] px-4 py-2.5 text-sm font-medium text-white"
                                    >
                                        {showForm
                                            ? "Close"
                                            : "Start Inn planning"}
                                    </button>

                                </section>

                                {showForm && (
                                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                        <h2 className="font-semibold">
                                            Which Inn are you considering?
                                        </h2>

                                        <div className="mt-5 grid gap-3 md:grid-cols-2">

                                            {inns.map((inn) => (
                                                <button
                                                    key={inn}
                                                    onClick={() => setSelectedInn(inn)}
                                                    className={`rounded-xl border p-4 text-left transition ${selectedInn === inn
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : "border-slate-200 hover:border-slate-300"
                                                        }`}
                                                >
                                                    <p className="font-medium">
                                                        {inn}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Select this Inn
                                                    </p>
                                                </button>
                                            ))}

                                        </div>

                                        {selectedInn && (
                                            <div className="mt-5 rounded-xl bg-slate-50 p-4">

                                                <p className="text-xs text-slate-400">
                                                    Selected Inn
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                    {selectedInn}
                                                </p>

                                                <button
                                                    onClick={() => setRegistered(true)}
                                                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
                                                >
                                                    I've registered with this Inn
                                                </button>

                                            </div>
                                        )}

                                    </section>
                                )}

                                {/* Registration checklist */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                    <h2 className="font-semibold">
                                        Registration checklist
                                    </h2>

                                    <div className="mt-5 space-y-3">

                                        <ChecklistItem
                                            title="Research the Inns"
                                            description="Compare the Inns and decide which is appropriate for you."
                                        />

                                        <ChecklistItem
                                            title="Check registration requirements"
                                            description="Review the current requirements and deadlines."
                                        />

                                        <ChecklistItem
                                            title="Prepare required documents"
                                            description="Keep any required documents and information ready."
                                        />

                                        <ChecklistItem
                                            title="Complete registration"
                                            description="Record your registration once completed."
                                        />

                                    </div>

                                </section>

                            </div>
                        )}

                        {/* REGISTERED */}
                        {registered && (
                            <div className="mt-6 space-y-6">

                                <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
                                            ✓
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                                Registration complete
                                            </p>

                                            <h2 className="mt-1 text-xl font-semibold">
                                                Your Inn information
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-600">
                                                Registration guidance is hidden because
                                                you have indicated that you are already
                                                registered.
                                            </p>
                                        </div>

                                    </div>

                                </section>

                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                    <h2 className="font-semibold">
                                        Your Inn
                                    </h2>

                                    <div className="mt-5">

                                        <label className="text-xs font-medium text-slate-600">
                                            Inn
                                        </label>

                                        <select
                                            value={selectedInn}
                                            onChange={(e) =>
                                                setSelectedInn(e.target.value)
                                            }
                                            className="mt-2 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                                        >
                                            <option value="">
                                                Select your Inn
                                            </option>

                                            {inns.map((inn) => (
                                                <option key={inn}>{inn}</option>
                                            ))}
                                        </select>

                                    </div>

                                </section>

                                <section className="grid gap-4 md:grid-cols-3">

                                    <InfoCard
                                        title="Inn events"
                                        description="Keep track of dinners, qualifying sessions and other events."
                                    />

                                    <InfoCard
                                        title="Inn tasks"
                                        description="Manage registration-related or professional activities."
                                    />

                                    <InfoCard
                                        title="Important dates"
                                        description="Keep relevant deadlines and events alongside your course."
                                    />

                                </section>

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

function ChecklistItem({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3 rounded-xl border border-slate-100 p-4">

            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300" />

            <div>
                <p className="text-sm font-medium">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                </p>
            </div>

        </div>
    );
}

function InfoCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
            </p>

            <button className="mt-4 text-sm font-medium text-indigo-600">
                Manage →
            </button>

        </div>
    );
}
