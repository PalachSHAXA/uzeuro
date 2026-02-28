import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Play, Clock, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { webinarsApi } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface WebinarItem {
  id: number;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  track: string;
  image: string;
  featured: boolean;
}

export default function Webinars() {
  const { t } = useTranslation(['home', 'common']);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [webinars, setWebinars] = useState<WebinarItem[]>([]);
  const [activeTrack, setActiveTrack] = useState<'all' | 'academic' | 'professional'>('all');

  useEffect(() => {
    (async () => {
      try {
        const apiWebinars = await webinarsApi.getAll() as Array<{
          id: number; title: string; speaker?: string; webinar_date?: string;
          duration?: string; track?: string; image_url?: string; status?: string;
        }>;
        if (apiWebinars && Array.isArray(apiWebinars) && apiWebinars.length > 0) {
          const active = apiWebinars
            .filter(w => w.status !== 'draft')
            .slice(0, 6)
            .map(w => ({
              id: w.id,
              title: w.title,
              speaker: w.speaker || 'UzEuroLaw Expert',
              date: w.webinar_date || '',
              duration: w.duration || '',
              track: w.track || 'professional',
              image: w.image_url || '/webinar-gdpr.jpg',
              featured: false,
            }));
          setWebinars(active);
        }
      } catch { /* no webinars available */ }
    })();
  }, []);

  const filteredWebinars = activeTrack === 'all'
    ? webinars
    : webinars.filter((w) => w.track === activeTrack);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
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

  if (webinars.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-eu-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t('webinars.label')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark mb-4">
              {t('webinars.title')} <span className="text-eu-blue">{t('webinars.titleHighlight')}</span>
            </h2>
            <p className="text-eu-text-secondary max-w-xl">
              {t('webinars.description')}
            </p>
          </div>

          {/* Track Toggle */}
          <div className="flex items-center gap-2 bg-eu-card rounded-full p-1.5">
            {([
              { key: 'all' as const },
              { key: 'academic' as const },
              { key: 'professional' as const },
            ] as const).map((track) => (
              <button
                key={track.key}
                onClick={() => setActiveTrack(track.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTrack === track.key
                    ? 'bg-eu-blue text-white shadow-lg'
                    : 'text-eu-text-secondary hover:text-eu-dark'
                }`}
              >
                {t(`webinars.tracks.${track.key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Webinar Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebinars.map((webinar) => (
            <div
              key={webinar.id}
              className={`group relative rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${
                webinar.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={webinar.image}
                  alt={webinar.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/60 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-eu-gold">
                    <Play className="w-6 h-6 text-eu-blue group-hover:text-eu-dark fill-current ml-1" />
                  </div>
                </div>

                {/* Track Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-eu-dark text-xs font-medium capitalize">
                  {webinar.track} Track
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-eu-dark mb-3 group-hover:text-eu-blue transition-colors line-clamp-2">
                  {webinar.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-eu-text-secondary mb-4">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{webinar.speaker}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{webinar.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-eu-border">
                  <span className="text-sm text-eu-text-secondary">
                    {webinar.date}
                  </span>
                  <button className="inline-flex items-center gap-1 text-eu-blue text-sm font-medium group/link">
                    {t('register', { ns: 'common' })}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="flex justify-center mt-10">
          <Link
            to="/webinars"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            {t('webinars.viewAll')}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
