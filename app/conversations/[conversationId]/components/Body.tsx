'use client';
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import { Conversation, User } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);
	const { conversationId } = useConversation();

	useEffect(() => {
		// Mark the conversation as seen when the component mounts
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	useEffect(() => {
		// Subscribe to the conversation
		pusherClient.subscribe(conversationId);
		// Scroll to the bottom of the chat
		bottomRef.current?.scrollIntoView();

		// Function to handle new messages from Pusher
		const messageHandler = (message: FullMessageType) => {
			// Mark the conversation as seen
			axios.post(`/api/conversations/${conversationId}/seen`);
			// Update the list of messages
			setMessages((current) => {
				// If the message is already in the list of messages...
				if (find(current, { id: message.id })) {
					// return the current list of messages.
					return current;
				}
				// Otherwise, return the current list of messages with the new message added
				return [...current, message];
			});

			// And scroll to the bottom of the chat
			bottomRef.current?.scrollIntoView();
		};

		// Function to handle updated messages from Pusher
		const updateMessageHandler = (newMessage: FullMessageType) => {
			// Update the message in the list of messages
			setMessages((current) =>
				// Map over the current list of messages
				current.map((currentMessage) => {
					// If the current message is the same as the new message...
					if (currentMessage.id === newMessage.id) {
						// Return the new message
						return newMessage;
					}

					// Otherwise, return the current message
					return currentMessage;
				})
			);
		};

		// When a new message is received, update the list of messages
		pusherClient.bind('messages:new', messageHandler);

		// When a message is updated, update the message in the list of messages
		pusherClient.bind('message:update', updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind('messages:new', messageHandler);
			pusherClient.unbind('message:update', updateMessageHandler);
		};
	}, [conversationId]);

	return (
		<div className='flex-1 overflow-y-auto'>
			{messages.map((message, index) => (
				<MessageBox isLast={index === messages.length - 1} key={message.id} data={message} />
			))}
			<div ref={bottomRef} className='pt-24' />
		</div>
	);
};
export default Body;
