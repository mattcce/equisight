import { PUBLIC_API_DOMAIN } from '$env/static/public';
import { authStore } from '$lib/states/auth.svelte';

export function handleUnauthorised(): void {
	authStore.isAuthenticated = false;

	// call logout route to invalidate session
	fetch(`http://${PUBLIC_API_DOMAIN}/auth/logout`, { method: 'POST', credentials: 'include' });
}

export enum LoginErrorCodes {
	BAD_CREDENTIALS = 400
}

export async function login(
	username: string,
	password: string,
	onSuccessfulCallback?: () => void,
	onErrorCallbacks?: { [key in LoginErrorCodes]?: () => void }
): Promise<void> {
	const response = await fetch(`http://${PUBLIC_API_DOMAIN}/auth/login`, {
		method: 'POST',
		body: new URLSearchParams({
			username,
			password
		}),
		credentials: 'include'
	});

	if (response.ok) {
		authStore.isAuthenticated = true;

		if (onSuccessfulCallback) {
			onSuccessfulCallback();
		}
	} else {
		const errorCode = response.status as LoginErrorCodes;

		if (onErrorCallbacks && onErrorCallbacks[errorCode]) {
			onErrorCallbacks[errorCode]();
		}
	}
}

export enum RegisterErrorCodes {
	BAD_REQUEST = 400
}

export async function register(
	username: string,
	password: string,
	onSuccessfulCallback?: () => void,
	onErrorCallbacks?: { [key in RegisterErrorCodes]: () => void }
): Promise<void> {
	const response = await fetch(`http://${PUBLIC_API_DOMAIN}/auth/register`, {
		method: 'POST',
		body: JSON.stringify({
			email: username,
			password: password,
			is_active: true,
			is_superuser: false,
			is_verified: true
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		if (onSuccessfulCallback) {
			onSuccessfulCallback();
		}
	} else {
		const errorCode = response.status as RegisterErrorCodes;

		if (onErrorCallbacks && onErrorCallbacks[errorCode]) {
			console.log('here');
			onErrorCallbacks[errorCode]();
		}
	}
}

export enum LogoutErrorCodes {
	UNAUTHORISED = 401
}

export async function logout(
	onSuccessfulCallback?: () => void,
	onErrorCallbacks?: { [errorCode: number]: () => void }
): Promise<void> {
	const response = await fetch(`http://${PUBLIC_API_DOMAIN}/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});

	if (response.ok) {
		authStore.isAuthenticated = false;
		if (onSuccessfulCallback) {
			onSuccessfulCallback();
		}
	} else {
		if (onErrorCallbacks && onErrorCallbacks[response.status]) {
			onErrorCallbacks[response.status]();
		}
	}
}
