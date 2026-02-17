import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navKeys = [
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'membership', href: '/membership' },
  { key: 'publications', href: '/publications' },
  { key: 'webinars', href: '/webinars' },
  { key: 'contact', href: '/contact' },
] as const;

const legalKeys = [
  { key: 'privacyPolicy', href: '/privacy' },
  { key: 'termsConditions', href: '/terms' },
  { key: 'cookiePolicy', href: '/cookies' },
] as const;

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
];

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="bg-eu-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="UZEURO - Uzbek-European Law Association"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-eu-gold hover:text-eu-dark hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">{t('footer.navigation')}</h4>
            <ul className="space-y-3">
              {navKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-eu-gold transition-colors duration-300 text-sm relative group"
                  >
                    {t(`nav.${link.key}`)}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-eu-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {legalKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-eu-gold transition-colors duration-300 text-sm relative group"
                  >
                    {t(`footer.${link.key}`)}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-eu-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@uzeuro.uz"
                  className="flex items-center gap-3 text-white/70 hover:text-eu-gold transition-colors duration-300 text-sm group"
                >
                  <Mail size={16} className="text-eu-gold" />
                  <span>info@uzeuro.uz</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+998711234567"
                  className="flex items-center gap-3 text-white/70 hover:text-eu-gold transition-colors duration-300 text-sm group"
                >
                  <Phone size={16} className="text-eu-gold" />
                  <span>+998 71 123 4567</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="text-eu-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p>Tashkent, Uzbekistan</p>
                  <p className="text-white/50 text-xs mt-1">{t('footer.euOffice')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            {t('allRightsReserved')}
          </p>
          <p className="text-white/40 text-xs">
            {t('orgFullName')}
          </p>
        </div>
      </div>
    </footer>
  );
}
