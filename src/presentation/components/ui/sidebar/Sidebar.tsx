import { Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../../../store/ui/useUiStore';
import { FiX } from 'react-icons/fi';
import { HiHome, HiSparkles, HiUsers } from 'react-icons/hi2';

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
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:m-3 md:rounded-xl
          flex flex-col
        `}
      >
        {/* Header con Logo */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-teal-50 md:rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <HiSparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Enterprise</h2>
                <p className="text-xs text-gray-600">Panel Admin</p>
              </div>
            </div>
            
            {/* Close button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-white/50 p-2 rounded-lg transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                  ${active 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white ' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={active ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600 transition-colors'}
                />
                <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-100 md:rounded-b-xl">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-gray-900">Sistema Activo</p>
            </div>
            <p className="text-xs text-gray-600">
              Versión 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};