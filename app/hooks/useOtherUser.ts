import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType } from '../types';
import { User } from '@prisma/client';

// This hook returns the other user in a conversation
const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
	// Get the current user's session
	const session = useSession();

	// Get the other user in the conversation
	const otherUser = useMemo(() => {
		// get the current user's email address from the session
		const currentUserEmail = session?.data?.user?.email;

		// Filter the users to remove the current user...
		const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);
		// and return the other user.
		return otherUser[0];
	}, [session?.data?.user?.email, conversation.users]);

	// Return the other user
	return otherUser;
};

export default useOtherUser;
