import { toast } from 'svelte-sonner';

import { goto } from '$app/navigation';
import { page } from '$app/state';
import { PUBLIC_API_DOMAIN } from '$env/static/public';

export const authStore = $state({ isAuthenticated: false });

export function handleUnauthorised(): void {
	authStore.isAuthenticated = false;

	// call logout route
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
			// username: 'user000@example.com',
			// password: 'password1'
		}),
		credentials: 'include'
	});

	if (response.ok) {
		authStore.isAuthenticated = true;
		toast.success('Logged in!');
		goto(page.url.searchParams.get('redirectTo') ?? '/');
		if (onSuccessfulCallback) {
			onSuccessfulCallback();
		}
	} else {
		const errorCode = response.status as LoginErrorCodes;
		const message = await response.json();

		switch (errorCode) {
			case LoginErrorCodes.BAD_CREDENTIALS:
				toast.error('Bad credentials!');
				console.log(JSON.stringify(message));
				break;
		}

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
		toast.success('Registered!');
		if (onSuccessfulCallback) {
			onSuccessfulCallback();
		}
	} else {
		const errorCode = response.status as RegisterErrorCodes;
		const message = await response.json();

		switch (errorCode) {
			default:
				toast.error(`Failed to register.`);
				console.log(JSON.stringify(message));
				break;
		}

		if (onErrorCallbacks && onErrorCallbacks[errorCode]) {
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
		toast.info('Logged out.');
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
