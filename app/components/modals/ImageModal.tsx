'use client';

import Image from 'next/image';
import Modal from './Modal';

interface ImageModalProps {
	src?: string | null;
	isOpen?: boolean;
	onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
	if (!src) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className='w-80 h-80'>
				<Image src={src} alt='Image' fill className='object-cover' />
			</div>
		</Modal>
	);
};
export default ImageModal;
