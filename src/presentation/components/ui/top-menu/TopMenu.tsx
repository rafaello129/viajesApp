import { HiBars3, HiChevronDown } from "react-icons/hi2";
import { FiLogOut, FiUser, FiSettings, FiMapPin } from "react-icons/fi";
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
          className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${
            t.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Fondo semitransparente */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => toast.dismiss(t.id)}
          ></div>
  
          {/* Modal centrado - ALAYA Style */}
          <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl mt-14 p-8 w-[90%] max-w-md  transform transition-all duration-300 scale-100">
            {/* Decorative element */}
            <div className=" top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center shadow-xl shadow-[#D4AF37]/30">
                <FiLogOut className="text-[#0A0A0A]" size={28} />
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl lg:text-3xl font-['Playfair_Display'] font-bold text-white mb-3">
                ¿Cerrar Sesión?
              </h2>
              <p className="text-[#E0E0E0]/70 mb-8 text-base font-['Inter']">
                Tu sesión se cerrará y deberás iniciar de nuevo para acceder a ALAYA.
              </p>
    
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={async () => {
                    toast.dismiss(t.id);
                    await logout();
                    toast.success("Sesión cerrada correctamente", {
                      style: {
                        background: '#1A1A1A',
                        color: '#fff',
                        border: '1px solid #2A2A2A',
                      },
                    });
                    navigate("/auth/login", { replace: true });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-['Inter'] font-semibold shadow-lg hover:shadow-red-500/25"
                >
                  Cerrar sesión
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-6 py-3 bg-[#2A2A2A] text-[#E0E0E0] rounded-xl hover:bg-[#3A3A3A] transition-all duration-300 font-['Inter'] font-semibold border border-[#3A3A3A]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
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
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] backdrop-blur-sm bg-[#1A1A1A]/95 m-0 md:m-3 md:mb-0 rounded-0 md:rounded-t-xl shadow-lg shadow-black/20">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-[#E0E0E0] hover:text-[#D4AF37] focus:outline-none hover:bg-[#2A2A2A] p-2 rounded-lg transition-all active:scale-95"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <HiBars3 size={24} />
        </button>

        {/* Title */}
        <div>
          <h1 className="text-xl font-['Playfair_Display'] font-bold text-white">
            Dashboard
          </h1>
          <p className="text-xs text-[#E0E0E0]/60 hidden sm:block font-['Inter']">
            Bienvenido de nuevo a ALAYA
          </p>
        </div>
      </div>

      {/* Right Section - User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg hover:bg-[#2A2A2A] transition-all group border border-transparent hover:border-[#D4AF37]/30"
        >
          {/* User Avatar */}
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.username}
              className="w-9 h-9 rounded-full ring-2 ring-[#2A2A2A] group-hover:ring-[#D4AF37] transition-all"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center text-[#0A0A0A] text-sm font-bold shadow-md ring-2 ring-[#2A2A2A] group-hover:ring-[#D4AF37] transition-all font-['Inter']">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Info (Desktop) */}
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-white font-['Inter']">
              {user?.username}
            </p>
            <p className="text-xs text-[#E0E0E0]/60 capitalize font-['Inter']">
              {user?.role || 'Usuario'}
            </p>
          </div>

          {/* Dropdown Arrow */}
          <HiChevronDown 
            className={`hidden md:block text-[#E0E0E0]/60 group-hover:text-[#D4AF37] transition-all duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl py-2 overflow-hidden animate-fade-in">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-[#2A2A2A] bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                <div className="flex items-center gap-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.username}
                      className="w-12 h-12 rounded-full ring-2 ring-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center text-[#0A0A0A] font-bold text-lg ring-2 ring-[#D4AF37] font-['Inter']">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate font-['Inter']">
                      {user?.username}
                    </p>
                    <p className="text-xs text-[#E0E0E0]/70 capitalize font-['Inter']">
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
                  className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#D4AF37] transition-all flex items-center gap-3 group font-['Inter']"
                >
                  <FiUser className="text-[#E0E0E0]/60 group-hover:text-[#D4AF37] transition-colors" size={18} />
                  <span className="font-medium">Mi Perfil</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#D4AF37] transition-all flex items-center gap-3 group font-['Inter']"
                >
                  <FiSettings className="text-[#E0E0E0]/60 group-hover:text-[#D4AF37] transition-colors" size={18} />
                  <span className="font-medium">Configuración</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-[#2A2A2A] pt-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center gap-3 group font-medium font-['Inter']"
                >
                  <FiLogOut className="text-red-400 group-hover:text-red-300 transition-colors" size={18} />
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