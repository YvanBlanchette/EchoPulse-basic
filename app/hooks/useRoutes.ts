import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BsFillPeopleFill, BsChatTextFill } from 'react-icons/bs';
import { BiSolidLogOut } from 'react-icons/bi';
import { signOut } from 'next-auth/react';
import useConversation from '@/app/hooks/useConversation';

// This hook returns the routes for the sidebar
const useRoutes = () => {
	// Get the current pathname
	const pathname = usePathname();
	// Get the current conversation ID
	const { conversationId } = useConversation();

	// Define the routes
	const routes = useMemo(
		() => [
			{
				label: 'Conversations',
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

	// Return the routes
	return routes;
};

export default useRoutes;
