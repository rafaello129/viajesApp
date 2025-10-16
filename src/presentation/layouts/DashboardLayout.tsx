import { type FC, type ReactNode } from "react";

import { useUiStore } from "../store/ui/useUiStore";
import { Footer, Sidebar, TopMenu } from "../components/ui";

interface Props { children: ReactNode; }

export const DashboardLayout: FC<Props> = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiStore();

  return (
    <div className="h-screen flex">
      {/* Sidebar mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
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
        <main className="flex-1 p-4 overflow-auto bg-[#F7F7F7] m-0 md:mx-3 md:mb-3 rounded-0 md:rounded-md">{children}</main>

        {/* Footer */}
        {/* <Footer /> */}

      </div>
    </div>
  );
};
