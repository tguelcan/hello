import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const authToken = cookies.get('auth')
	return { ...locals, authToken };
};