import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-zinc-300 py-12 rounded-t-3xl shadow-inner shadow-orange-500/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">

          {/* Coluna 1: Sobre ATHEOS */}
          <div className='md:max-w-md'>
            <h3 className="text-lg font-bold mb-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
              Sobre ATHEOS
            </h3>
            {/* LINHA MODIFICADA ABAIXO */}
            <p className="text-sm text-zinc-400 leading-relaxed transition-all duration-300 hover:text-zinc-200 hover:-translate-y-1 cursor-default">
              Projeto ATHEOS — <span className="italic">"simplesmente o melhor website feito para finanças juntamente de educações financeiras e aprendizado da mitologia grega"</span>
            </p>
          </div>

          {/* Coluna 2: Siga a Gente */}
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
                  className="text-2xl text-zinc-400 hover:text-orange-500 hover:scale-110 transition-all duration-300"
                >
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} ATHEOS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;