export async function apiClient(route: string, requestInit: RequestInit): Promise<Response> {
	const response = await fetch(`http://localhost:5173/api/mock${route}`, {
		...requestInit
	});

	return response;
}
