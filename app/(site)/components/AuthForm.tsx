'use client';
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, set, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsFacebook, BsGoogle } from 'react-icons/bs';

// Screen Variants: Login | Register
type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
	// variant state
	const [variant, setVariant] = useState<Variant>('LOGIN');
	// isLoading state
	const [isLoading, setIsLoading] = useState(false);

	// Function to toggle between login and register
	const toggleVariant = useCallback(() => {
		// If the variant is login...
		if (variant === 'LOGIN') {
			// set it to register...
			setVariant('REGISTER');
		} else {
			// otherwise set it to login.
			setVariant('LOGIN');
		}
	}, [variant]);

	// React Hook Form
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			phone: '',
			email: '',
			password: '',
		},
	});

	// Function to handle form submission
	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);

		if (variant === 'REGISTER') {
			//Axios Register
		}

		if (variant === 'LOGIN') {
			//NextAuth SignIn
		}

		// Social Auth SignIn
		const socialAction = (action: string) => {
			setIsLoading(true);
			// NextAuth Social SignIn
		};
	};

	return (
		<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
			{/* Conditionnal title */}
			<h2 className='mb-6 text-center text-2xl font-semibold tracking-tight text-[hsl(30,70%,60%)]'>
				{variant === 'LOGIN' ? 'Connectez-vous à votre compte' : 'Créer votre compte'}
			</h2>

			{/* Form */}
			<div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					{/* Name */}
					{variant === 'REGISTER' && (
						<Input label='Nom' id='name' register={register} errors={errors} disabled={isLoading} placeholder='Inscrire votre nom...' />
					)}
					{/* Email */}
					<Input
						label='Adresse Courriel'
						id='email'
						type='email'
						register={register}
						errors={errors}
						disabled={isLoading}
						placeholder='Inscrire votre courriel...'
					/>
					{/* Password */}
					<Input
						label='Mot de Passe'
						id='password'
						type='password'
						register={register}
						errors={errors}
						disabled={isLoading}
						placeholder='Inscrire votre mot de passe...'
					/>
					{/* Confirm Password */}
					{variant === 'REGISTER' && (
						<Input
							label=''
							id='confirmPassword'
							type='password'
							register={register}
							errors={errors}
							disabled={isLoading}
							placeholder='Confirmer votre mot de passe...'
						/>
					)}

					{/* Submit button */}
					<div>
						<Button disabled={isLoading} fullWidth type='submit'>
							{variant === 'LOGIN' ? 'Connection' : 'Enregistrer'}
						</Button>
					</div>
				</form>

				{/* Social logins */}
				<div className='mt-6'>
					{variant === 'LOGIN' && (
						<>
							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-gray-300' />
								</div>
								<div className='relative flex justify-center text-sm'>
									<span className='bg-white px-3 text-gray-500'>Ou se connecter avec</span>
								</div>
							</div>

							{/* Socials */}
							<div className='mt-6 flex gap-2'>
								<AuthSocialButton title='Se Connecter avec votre compte Facebook' icon={BsFacebook} onClick={() => socialAction('facebook')} />
								<AuthSocialButton title='Se Connecter avec votre compte Google' icon={BsGoogle} onClick={() => socialAction('google')} />
							</div>
						</>
					)}

					{/* Toggle between login and register */}
					<div className='flex flex-col gap-2 items-center justify-center text-sm mt-6 px-2 text-gray-500'>
						<div>{variant === 'LOGIN' ? "Vous n'avez pas de compte EchoPulse?" : 'Vous avez déjà un compte EchoPulse?'}</div>
						<div onClick={toggleVariant} className='underline cursor-pointer block font-medium hover:text-[hsl(225,100%,40%)]'>
							{variant === 'LOGIN' ? 'Créer un compte' : 'Se connecter'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default AuthForm;
