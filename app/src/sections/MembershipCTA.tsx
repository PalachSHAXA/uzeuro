import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function MembershipCTA() {
  const { t } = useTranslation('home');
  const benefits = t('membershipCTA.benefits', { returnObjects: true }) as string[];
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-item');
        gsap.fromTo(
          elements,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3D Shape animation
      if (shapeRef.current) {
        gsap.fromTo(
          shapeRef.current,
          { opacity: 0, x: 100, rotate: 20 },
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: shapeRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Continuous floating animation
        gsap.to(shapeRef.current, {
          y: -15,
          rotate: 3,
          duration: 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #003399 0%, #002a7a 50%, #001f5c 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 10s ease infinite',
        }}
      />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-eu-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div ref={contentRef}>
            <h2 className="animate-item text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-white mb-4">
              {t('membershipCTA.title')} <span className="text-eu-gold">{t('membershipCTA.titleHighlight')}</span> {t('membershipCTA.titleEnd')}
            </h2>
            <p className="animate-item text-white/80 text-lg mb-2">
              {t('membershipCTA.subtitle')}
            </p>
            <p className="animate-item text-white/60 text-sm mb-8">
              {t('membershipCTA.description')}
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="animate-item flex items-center gap-3 text-white/90"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-eu-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-eu-gold" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              to="/membership"
              className="animate-item inline-flex items-center gap-2 bg-eu-gold text-eu-dark px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-white hover:shadow-glow-gold hover:-translate-y-1 group"
            >
              {t('membershipCTA.cta')}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Right - 3D Shape */}
          <div className="hidden lg:flex justify-center items-center">
            <div
              ref={shapeRef}
              className="relative w-80 h-80"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main shape - abstract geometric form */}
              <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 rotate-6" />
              <div className="absolute inset-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 -rotate-3" />
              <div className="absolute inset-8 rounded-xl bg-eu-gold/20 backdrop-blur-sm border border-eu-gold/30 rotate-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-heading font-bold text-eu-gold">{t('free', { ns: 'common' })}</div>
                  <div className="text-white/80 text-sm mt-2">{t('untilDec2026', { ns: 'common' })}</div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-eu-gold/30 backdrop-blur-md border border-eu-gold/40 float" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 rotate-12 float-delayed" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
