"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Exam {
  id: number;
  subject_id: number;
  name: string;
  exam_date: string;
  exam_type: string | null;
  notes: string | null;
  created_at: string;
}

interface Subject {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [subjectId, setSubjectId] =
    useState("");
  const [name, setName] =
    useState("");
  const [examDate, setExamDate] =
    useState("");
  const [examType, setExamType] =
    useState("");
  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [
        examsResponse,
        subjectsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/exams`, {
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/subjects`, {
          cache: "no-store",
        }),
      ]);

      if (!examsResponse.ok) {
        throw new Error(
          "Failed to load exams"
        );
      }

      if (!subjectsResponse.ok) {
        throw new Error(
          "Failed to load subjects"
        );
      }

      const examsData =
        await examsResponse.json();

      const subjectsData =
        await subjectsResponse.json();

      setExams(examsData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateExam(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!subjectId) {
      setError(
        "Please select a subject."
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Please enter an exam name."
      );
      return;
    }

    if (!examDate) {
      setError(
        "Please select an exam date."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/exams`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            subject_id:
              Number(subjectId),
            name: name.trim(),
            exam_date:
              examDate,
            exam_type:
              examType.trim() ||
              null,
            notes:
              notes.trim() ||
              null,
          }),
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to create exam"
        );
      }

      setSubjectId("");
      setName("");
      setExamDate("");
      setExamType("");
      setNotes("");

      setShowAddForm(false);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create exam."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExam(
    examId: number,
    examName: string
  ) {
    const confirmed =
      window.confirm(
        `Delete "${examName}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      const response =
        await fetch(
          `${API_URL}/api/exams/${examId}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to delete exam"
        );
      }

      setExams((current) =>
        current.filter(
          (exam) =>
            exam.id !== examId
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete exam."
      );
    }
  }

  function getSubjectName(
    subjectId: number
  ) {
    return (
      subjects.find(
        (subject) =>
          subject.id === subjectId
      )?.name ||
      "Unknown subject"
    );
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function isUpcoming(
    date: string
  ) {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const examDate =
      new Date(
        `${date}T00:00:00`
      );

    return examDate >= today;
  }

  const sortedExams =
    [...exams].sort(
      (a, b) =>
        new Date(
          `${a.exam_date}T00:00:00`
        ).getTime() -
        new Date(
          `${b.exam_date}T00:00:00`
        ).getTime()
    );

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              ← Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              Exams
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your upcoming and completed exams.
            </p>
          </div>

          <button
            onClick={() =>
              setShowAddForm(
                (current) =>
                  !current
              )
            }
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            {showAddForm
              ? "Cancel"
              : "+ Add Exam"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add form */}
        {showAddForm && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Add an exam
            </h2>

            <form
              onSubmit={
                handleCreateExam
              }
              className="mt-6 space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subject
                  </label>

                  <select
                    value={
                      subjectId
                    }
                    onChange={(
                      event
                    ) =>
                      setSubjectId(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exam name
                  </label>

                  <input
                    type="text"
                    value={
                      name
                    }
                    onChange={(
                      event
                    ) =>
                      setName(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="e.g. Criminal Law Final"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exam date
                  </label>

                  <input
                    type="date"
                    value={
                      examDate
                    }
                    onChange={(
                      event
                    ) =>
                      setExamDate(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exam type
                  </label>

                  <input
                    type="text"
                    value={
                      examType
                    }
                    onChange={(
                      event
                    ) =>
                      setExamType(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="e.g. Written, Oral, MCQ"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  value={
                    notes
                  }
                  onChange={(
                    event
                  ) =>
                    setNotes(
                      event
                        .target
                        .value
                    )
                  }
                  rows={3}
                  placeholder="Optional notes..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Add Exam"}
                </button>
              </div>

            </form>
          </section>
        )}

        {/* Exam list */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Your exams
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {exams.length} exam
              {exams.length ===
                1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">
              Loading exams...
            </div>
          ) : exams.length ===
            0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500">
                No exams have been added yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {sortedExams.map(
                (exam) => (
                  <div
                    key={
                      exam.id
                    }
                    className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <Link
                      href={`/exams/${exam.id}`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-slate-900 hover:underline">
                          {
                            exam.name
                          }
                        </h3>

                        {isUpcoming(
                          exam.exam_date
                        ) ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Upcoming
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span>
                          {
                            getSubjectName(
                              exam.subject_id
                            )
                          }
                        </span>

                        <span>
                          ·
                        </span>

                        <span>
                          {
                            formatDate(
                              exam.exam_date
                            )
                          }
                        </span>

                        {exam.exam_type && (
                          <>
                            <span>
                              ·
                            </span>

                            <span>
                              {
                                exam.exam_type
                              }
                            </span>
                          </>
                        )}
                      </div>

                      {exam.notes && (
                        <p className="mt-2 text-sm text-slate-400">
                          {
                            exam.notes
                          }
                        </p>
                      )}
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                      >
                        Open
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteExam(
                            exam.id,
                            exam.name
                          )
                        }
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
