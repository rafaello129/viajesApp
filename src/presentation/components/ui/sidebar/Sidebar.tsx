

import { Link } from 'react-router-dom'
import { useUiStore } from '../../../store/ui/useUiStore';

export const Sidebar = () => {
      
    const { isSidebarOpen } = useUiStore();

    return (
        <aside
                className={`
                m-0 md:my-3 md:ms-3 rounded-0 md:rounded-md p-4
                fixed inset-y-0 left-0 z-30 w-64 bg-[#F7F7F7] 
                transform transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0
                `}
            >
                <div className="flex items-center justify-center mb-6">
                    <img
                        src='./vite.svg'
                        alt="Logo"
                        className="h-20 w-auto"
                    />
                </div>
        
                <div className="mb-4 text-gray-600 font-bold border-b border-gray-300">Menú</div>
        
                <nav className="space-y-2">
                    <Link
                        to="#"
                        className="flex items-center gap-2 px-2 py-1 hover:font-bold text-gray-700 transition"
                    >
                        Clientes
                    </Link>
                    <Link
                        to="/usuarios"
                        className="flex items-center gap-2 px-2 py-1 hover:font-bold text-gray-700 transition"
                    >
                        Usuarios
                    </Link>
                </nav>
            </aside>
    )
}
