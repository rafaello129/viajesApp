export const Footer = () => {
  return (
    <footer className="mt-auto px-6 py-4 text-center text-xs bg-white border-t border-gray-200 m-0 md:mx-3 md:mb-3 md:rounded-b-xl">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-600">
        <span>Desarrollado por</span>
        <a 
          href="https://octramtechnologies.mx" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          OCTRAM TECHNOLOGIES
        </a>
        <span className="hidden sm:inline">•</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};