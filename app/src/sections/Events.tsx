import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { eventsApi } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const fallbackImages = ['/event-forum.jpg', '/event-handshake.jpg', '/event-webinar.jpg'];

interface ApiEvent {
  id: number;
  title: string;
  event_date: string;
  location: string;
  type: string;
  image_url?: string;
  status?: string;
}

export default function Events() {
  const { t } = useTranslation(['home', 'common']);
  const [events, setEvents] = useState<Array<{ id: number; title: string; date: string; location: string; type: string; image: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const apiEvents = await eventsApi.getAll() as ApiEvent[];
        if (apiEvents && Array.isArray(apiEvents) && apiEvents.length > 0) {
          const active = apiEvents
            .filter(e => e.status !== 'draft')
            .slice(0, 3)
            .map((e, i) => ({
              id: e.id,
              title: e.title,
              date: e.event_date,
              location: e.location,
              type: e.type,
              image: e.image_url || fallbackImages[i % fallbackImages.length],
            }));
          if (active.length > 0) {
            setEvents(active);
            return;
          }
        }
      } catch { /* fallback to demo */ }
      // Fallback: demo items from locale
      const demoItems = t('events.demoItems', { returnObjects: true }) as Array<{
        title: string; date: string; location: string; type: string;
      }>;
      if (Array.isArray(demoItems)) {
        setEvents(demoItems.map((item, i) => ({ ...item, id: i + 1, image: fallbackImages[i] })));
      }
    })();
  }, [t]);

  const formatDate = (dateStr: string) => {
    // If already a localized string (from demo items), return as-is
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

      // Cards slide in
      if (sliderRef.current) {
        const cards = sliderRef.current.querySelectorAll('.event-card');
        gsap.fromTo(
          cards,
          { opacity: 0, x: 100, rotateY: 10 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sliderRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    if (events.length > 0) setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    if (events.length > 0) setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (events.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t('events.label')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark">
              {t('events.title')}{' '}
              <span className="text-eu-blue">{t('events.titleHighlight')}</span> {t('events.titleEnd')}
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-eu-blue font-medium group"
          >
            {t('events.viewAll')}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="event-card flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="group relative rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-3">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/60 to-transparent" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-eu-blue text-white text-sm font-medium shadow-lg">
                      {formatDate(event.date)}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-eu-dark text-xs font-medium">
                      {event.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-xl text-eu-dark mb-3 group-hover:text-eu-blue transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-eu-text-secondary text-sm">
                      <MapPin size={16} className="text-eu-blue" />
                      <span>{event.location}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-eu-border flex items-center justify-between">
                      <span className="text-sm text-eu-text-secondary">
                        {formatDate(event.date)}
                      </span>
                      <Link
                        to={`/events#${event.id}`}
                        className="inline-flex items-center gap-1 text-eu-blue text-sm font-medium group/link"
                      >
                        {t('learnMore', { ns: 'common' })}
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8 sm:hidden">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center text-eu-dark hover:bg-eu-blue hover:text-white transition-all duration-300"
              aria-label="Previous event"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center text-eu-dark hover:bg-eu-blue hover:text-white transition-all duration-300"
              aria-label="Next event"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-eu-blue'
                    : 'bg-eu-divider hover:bg-eu-blue/50'
                }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
