import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Handshake, Network, BookOpen, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const featureKeys = [
  { icon: Handshake, key: 'crossBorder' },
  { icon: Network, key: 'network' },
  { icon: BookOpen, key: 'knowledge' },
  { icon: TrendingUp, key: 'career' },
];

export default function Mission() {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Cards animation with 3D flip effect
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.mission-card');
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            rotateY: -30,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-eu-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Header */}
          <div ref={headerRef} className="lg:sticky lg:top-32">
            <span className="section-label">{t('mission.label')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark mb-6">
              {t('mission.title')}{' '}
              <span className="text-eu-blue">{t('mission.titleHighlight')}</span>
            </h2>
            <p className="text-eu-text-secondary text-lg leading-relaxed">
              {t('mission.description')}
            </p>
          </div>

          {/* Right - Cards Grid */}
          <div ref={cardsRef} className="grid sm:grid-cols-2 gap-6">
            {featureKeys.map((feature, index) => (
              <div
                key={feature.key}
                className="mission-card group"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateY(${index % 2 === 1 ? '20px' : '0'})`,
                }}
              >
                <div className="glass-card rounded-2xl p-6 h-full transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-eu-blue/10 flex items-center justify-center mb-5 group-hover:bg-eu-blue group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-eu-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-eu-dark mb-3">
                    {t(`mission.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-eu-text-secondary text-sm leading-relaxed">
                    {t(`mission.features.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
