import prisma from '@/app/libs/prismadb';

// function to get messages
const getMessages = async (conversationId: string) => {
	try {
		// Find messages by conversation id
		const messages = await prisma.message.findMany({
			// Where conversationId is equal to the prisma conversationId
			where: {
				conversationId: conversationId,
			},
			// Include sender and seen
			include: {
				sender: true,
				seen: true,
			},
			// Order by createdAt in ascending order
			orderBy: {
				createdAt: 'asc',
			},
		});

		// Return the messages
		return messages;

		// If there is an error...
	} catch (error: any) {
		// log the error...
		console.error(error);
		// and return an empty array.
		return [];
	}
};

// Export the function
export default getMessages;
