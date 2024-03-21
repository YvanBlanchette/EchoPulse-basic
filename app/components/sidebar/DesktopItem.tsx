'use client';
import clsx from 'clsx';
import Link from 'next/link';

interface DesktopItemProps {
	label: string;
	href: string;
	icon: any;
	active?: boolean;
	onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItemProps> = ({ label, href, icon: Icon, active, onClick }) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<li onClick={handleClick}>
			<Link
				href={href}
				title={label}
				className={clsx(
					'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-[hsl(225,100%,35%)] hover:bg-gray-100',
					active && 'text-[hsl(225,100%,35%)] bg-gray-100'
				)}
			>
				<Icon className='h-8 w-8 shrink-0' />
				<span className='sr-only'>{label}</span>
			</Link>
		</li>
	);
};

export default DesktopItem;
