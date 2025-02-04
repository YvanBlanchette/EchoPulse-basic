'use client';

import ImageModal from '@/app/components/modals/ImageModal';
import Avatar from '@/app/components/sidebar/Avatar';
import { FullMessageType } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

interface MessageBoxProps {
	isLast?: boolean;
	data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
	// Get the current user from the session
	const session = useSession();

	// State to manage the image modal
	const [imageModalOpen, setImageModalOpen] = useState(false);

	// Verify is the message is our own message
	const isOwnMessage = session?.data?.user?.email === data?.sender?.email;

	// Make a list of user who have seen the message...
	const seenList = (data.seen || [])
		// but remove the sender from the list by filtering...
		.filter((user) => user.email !== data?.sender?.email)
		// map the users by name...
		.map((user) => user.name)
		// and join them in the list with a comma.
		.join(', ');

	// Create dynamic classes
	const container = clsx('flex gap-3 p-4 ', isOwnMessage && 'justify-end');
	const avatar = clsx(isOwnMessage && 'order-2');
	const body = clsx('flex flex-col gap-2', isOwnMessage && 'items-end');
	const message = clsx(
		'text-sm w-fit overflow-hidden',
		isOwnMessage ? 'bg-[hsl(225,100%,35%)] ring-2 ring-[hsl(225,100%,55%)] ring-offset-2 text-white' : 'bg-gray-100 ring-2 ring-gray-100 ring-offset-2',
		data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
	);

	return (
		<div className={container}>
			<div className={avatar}>
				<Avatar user={data.sender} />
			</div>
			<div className={body}>
				<div className='flex items-center gap-1'>
					<div className='text-sm text-gray-500'>{data.sender.name}</div>
					<div className='text-xs text-gray-400'>{format(new Date(data.createdAt), 'p')}</div>
				</div>
				<div className={message}>
					<ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
					{data.image ? (
						<Image
							onClick={() => setImageModalOpen(true)}
							alt='image'
							height='288'
							width='288'
							src={data.image}
							className='object-cover cursor-pointer hover:scale-110 transition translate'
						/>
					) : (
						<div>{data.body}</div>
					)}
				</div>
				{isLast && isOwnMessage && seenList.length > 0 && <div className='text-xs font-light text-gray-500'>{`Vu par ${seenList}`}</div>}
			</div>
		</div>
	);
};
export default MessageBox;
