"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

interface Subject {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  subject_id: number;
  name: string;
  exam_date: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterExam, setFilterExam] = useState("");

  const [deleteTarget, setDeleteTarget] =
    useState<Resource | null>(null);

  const [subjectId, setSubjectId] = useState("");
  const [examId, setExamId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [
        resourcesResponse,
        subjectsResponse,
        examsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/resources`, {
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/subjects`, {
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/exams`, {
          cache: "no-store",
        }),
      ]);

      if (!resourcesResponse.ok) {
        throw new Error("Failed to load resources");
      }

      if (!subjectsResponse.ok) {
        throw new Error("Failed to load subjects");
      }

      if (!examsResponse.ok) {
        throw new Error("Failed to load exams");
      }

      const resourcesData =
        await resourcesResponse.json();

      const subjectsData =
        await subjectsResponse.json();

      const examsData =
        await examsResponse.json();

      setResources(resourcesData);
      setSubjects(subjectsData);
      setExams(examsData);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load resources."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateResource(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a resource title.");
      return;
    }

    if (!file) {
      setError("Please select a PDF document.");
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError(
        "Only PDF documents are currently supported."
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "subject_id",
        subjectId
      );

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      if (examId) {
        formData.append(
          "exam_id",
          examId
        );
      }

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        `${API_URL}/api/resources`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to create resource"
        );
      }

      resetForm();

      setShowAddForm(false);

      await loadData();

      setSuccess(
        "Resource uploaded successfully and is ready for search."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create resource."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setSubjectId("");
    setExamId("");
    setFile(null);

    const fileInput =
      document.getElementById(
        "resource-file"
      ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  function handleCancelAdd() {
    resetForm();
    setShowAddForm(false);
    setError(null);
  }

  async function confirmDeleteResource() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        `${API_URL}/api/resources/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to delete resource"
        );
      }

      const deletedTitle =
        deleteTarget.title;

      setResources((current) =>
        current.filter(
          (resource) =>
            resource.id !==
            deleteTarget.id
        )
      );

      setDeleteTarget(null);

      setSuccess(
        `"${deletedTitle}" was deleted successfully.`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete resource."
      );
    } finally {
      setDeleting(false);
    }
  }

  function getSubjectName(subjectId: number) {
    return (
      subjects.find(
        (subject) =>
          subject.id === subjectId
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
        (exam) =>
          exam.id === examId
      )?.name || "Unknown exam"
    );
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const selectedSubjectExams = exams.filter(
    (exam) =>
      !subjectId ||
      exam.subject_id ===
      Number(subjectId)
  );

  const filterExamOptions = exams.filter(
    (exam) =>
      !filterSubject ||
      exam.subject_id ===
      Number(filterSubject)
  );

  const filteredResources = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    return resources.filter(
      (resource) => {
        const matchesSearch =
          !query ||
          resource.title
            .toLowerCase()
            .includes(query) ||
          resource.file_name
            .toLowerCase()
            .includes(query) ||
          (
            resource.description ||
            ""
          )
            .toLowerCase()
            .includes(query);

        const matchesSubject =
          !filterSubject ||
          resource.subject_id ===
          Number(filterSubject);

        const matchesExam =
          !filterExam ||
          resource.exam_id ===
          Number(filterExam);

        return (
          matchesSearch &&
          matchesSubject &&
          matchesExam
        );
      }
    );
  }, [
    resources,
    searchQuery,
    filterSubject,
    filterExam,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filterSubject !== "" ||
    filterExam !== "";

  function clearFilters() {
    setSearchQuery("");
    setFilterSubject("");
    setFilterExam("");
  }

  function handleFilterSubjectChange(
    value: string
  ) {
    setFilterSubject(value);

    if (filterExam) {
      const selectedExam = exams.find(
        (exam) =>
          exam.id ===
          Number(filterExam)
      );

      if (
        selectedExam &&
        value &&
        selectedExam.subject_id !==
        Number(value)
      ) {
        setFilterExam("");
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              href="/"
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              ← Dashboard
            </Link>

            <div className="mt-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Resources
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Your legal study library. Upload legislation,
                lecture notes, case materials, and other
                documents to make them searchable.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (showAddForm) {
                handleCancelAdd();
              } else {
                setShowAddForm(true);
                setError(null);
                setSuccess(null);
              }
            }}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            {showAddForm
              ? "Cancel"
              : "+ Add Resource"}
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>

            <button
              onClick={() =>
                setSuccess(null)
              }
              className="text-emerald-700 hover:text-emerald-900"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="break-words">
              {error}
            </span>

            <button
              onClick={() =>
                setError(null)
              }
              className="shrink-0 text-red-700 hover:text-red-900"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Add resource */}
        {showAddForm && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Add a resource
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a PDF to add it to your searchable
                legal study library.
              </p>
            </div>

            <form
              onSubmit={
                handleCreateResource
              }
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">

                {/* Subject */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subject
                  </label>

                  <select
                    value={subjectId}
                    onChange={(
                      event
                    ) => {
                      setSubjectId(
                        event
                          .target
                          .value
                      );
                      setExamId(
                        ""
                      );
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">
                      Select subject
                    </option>

                    {subjects.map(
                      (
                        subject
                      ) => (
                        <option
                          key={
                            subject.id
                          }
                          value={
                            subject.id
                          }
                        >
                          {
                            subject.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Exam */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exam
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <select
                    value={examId}
                    onChange={(
                      event
                    ) =>
                      setExamId(
                        event
                          .target
                          .value
                      )
                    }
                    disabled={
                      !subjectId
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      No specific exam
                    </option>

                    {selectedSubjectExams.map(
                      (
                        exam
                      ) => (
                        <option
                          key={
                            exam.id
                          }
                          value={
                            exam.id
                          }
                        >
                          {
                            exam.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="e.g. DORA Regulation"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={description}
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Brief description of the document..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* File */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document
                </label>

                <label
                  htmlFor="resource-file"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    📄
                  </div>

                  {file ? (
                    <>
                      <p className="text-sm font-medium text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(
                          file.size
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-700">
                        Choose a PDF document
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PDF files are currently
                        supported
                      </p>
                    </>
                  )}

                  <input
                    id="resource-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(
                      event
                    ) =>
                      setFile(
                        event
                          .target
                          .files?.[0] ||
                        null
                      )
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {/* Form actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCancelAdd
                  }
                  disabled={
                    saving
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Uploading..."
                    : "Upload Resource"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Resource library */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Library header */}
          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Your resources
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Loading..."
                    : `${filteredResources.length} of ${resources.length} resource${resources.length ===
                      1
                      ? ""
                      : "s"
                    }`}
                </p>
              </div>

              {!loading &&
                resources.length >
                0 && (
                  <button
                    onClick={() =>
                      setShowAddForm(
                        true
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    + Add Resource
                  </button>
                )}
            </div>

            {/* Filters */}
            {!loading &&
              resources.length >
              0 && (
                <div className="mt-5 grid gap-3 md:grid-cols-3">

                  <div className="md:col-span-1">
                    <label
                      htmlFor="resource-search"
                      className="sr-only"
                    >
                      Search resources
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        ⌕
                      </span>

                      <input
                        id="resource-search"
                        type="text"
                        value={
                          searchQuery
                        }
                        onChange={(
                          event
                        ) =>
                          setSearchQuery(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Search resources..."
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject-filter"
                      className="sr-only"
                    >
                      Filter by subject
                    </label>

                    <select
                      id="subject-filter"
                      value={
                        filterSubject
                      }
                      onChange={(
                        event
                      ) =>
                        handleFilterSubjectChange(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    >
                      <option value="">
                        All subjects
                      </option>

                      {subjects.map(
                        (
                          subject
                        ) => (
                          <option
                            key={
                              subject.id
                            }
                            value={
                              subject.id
                            }
                          >
                            {
                              subject.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="exam-filter"
                      className="sr-only"
                    >
                      Filter by exam
                    </label>

                    <select
                      id="exam-filter"
                      value={
                        filterExam
                      }
                      onChange={(
                        event
                      ) =>
                        setFilterExam(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    >
                      <option value="">
                        All exams
                      </option>

                      {filterExamOptions.map(
                        (
                          exam
                        ) => (
                          <option
                            key={
                              exam.id
                            }
                            value={
                              exam.id
                            }
                          >
                            {
                              exam.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              )}

            {hasActiveFilters &&
              !loading && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Showing filtered resources
                  </p>

                  <button
                    onClick={
                      clearFilters
                    }
                    className="text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-0">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={
                      item
                    }
                    className="animate-pulse border-b border-slate-100 p-6 last:border-b-0"
                  >
                    <div className="h-4 w-1/3 rounded bg-slate-200" />

                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />

                    <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                )
              )}
            </div>
          )}

          {/* Empty library */}
          {!loading &&
            resources.length ===
            0 && (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  📚
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  No study resources yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Upload your first lecture note,
                  regulation, casebook, or other legal
                  document to start building your
                  searchable study library.
                </p>

                <button
                  onClick={() =>
                    setShowAddForm(
                      true
                    )
                  }
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  + Add your first resource
                </button>
              </div>
            )}

          {/* No filter results */}
          {!loading &&
            resources.length >
            0 &&
            filteredResources.length ===
            0 && (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                  🔎
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No resources found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="mt-4 text-sm font-medium text-slate-900 underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            )}

          {/* Resource list */}
          {!loading &&
            filteredResources.length >
            0 && (
              <div className="divide-y divide-slate-100">

                {filteredResources.map(
                  (
                    resource
                  ) => {
                    const examName =
                      getExamName(
                        resource.exam_id
                      );

                    return (
                      <div
                        key={
                          resource.id
                        }
                        className="group flex flex-col gap-5 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                      >

                        {/* Resource information */}
                        <Link
                          href={`/resources/${resource.id}`}
                          className="min-w-0 flex-1"
                        >
                          <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg">
                              📄
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-medium text-slate-900 transition group-hover:text-slate-700">
                                {
                                  resource.title
                                }
                              </h3>

                              {resource.description && (
                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                  {
                                    resource.description
                                  }
                                </p>
                              )}

                              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">

                                <span className="font-medium text-slate-500">
                                  {
                                    getSubjectName(
                                      resource.subject_id
                                    )
                                  }
                                </span>

                                {examName && (
                                  <>
                                    <span>
                                      ·
                                    </span>

                                    <span>
                                      {
                                        examName
                                      }
                                    </span>
                                  </>
                                )}

                                <span>
                                  ·
                                </span>

                                <span>
                                  {
                                    resource.file_name
                                  }
                                </span>

                                <span>
                                  ·
                                </span>

                                <span>
                                  {
                                    formatFileSize(
                                      resource.file_size
                                    )
                                  }
                                </span>

                                <span>
                                  ·
                                </span>

                                <span>
                                  Added{" "}
                                  {
                                    formatDate(
                                      resource.created_at
                                    )
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2 sm:self-center">

                          <Link
                            href={`/resources/${resource.id}`}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Open
                          </Link>

                          <button
                            onClick={() =>
                              setDeleteTarget(
                                resource
                              )
                            }
                            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg">
                ⚠
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete resource?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are about to delete{" "}
                  <span className="font-medium text-slate-700">
                    "{deleteTarget.title}"
                  </span>
                  .
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This will permanently remove the
                  document and its extracted search
                  content.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                disabled={
                  deleting
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDeleteResource
                }
                disabled={
                  deleting
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete resource"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
