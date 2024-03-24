import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/libs/authOptions';

// Function to get the session for the user...
export default async function getSession() {
	// ... and return the session passing on the authOptions
	return await getServerSession(authOptions);
}
