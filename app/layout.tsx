import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToasterContext from '@/app/context/ToasterContext';
import AuthContext from '@/app/context/AuthContext';
import ActiveStatus from './components/ActiveStatus';

const montserrat = Montserrat({ subsets: ['latin'] });

export const dynamic = 'force-dynamic'; 

export const metadata: Metadata = {
	title: 'EchoPulse',
	description: 'The NextGen Messaging App!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={montserrat.className}>
				<AuthContext>
					<ToasterContext />
					<ActiveStatus />
					{children}
				</AuthContext>
			</body>
		</html>
	);
}
