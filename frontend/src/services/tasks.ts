const API_URL = "http://localhost:8000";

export interface Task {
    id: number;
    subject_id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: string;
    status: string;
    created_at: string;
}

export interface CreateTask {
    subject_id: number;
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
}

export async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/tasks`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load tasks");
    }

    return response.json();
}

export async function createTask(
    task: CreateTask
): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}

export async function updateTask(
    id: number,
    task: Partial<CreateTask>
): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json();
}

export async function deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
}
