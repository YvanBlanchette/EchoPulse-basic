import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
	const currentUser = await getCurrentUser();

	// If no user is logged in, return an empty array
	if (!currentUser) {
		return [];
	}

	try {
		// Fetch conversations from the database
		const conversations = await prisma.conversation.findMany({
			// Sort by last message received/sent
			orderBy: {
				lastMessageAt: 'desc',
			},
			// Only fetch conversations where the current user is a participant
			where: {
				userIds: {
					has: currentUser.id,
				},
			},
			// Populate the users and the messages
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		});

		// Return the conversations
		return conversations;

		// If an error occurs...
	} catch (error: any) {
		// log the error...
		console.error(error);
		// and return an empty array.
		return [];
	}
};

export default getConversations;
