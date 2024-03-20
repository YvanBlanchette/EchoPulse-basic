'use client';
import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
	label: string;
	id: string;
	type?: string;
	required?: boolean;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors;
	disabled?: boolean;
	placeholder?: string;
}

const input: React.FC<InputProps> = ({ label, id, type, required, register, errors, disabled, placeholder }) => {
	return (
		<div>
			<label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
				{label}
			</label>
			<div className='mt-2'>
				<input
					id={id}
					type={type}
					autoComplete={id}
					disabled={disabled}
					{...register(id, { required })}
					className={clsx(
						'form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[hsl(225,100%,30%)] sm:text-sm sm:leading-6',
						errors[id] && 'focus:ring-red-600',
						disabled && 'opacity-50 cursor-default'
					)}
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
};
export default input;
