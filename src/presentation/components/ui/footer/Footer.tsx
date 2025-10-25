import { FiMapPin } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="px-4 md:px-6 py-4 bg-[#1A1A1A] border-t border-[#2A2A2A] m-0 md:mx-3 md:mb-3 rounded-0 md:rounded-b-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center">
              <FiMapPin className="text-[#0A0A0A]" size={14} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-['Playfair_Display'] font-bold text-white">
                ALAYA
              </p>
              <p className="text-xs text-[#E0E0E0]/60 font-['Inter']">
                Luxury Travel Platform
              </p>
            </div>
          </div>

          {/* Center */}
          <div className="text-xs text-[#E0E0E0]/60 text-center font-['Inter']">
            © {new Date().getFullYear()} ALAYA. Todos los derechos reservados.
          </div>

          {/* Right side */}
          <div className="text-xs text-[#E0E0E0]/60 font-['Inter']">
            Desarrollado por{" "}
            <a 
              href="https://octramtechnologies.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-[#E5C158] transition-colors duration-300 font-medium"
            >
              OCTRAM TECHNOLOGIES
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};