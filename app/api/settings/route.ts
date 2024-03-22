import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

// function to update user settings
export async function POST(request: Request) {
	try {
		// Get the current user
		const currentUser = await getCurrentUser();
		// Get the body of the request
		const body = await request.json();
		const { name, image } = body;

		// If the user is not logged in, return an unauthorized error
		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Update the user settings
		const updatedUser = await prisma.user.update({
			// Find the user in the database by id
			where: {
				id: currentUser.id,
			},
			// Update the user's settings
			data: {
				image: image,
				name: name,
			},
		});

		// Return the updated user
		return NextResponse.json(updatedUser);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error(error, 'ERROR_MESSAGES');
		// and return a 500 status error.
		return new NextResponse('Error', { status: 500 });
	}
}
