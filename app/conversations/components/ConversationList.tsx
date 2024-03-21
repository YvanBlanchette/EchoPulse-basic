'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/types';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';

interface ConversationListProps {
	initialConversations: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({ initialConversations }) => {
	const [conversations, setConversations] = useState(initialConversations);
	const router = useRouter();

	const { conversationId, isOpen } = useConversation();

	return (
		<aside
			className={clsx(
				'fixed inset-y-0 pb-20 overflow-y-auto border-r border-gray-200 w-full left-0 lg:pb-0 lg:left-20 lg:w-80 lg:block',
				isOpen ? 'hidden' : 'block w-full left-0'
			)}
		>
			<div className='px-5'>
				<div className='flex justify-between items-center mb-4 pt-4'>
					<div className='text-2xl font-bold text-neutral-800 py-4 pl-3'>Conversations</div>
					<div className='rounded-md p-2  text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-[hsl(225,100%,35%)] transition duration-300'>
						<MdGroupAdd size={35} />
					</div>
				</div>
				{conversations.map((conversation) => (
					<ConversationBox key={conversation.id} data={conversation} selected={conversationId === conversation.id} />
				))}
			</div>
		</aside>
	);
};
export default ConversationList;
