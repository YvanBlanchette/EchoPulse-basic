import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/app/libs/pusher';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// This is the handler for the /api/pusher/auth route
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	// Get the session from the request
	const session = await getServerSession(request, response, authOptions);

	// If the session does not exist, return a 401 status
	if (!session?.user?.email) {
		return response.status(401);
	}

	// Get the socket id, channel name and user id from the request body
	const socketId = request.body.socket_id;
	const channel = request.body.channel_name;

	// The user id is the email of the user
	const data = { user_id: session.user.email };

	// Authorize the channel
	const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

	// Return the authorization response
	return response.send(authResponse);
}
