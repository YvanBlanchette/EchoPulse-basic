'use client';

import Avatar from '@/app/components/sidebar/Avatar';
import useOtherUser from '@/app/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/app/components/sidebar/AvatarGroup';
import useActiveList from '@/app/hooks/useActiveList';

interface HeaderProps {
	conversation: Conversation & {
		users: User[];
	};
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
	const otherUser = useOtherUser(conversation);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const { members } = useActiveList();
	const isActive = members.indexOf(otherUser?.email!) !== -1;

	const statusText = useMemo(() => {
		if (conversation.isGroup) {
			return `${conversation.users.length} membres`;
		}

		return isActive ? 'en ligne' : 'hors ligne';
	}, [conversation, isActive]);

	return (
		<>
			<ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
			<div className='bg-white w-full flex border-b-[1px] py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
				<div className='flex gap-3 items-center'>
					<Link href='/conversations' className='lg:hidden block text-[hsl(30,80%,60%)] hover:text-[hsl(225,100%,35%)] transition cursor-pointer'>
						<HiChevronLeft size={32} />
					</Link>

					{conversation.isGroup ? <AvatarGroup users={conversation.users} /> : <Avatar user={otherUser} />}
					<div className='flex flex-col'>
						<div>{conversation.name || otherUser.name}</div>
						<div className='text-sm font-light text-neutral-500'>{statusText}</div>
					</div>
				</div>
				<HiEllipsisHorizontal
					size={32}
					onClick={() => setDrawerOpen(true)}
					className='cursor-pointer hover:text-[hsl(30,80%,60%)] text-[hsl(225,100%,40%)] transition'
				/>
			</div>
		</>
	);
};
export default Header;
