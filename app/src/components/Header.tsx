import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navKeys = [
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'membership', href: '/membership' },
  { key: 'publications', href: '/publications' },
  { key: 'webinars', href: '/webinars' },
] as const;

const languages = ['en', 'ru', 'uz'] as const;

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('uzeuro_lang', lang);
  };

    return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'py-3 bg-eu-surface/90 backdrop-blur-xl shadow-lg'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/logo.png"
                alt="UZEURO - Uzbek-European Law Association"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navKeys.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 animated-underline ${
                    activeLink === link.href
                      ? 'text-eu-blue'
                      : 'text-eu-dark hover:text-eu-blue'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>

            {/* CTA & Language */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                {languages.map((lang, idx) => (
                  <span key={lang} className="flex items-center">
                    {idx > 0 && <span className="text-eu-divider">|</span>}
                    <button
                      onClick={() => changeLanguage(lang)}
                      className={`px-2 py-1 transition-colors ${
                        i18n.language === lang
                          ? 'text-eu-blue font-medium'
                          : 'text-eu-text-tertiary hover:text-eu-blue'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  </span>
                ))}
              </div>
              <Link
                to="/membership"
                className="btn-primary text-sm"
              >
                {t('joinNow')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-eu-dark"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-eu-dark/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-eu-surface shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <nav className="flex flex-col gap-4">
              {navKeys.map((link, index) => (
                <Link
                  key={link.key}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium py-2 transition-all duration-300 ${
                    activeLink === link.href
                      ? 'text-eu-blue'
                      : 'text-eu-dark hover:text-eu-blue'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-8 border-t border-eu-border">
              <Link
                to="/membership"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full text-center block"
              >
                {t('joinNow')}
              </Link>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                {languages.map((lang, idx) => (
                  <span key={lang} className="flex items-center">
                    {idx > 0 && <span className="text-eu-divider">|</span>}
                    <button
                      onClick={() => changeLanguage(lang)}
                      className={`px-3 py-1 transition-colors ${
                        i18n.language === lang
                          ? 'text-eu-blue font-medium'
                          : 'text-eu-text-secondary hover:text-eu-blue'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
