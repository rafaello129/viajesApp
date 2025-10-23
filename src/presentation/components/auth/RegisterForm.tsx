import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiChevronDown, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Branding section */}
      <div className="relative lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 lg:p-12 flex flex-col justify-between h-[35vh] lg:h-full">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Logo/Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg bg-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white">Enterprise</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-3 lg:space-y-4">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight text-balance">
            Únete a nuestra plataforma
          </h1>
          <p className="text-sm lg:text-lg text-white/80 max-w-md leading-relaxed">
            Crea tu cuenta y comienza a disfrutar de todas las ventajas que tenemos para tu negocio.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-xs lg:text-sm">
          <a 
            href="https://octramtechnologies.mx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            OCTRAM TECHNOLOGIES
          </a>{" "}
          © {new Date().getFullYear()}
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="lg:w-1/2 bg-background flex items-center justify-center p-6 lg:p-12 h-[65vh] lg:h-full overflow-y-auto">
        <div className="w-full max-w-md space-y-4 lg:space-y-5 animate-fade-in">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Crear Cuenta</h2>
            <p className="text-sm text-muted-foreground">Completa el formulario para registrarte</p>
          </div>

          {/* Error message */}
          {displayError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-sm">
                {displayError === 'HTTP Error 400: Bad Request' 
                  ? 'Error al crear la cuenta. Por favor, verifica los datos ingresados.' 
                  : displayError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground block">
                Nombre Completo
              </label>
              <div className="relative group">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
                  size={16}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

            {/* Username input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground block">
                Usuario
              </label>
              <div className="relative group">
                <FiUserPlus
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
                  size={16}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="tu.usuario"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">
                Contraseña
              </label>
              <div className="relative group">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
                  size={16}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground block">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
                  size={16}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role select */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-sm font-medium text-foreground block">
                Rol
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full appearance-none px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-6 rounded-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group text-sm"
            >
              <span>{isLoading ? "Registrando..." : "Crear Cuenta"}</span>
              {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-2 text-xs font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-2 text-xs font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <a href="/auth/login" className="text-primary font-medium hover:underline">
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};