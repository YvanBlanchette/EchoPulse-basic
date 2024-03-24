import Image from 'next/image';

const EmptyState = () => {
	return (
		<div className='px-4 py-10 sm:px-6 lg:px-8 h-full flex items-center justify-center bg-gray-100'>
			<div className='flex flex-col text-center items-center'>
				<div className='flex gap-2 justify-center items-center mx-auto my-auto mb-5'>
					<Image alt='EchoPulse logo' src={'/images/EchoPulse_logo.svg'} width='0' height='0' sizes='100vw' style={{ width: '60px', height: '60px' }} />
					<h1 className='font-semibold text-5xl text-[hsl(225,100%,30%)] tracking-tight'>
						Echo<span className='font-light text-[hsl(30,80%,60%)]'>Pulse</span>
					</h1>
				</div>
				<h3 className='mt-2 text-2xl font-medium text-gray-900'>Sélectionnez une conversation ou démarrez en une nouvelle</h3>
			</div>
		</div>
	);
};
export default EmptyState;
