import getCurrentUser from '@/app/actions/getCurrentUser';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

async function Sidebar({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser();

	return (
		<div className='h-full'>
			<DesktopMenu currentUser={currentUser!} />
			<MobileMenu />
			<main className='lg:pl-20 h-full'>{children}</main>
		</div>
	);
}

export default Sidebar;
