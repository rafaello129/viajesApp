import { HiBars3 } from "react-icons/hi2";
import { useUiStore } from "../../../store/ui/useUiStore";
import { CiLogin } from "react-icons/ci";


export const TopMenu = () => {

    const { isSidebarOpen, setIsSidebarOpen } = useUiStore();
    
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-[#F7F7F7] m-0 md:m-3 rounded-0 md:rounded-md">

            <button
                className="md:hidden text-gray-600 focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <HiBars3 size={25} />
            </button>

            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center space-x-4">
                <button
                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-300 transition"
                >
                <CiLogin size={25} className="text-gray-700" />
                <span className="hidden md:inline text-gray-700 font-medium">
                    Cerrar sesión
                </span>
                </button>
            </div>
        </header>
  )
}
