'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { FaWifi } from 'react-icons/fa';
import { CldUploadButton } from 'next-cloudinary';

interface FormProps {}

const Form: React.FC<FormProps> = () => {
	const { conversationId } = useConversation();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FieldValues>({ defaultValues: { message: '' } });

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setValue('message', '', { shouldValidate: true });

		axios.post('/api/messages', { ...data, conversationId });
	};

	const handleUpload = (result: any) => {
		axios.post('/api/messages', {
			image: result?.info?.secure_url,
			conversationId,
		});
	};

	return (
		<div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
			<CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset='lpqi1tte'>
				<HiPhoto size={30} className='hover:text-[hsl(225,100%,35%)] text-[hsl(225,100%,75%)] transition cursor-pointer' title='Envoyer une image' />
			</CldUploadButton>
			<form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
				<MessageInput id='message' register={register} error={errors} placeholder='Contenu de votre echo...' title='Contenu de votre echo...' />
			</form>
			<button
				type='submit'
				className='rounded-full p-1 cursor-pointer hover:bg-[hsl(225,100%,35%)] bg-[hsl(225,100%,75%)] text-white transition'
				title='Envoyer votre Echo'
			>
				<FaWifi size={24} className='rotate-[90deg] scale-y-110 scale-x-90' />
			</button>
		</div>
	);
};
export default Form;
