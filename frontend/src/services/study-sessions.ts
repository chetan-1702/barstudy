const API_URL = "http://localhost:8000";

export interface StudySession {
    id: number;
    subject_id: number;
    title: string;
    session_date: string;
    duration_minutes: number;
    notes: string | null;
    created_at: string;
}

export interface CreateStudySession {
    subject_id: number;
    title: string;
    session_date: string;
    duration_minutes: number;
    notes?: string;
}

export async function getStudySessions(): Promise<StudySession[]> {
    const response = await fetch(
        `${API_URL}/api/study-sessions`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load study sessions");
    }

    return response.json();
}

export async function createStudySession(
    session: CreateStudySession
): Promise<StudySession> {
    const response = await fetch(
        `${API_URL}/api/study-sessions`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(session),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create study session");
    }

    return response.json();
}

export async function updateStudySession(
    id: number,
    session: Partial<CreateStudySession>
): Promise<StudySession> {
    const response = await fetch(
        `${API_URL}/api/study-sessions/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(session),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update study session");
    }

    return response.json();
}

export async function deleteStudySession(
    id: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/study-sessions/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete study session");
    }
}
