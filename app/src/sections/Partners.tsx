import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scale, Building2, GraduationCap, Globe2, Landmark, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: 'European Law Academy', icon: Scale },
  { name: 'Tashkent State University of Law', icon: GraduationCap },
  { name: 'EU Delegation to Uzbekistan', icon: Globe2 },
  { name: 'International Bar Association', icon: Briefcase },
  { name: 'Uzbekistan Lawyers Association', icon: Landmark },
  { name: 'Brussels Legal Consortium', icon: Building2 },
];

export default function Partners() {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Double the partners array for seamless loop
  const doubledPartners = [...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div ref={headerRef} className="text-center">
          <span className="section-label">{t('partners.label')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark">
            {t('partners.title')} <span className="text-eu-blue">{t('partners.titleHighlight')}</span> {t('partners.titleEnd')}
          </h2>
        </div>
      </div>

      {/* Marquee Row 1 - Left to Right */}
      <div className="mb-8 overflow-hidden">
        <div className="flex marquee hover:[animation-play-state:paused]">
          {doubledPartners.map((partner, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 mx-6 group"
            >
              <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-eu-blue/10 flex items-center justify-center group-hover:bg-eu-blue transition-colors duration-300">
                  <partner.icon className="w-6 h-6 text-eu-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-eu-dark whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Right to Left */}
      <div className="overflow-hidden">
        <div className="flex marquee-reverse hover:[animation-play-state:paused]">
          {[...doubledPartners].reverse().map((partner, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 mx-6 group"
            >
              <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-eu-gold/20 flex items-center justify-center group-hover:bg-eu-gold transition-colors duration-300">
                  <partner.icon className="w-6 h-6 text-eu-gold group-hover:text-eu-dark transition-colors duration-300" />
                </div>
                <span className="font-medium text-eu-dark whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-eu-surface to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-eu-surface to-transparent pointer-events-none" />
    </section>
  );
}
