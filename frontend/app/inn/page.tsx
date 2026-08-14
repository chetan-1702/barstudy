"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:8000";

interface InnProfile {
    id: number;
    user_id: number;
    registered: boolean;
    inn_name: string | null;
    application_status: string | null;
    intended_application_date: string | null;
    joining_date: string | null;
    membership_status: string | null;
    important_dates: string | null;
    documents: string | null;
    notes: string | null;
}

export default function InnPage() {
    const [registered, setRegistered] = useState(false);

    const [innName, setInnName] = useState("");
    const [applicationStatus, setApplicationStatus] = useState("");
    const [intendedApplicationDate, setIntendedApplicationDate] =
        useState("");

    const [joiningDate, setJoiningDate] = useState("");
    const [membershipStatus, setMembershipStatus] = useState("");

    const [importantDates, setImportantDates] = useState("");
    const [documents, setDocuments] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const response = await fetch(`${API_URL}/api/inn`, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load Inn profile");
            }

            const data: InnProfile | null = await response.json();

            if (data) {
                setRegistered(data.registered);
                setInnName(data.inn_name || "");
                setApplicationStatus(data.application_status || "");
                setIntendedApplicationDate(
                    data.intended_application_date || ""
                );
                setJoiningDate(data.joining_date || "");
                setMembershipStatus(data.membership_status || "");
                setImportantDates(data.important_dates || "");
                setDocuments(data.documents || "");
                setNotes(data.notes || "");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load your Inn information.");
        } finally {
            setLoading(false);
        }
    }

    async function saveProfile() {
        try {
            setSaving(true);
            setSaved(false);
            setError("");

            const response = await fetch(`${API_URL}/api/inn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    registered,

                    inn_name: innName || null,

                    application_status: registered
                        ? null
                        : applicationStatus || null,

                    intended_application_date:
                        registered
                            ? null
                            : intendedApplicationDate || null,

                    joining_date: registered
                        ? joiningDate || null
                        : null,

                    membership_status: registered
                        ? membershipStatus || null
                        : null,

                    important_dates:
                        importantDates || null,

                    documents: documents || null,

                    notes: notes || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save profile");
            }

            setSaved(true);
        } catch (err) {
            console.error(err);
            setError("Unable to save your Inn information.");
        } finally {
            setSaving(false);
        }
    }

    function changeRegistrationStatus(value: boolean) {
        setRegistered(value);
        setSaved(false);

        // Clear fields that no longer apply.
        if (value) {
            setApplicationStatus("");
            setIntendedApplicationDate("");
        } else {
            setJoiningDate("");
            setMembershipStatus("");
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f6f7fb] p-10">
                <div className="mx-auto max-w-4xl">
                    <p className="text-sm text-slate-500">
                        Loading Inn information...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f6f7fb]">

            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-4xl px-6 py-6">

                    <div className="flex items-center gap-3 text-sm">
                        <Link
                            href="/"
                            className="text-slate-500 hover:text-slate-900"
                        >
                            Dashboard
                        </Link>

                        <span className="text-slate-300">
                            /
                        </span>

                        <span className="font-medium text-slate-900">
                            Inn of Court
                        </span>
                    </div>

                    <div className="mt-6">

                        <p className="text-sm font-medium text-indigo-600">
                            Bar Course
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Inn of Court
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Keep track of your Inn registration,
                            application information and important
                            dates.
                        </p>

                    </div>

                </div>
            </header>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-6 py-8">

                {/* Registration status */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold">
                        Inn registration
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Have you already registered with an Inn
                        of Court?
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                changeRegistrationStatus(false)
                            }
                            className={`rounded-xl border px-5 py-4 text-left transition ${!registered
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <p
                                className={`font-semibold ${!registered
                                    ? "text-indigo-700"
                                    : "text-slate-900"
                                    }`}
                            >
                                Not yet
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                I am planning or applying to join an Inn.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                changeRegistrationStatus(true)
                            }
                            className={`rounded-xl border px-5 py-4 text-left transition ${registered
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <p
                                className={`font-semibold ${registered
                                    ? "text-indigo-700"
                                    : "text-slate-900"
                                    }`}
                            >
                                Yes
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                I have already registered with an Inn.
                            </p>
                        </button>

                    </div>

                </section>

                {/* Inn information */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-semibold">
                            {registered
                                ? "Your Inn"
                                : "Inn information"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {registered
                                ? "Keep your membership information organised."
                                : "Keep track of your planned Inn application."}
                        </p>

                    </div>

                    <div className="space-y-5">

                        {/* Inn */}
                        <Field label="Inn of Court">

                            <select
                                value={innName}
                                onChange={(e) =>
                                    setInnName(e.target.value)
                                }
                                className="input"
                            >
                                <option value="">
                                    Select an Inn
                                </option>

                                <option value="Gray's Inn">
                                    Gray's Inn
                                </option>

                                <option value="Lincoln's Inn">
                                    Lincoln's Inn
                                </option>

                                <option value="Inner Temple">
                                    Inner Temple
                                </option>

                                <option value="Middle Temple">
                                    Middle Temple
                                </option>
                            </select>

                        </Field>

                        {/* NOT REGISTERED */}
                        {!registered && (
                            <>
                                <Field label="Application status">

                                    <select
                                        value={applicationStatus}
                                        onChange={(e) =>
                                            setApplicationStatus(
                                                e.target.value
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="">
                                            Select status
                                        </option>

                                        <option value="Considering">
                                            Considering
                                        </option>

                                        <option value="Preparing application">
                                            Preparing application
                                        </option>

                                        <option value="Application submitted">
                                            Application submitted
                                        </option>

                                        <option value="Accepted">
                                            Accepted
                                        </option>
                                    </select>

                                </Field>

                                <Field label="Intended application date">

                                    <input
                                        type="date"
                                        value={intendedApplicationDate}
                                        onChange={(e) =>
                                            setIntendedApplicationDate(
                                                e.target.value
                                            )
                                        }
                                        className="input"
                                    />

                                </Field>
                            </>
                        )}

                        {/* REGISTERED */}
                        {registered && (
                            <>
                                <Field label="Membership status">

                                    <select
                                        value={membershipStatus}
                                        onChange={(e) =>
                                            setMembershipStatus(
                                                e.target.value
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="">
                                            Select status
                                        </option>

                                        <option value="Student member">
                                            Student member
                                        </option>

                                        <option value="Member">
                                            Member
                                        </option>

                                        <option value="Called to the Bar">
                                            Called to the Bar
                                        </option>
                                    </select>

                                </Field>

                                <Field label="Joining date">

                                    <input
                                        type="date"
                                        value={joiningDate}
                                        onChange={(e) =>
                                            setJoiningDate(
                                                e.target.value
                                            )
                                        }
                                        className="input"
                                    />

                                </Field>
                            </>
                        )}

                        {/* Common fields */}
                        <Field
                            label={
                                registered
                                    ? "Important dates"
                                    : "Important application dates"
                            }
                        >

                            <textarea
                                value={importantDates}
                                onChange={(e) =>
                                    setImportantDates(
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="For example: application deadline, qualifying sessions, dinners..."
                                className="input resize-none"
                            />

                        </Field>

                        <Field label="Documents">

                            <textarea
                                value={documents}
                                onChange={(e) =>
                                    setDocuments(e.target.value)
                                }
                                rows={4}
                                placeholder="Keep track of documents you need to prepare or submit..."
                                className="input resize-none"
                            />

                        </Field>

                        <Field label="Notes">

                            <textarea
                                value={notes}
                                onChange={(e) =>
                                    setNotes(e.target.value)
                                }
                                rows={4}
                                placeholder="Anything else you want to remember..."
                                className="input resize-none"
                            />

                        </Field>

                    </div>

                </section>

                {/* Messages */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {saved && (
                    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-700">
                            Inn information saved successfully.
                        </p>
                    </div>
                )}

                {/* Save */}
                <div className="mt-6 flex justify-end">

                    <button
                        type="button"
                        onClick={saveProfile}
                        disabled={saving}
                        className="rounded-xl bg-[#171b3a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#222750] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Inn information"}
                    </button>

                </div>

            </div>
        </main>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            {children}
        </div>
    );
}
