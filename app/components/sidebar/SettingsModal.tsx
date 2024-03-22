'use client';

import { User } from '@prisma/client';
import Modal from '../Modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {
	currentUser: User;
	isOpen?: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentUser, isOpen, onClose }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: currentUser?.name,
			image: currentUser?.image,
		},
	});

	const image = watch('image');

	const handleUpload = (result: any) => {
		setValue('image', result?.info?.secure_url, { shouldValidate: true });
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		axios
			.post('/api/settings', data)
			.then(() => {
				router.refresh();
				onClose();
			})
			.catch(() => toast.error('Une erreur est survenue lors de la mise à jour de vos paramètres.'))
			.finally(() => setIsLoading(false));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='space-y-12'>
					<div className='border-gray-900/10 pb-12'>
						<h2 className='text-base font-semibold leading-7 text-gray-900'>Profil</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600'>Modifier vos informations personelles</p>
						<div className='mt-10 flex flex-col gap-y-8'>
							<Input disabled={isLoading} label='Nom' id='name' errors={errors} required register={register} />
							<div>
								<label className='block mt-2 text-sm font-medium leading-6 text-gray-900'>Photo de Profil</label>
								<div className='mt-4 flex items-center gap-x-3'>
									<Image
										width='100'
										height='100'
										className='rounded-full'
										src={image || currentUser?.image || '/images/placeholder.jpg'}
										alt={`Photo de ${currentUser.name}`}
									/>
									<CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset='lpqi1tte'>
										<Button type='button' secondary disabled={isLoading}>
											Modifier
										</Button>
									</CldUploadButton>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-4 flex items-center justify-end gap-x-6'>
						<Button type='button' onClick={onClose} secondary disabled={isLoading}>
							Annuler
						</Button>
						<Button type='submit' disabled={isLoading}>
							Enregistrer
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
};
export default SettingsModal;
