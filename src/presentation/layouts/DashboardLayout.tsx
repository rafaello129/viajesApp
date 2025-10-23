import { type FC, type ReactNode } from "react";
import { useUiStore } from "../store/ui/useUiStore";
import { Footer, Sidebar, TopMenu } from "../components/ui";

interface Props { 
  children: ReactNode; 
}

export const DashboardLayout: FC<Props> = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen">
       
        {/* TopMenu */}
        <TopMenu />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 m-0 md:mx-3 md:mb-3">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
};