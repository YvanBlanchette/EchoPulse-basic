import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

// Interface for the DELETE request
interface IParams {
	conversationId?: string;
}

// Function to handle the DELETE request for a conversation
export async function DELETE(request: Request, { params }: { params: IParams }) {
	try {
		// Get the conversation ID from the request parameters
		const { conversationId } = params;
		// Get the current user
		const currentUser = await getCurrentUser();

		// If there is no current user...
		if (!currentUser?.id) {
			// Return a 401 Unauthorized response
			return NextResponse.json(null);
		}

		// Find the existing conversation
		const existingConversation = await prisma.conversation.findUnique({
			// Find the conversation by its ID
			where: {
				id: conversationId,
			},
			// Include the users in the conversation
			include: {
				users: true,
			},
		});

		// If there is no existing conversation...
		if (!existingConversation) {
			// Return a 404 Not Found response
			return new NextResponse('Invalid ID', { status: 400 });
		}

		// Delete the conversation
		const deletedConversation = await prisma.conversation.deleteMany({
			// Delete the conversation by its ID
			where: {
				id: conversationId,
				// Only delete the conversation if the current user is a member
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		});

		// Delete the conversation in real time with Pusher
		existingConversation.users.forEach((user) => {
			// If the user has an email...
			if (user.email) {
				// Trigger the conversation:remove event
				pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
			}
		});

		// Return the deleted conversation
		return NextResponse.json(deletedConversation);

		// If an error occurs...
	} catch (error) {
		// Log the error to the console
		console.error(error);
		// Return a 500 Internal Server Error response
		return NextResponse.json(null);
	}
}
