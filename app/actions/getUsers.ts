import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

const getUsers = async () => {
	const session = await getSession();

	// If there is no Users...
	if (!session?.user?.email) {
		// return an empty array.
		return [];
	}

	try {
		// Get all users except the current user
		const users = await prisma.user.findMany({
			// Order the users by the most recent user
			orderBy: {
				createdAt: 'desc',
			},
			// Exclude the current user
			where: {
				NOT: {
					email: session.user.email,
				},
			},
		});

		// Return the users
		return users;

		// If there is an error...
	} catch (error: any) {
		// log the error...
		console.error(error);
		// and return an empty array.
		return [];
	}
};

export default getUsers;
