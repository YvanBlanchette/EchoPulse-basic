'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/types';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MdGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import GroupChatModal from '../../components/modals/GroupChatModal';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface ConversationListProps {
	initialConversations: FullConversationType[];
	users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({ initialConversations, users }) => {
	const session = useSession();
	const [conversations, setConversations] = useState(initialConversations);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	const { conversationId, isOpen } = useConversation();

	const pusherKey = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	useEffect(() => {
		if (!pusherKey) {
			return;
		}

		pusherClient.subscribe(pusherKey);

		// New conversation handler
		const newHandler = (conversation: FullConversationType) => {
			// Set the new conversation
			setConversations((current) => {
				// If a conversation with the same id already exists...
				if (find(current, { id: conversation.id })) {
					//return current conversations;
				}

				// Otherwise, add the new conversation to the list
				return [conversation, ...current];
			});
		};

		// Update conversation handler
		const updateHandler = (conversation: FullConversationType) => {
			// Update the conversation
			setConversations((current) =>
				// Map through the current conversations
				current.map((currentConversation) => {
					// If the conversation id matches the current conversation id...
					if (currentConversation.id === conversation.id) {
						// Return the updated conversation
						return {
							...currentConversation,
							messages: conversation.messages,
						};
					}

					// Otherwise, return the current conversation
					return currentConversation;
				})
			);
		};

		const removeHandler = (conversation: FullConversationType) => {
			setConversations((current) => {
				return [...current.filter((convo) => convo.id !== conversation.id)];
			});

			if (conversationId === conversation.id) {
				router.push('/conversations');
			}
		};

		// Bind the new conversation handler to the 'conversation:new' event
		pusherClient.bind('conversation:new', newHandler);

		// Bind the update conversation handler to the 'conversation:update' event
		pusherClient.bind('conversation:update', updateHandler);

		// Bind the remove conversation handler to the 'conversation:remove' event
		pusherClient.bind('conversation:remove', removeHandler);

		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind('conversation:new', newHandler);
			pusherClient.unbind('conversation:update', updateHandler);
			pusherClient.unbind('conversation:remove', removeHandler);
		};
	}, [pusherKey, conversationId, router]);

	return (
		<>
			<GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
			<aside
				className={clsx(
					'fixed inset-y-0 pb-20 overflow-y-auto border-r border-gray-200 w-full left-0 lg:pb-0 lg:left-20 lg:w-80 lg:block',
					isOpen ? 'hidden' : 'block w-full left-0'
				)}
			>
				<div className='px-5'>
					<div className='flex justify-between items-center mb-4 pt-4'>
						{/* Title */}
						<div className='text-2xl font-bold text-neutral-800 py-4 pl-3'>Conversations</div>

						{/* Group conversation button */}
						<div
							onClick={() => setIsModalOpen(true)}
							title='Créer une conversation de groupe'
							className='rounded-md p-2  text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-[hsl(225,100%,35%)] transition duration-300'
						>
							<MdGroupAdd size={25} />
						</div>
					</div>
					{conversations.map((conversation) => (
						<ConversationBox key={conversation.id} data={conversation} selected={conversationId === conversation.id} />
					))}
				</div>
			</aside>
		</>
	);
};
export default ConversationList;
