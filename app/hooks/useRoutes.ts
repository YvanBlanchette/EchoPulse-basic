import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BsFillPeopleFill, BsChatTextFill } from 'react-icons/bs';
import { BiSolidLogOut } from 'react-icons/bi';
import { signOut } from 'next-auth/react';
import useConversation from '@/app/hooks/useConversation';

const useRoutes = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: 'Discussions',
				href: '/conversations',
				icon: BsChatTextFill,
				active: pathname === '/conversations' || !!conversationId,
			},
			{
				label: 'Utilisateurs',
				href: '/users',
				icon: BsFillPeopleFill,
				active: pathname === '/users',
			},
			{
				label: 'Se déconnecter',
				href: '#',
				onClick: () => signOut(),
				icon: BiSolidLogOut,
			},
		],
		[pathname, conversationId]
	);

	return routes;
};

export default useRoutes;
