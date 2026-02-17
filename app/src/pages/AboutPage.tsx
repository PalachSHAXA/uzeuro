import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Award, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { t } = useTranslation(['about', 'common']);

  const timeline = t('timeline.items', { returnObjects: true }) as Array<{
    year: string;
    title: string;
    description: string;
  }>;

  const team = t('team.members', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    bio: string;
  }>;

  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.animate-item'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
          }
        );
      }

      // Mission cards
      if (missionRef.current) {
        gsap.fromTo(
          missionRef.current.querySelectorAll('.mission-card'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: missionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Timeline items
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Team cards
      if (teamRef.current) {
        gsap.fromTo(
          teamRef.current.querySelectorAll('.team-card'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: teamRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-eu-blue/5 to-eu-gold/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="animate-item section-label">{t('label')}</span>
          <h1 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-eu-dark mb-8">
            {t('title')} <span className="text-eu-blue">{t('titleHighlight')}</span>
          </h1>
          <div className="animate-item max-w-3xl mx-auto space-y-5 text-lg text-eu-text-secondary leading-relaxed">
            {(t('paragraphs', { returnObjects: true }) as string[]).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={missionRef} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="mission-card glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-eu-blue/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-eu-blue" />
              </div>
              <h3 className="font-heading font-semibold text-2xl text-eu-dark mb-4">
                {t('mission.title')}
              </h3>
              <p className="text-eu-text-secondary leading-relaxed">
                {t('mission.text')}
              </p>
            </div>

            {/* Vision */}
            <div className="mission-card glass-card rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-eu-gold/20 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-eu-gold" />
              </div>
              <h3 className="font-heading font-semibold text-2xl text-eu-dark mb-4">
                {t('vision.title')}
              </h3>
              <p className="text-eu-text-secondary leading-relaxed">
                {t('vision.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32 bg-eu-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">{t('timeline.label')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark">
              {t('timeline.title')} <span className="text-eu-blue">{t('timeline.titleHighlight')}</span>
            </h2>
          </div>

          <div ref={timelineRef} className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-eu-border lg:-translate-x-px" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`timeline-item relative flex items-start gap-8 lg:gap-0 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Year Badge */}
                  <div className="absolute left-0 lg:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-eu-blue flex items-center justify-center z-10 shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-20 lg:ml-0 lg:w-[calc(50%-4rem)] ${
                      index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'
                    }`}
                  >
                    <div className="glass-card rounded-2xl p-6">
                      <div className="text-2xl font-heading font-bold text-eu-blue mb-2">
                        {item.year}
                      </div>
                      <h4 className="font-heading font-semibold text-eu-dark mb-2">
                        {item.title}
                      </h4>
                      <p className="text-eu-text-secondary text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block lg:w-[calc(50%-4rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steering Committee */}
      <section ref={teamRef} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">{t('team.label')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark">
              {t('team.title')} <span className="text-eu-blue">{t('team.titleHighlight')}</span>
            </h2>
          </div>

          <p className="text-eu-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('team.description')}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="team-card group"
              >
                <div className="glass-card rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                  {/* Avatar - Initials */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-eu-blue/10 flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-eu-blue">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Info */}
                  <h4 className="font-heading font-semibold text-eu-dark mb-1">
                    {member.name}
                  </h4>
                  <p className="text-eu-blue text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-eu-text-secondary text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-eu-blue to-eu-blue/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Award className="w-8 h-8 text-eu-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold max-w-2xl">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 max-w-xl">
              {t('cta.description')}
            </p>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 bg-eu-gold text-eu-dark px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-white hover:shadow-glow-gold hover:-translate-y-1 group"
            >
              {t('becomeMember', { ns: 'common' })}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
