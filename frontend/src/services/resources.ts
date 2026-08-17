const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Resource {
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

export interface ResourceUpdate {
    subject_id?: number;
    exam_id?: number | null;
    title?: string;
    description?: string | null;
}

export async function getResources(): Promise<Resource[]> {
    const response = await fetch(
        `${API_BASE_URL}/api/resources`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch resources");
    }

    return response.json();
}

export async function getResource(
    id: number
): Promise<Resource> {
    const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch resource");
    }

    return response.json();
}

export async function createResource(
    subjectId: number,
    title: string,
    description: string,
    examId: number | null,
    file: File
): Promise<Resource> {
    const formData = new FormData();

    formData.append(
        "subject_id",
        String(subjectId)
    );

    formData.append(
        "title",
        title
    );

    if (description.trim()) {
        formData.append(
            "description",
            description
        );
    }

    if (examId !== null) {
        formData.append(
            "exam_id",
            String(examId)
        );
    }

    formData.append(
        "file",
        file
    );

    const response = await fetch(
        `${API_BASE_URL}/api/resources`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        let message = "Failed to upload resource";

        try {
            const data = await response.json();

            if (data.detail) {
                message = data.detail;
            }
        } catch {
            // Keep default error message
        }

        throw new Error(message);
    }

    return response.json();
}

export async function updateResource(
    id: number,
    data: ResourceUpdate
): Promise<Resource> {
    const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update resource");
    }

    return response.json();
}

export async function deleteResource(
    id: number
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete resource");
    }
}

export function getResourceDownloadUrl(
    id: number
): string {
    return `${API_BASE_URL}/api/resources/${id}/download`;
}
