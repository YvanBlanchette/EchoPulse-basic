import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// Function to handle POST request
export async function POST(request: Request) {
	try {
		// Get current user
		const currentUser = await getCurrentUser();
		// Get body from request
		const body = await request.json();
		// Destructure userId, isGroup, members, and name from body
		const { userId, isGroup, members, name } = body;

		// If no current user, user id or email...
		if (!currentUser?.id || !currentUser?.email) {
			// return unauthorized response.
			return new NextResponse('Non authorisé', { status: 400 });
		}

		// If the request is for a group chat but there are no members or no name...
		if (isGroup && (!members || members.length < 2 || !name)) {
			// return invalid data response.
			return new NextResponse('Data invalide', { status: 400 });
		}

		// If the request is for a group chat...
		if (isGroup) {
			// create a new conversation with the name, isGroup, and members.
			const newConversation = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						// Connect the current user and all the members to the conversation.
						connect: [
							...members.map((member: { value: string }) => ({
								id: member.value,
							})),
							{
								id: currentUser.id,
							},
						],
					},
				},
				// Populate the users field in the conversation.
				include: {
					users: true,
				},
			});

			// return the new conversation.
			return NextResponse.json(newConversation);
		}

		// If the request is for a single chat, verify if there is an existing conversation between the current user and the user id.
		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					// Verify if there is a conversation with the current user and the user id.
					{
						userIds: {
							equals: [currentUser.id, userId],
						},
					},
					{
						userIds: {
							equals: [userId, currentUser.id],
						},
					},
				],
			},
		});

		// If there already is an existing conversation between the 2 users...
		// Extract that conversation from the array of conversations...
		const singleConversation = existingConversations[0];

		// and return that conversation.
		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		// If there is not, create a new conversation between the current user and the user id.
		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			// Populate the users field in the conversation.
			include: {
				users: true,
			},
		});

		// Return the new conversation.
		return NextResponse.json(newConversation);
	} catch (error) {
		return new NextResponse(`Internal Error: ${error}`, { status: 500 });
	}
}
