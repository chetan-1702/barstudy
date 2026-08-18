const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ResourceSearchResult {
    chunk_id: number;
    resource_id: number;
    resource_title: string;
    chunk_index: number;
    page_number: number | null;
    content: string;
}

export interface ResourceSearchResponse {
    query: string;
    resource_id: number;
    results: ResourceSearchResult[];
}

export async function searchResource(
    resourceId: number,
    query: string
): Promise<ResourceSearchResult[]> {
    const response = await fetch(
        `${API_URL}/api/resources/${resourceId}/search?q=${encodeURIComponent(query)}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || "Failed to search resource"
        );
    }

    const data = await response.json();

    /*
     * The backend currently returns a plain array:
     *
     * [
     *   {
     *     "chunk_id": ...,
     *     ...
     *   }
     * ]
     *
     * If we later change the backend to return:
     *
     * {
     *   "query": "...",
     *   "resource_id": 7,
     *   "results": [...]
     * }
     *
     * this also supports that format.
     */

    if (Array.isArray(data)) {
        return data;
    }

    if (
        data &&
        Array.isArray(data.results)
    ) {
        return data.results;
    }

    return [];
}
