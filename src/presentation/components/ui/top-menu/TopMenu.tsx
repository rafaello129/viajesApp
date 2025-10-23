import { HiBars3, HiChevronDown } from "react-icons/hi2";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "../../../store/ui/useUiStore";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

import { useState, useRef, useEffect } from "react";
export const TopMenu = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    toast.custom(
      (t) => (
        <div
          className={` inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${
            t.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Fondo semitransparente */}
          <div
            className="absolute  backdrop-blur-sm"
            onClick={() => toast.dismiss(t.id)}
          ></div>
  
          {/* Modal centrado */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center transform transition-all duration-300 scale-100">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              ¿Cerrar sesión?
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Tu sesión se cerrará y deberás iniciar de nuevo.
            </p>
  
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  await logout();
                  toast.success("Sesión cerrada correctamente");
                  navigate("/auth/login", { replace: true });
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-lg"
              >
                Cerrar sesión
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // no se cierra solo
        position: "top-center", // no afecta, pero debe estar presente
      }
    );
  };
  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 h-16 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95 m-0 md:m-3 md:mb-0 rounded-0 md:rounded-t-xl shadow-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-all active:scale-95"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <HiBars3 size={24} />
        </button>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">Bienvenido de nuevo</p>
        </div>
      </div>

      {/* Right Section - User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200"
        >
          {/* User Avatar */}
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.username}
              className="w-9 h-9 rounded-full ring-2 ring-gray-200 group-hover:ring-emerald-400 transition-all"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-gray-200 group-hover:ring-emerald-400 transition-all">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Info (Desktop) */}
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-gray-900">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || 'Usuario'}
            </p>
          </div>

          {/* Dropdown Arrow */}
          <HiChevronDown 
            className={`hidden md:block text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 overflow-hidden animate-fade-in">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.username}
                      className="w-12 h-12 rounded-full ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {user?.role || 'Usuario'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/dashboard/profile');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center gap-3 group"
                >
                  <FiUser className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={18} />
                  <span className="font-medium">Mi Perfil</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center gap-3 group"
                >
                  <FiSettings className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={18} />
                  <span className="font-medium">Configuración</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 group font-medium"
                >
                  <FiLogOut className="text-red-500 group-hover:text-red-600 transition-colors" size={18} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};