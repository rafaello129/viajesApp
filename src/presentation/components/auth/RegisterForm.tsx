import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiChevronDown, FiLock, FiUser, FiUserPlus, FiMapPin, FiShield, FiMail } from 'react-icons/fi';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [validationError, setValidationError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    clearError();
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    // Validar fortaleza mínima de contraseña
    if (passwordStrength < 2) {
      setValidationError('La contraseña debe tener al menos 8 caracteres, mayúsculas y minúsculas');
      return;
    }

    try {
      await register({
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  const displayError = error || validationError;

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength <= 3) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0A0A0A]">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden relative bg-gradient-to-br from-[#0A0A0A] via-[#1E3A5F] to-[#0A0A0A] p-6 pb-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37] opacity-[0.07] blur-[100px] rounded-full animate-pulse" />
        
        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#E5C158] to-[#B8962F] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30 rotate-3 transition-transform hover:rotate-0 duration-500">
              <FiMapPin className="text-[#0A0A0A]" size={32} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#1E3A5F] rounded-full border-2 border-[#0A0A0A]" />
          </div>
          <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight mb-1">
            ALAYA
          </h1>
          <p className="text-[#D4AF37] text-xs tracking-[0.2em] font-['Inter'] font-medium">
            LUXURY TRAVEL
          </p>
        </div>

        {/* Tagline */}
        <div className="relative z-10 text-center mb-6">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white leading-tight mb-2">
            Comienza tu
            <br />
            <span className="text-[#D4AF37]">Aventura de Lujo</span>
          </h2>
          <p className="text-sm text-[#E0E0E0]/80 font-['Inter'] max-w-sm mx-auto">
            Únete a viajeros exclusivos que exploran el mundo con seguridad
          </p>
        </div>

        {/* Expandable benefits section */}
        <div className="relative z-10">
          <button
            onClick={() => setShowMobileInfo(!showMobileInfo)}
            className="w-full flex items-center justify-center gap-2 text-[#D4AF37] text-sm font-['Inter'] font-medium py-2 transition-all duration-300"
          >
            <span>{showMobileInfo ? 'Ocultar beneficios' : 'Ver beneficios'}</span>
            <FiChevronDown 
              className={`transition-transform duration-300 ${showMobileInfo ? 'rotate-180' : ''}`} 
              size={16} 
            />
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ${showMobileInfo ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 bg-[#1A1A1A]/50 backdrop-blur-sm p-3 rounded-lg border border-[#2A2A2A]">
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-[#D4AF37]" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                    Viajes 100% Seguros
                  </h3>
                  <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                    Protección y asistencia en cada paso de tu viaje
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-[#1A1A1A]/50 backdrop-blur-sm p-3 rounded-lg border border-[#2A2A2A]">
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <svg className="text-[#D4AF37]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                    Comunidad Exclusiva
                  </h3>
                  <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                    Conecta con viajeros de élite de todo el mundo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1A1A1A]/50 backdrop-blur-sm p-3 rounded-lg border border-[#2A2A2A]">
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <svg className="text-[#D4AF37]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                    Experiencias Curadas
                  </h3>
                  <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                    Acceso VIP a destinos y eventos únicos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Left side - ALAYA Brand Experience */}
      <div className="hidden lg:flex relative lg:w-1/2 bg-gradient-to-br from-[#0A0A0A] via-[#1E3A5F] to-[#0A0A0A] p-16 flex-col justify-between overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.07] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1E3A5F] opacity-10 blur-[120px] rounded-full" />
        
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="bg-grid-pattern w-full h-full" />
        </div>

        {/* Logo/Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#E5C158] to-[#B8962F] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30 rotate-3 transition-transform hover:rotate-0 duration-500">
                <FiMapPin className="text-[#0A0A0A]" size={28} strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1E3A5F] rounded-full border-2 border-[#0A0A0A]" />
            </div>
            <div>
              <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
                ALAYA
              </h1>
              <p className="text-[#D4AF37] text-xs tracking-[0.2em] font-['Inter'] font-medium">
                LUXURY TRAVEL
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8 max-w-xl">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-['Playfair_Display'] font-bold text-white leading-[1.1]">
              Comienza tu
              <br />
              <span className="text-[#D4AF37]">Aventura de Lujo</span>
            </h2>
            <p className="text-lg text-[#E0E0E0] leading-relaxed font-['Inter']">
              Únete a una comunidad exclusiva de viajeros que exploran Latinoamérica con seguridad, estilo y experiencias inolvidables.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all duration-300">
                <FiShield className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                  Viajes 100% Seguros
                </h3>
                <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                  Protección y asistencia en cada paso de tu viaje
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all duration-300">
                <svg className="text-[#D4AF37]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                  Comunidad Exclusiva
                </h3>
                <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                  Conecta con viajeros de élite de todo el mundo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-all duration-300">
                <svg className="text-[#D4AF37]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-['Inter'] font-semibold text-sm mb-1">
                  Experiencias Curadas
                </h3>
                <p className="text-[#E0E0E0]/70 text-xs font-['Inter']">
                  Acceso VIP a destinos y eventos únicos
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#2A2A2A]">
            <div>
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#D4AF37] mb-1">50K+</div>
              <div className="text-xs text-[#E0E0E0]/60 font-['Inter']">Viajeros Activos</div>
            </div>
            <div>
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#D4AF37] mb-1">150+</div>
              <div className="text-xs text-[#E0E0E0]/60 font-['Inter']">Destinos</div>
            </div>
            <div>
              <div className="text-3xl font-['Playfair_Display'] font-bold text-[#D4AF37] mb-1">24/7</div>
              <div className="text-xs text-[#E0E0E0]/60 font-['Inter']">Soporte</div>
            </div>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-[#D4AF37] to-transparent" />
            <span className="text-xs text-[#D4AF37] font-['Inter'] font-medium tracking-[0.15em]">
              SINCE 2025
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-[#E0E0E0]/50 text-sm font-['Inter']">
            <a 
              href="https://octramtechnologies.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors duration-300"
            >
              OCTRAM TECHNOLOGIES
            </a>
            {" "}© {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[#E0E0E0]/50 text-xs font-['Inter']">Sistema Activo</span>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="lg:w-1/2 bg-[#0A0A0A] flex items-center justify-center p-6 lg:p-16 flex-1">
        <div className="w-full max-w-md space-y-6 lg:space-y-7 animate-fade-in">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2 lg:mb-3">
              <span className="text-[#D4AF37] text-xs font-['Inter'] font-medium tracking-wide">
                REGISTRO EXCLUSIVO
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-['Playfair_Display'] font-bold text-white">
              Crear Cuenta
            </h2>
            <p className="text-sm lg:text-base text-[#E0E0E0]/70 font-['Inter']">
              Completa tus datos para unirte a la experiencia ALAYA
            </p>
          </div>

          {/* Error message */}
          {displayError && (
            <div className="relative p-4 rounded-xl bg-red-500/5 border border-red-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
              <div className="relative flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                </div>
                <p className="text-red-400 text-sm font-['Inter']">
                  {displayError === 'HTTP Error 400: Bad Request' 
                    ? 'Error al crear la cuenta. Por favor, verifica los datos ingresados.' 
                    : displayError}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {/* Name input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#E0E0E0] block font-['Inter'] flex items-center gap-2">
                Nombre Completo
                <span className="text-[#D4AF37]/60 text-xs">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-focus-within:from-[#D4AF37]/10 group-focus-within:via-[#D4AF37]/5 group-focus-within:to-[#D4AF37]/0 transition-all duration-500" />
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0E0E0]/30 group-focus-within:text-[#D4AF37] transition-all duration-300 z-10"
                  size={18}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#E0E0E0]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all duration-300 font-['Inter'] backdrop-blur-sm hover:border-[#2A2A2A]/80 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Juan Pérez García"
                />
              </div>
            </div>

            {/* Username input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-[#E0E0E0] block font-['Inter'] flex items-center gap-2">
                Nombre de Usuario
                <span className="text-[#D4AF37]/60 text-xs">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-focus-within:from-[#D4AF37]/10 group-focus-within:via-[#D4AF37]/5 group-focus-within:to-[#D4AF37]/0 transition-all duration-500" />
                <FiUserPlus
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0E0E0]/30 group-focus-within:text-[#D4AF37] transition-all duration-300 z-10"
                  size={18}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#E0E0E0]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all duration-300 font-['Inter'] backdrop-blur-sm hover:border-[#2A2A2A]/80 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="juanperez"
                />
              </div>
            </div>

            {/* Password input with strength indicator */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#E0E0E0] block font-['Inter'] flex items-center gap-2">
                Contraseña
                <span className="text-[#D4AF37]/60 text-xs">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-focus-within:from-[#D4AF37]/10 group-focus-within:via-[#D4AF37]/5 group-focus-within:to-[#D4AF37]/0 transition-all duration-500" />
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0E0E0]/30 group-focus-within:text-[#D4AF37] transition-all duration-300 z-10"
                  size={18}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#E0E0E0]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all duration-300 font-['Inter'] backdrop-blur-sm hover:border-[#2A2A2A]/80 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
              {formData.password && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-['Inter']">
                    <span className="text-[#E0E0E0]/60">Fortaleza de contraseña</span>
                    <span className={`font-medium ${
                      passwordStrength <= 1 ? 'text-red-400' : 
                      passwordStrength <= 3 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? getPasswordStrengthColor() : 'bg-[#2A2A2A]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#E0E0E0] block font-['Inter'] flex items-center gap-2">
                Confirmar Contraseña
                <span className="text-[#D4AF37]/60 text-xs">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-focus-within:from-[#D4AF37]/10 group-focus-within:via-[#D4AF37]/5 group-focus-within:to-[#D4AF37]/0 transition-all duration-500" />
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0E0E0]/30 group-focus-within:text-[#D4AF37] transition-all duration-300 z-10"
                  size={18}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#E0E0E0]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all duration-300 font-['Inter'] backdrop-blur-sm hover:border-[#2A2A2A]/80 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role select - Hidden by default, only for admin purposes */}
            <input type="hidden" name="role" value={formData.role} />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 lg:py-4 px-6 rounded-xl font-semibold text-[#0A0A0A] bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] bg-size-200 hover:bg-pos-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-3 group font-['Inter'] overflow-hidden text-base mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative z-10">{isLoading ? "Creando cuenta..." : "Unirse a ALAYA"}</span>
              {!isLoading && (
                <FiArrowRight 
                  className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" 
                  size={18} 
                />
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2 lg:py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0A] px-4 text-[#E0E0E0]/40 font-['Inter'] tracking-[0.15em]">
                O regístrate con
              </span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button
              type="button"
              disabled={isLoading}
              className="relative py-3 lg:py-3.5 px-3 lg:px-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] hover:border-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 text-sm font-medium text-[#E0E0E0] font-['Inter'] backdrop-blur-sm group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-500" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="relative z-10">Google</span>
            </button>
            
            <button
              type="button"
              disabled={isLoading}
              className="relative py-3 lg:py-3.5 px-3 lg:px-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] hover:border-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 text-sm font-medium text-[#E0E0E0] font-['Inter'] backdrop-blur-sm group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-500" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89893V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z" />
              </svg>
              <span className="relative z-10">Facebook</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-[#E0E0E0]/60 font-['Inter'] pt-2 lg:pt-3">
            ¿Ya tienes cuenta?{" "}
            <a href="/auth/login" className="text-[#D4AF37] font-semibold hover:text-[#E5C158] transition-colors duration-300 inline-flex items-center gap-1 group">
              Inicia sesión
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 pt-4 lg:pt-5 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2 text-[#E0E0E0]/40 text-xs font-['Inter']">
              <FiShield size={14} className="text-[#D4AF37]" />
              <span className="hidden sm:inline">Datos Protegidos</span>
              <span className="sm:hidden">Protegido</span>
            </div>
            <div className="w-px h-4 bg-[#2A2A2A]" />
            <div className="flex items-center gap-2 text-[#E0E0E0]/40 text-xs font-['Inter']">
              <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span className="hidden sm:inline">SSL Encriptado</span>
              <span className="sm:hidden">SSL</span>
            </div>
          </div>

          {/* Mobile footer - Only visible on mobile */}
          <div className="lg:hidden text-center text-[#E0E0E0]/50 text-xs font-['Inter'] pt-4 border-t border-[#2A2A2A] mt-4">
            <a 
              href="https://octramtechnologies.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors duration-300"
            >
              OCTRAM TECHNOLOGIES
            </a>
            {" "}© 2025
          </div>
        </div>
      </div>
    </div>
  );
};