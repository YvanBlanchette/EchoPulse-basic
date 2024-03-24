import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

// Interface for the parameters
interface IParams {
	conversationId?: string;
}

// This function handles the POST request for updating the seen status of messages in a conversation.
export async function POST(request: Request, { params }: { params: IParams }) {
	try {
		// get current user from the getCurrentUser() function
		const currentUser = await getCurrentUser();

		// Extract conversation id from thbe parameters
		const { conversationId } = params;

		// If there is no current user...
		if (!currentUser?.id || !currentUser?.email) {
			// Return an error 'Unauthorized'
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Find existing conversation
		const conversation = await prisma.conversation.findUnique({
			// Find the conversation with the given ID
			where: {
				id: conversationId,
			},
			// Include the messages and users of the conversation
			include: {
				messages: {
					include: {
						seen: true,
					},
				},
				// Populate the users of the conversation
				users: true,
			},
		});

		// If there is no conversation...
		if (!conversation) {
			// Return an error 'Invalid ID'
			return new NextResponse('Invalid ID', { status: 400 });
		}

		// Find last message from the conversation
		const lastMessage = conversation.messages[conversation.messages.length - 1];

		// If there is no last message...
		if (!lastMessage) {
			// Return the conversation
			return NextResponse.json(conversation);
		}

		// If there is a last message, update seen of last message
		const updatedMessage = await prisma.message.update({
			// Update the message with the given ID
			where: {
				id: lastMessage.id,
			},
			// Include the sender and seen of the message
			include: {
				sender: true,
				seen: true,
			},
			// Update the seen of the message
			data: {
				seen: {
					connect: {
						id: currentUser.id,
					},
				},
			},
		});

		// Trigger a conversation update event for the current user
		await pusherServer.trigger(currentUser.email, 'conversation:update', {
			id: conversationId,
			messages: [updatedMessage],
		});

		// If the last message has been seen by the current user...
		if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
			// Return the conversation.
			return NextResponse.json(conversation);
		}

		// Otherwise, update the conversation with the updated message
		await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

		// Return the updated message
		return NextResponse.json(updatedMessage);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error(error, 'ERROR_MESSAGES_SEEN');
		// and return an error '500'
		return new NextResponse('Error', { status: 500 });
	}
}
