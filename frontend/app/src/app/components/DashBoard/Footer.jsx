import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 hover:text-white transition-colors duration-200 cursor-pointer">
            Sobre ATHEOS
          </h3>
          <p className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-200 cursor-pointer">
            Projeto ATHEOS — <span className="italic hover:underline">"simplesmente o melhor website feito para finanças juntamente de educações financeiras e aprendizado da mitologia grega"</span>
          </p>
        </div>

        {/* Coluna 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 hover:text-white transition-colors duration-200 cursor-pointer">
            Links Úteis
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white hover:underline hover:scale-105 transition-all duration-200 inline-block">
                Home
              </a>
            </li>
            <li>
              <a href="/sobre" className="hover:text-white hover:underline hover:scale-105 transition-all duration-200 inline-block">
                Sobre
              </a>
            </li>
            <li>
              <a href="/contato" className="hover:text-white hover:underline hover:scale-105 transition-all duration-200 inline-block">
                Contato
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white hover:underline hover:scale-105 transition-all duration-200 inline-block">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 hover:text-white transition-colors duration-200 cursor-pointer">
            Siga a Gente
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-white hover:scale-125 transition-transform duration-200"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white hover:scale-125 transition-transform duration-200"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white hover:scale-125 transition-transform duration-200"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-700 mt-8 pt-4 text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer">
        &copy; {new Date().getFullYear()} ATHEOS. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
