'use client';
import { useCallback, useMemo } from 'react';
import { FullConversationType } from '@/app/types';
import { useRouter } from 'next/navigation';
import { Conversation, Message, User } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/sidebar/Avatar';

interface ConversationBoxProps {
	data: FullConversationType;
	selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
	// Get the other user in the conversation
	const otherUser = useOtherUser(data);
	// Get the current user's session
	const session = useSession();
	// Get the router
	const router = useRouter();

	//! Function to handle clicking on the conversation box
	const handleClick = useCallback(() => {
		// Redirect to the conversation page
		router.push(`/conversations/${data.id}`);
	}, [data.id, router]);

	// Get the last message in the conversation
	const lastMessage = useMemo(() => {
		// If there are no messages, return null
		const messages = data.messages || [];

		// return the last message
		return messages[messages.length - 1];
	}, [data.messages]);

	// Get the user's email address from the session
	const userEmail = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	// logics to check if the user has seen the last message
	const hasSeen = useMemo(() => {
		// If there are no messages...
		if (!lastMessage) {
			// return false.
			return false;
		}

		const seenArray = lastMessage.seen || [];

		// If there is no user email...
		if (!userEmail) {
			// return false.
			return false;
		}

		// Check if the user email is in the seen array, and use the lenght to return a boolean
		return seenArray.filter((user) => user.email === userEmail).length !== 0;
	}, [userEmail, lastMessage]);

	// logics to check the last message sent by the current user
	const lastMessageText = useMemo(() => {
		// If the last message was an image...
		if (lastMessage?.image) {
			// return 'Envoyé une Image.
			return 'a envoyé un image';
		}

		// If the last message has a body...
		if (lastMessage?.body) {
			// return the body of the last message.
			return lastMessage.body;
		}

		//If there is not last message, return 'Démarré une Conversation'
		return 'Nouvelle conversation';
	}, [lastMessage]);

	return (
		<div
			onClick={handleClick}
			className={clsx(
				'w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3',
				selected ? 'bg-neutral-100' : 'bg-white'
			)}
		>
			<Avatar user={otherUser} />
			<div className='min-w-0 flex-1'>
				<div className='focus:outline-none'>
					<div className='flex justify-between items-center mb-1'>
						<p className='text-md font-medium text-gray-900'>{data.name || otherUser.name}</p>
						{lastMessage?.createdAt && <p className='text-xs text-gray-400 font-light'>{format(new Date(lastMessage.createdAt), 'p')}</p>}
					</div>
					<p className={clsx('truncate text-sm', hasSeen ? 'text-gray-500' : 'text-[hsl(30,80%,60%)] font-medium')}>{lastMessageText}</p>
				</div>
			</div>
		</div>
	);
};

export default ConversationBox;
