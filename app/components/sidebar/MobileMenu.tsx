'use client';
import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import MobileItem from './MobileItem';

const MobileMenu = () => {
	const routes = useRoutes();
	const { isOpen } = useConversation();

	if (isOpen) {
		return null;
	}

	return (
		<div className='fixed bottom-0 w-full bg-white border-t-[1px] lg:hidden z-40 flex justify-between items-center'>
			{routes.map((route) => (
				<MobileItem key={route.label} href={route.href} label={route.label} icon={route.icon} active={route.active} onClick={route.onClick} />
			))}
		</div>
	);
};
export default MobileMenu;
