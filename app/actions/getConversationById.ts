import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

// function to get conversation by id
const getConversationById = async (conversationId: string) => {
	try {
		// Get current user
		const currentUser = await getCurrentUser();

		// If there is no current user...
		if (!currentUser?.email) {
			// return null.
			return null;
		}

		// Find conversation by its id
		const conversation = await prisma.conversation.findUnique({
			// where id is equal to the conversationId
			where: {
				id: conversationId,
			},
			// include users
			include: {
				users: true,
			},
		});

		// Return the conversation
		return conversation;

		// If there is an error...
	} catch (error: any) {
		// log the error...
		console.error(error);
		// and return null.
		return null;
	}
};

// Export the function
export default getConversationById;
