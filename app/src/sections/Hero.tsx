import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Users, Globe, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const statKeys = [
  { value: 2025, suffix: '', key: 'estInParis', icon: Calendar },
  { value: 27, suffix: '', key: 'euMemberStates', icon: Globe },
  { value: 3, suffix: '', key: 'founders', icon: Users },
];

export default function Hero() {
  const { t } = useTranslation(['home', 'common']);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState(statKeys.map(() => 0));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation - word by word
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 40,
            rotateX: 15,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 0.3,
          }
        );
      }

      // Subheadline animation
      if (subheadlineRef.current) {
        gsap.fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.9,
          }
        );
      }

      // Buttons animation
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'elastic.out(1, 0.5)',
            delay: 1.1,
          }
        );
      }

      // Stats animation with counter
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 60, rotate: 5 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 1.3,
            onComplete: () => {
              // Animate counters
              statKeys.forEach((stat, index) => {
                const duration = 2000;
                const start = performance.now();
                const animate = (currentTime: number) => {
                  const elapsed = currentTime - start;
                  const progress = Math.min(elapsed / duration, 1);
                  const easeOut = 1 - Math.pow(1 - progress, 3);
                  setCounters((prev) => {
                    const newCounters = [...prev];
                    newCounters[index] = Math.floor(easeOut * stat.value);
                    return newCounters;
                  });
                  if (progress < 1) {
                    requestAnimationFrame(animate);
                  }
                };
                setTimeout(() => requestAnimationFrame(animate), index * 100);
              });
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Shape 1 - Large circle */}
        <div
          className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-eu-blue/5 blur-3xl float"
          style={{ animationDelay: '0s' }}
        />
        {/* Shape 2 - Medium circle */}
        <div
          className="absolute bottom-40 left-[10%] w-48 h-48 rounded-full bg-eu-gold/10 blur-2xl float-delayed"
          style={{ animationDelay: '-2s' }}
        />
        {/* Shape 3 - Small circle */}
        <div
          className="absolute top-[40%] right-[5%] w-32 h-32 rounded-full bg-eu-blue/10 blur-xl float"
          style={{ animationDelay: '-4s' }}
        />
        {/* Shape 4 - Glassmorphism card */}
        <div
          className="absolute bottom-20 right-[25%] w-40 h-40 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 rotate-12 float-delayed"
          style={{ animationDelay: '-1s' }}
        />
        {/* Shape 5 - Small glass circle */}
        <div
          className="absolute top-[30%] left-[5%] w-24 h-24 rounded-full bg-white/30 backdrop-blur-lg border border-white/40 float"
          style={{ animationDelay: '-3s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="space-y-8">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-semibold text-eu-dark leading-tight"
              style={{ perspective: '1000px' }}
            >
              <span className="word inline-block">{t('hero.title1')}</span>{' '}
              <span className="word inline-block">{t('hero.title2')}</span>{' '}
              <span className="word inline-block text-eu-blue">{t('hero.title3')}</span>
            </h1>

            <p
              ref={subheadlineRef}
              className="text-lg lg:text-xl text-eu-text-secondary max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-4">
              <Link
                to="/membership"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                {t('becomeMember', { ns: 'common' })}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/events"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                {t('exploreEvents', { ns: 'common' })}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {statKeys.map((stat, index) => (
              <div
                key={stat.key}
                className="stat-card glass-card rounded-2xl p-6 text-center group hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-eu-blue/10 flex items-center justify-center group-hover:bg-eu-blue group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-eu-blue group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-eu-dark">
                  {counters[index]}
                  <span className="text-eu-blue">{stat.suffix}</span>
                </div>
                <div className="text-sm text-eu-text-secondary mt-1">{t(`hero.stats.${stat.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-eu-surface to-transparent" />
    </section>
  );
}
