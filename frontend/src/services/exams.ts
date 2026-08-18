const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Exam {
    id: number;
    subject_id: number;
    name: string;
    exam_date: string;
    exam_type: string | null;
    notes: string | null;
    created_at: string;
}

export interface CreateExam {
    subject_id: number;
    name: string;
    exam_date: string;
    exam_type?: string;
    notes?: string;
}

export async function getExams(): Promise<Exam[]> {
    const response = await fetch(`${API_URL}/api/exams`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load exams");
    }

    return response.json();
}

export async function createExam(
    exam: CreateExam
): Promise<Exam> {
    const response = await fetch(`${API_URL}/api/exams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(exam),
    });

    if (!response.ok) {
        throw new Error("Failed to create exam");
    }

    return response.json();
}

export async function updateExam(
    id: number,
    exam: Partial<CreateExam>
): Promise<Exam> {
    const response = await fetch(`${API_URL}/api/exams/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(exam),
    });

    if (!response.ok) {
        throw new Error("Failed to update exam");
    }

    return response.json();
}

export async function deleteExam(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/exams/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete exam");
    }
}
