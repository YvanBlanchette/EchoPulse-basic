'use client';
import { signOut } from 'next-auth/react';

const page = () => {
	return (
		<div>
			<h1>Hello Users</h1>
			<button onClick={() => signOut()}>Se déconnecter</button>
		</div>
	);
};
export default page;
