// import { redirect } from '@sveltejs/kit';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { formSchema } from './schema';

export async function load(): Promise<{
	form: SuperValidated<{
		username: string;
		password: string;
	}>;
}> {
	return {
		form: await superValidate(zod(formSchema))
	};
}
