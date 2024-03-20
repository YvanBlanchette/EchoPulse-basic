import Image from 'next/image';
import AuthForm from './components/AuthForm';

export default function Home() {
	return (
		<div className='flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8 bg-gray-100'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='flex gap-2 justify-center items-center mx-auto my-auto'>
					<Image alt='EchoPulse logo' src={'/images/EchoPulse_logo.svg'} width={60} height={60} />
					<h1 className='font-semibold text-5xl text-[hsl(225,100%,30%)] tracking-tight'>
						Echo<span className='font-light'>Pulse</span>
					</h1>
				</div>
			</div>
			<AuthForm />
		</div>
	);
}
