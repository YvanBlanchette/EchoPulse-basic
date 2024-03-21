'use client';
import clsx from 'clsx';
import Link from 'next/link';

interface MobileItemProps {
	label: string;
	href: string;
	icon: any;
	active?: boolean;
	onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({ label, href, icon: Icon, active, onClick }) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Link
			href={href}
			title={label}
			onClick={handleClick}
			className={clsx(`group w-full flex justify-center p-4 text-sm leading-6 font-semibold text-gray-500`, active && 'bg-gray-100 text-black')}
		>
			<Icon className='h-8 w-8' />
			<span className='sr-only'>{label}</span>
		</Link>
	);
};
export default MobileItem;
