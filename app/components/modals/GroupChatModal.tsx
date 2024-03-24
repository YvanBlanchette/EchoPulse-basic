'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';

import Input from '../inputs/Input';
import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import Select from '../inputs/Select';

interface GroupChatModalProps {
	isOpen?: boolean;
	onClose: () => void;
	users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users = [] }) => {
	// Initialize the router
	const router = useRouter();
	// Initialize the loading state
	const [isLoading, setIsLoading] = useState(false);

	// Initialize the form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			members: [],
		},
	});

	// Watch members to update the form value
	const members = watch('members');

	// Function to handle the form submit
	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		// Set loading to true
		setIsLoading(true);

		// Make an axios request to create a group chat
		axios
			.post('/api/conversations', {
				...data,
				isGroup: true,
			})
			.then(() => {
				router.refresh();
				onClose();
			})
			.catch(() => toast.error('Une erreur est survenue lors de la création de la conversation. Veuillez réessayer.'))
			.finally(() => setIsLoading(false));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='space-y-12'>
					<div className='border-b border-gray-900/10 pb-12'>
						<h2
							className='
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              '
						>
							Conversation de groupe
						</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600'>Créer une conversation avec plusieurs personnes.</p>
						<div className='mt-10 flex flex-col gap-y-8'>
							<Input disabled={isLoading} label='Nom du groupe' id='name' errors={errors} required register={register} />
							<Select
								disabled={isLoading}
								label='Membres'
								options={users.map((user) => ({ value: user.id, label: user.name }))}
								onChange={(value) => setValue('members', value, { shouldValidate: true })}
								value={members}
							/>
						</div>
					</div>
				</div>
				<div className='mt-6 flex items-center justify-end gap-x-6'>
					<Button disabled={isLoading} onClick={onClose} type='button' secondary>
						Annuler
					</Button>
					<Button disabled={isLoading} type='submit'>
						Démarrer
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default GroupChatModal;
