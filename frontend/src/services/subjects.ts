const API_URL = "http://localhost:8000";

export interface Subject {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    created_at: string;
}

export interface CreateSubject {
    name: string;
    code?: string;
    description?: string;
}

export async function getSubjects(): Promise<Subject[]> {
    const response = await fetch(`${API_URL}/api/subjects`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load subjects");
    }

    return response.json();
}

export async function createSubject(
    subject: CreateSubject
): Promise<Subject> {
    const response = await fetch(`${API_URL}/api/subjects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
    });

    if (!response.ok) {
        throw new Error("Failed to create subject");
    }

    return response.json();
}

export async function deleteSubject(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/subjects/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete subject");
    }
}
