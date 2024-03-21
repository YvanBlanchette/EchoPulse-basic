import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

// Function to get the current user from the database
const getCurrentUser = async () => {
	try {
		// Get the current session
		const session = await getSession();

		// If there's no session, return null
		if (!session?.user?.email) return null;

		// If there's a session...
		const currentUser = await prisma.user.findUnique({
			// ...find the user in the database with the email from the session
			where: {
				email: session.user.email as string,
			},
		});

		// If there's no user with that email, return null
		if (!currentUser) return null;

		// If there is a user with that email, return the user
		return currentUser;
	} catch (error: any) {
		// If there's an error, log it and return null
		console.error('Error getting the current user from the database: ', error);
		return null;
	}
};

export default getCurrentUser;
