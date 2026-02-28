import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, ArrowRight, Filter, X, Image as ImageIcon, Users } from 'lucide-react';
import { eventsApi, registerForEvent } from '../services/api';

gsap.registerPlugin(ScrollTrigger);


interface EventItem {
  id: number; title: string; event_date: string; event_time: string;
  location: string; type: string; format: string; description: string;
  image_url: string; status: string; gallery: string; summary: string;
  max_capacity?: number; registered_count?: number;
}

const filterKeys = [
  { key: 'all', i18nKey: 'filters.allEvents' },
  { key: 'upcoming', i18nKey: 'filters.upcoming' },
  { key: 'past', i18nKey: 'filters.past' },
  { key: 'online', i18nKey: 'filters.online' },
  { key: 'in-person', i18nKey: 'filters.inPerson' },
];

const eventTypeKeys = ['Conference', 'Seminar', 'Webinar', 'Workshop', 'Meeting'];

export default function EventsPage() {
  const { t } = useTranslation(['events', 'common']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryEvent, setGalleryEvent] = useState<EventItem | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', citizenship: '', telegram: '' });
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [regMessage, setRegMessage] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const apiEvents = await eventsApi.getAll() as EventItem[];
        if (apiEvents && Array.isArray(apiEvents)) {
          setEvents(apiEvents.filter(e => e.status !== 'draft'));
        }
      } catch { /* no events */ }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.animate-item'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out' }
        );
      }
      if (eventsRef.current) {
        gsap.fromTo(
          eventsRef.current.querySelectorAll('.event-card'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: eventsRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
        );
      }
    });
    return () => ctx.revert();
  }, [events]);

  const today = new Date().toISOString().split('T')[0];
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'upcoming' && event.event_date < today) return false;
    if (activeFilter === 'past' && event.event_date >= today) return false;
    if (activeFilter === 'online' && event.format !== 'online') return false;
    if (activeFilter === 'in-person' && event.format !== 'in-person') return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) return false;
    return true;
  });

  const getGallery = (event: EventItem): string[] => {
    try {
      const parsed = JSON.parse(event.gallery || '[]');
      if (Array.isArray(parsed)) return parsed;
      if (typeof event.gallery === 'string' && event.gallery.includes(',')) {
        return event.gallery.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    } catch {
      if (typeof event.gallery === 'string' && event.gallery.includes(',')) {
        return event.gallery.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    }
  };

  const toggleEventType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        ref={heroRef}
        className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-eu-blue/5 to-eu-gold/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="animate-item section-label">{t('label')}</span>
          <h1 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-eu-dark mb-6">
            {t('title')} <span className="text-eu-blue">{t('titleHighlight')}</span>
          </h1>
          <p className="animate-item text-lg text-eu-text-secondary max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-eu-border bg-white/50 backdrop-blur-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Main Filters */}
            <div className="flex flex-wrap gap-2">
              {filterKeys.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? 'bg-eu-blue text-white'
                      : 'bg-eu-card text-eu-dark hover:bg-eu-blue/10'
                  }`}
                >
                  {t(filter.i18nKey)}
                </button>
              ))}
            </div>

            {/* Type Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-eu-card text-eu-dark hover:bg-eu-blue/10 transition-colors"
            >
              <Filter size={16} />
              {t('eventTypes')}
              {selectedTypes.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-eu-blue text-white text-xs flex items-center justify-center">
                  {selectedTypes.length}
                </span>
              )}
            </button>
          </div>

          {/* Type Filters (Expandable) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-eu-border animate-fade-up">
              <p className="text-sm text-eu-text-secondary mb-3">{t('filterByType')}</p>
              <div className="flex flex-wrap gap-2">
                {eventTypeKeys.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleEventType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTypes.includes(type)
                        ? 'bg-eu-blue text-white'
                        : 'bg-eu-card text-eu-dark hover:bg-eu-blue/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedTypes.length > 0 && (
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-eu-text-secondary hover:text-eu-dark transition-colors"
                  >
                    {t('clearAll', { ns: 'common' })}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section ref={eventsRef} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eu-card flex items-center justify-center">
                <X className="w-8 h-8 text-eu-text-tertiary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-eu-dark mb-2">
                {t('noEvents')}
              </h3>
              <p className="text-eu-text-secondary">
                {t('noEventsHint')}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const isPast = event.event_date < today;
                const photos = getGallery(event);
                return (
                  <div key={event.id} className="event-card group cursor-pointer" onClick={() => { setGalleryEvent(event); setRegStatus('idle'); setRegForm({ name: '', email: '', phone: '', citizenship: '', telegram: '' }); setRegMessage(''); }}>
                    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={event.image_url || '/event-forum.jpg'}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/60 to-transparent" />
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-eu-dark text-xs font-medium">
                          {event.type}
                        </div>
                        {isPast && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium">
                            {t('pastEvent', { ns: 'common' })}
                          </div>
                        )}
                        {!isPast && event.format === 'online' && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-medium">
                            {t('online', { ns: 'common' })}
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading font-semibold text-lg text-eu-dark mb-3 group-hover:text-eu-blue transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-eu-text-secondary text-sm mb-4 line-clamp-2">
                          {isPast && event.summary ? event.summary : event.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                            <MapPin className="w-4 h-4 text-eu-blue" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                            <Clock className="w-4 h-4 text-eu-blue" />
                            <span>{event.event_time}</span>
                          </div>
                        </div>

                        {!isPast && (() => {
                          const remaining = (event.max_capacity || 200) - (event.registered_count || 0);
                          return remaining > 0 ? (
                            <p className="text-xs text-eu-text-secondary mb-3 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-eu-blue" />
                              {t('spotsRemaining', { ns: 'common', count: remaining })}
                            </p>
                          ) : (
                            <p className="text-xs text-red-500 mb-3 font-medium">{t('eventFull', { ns: 'common' })}</p>
                          );
                        })()}

                        <div className="w-full py-3 rounded-xl border-2 border-eu-blue text-eu-blue font-medium flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-eu-blue group-hover:text-white">
                          {isPast ? (photos.length > 0 ? t('viewEvent') : t('eventCompleted')) : t('registerNow', { ns: 'common' })}
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      {galleryEvent && (() => {
        const photos = getGallery(galleryEvent);
        const mainPhoto = galleryEvent.image_url || photos[0] || '/event-forum.jpg';
        const isPastEvent = galleryEvent.event_date < today;
        return (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setGalleryEvent(null)}>
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-eu-blue/10 text-eu-blue text-xs font-semibold">{galleryEvent.type}</span>
                  {isPastEvent && <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium">{t('pastEvent', { ns: 'common' })}</span>}
                </div>
                <button onClick={() => setGalleryEvent(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main content: text left, photo right */}
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Left - Text info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-heading font-bold text-eu-dark mb-3">{galleryEvent.title}</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                      <Calendar className="w-4 h-4 text-eu-blue flex-shrink-0" />
                      <span>{formatDate(galleryEvent.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                      <Clock className="w-4 h-4 text-eu-blue flex-shrink-0" />
                      <span>{galleryEvent.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                      <MapPin className="w-4 h-4 text-eu-blue flex-shrink-0" />
                      <span>{galleryEvent.location}</span>
                    </div>
                  </div>
                  <p className="text-eu-text-secondary text-sm leading-relaxed mb-3">
                    {galleryEvent.description}
                  </p>
                  {isPastEvent && galleryEvent.summary && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-eu-dark mb-1">{t('eventSummary')}</h4>
                      <p className="text-sm text-eu-text-secondary leading-relaxed">{galleryEvent.summary}</p>
                    </div>
                  )}
                  {photos.length > 0 && (
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> {t('photosFromEvent', { count: photos.length })}
                    </p>
                  )}

                  {/* Registration for upcoming events */}
                  {!isPastEvent && (() => {
                    const capacity = galleryEvent.max_capacity || 200;
                    const registered = galleryEvent.registered_count || 0;
                    const remaining = capacity - registered;
                    return (
                      <div className="mt-5 p-4 bg-eu-blue/5 rounded-xl border border-eu-blue/10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-eu-dark">{t('registerForEvent')}</h4>
                          <span className="text-xs text-eu-text-secondary flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {remaining > 0 ? t('spotsLeft', { ns: 'common', count: remaining }) : t('eventFull', { ns: 'common' })}
                          </span>
                        </div>
                        {regStatus === 'success' ? (
                          <div className="text-sm text-green-600 font-medium py-2">
                            {t('registeredSuccess')} {regMessage}
                          </div>
                        ) : remaining <= 0 ? (
                          <p className="text-sm text-red-500 font-medium">{t('noSpotsAvailable', { ns: 'common' })}</p>
                        ) : (
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!regForm.name || !regForm.email || !regForm.phone || !regForm.citizenship) return;
                            setRegStatus('loading');
                            try {
                              const res = await registerForEvent({ eventId: galleryEvent.id, name: regForm.name, email: regForm.email, phone: regForm.phone, citizenship: regForm.citizenship, telegram: regForm.telegram });
                              if (res.success) {
                                setRegStatus('success');
                                setRegMessage(res.remaining !== undefined ? `${res.remaining} spots remaining.` : '');
                                // Update local event data
                                setEvents(prev => prev.map(ev => ev.id === galleryEvent.id ? { ...ev, registered_count: (ev.registered_count || 0) + 1 } : ev));
                                setGalleryEvent({ ...galleryEvent, registered_count: (galleryEvent.registered_count || 0) + 1 });
                              } else {
                                setRegStatus(res.error === 'Already registered' ? 'duplicate' : 'error');
                                setRegMessage(res.error || 'Registration failed');
                              }
                            } catch {
                              setRegStatus('error');
                              setRegMessage(t('networkError'));
                            }
                          }} className="space-y-2">
                            <input
                              type="text" placeholder={t('formPlaceholders.name')} value={regForm.name}
                              onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                              required
                            />
                            <input
                              type="email" placeholder={t('formPlaceholders.email')} value={regForm.email}
                              onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                              required
                            />
                            <input
                              type="tel" placeholder={t('formPlaceholders.phone')} value={regForm.phone}
                              onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                              required
                            />
                            <select
                              value={regForm.citizenship}
                              onChange={e => setRegForm({ ...regForm, citizenship: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                              required
                            >
                              <option value="">{t('countries.selectCitizenship', { ns: 'common' })}</option>
                              <option value="Uzbekistan">{t('countries.uzbekistan', { ns: 'common' })}</option>
                              <option value="Russia">{t('countries.russia', { ns: 'common' })}</option>
                              <option value="Kazakhstan">{t('countries.kazakhstan', { ns: 'common' })}</option>
                              <option value="Kyrgyzstan">{t('countries.kyrgyzstan', { ns: 'common' })}</option>
                              <option value="Tajikistan">{t('countries.tajikistan', { ns: 'common' })}</option>
                              <option value="Turkmenistan">{t('countries.turkmenistan', { ns: 'common' })}</option>
                              <option value="Germany">{t('countries.germany', { ns: 'common' })}</option>
                              <option value="France">{t('countries.france', { ns: 'common' })}</option>
                              <option value="UK">{t('countries.uk', { ns: 'common' })}</option>
                              <option value="USA">{t('countries.usa', { ns: 'common' })}</option>
                              <option value="Other">{t('countries.other', { ns: 'common' })}</option>
                            </select>
                            <input
                              type="text" placeholder={t('formPlaceholders.telegram')} value={regForm.telegram}
                              onChange={e => setRegForm({ ...regForm, telegram: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                            />
                            {regStatus === 'error' && <p className="text-xs text-red-500">{regMessage}</p>}
                            {regStatus === 'duplicate' && <p className="text-xs text-orange-500">{t('alreadyRegistered')}</p>}
                            <button type="submit" disabled={regStatus === 'loading'}
                              className="w-full py-2.5 bg-eu-blue text-white rounded-lg text-sm font-medium hover:bg-eu-blue/90 transition disabled:opacity-50">
                              {regStatus === 'loading' ? t('registering') : t('registerNow', { ns: 'common' })}
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Right - Main photo */}
                <div className="lg:w-[380px] flex-shrink-0">
                  <img
                    src={mainPhoto}
                    alt={galleryEvent.title}
                    className="w-full h-64 lg:h-72 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                    onClick={() => setLightboxPhoto(mainPhoto)}
                  />
                </div>
              </div>

              {/* Bottom - Scrollable gallery row */}
              {photos.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {photos.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="h-24 w-36 flex-shrink-0 object-cover rounded-lg cursor-pointer hover:opacity-80 transition border border-gray-100"
                        onClick={() => setLightboxPhoto(url)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <button onClick={() => setLightboxPhoto(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
            <X className="w-6 h-6 text-white" />
          </button>
          <img src={lightboxPhoto} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
