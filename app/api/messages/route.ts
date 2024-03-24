import { NextResponse } from 'next/server';
import { pusherServer } from '@/app/libs/pusher';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

// Function to handle POST requests to the /api/messages route
export async function POST(request: Request) {
	try {
		// Get the current user
		const currentUser = await getCurrentUser();
		// Get the request body
		const body = await request.json();
		// Extract the message, image, and conversationId from the body
		const { message, image, conversationId } = body;

		// If the current user is not defined...
		if (!currentUser?.id || !currentUser?.email) {
			// Return an unauthorized response
			return new NextResponse('Non authorisé', { status: 401 });
		}

		// Create a new message
		const newMessage = await prisma.message.create({
			// Include the sender and seen fields
			include: {
				seen: true,
				sender: true,
			},
			// Set the body, image, conversation, sender, and seen fields
			data: {
				body: message,
				image: image,
				conversation: {
					connect: { id: conversationId },
				},
				sender: {
					connect: { id: currentUser.id },
				},
				seen: {
					connect: {
						id: currentUser.id,
					},
				},
			},
		});

		// Update the conversation with the new message
		const updatedConversation = await prisma.conversation.update({
			// Find the conversation by its ID
			where: {
				id: conversationId,
			},
			// Set the lastMessageAt and messages fields
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			// Include the users and messages fields
			include: {
				users: true,
				messages: {
					include: {
						seen: true,
					},
				},
			},
		});

		// Trigger a new message event for the conversation ID
		await pusherServer.trigger(conversationId, 'messages:new', newMessage);

		// Get the last message from the updated conversation
		const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

		// Trigger a conversation update event for each user in the conversation
		updatedConversation.users.map((user) => {
			pusherServer.trigger(user.email!, 'conversation:update', {
				id: conversationId,
				messages: [lastMessage],
			});
		});

		// Return the new message
		return NextResponse.json(newMessage);

		// If an error occurs...
	} catch (error) {
		// Log the error...
		console.error(error, 'ERROR_MESSAGES');
		// and return a server error response.
		return new NextResponse('Error', { status: 500 });
	}
}
