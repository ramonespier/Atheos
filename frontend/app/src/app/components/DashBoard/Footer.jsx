import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-zinc-300 py-10 rounded-t-3xl shadow-inner shadow-orange-500/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Coluna 1 */}
        <div>
          <h3 className="text-lg font-bold mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
            Sobre ATHEOS
          </h3>
          <p className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer leading-relaxed">
            Projeto ATHEOS — <span className="italic hover:underline">"simplesmente o melhor website feito para finanças juntamente de educações financeiras e aprendizado da mitologia grega"</span>
          </p>
        </div>

        {/* Coluna 2 */}
        <div>
          <h3 className="text-lg font-bold mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
            Links Úteis
          </h3>
          <ul className="space-y-3 text-sm">
            {['Home', 'Sobre', 'Contato', 'Blog'].map((item, idx) => (
              <li key={idx}>
                <a
                  href={`/${item.toLowerCase()}`}
                  className="hover:text-orange-500 hover:underline hover:scale-105 transition-all duration-300 inline-block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3 */}
        <div>
          <h3 className="text-lg font-bold mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
            Siga a Gente
          </h3>
          <div className="flex space-x-6">
            {[
              { href: 'https://twitter.com', icon: 'fa-twitter', label: 'Twitter' },
              { href: 'https://github.com', icon: 'fa-github', label: 'GitHub' },
              { href: 'https://instagram.com', icon: 'fa-instagram', label: 'Instagram' }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-xl hover:text-orange-500 hover:scale-125 transition-transform duration-300"
              >
                <i className={`fab ${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-700 mt-10 pt-6 text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer">
        &copy; {new Date().getFullYear()} ATHEOS. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
