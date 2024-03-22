'use client';

import Modal from '@/app/components/Modal';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface GroupChatModalProps {
	isOpen?: boolean;
	onClose: () => void;
	users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users }) => {
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
			name: '',
			members: [],
		},
	});

	const members = watch('members');
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		axios
			.post('/api/conversations', { ...data, isGroup: true })
			.then(() => {
				router.refresh();
				onClose();
			})
			.catch(() => toast.error('Une erreur est survenue lors de la création du groupe'))
			.finally(() => setIsLoading(false));
	};

	return;

	<Modal isOpen={isOpen} onClose={onClose}>
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='space-y-12'></div>
		</form>
	</Modal>;
};
export default GroupChatModal;