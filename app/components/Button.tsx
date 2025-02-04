'use client';
import clsx from 'clsx';

interface ButtonProps {
	type?: 'button' | 'submit' | 'reset' | undefined;
	fullWidth?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
	secondary?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, fullWidth, children, onClick, secondary, danger, disabled }) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={clsx(
				`flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 uppercase tracking-widest transition-all duration-300 `,
				disabled && 'opacity-30 hover:opacity-30 cursor-default',
				fullWidth && 'w-full',
				secondary ? 'text-gray-900 hover:text-red-600' : 'text-white',
				danger && 'bg-red-500 hover:bg-red-600 focus-visible:outline-red-600',
				!secondary && !danger && 'bg-[hsl(225,100%,30%)] hover:opacity-75 focus-visible:outline-[hsl(225,100%,60%)]'
			)}
		>
			{children}
		</button>
	);
};
export default Button;
