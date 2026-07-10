import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
	const { props } = usePage();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const user = props?.auth?.user;

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
			<Topbar user={user} onMenuClick={() => setSidebarOpen(true)} />
			<main className="lg:pl-72">
				<div className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					{children}
				</div>
			</main>
		</div>
	);
}
