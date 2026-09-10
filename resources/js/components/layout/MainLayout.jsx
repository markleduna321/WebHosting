import { useSelector } from 'react-redux';
import cn from 'classnames';
import { selectSidebarCollapsed } from '@/features/ui/uiSlice';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children, title, subtitle }) {
	const collapsed = useSelector(selectSidebarCollapsed);

	return (
		<div className="min-h-screen bg-white">
			<Sidebar />

			<div
				className={cn(
					'flex min-h-screen flex-col transition-[padding] duration-300',
					collapsed ? 'lg:pl-16' : 'lg:pl-64'
				)}
			>
				<Topbar title={title} subtitle={subtitle} />

				<main className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-8">
					<div className="animate-slideUp">{children}</div>
				</main>
			</div>
		</div>
	);
}
