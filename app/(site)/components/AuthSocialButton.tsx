import { IconType } from 'react-icons';

interface AuthSocialButtonProps {
	title: string;
	icon: IconType;
	onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ icon: Icon, onClick, title }) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className='inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-[hsl(225,100%,60%)] hover:text-[hsl(225,100%,35%)] transition-all duration-300 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
			title={title}
		>
			<Icon className='text-2xl' />
		</button>
	);
};
export default AuthSocialButton;
