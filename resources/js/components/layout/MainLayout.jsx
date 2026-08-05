import React from 'react';

export default function MainLayout({ children }) {
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<header className="bg-white dark:bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
					<h1 className="text-lg font-semibold">App</h1>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
