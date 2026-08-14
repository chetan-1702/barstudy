const API_URL = "http://localhost:8000";

export interface Resource {
    id: number;
    subject_id: number;
    name: string;
    resource_type: string;
    url: string | null;
    description: string | null;
    created_at: string;
}

export interface CreateResource {
    subject_id: number;
    name: string;
    resource_type: string;
    url?: string;
    description?: string;
}

export async function getResources(): Promise<Resource[]> {
    const response = await fetch(
        `${API_URL}/api/resources`,
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error("Failed to load resources");
    }

    return response.json();
}

export async function createResource(
    resource: CreateResource
): Promise<Resource> {
    const response = await fetch(
        `${API_URL}/api/resources`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resource),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create resource");
    }

    return response.json();
}

export async function deleteResource(
    id: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/resources/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete resource");
    }
}
