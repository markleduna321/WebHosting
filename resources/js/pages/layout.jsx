import { useState } from "react";
import SidebarSection from "./_sections/sidebar-section";
import TopbarSection from "./_sections/topbar-section";

export default function Layout({ children, title, subtitle }) {
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="h-full bg-white">
            <SidebarSection
                collapsed={desktopCollapsed}
                mobileOpen={mobileSidebarOpen}
                onToggleCollapse={() => setDesktopCollapsed((v) => !v)}
                onCloseMobile={() => setMobileSidebarOpen(false)}
            />
            <div
                className={`${
                    desktopCollapsed ? "lg:pl-20" : "lg:pl-72"
                } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection
                    title={title}
                    subtitle={subtitle}
                    onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
                />
                <main className="flex-1 p-6 bg-gray-100">
                    {/* Added the animation wrapper here */}
                    <div className="animate-slideUp">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}