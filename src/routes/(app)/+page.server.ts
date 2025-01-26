import type { Actions, PageServerLoad } from './$types';
import { JWT_SECRET } from '$env/static/private'
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import {slugify} from '$lib';

export const load: PageServerLoad = async ({ locals }) => {
	return locals
};

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('auth', { path: '/' });
		throw redirect(302, '/')
	},
	changeRoom: async ({ locals, request, cookies }) => {
		const { user } = locals
		const data = await request.formData();
		const room = data.get('room') as string;
		if(!room) return

		const authToken: string = jwt.sign({
			username: user.username,
			room
		}, JWT_SECRET, { expiresIn: '7d' });

		cookies.set('auth', authToken, { path: '/' });

		throw redirect(301, `/${slugify(room)}`)
	}
} satisfies Actions;