import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiShield, 
  FiUsers, 
  FiTrendingUp, 
  FiCalendar,
  FiGlobe,
  FiClock,
  FiAward
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Stats de ejemplo
  const stats = [
    {
      label: 'Viajes Planeados',
      value: '0',
      icon: FiMapPin,
      color: 'from-[#D4AF37] to-[#B8962F]',
      iconBg: 'bg-[#D4AF37]/10',
    },
    {
      label: 'Destinos Visitados',
      value: '0',
      icon: FiGlobe,
      color: 'from-[#1E3A5F] to-[#2A4A7F]',
      iconBg: 'bg-[#1E3A5F]/10',
    },
    {
      label: 'Experiencias',
      value: '0',
      icon: HiSparkles,
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
    },
    {
      label: 'Puntos ALAYA',
      value: '0',
      icon: FiAward,
      color: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10',
    },
  ];

  const upcomingTrips = [
    // Vacío por ahora - se llenará con datos reales
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#1E3A5F]/20 to-[#1A1A1A] rounded-2xl p-6 lg:p-8 border border-[#2A2A2A] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1E3A5F] opacity-10 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Avatar */}
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.username}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl ring-4 ring-[#D4AF37] shadow-xl shadow-[#D4AF37]/20"
                />
              ) : (
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center text-[#0A0A0A] text-3xl lg:text-4xl font-bold shadow-xl shadow-[#D4AF37]/30 ring-4 ring-[#D4AF37]/30 font-['Inter']">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* User Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl lg:text-3xl font-['Playfair_Display'] font-bold text-white">
                    Bienvenido, {user?.username}
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-['Inter'] ${
                    user?.is_online 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-[#2A2A2A] text-[#E0E0E0]/60 border border-[#3A3A3A]'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${user?.is_online ? 'bg-green-400 animate-pulse' : 'bg-[#E0E0E0]/40'}`} />
                    {user?.is_online ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
                <p className="text-[#E0E0E0]/70 font-['Inter'] mb-2">
                  Viajero Premium • ID: {user?.uid}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#D4AF37] font-['Inter']">
                  <FiShield size={16} />
                  <span>Cuenta Verificada</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/dashboard/new-trip')}
                className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center gap-2"
              >
                <FiMapPin size={18} />
                <span>Planear Viaje</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/explore')}
                className="px-4 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-['Inter'] font-semibold hover:bg-[#3A3A3A] border border-[#3A3A3A] transition-all duration-300 flex items-center gap-2"
              >
                <FiGlobe size={18} />
                <span>Explorar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#D4AF37]/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={24} />
                </div>
                <FiTrendingUp className="text-green-400" size={18} />
              </div>
              <div>
                <p className="text-3xl font-['Playfair_Display'] font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[#E0E0E0]/60 font-['Inter']">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <FiCalendar className="text-[#D4AF37]" size={20} />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">
                Próximos Viajes
              </h3>
            </div>
            <button className="text-[#D4AF37] text-sm font-['Inter'] font-medium hover:text-[#E5C158] transition-colors">
              Ver todos
            </button>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-[#E0E0E0]/40" size={28} />
              </div>
              <p className="text-[#E0E0E0]/60 font-['Inter'] mb-4">
                Aún no tienes viajes planeados
              </p>
              <button
                onClick={() => navigate('/dashboard/new-trip')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
              >
                Planear mi primer viaje
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Aquí irían los viajes cuando existan */}
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          {/* Activity */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FiClock className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-['Playfair_Display'] font-bold text-white">
                Actividad Reciente
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-white font-['Inter']">
                    Cuenta creada exitosamente
                  </p>
                  <p className="text-xs text-[#E0E0E0]/50 font-['Inter'] mt-1">
                    Hace unos momentos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community */}
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#1E3A5F]/10 border border-[#D4AF37]/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                <FiUsers className="text-[#D4AF37]" size={20} />
              </div>
              <h3 className="text-lg font-['Playfair_Display'] font-bold text-white">
                Comunidad
              </h3>
            </div>
            <p className="text-sm text-[#E0E0E0]/70 font-['Inter'] mb-4">
              Únete a 50,000+ viajeros compartiendo experiencias únicas
            </p>
            <button className="w-full px-4 py-2.5 bg-[#2A2A2A] text-white rounded-lg font-['Inter'] font-medium hover:bg-[#3A3A3A] transition-all duration-300">
              Explorar comunidad
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info (solo en desarrollo) */}

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <h3 className="text-lg font-['Playfair_Display'] font-bold text-white mb-4">
            Información de Usuario (Debug)
          </h3>
          <pre className="text-xs text-[#E0E0E0]/70 overflow-auto bg-[#0A0A0A] p-4 rounded-lg border border-[#2A2A2A] font-mono">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
     
    </div>
  );
};