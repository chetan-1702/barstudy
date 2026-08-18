"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
    searchResource,
    type ResourceSearchResult,
} from "../../../src/services/resource-search";

interface Resource {
    id: number;
    subject_id: number;
    exam_id: number | null;
    title: string;
    description: string | null;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResourcePage() {
    const params = useParams();
    const router = useRouter();

    const resourceId = Number(params.id);

    const [resource, setResource] = useState<Resource | null>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ResourceSearchResult[]>([]);

    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [error, setError] = useState<string | null>(null);

    /*
     * Load the resource metadata.
     */
    useEffect(() => {
        if (!Number.isFinite(resourceId)) {
            setError("Invalid resource ID.");
            setLoading(false);
            return;
        }

        loadResource();
    }, [resourceId]);

    async function loadResource() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/api/resources/${resourceId}`,
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to load resource"
                );
            }

            const data: Resource = await response.json();

            setResource(data);
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load this resource."
            );
        } finally {
            setLoading(false);
        }
    }

    /*
     * Search inside the resource.
     */
    async function handleSearch(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        try {
            setSearching(true);
            setError(null);
            setHasSearched(true);

            const data = await searchResource(
                resourceId,
                trimmedQuery
            );

            /*
             * IMPORTANT:
             *
             * The API returns:
             *
             * {
             *   query: "...",
             *   resource_id: 7,
             *   results: [...]
             * }
             *
             * Therefore we need data.results,
             * not data itself.
             */
            setResults(data);
        } catch (err) {
            console.error(err);

            setResults([]);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to search this resource."
            );
        } finally {
            setSearching(false);
        }
    }

    /*
     * Highlight matching text.
     */
    function highlightText(
        text: string,
        searchQuery: string
    ) {
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            return text;
        }

        const escaped = trimmedQuery.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const parts = text.split(
            new RegExp(`(${escaped})`, "gi")
        );

        return parts.map((part, index) => {
            const isMatch =
                part.toLowerCase() ===
                trimmedQuery.toLowerCase();

            if (isMatch) {
                return (
                    <mark
                        key={index}
                        className="rounded bg-yellow-200 px-1"
                    >
                        {part}
                    </mark>
                );
            }

            return (
                <span key={index}>
                    {part}
                </span>
            );
        });
    }

    /*
     * Format file size.
     */
    function formatFileSize(bytes: number) {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    }

    /*
     * Loading state.
     */
    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm text-slate-500">
                        Loading resource...
                    </p>
                </div>
            </main>
        );
    }

    /*
     * Resource not found / loading error.
     */
    if (!resource) {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm text-red-600">
                        {error || "Resource not found."}
                    </p>

                    <button
                        onClick={() =>
                            router.push("/resources")
                        }
                        className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to resources
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-5xl">

                {/* Back link */}
                <div className="mb-6">
                    <Link
                        href="/resources"
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Back to resources
                    </Link>
                </div>

                {/* Resource information */}
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                {resource.title}
                            </h1>

                            {resource.description && (
                                <p className="mt-2 text-sm text-slate-500">
                                    {resource.description}
                                </p>
                            )}

                            <p className="mt-3 text-xs text-slate-400">
                                {resource.file_name}
                                {" · "}
                                {formatFileSize(
                                    resource.file_size
                                )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Resource ID: {resource.id}
                            </p>
                        </div>

                        <a
                            href={`${API_URL}/api/resources/${resource.id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Open document
                        </a>

                    </div>

                </section>

                {/* Document search */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Search this document
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Find terms, sections, or phrases inside this resource.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >

                        <input
                            type="text"
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="e.g. ICT risk, incident reporting, governance..."
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />

                        <button
                            type="submit"
                            disabled={searching}
                            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {searching
                                ? "Searching..."
                                : "Search"}
                        </button>

                    </form>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Search results */}
                    {hasSearched && !searching && (
                        <div className="mt-8">

                            <div className="mb-4 flex items-center justify-between">

                                <h3 className="text-sm font-semibold text-slate-900">
                                    Search results
                                </h3>

                                <span className="text-xs text-slate-400">
                                    {results.length} result
                                    {results.length === 1
                                        ? ""
                                        : "s"}
                                </span>

                            </div>

                            {results.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">

                                    <p className="text-sm font-medium text-slate-600">
                                        No matches found.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Try a different term or phrase.
                                    </p>

                                </div>
                            ) : (
                                <div className="space-y-4">

                                    {results.map((result) => (
                                        <article
                                            key={result.chunk_id}
                                            className="rounded-xl border border-slate-200 p-5 transition hover:border-slate-300"
                                        >

                                            {/* Result metadata */}
                                            <div className="mb-3 flex items-center justify-between">

                                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                    {result.page_number
                                                        ? `Page ${result.page_number}`
                                                        : "Page unavailable"}
                                                </span>

                                                <span className="text-xs text-slate-400">
                                                    Chunk{" "}
                                                    {result.chunk_index + 1}
                                                </span>

                                            </div>

                                            {/* Result content */}
                                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                                {highlightText(
                                                    result.content,
                                                    query
                                                )}
                                            </p>

                                        </article>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}
