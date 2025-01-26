import type { Actions } from './$types';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private'
import {slugify} from '$lib';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const room = data.get('room') as string;

		if(!username) return
		const authToken: string = jwt.sign({
			username,
			room
		}, JWT_SECRET, { expiresIn: '7d' });

		cookies.set('auth', authToken, { path: '/' });

		throw redirect(301, `/${slugify(room)}`)
	}
} satisfies Actions;