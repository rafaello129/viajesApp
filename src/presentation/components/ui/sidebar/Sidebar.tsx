import { Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../../../store/ui/useUiStore';
import { FiX, FiMapPin } from 'react-icons/fi';
import { HiHome, HiUsers } from 'react-icons/hi2';

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiStore();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard/home',
      icon: HiHome,
      label: 'Inicio',
    },
    {
      path: '/dashboard/users',
      icon: HiUsers,
      label: 'Usuarios',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          bg-[#1A1A1A] border-r border-[#2A2A2A]
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:m-3 md:rounded-xl
          flex flex-col shadow-2xl shadow-black/50
        `}
      >
        {/* Header con Logo ALAYA */}
        <div className="p-6 border-b border-[#2A2A2A] bg-gradient-to-br from-[#0A0A0A] via-[#1E3A5F]/20 to-[#0A0A0A] md:rounded-t-xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-5 blur-3xl rounded-full" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 rotate-3 transition-transform hover:rotate-0 duration-300">
                <FiMapPin className="text-[#0A0A0A]" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-['Playfair_Display'] font-bold text-white">ALAYA</h2>
                <p className="text-xs text-[#D4AF37] font-['Inter'] tracking-wider">DASHBOARD</p>
              </div>
            </div>
            
            {/* Close button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[#E0E0E0] hover:text-[#D4AF37] hover:bg-[#2A2A2A] p-2 rounded-lg transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-3 px-3 text-xs font-semibold text-[#E0E0E0]/40 uppercase tracking-wider font-['Inter']">
            Menú Principal
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all group font-['Inter'] relative overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/20' 
                    : 'text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#D4AF37]'
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
                
                <Icon 
                  size={20} 
                  className={`relative z-10 ${active ? 'text-[#0A0A0A]' : 'text-[#E0E0E0]/60 group-hover:text-[#D4AF37] transition-colors'}`}
                />
                <span className={`relative z-10 font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse relative z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#2A2A2A] md:rounded-b-xl">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#1E3A5F]/10 rounded-lg p-3 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <p className="text-xs font-semibold text-white font-['Inter']">Sistema Activo</p>
            </div>
            <p className="text-xs text-[#E0E0E0]/60 font-['Inter']">
              Versión 1.0.0 • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};