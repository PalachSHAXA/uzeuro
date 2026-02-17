import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Clock, User, Calendar, ArrowRight, CheckCircle, X, Loader2, Video } from 'lucide-react';
import { webinarsApi, registerForWebinar } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const trackIds = ['all', 'academic', 'professional'] as const;

interface Webinar {
  id: number;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  track: string;
  description: string;
  image_url: string;
  max_capacity: number;
  registered_count: number;
}

export default function WebinarsPage() {
  const { t } = useTranslation(['webinars', 'common']);
  const [activeTrack, setActiveTrack] = useState('all');

  const tracks = trackIds.map(id => ({
    id,
    label: t(`tracks.${id}`),
  }));
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredWebinars, setRegisteredWebinars] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('uzeuro_registered_webinars') || '[]'); } catch { return []; }
  });
  const [detailWebinar, setDetailWebinar] = useState<Webinar | null>(null);
  const [regModal, setRegModal] = useState<Webinar | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', citizenship: '', telegram: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const webinarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await webinarsApi.getAll('active');
        setWebinars(data);
      } catch {
        setWebinars([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem('uzeuro_registered_webinars', JSON.stringify(registeredWebinars));
  }, [registeredWebinars]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.animate-item'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out' }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || webinars.length === 0) return;
    const ctx = gsap.context(() => {
      if (webinarsRef.current) {
        gsap.fromTo(
          webinarsRef.current.querySelectorAll('.webinar-card'),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: webinarsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [loading, webinars, activeTrack]);

  const filteredWebinars = activeTrack === 'all'
    ? webinars
    : webinars.filter((w) => w.track === activeTrack);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regModal) return;
    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim() || !regForm.citizenship.trim()) {
      setRegError(t('fillRequiredFields'));
      return;
    }
    setRegLoading(true);
    setRegError('');
    try {
      const result = await registerForWebinar({
        name: regForm.name,
        email: regForm.email,
        phone: regForm.phone,
        citizenship: regForm.citizenship,
        telegram: regForm.telegram,
        webinarId: regModal.id,
        webinarTitle: regModal.title,
      });
      if (result.error) {
        setRegError(result.error === 'Already registered' ? t('alreadyRegistered') : result.error);
      } else {
        setRegSuccess(true);
        setRegisteredWebinars(prev => [...prev, regModal.id]);
        setWebinars(prev => prev.map(w => w.id === regModal.id ? { ...w, registered_count: (w.registered_count || 0) + 1 } : w));
      }
    } catch {
      setRegError(t('registrationFailed'));
    }
    setRegLoading(false);
  };

  const closeModal = () => {
    setRegModal(null);
    setRegForm({ name: '', email: '', phone: '', citizenship: '', telegram: '' });
    setRegError('');
    setRegSuccess(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getProgressPercentage = (registered: number, max: number) => {
    if (!max) return 0;
    return Math.min(Math.round((registered / max) * 100), 100);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-eu-blue/5 to-eu-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="animate-item section-label">{t('label')}</span>
              <h1 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-eu-dark mb-6">
                {t('title')} <span className="text-eu-blue">{t('titleMiddle')}</span> {t('titleEnd')}
              </h1>
              <p className="animate-item text-lg text-eu-text-secondary mb-8">
                {t('description')}
              </p>
              <div className="animate-item grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-heading font-bold text-eu-blue">{webinars.length || '0'}+</div>
                  <div className="text-sm text-eu-text-secondary">{t('webinarCount')}</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-eu-blue">
                    {webinars.reduce((sum, w) => sum + (w.registered_count || 0), 0)}+
                  </div>
                  <div className="text-sm text-eu-text-secondary">{t('registeredCount')}</div>
                </div>
              </div>
            </div>

            {/* Featured Webinar */}
            {webinars.length > 0 && (
              <div className="animate-item">
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="relative h-64">
                    {webinars[0].image_url ? (
                      <img src={webinars[0].image_url} alt={webinars[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-eu-blue/20 to-eu-gold/20 flex items-center justify-center">
                        <Video className="w-20 h-20 text-eu-blue/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 rounded-lg bg-eu-gold text-eu-dark text-xs font-medium mb-2">
                        {t('featured', { ns: 'common' })}
                      </span>
                      <h3 className="text-xl font-heading font-semibold text-white mb-2">
                        {webinars[0].title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(webinars[0].date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {webinars[0].duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Track Toggle */}
      <section className="py-8 border-b border-eu-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-heading font-semibold text-eu-dark">{t('upcomingWebinars')}</h2>
            <div className="flex items-center gap-2 bg-eu-card rounded-full p-1.5">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTrack === track.id
                      ? 'bg-eu-blue text-white shadow-lg'
                      : 'text-eu-text-secondary hover:text-eu-dark'
                  }`}
                >
                  {track.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Webinars Grid */}
      <section ref={webinarsRef} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-eu-blue animate-spin mb-4" />
              <p className="text-eu-text-secondary">{t('loadingWebinars')}</p>
            </div>
          ) : filteredWebinars.length === 0 ? (
            <div className="text-center py-20">
              <Video className="w-16 h-16 text-eu-border mx-auto mb-4" />
              <p className="text-eu-text-secondary text-lg">{t('noWebinars')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWebinars.map((webinar) => {
                const isRegistered = registeredWebinars.includes(webinar.id);
                const capacity = webinar.max_capacity || 300;
                const registered = webinar.registered_count || 0;
                const progress = getProgressPercentage(registered, capacity);

                return (
                  <div key={webinar.id} className="webinar-card group cursor-pointer" onClick={() => setDetailWebinar(webinar)}>
                    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        {webinar.image_url ? (
                          <img src={webinar.image_url} alt={webinar.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-eu-blue/20 to-eu-gold/20 flex items-center justify-center">
                            <Video className="w-16 h-16 text-eu-blue/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/60 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-eu-blue fill-current ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-eu-dark text-xs font-medium capitalize">
                          {webinar.track} {t('track', { ns: 'common' })}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-heading font-semibold text-lg text-eu-dark mb-3 group-hover:text-eu-blue transition-colors line-clamp-2">
                          {webinar.title}
                        </h3>
                        <p className="text-eu-text-secondary text-sm mb-4 line-clamp-2">
                          {webinar.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                            <User className="w-4 h-4 text-eu-blue" />
                            <span>{webinar.speaker}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                            <Calendar className="w-4 h-4 text-eu-blue" />
                            <span>{formatDate(webinar.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-eu-text-secondary">
                            <Clock className="w-4 h-4 text-eu-blue" />
                            <span>{webinar.duration}</span>
                          </div>
                        </div>

                        {/* Registration Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-eu-text-secondary">{t('registration', { ns: 'common' })}</span>
                            <span className="text-eu-text-secondary">{registered}/{capacity}</span>
                          </div>
                          <div className="h-2 bg-eu-border rounded-full overflow-hidden">
                            <div className="h-full bg-eu-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isRegistered) {
                              setRegModal(webinar);
                            }
                          }}
                          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            isRegistered
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : registered >= capacity
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-eu-blue text-white hover:bg-eu-dark'
                          }`}
                          disabled={isRegistered || registered >= capacity}
                        >
                          {isRegistered ? (
                            <><CheckCircle className="w-5 h-5" /> {t('registered', { ns: 'common' })}</>
                          ) : registered >= capacity ? (
                            t('fullyBooked', { ns: 'common' })
                          ) : (
                            <>{t('registerNow', { ns: 'common' })} <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {detailWebinar && !regModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailWebinar(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {detailWebinar.image_url ? (
              <img src={detailWebinar.image_url} alt={detailWebinar.title} className="w-full h-64 object-cover rounded-t-2xl" />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-eu-blue/20 to-eu-gold/20 flex items-center justify-center rounded-t-2xl">
                <Video className="w-20 h-20 text-eu-blue/30" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-lg bg-eu-blue/10 text-eu-blue text-xs font-medium capitalize mb-2">{detailWebinar.track} {t('track', { ns: 'common' })}</span>
                  <h2 className="text-2xl font-heading font-bold text-eu-dark">{detailWebinar.title}</h2>
                </div>
                <button onClick={() => setDetailWebinar(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-eu-text-secondary"><User className="w-4 h-4 text-eu-blue" />{detailWebinar.speaker}</div>
                <div className="flex items-center gap-2 text-sm text-eu-text-secondary"><Calendar className="w-4 h-4 text-eu-blue" />{formatDate(detailWebinar.date)}</div>
                <div className="flex items-center gap-2 text-sm text-eu-text-secondary"><Clock className="w-4 h-4 text-eu-blue" />{detailWebinar.duration}</div>
              </div>
              <p className="text-eu-text-secondary mb-6">{detailWebinar.description}</p>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-eu-text-secondary">{t('registration', { ns: 'common' })}</span>
                  <span className="text-eu-text-secondary">{detailWebinar.registered_count || 0}/{detailWebinar.max_capacity || 300}</span>
                </div>
                <div className="h-2 bg-eu-border rounded-full overflow-hidden">
                  <div className="h-full bg-eu-blue rounded-full" style={{ width: `${getProgressPercentage(detailWebinar.registered_count || 0, detailWebinar.max_capacity || 300)}%` }} />
                </div>
              </div>
              <button
                onClick={() => { setRegModal(detailWebinar); setDetailWebinar(null); }}
                disabled={registeredWebinars.includes(detailWebinar.id)}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  registeredWebinars.includes(detailWebinar.id) ? 'bg-green-100 text-green-700' : 'bg-eu-blue text-white hover:bg-eu-dark'
                }`}
              >
                {registeredWebinars.includes(detailWebinar.id) ? <><CheckCircle className="w-5 h-5" /> {t('registered', { ns: 'common' })}</> : <>{t('registerNow', { ns: 'common' })} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {regModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-eu-dark">{t('registerForWebinar')}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="mb-4 p-3 bg-eu-blue/5 rounded-xl">
              <h3 className="font-semibold text-eu-dark text-sm">{regModal.title}</h3>
              <p className="text-xs text-eu-text-secondary mt-1">
                {regModal.speaker} &middot; {formatDate(regModal.date)} &middot; {regModal.duration}
              </p>
            </div>

            {regSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-eu-dark mb-2">{t('registrationSuccessful')}</h3>
                <p className="text-sm text-eu-text-secondary mb-4">{t('registrationSuccessDesc')}</p>
                <button onClick={closeModal} className="px-6 py-2 bg-eu-blue text-white rounded-xl hover:bg-eu-dark transition">{t('close', { ns: 'common' })}</button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.fullName', { ns: 'common' })} *</label>
                  <input
                    type="text" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder={t('form.enterFullName', { ns: 'common' })} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.email', { ns: 'common' })} *</label>
                  <input
                    type="email" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder={t('form.enterEmail', { ns: 'common' })} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.phone', { ns: 'common' })} *</label>
                  <input
                    type="tel" value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder={t('form.phonePlaceholder', { ns: 'common' })} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.citizenship', { ns: 'common' })} *</label>
                  <select
                    value={regForm.citizenship} onChange={e => setRegForm({ ...regForm, citizenship: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                  >
                    <option value="">{t('countries.selectCountry', { ns: 'common' })}</option>
                    <option value="Uzbekistan">{t('countries.uzbekistan', { ns: 'common' })}</option>
                    <option value="Germany">{t('countries.germany', { ns: 'common' })}</option>
                    <option value="France">{t('countries.france', { ns: 'common' })}</option>
                    <option value="Italy">{t('countries.italy', { ns: 'common' })}</option>
                    <option value="Spain">{t('countries.spain', { ns: 'common' })}</option>
                    <option value="Netherlands">{t('countries.netherlands', { ns: 'common' })}</option>
                    <option value="Belgium">{t('countries.belgium', { ns: 'common' })}</option>
                    <option value="Poland">{t('countries.poland', { ns: 'common' })}</option>
                    <option value="Czech Republic">{t('countries.czechRepublic', { ns: 'common' })}</option>
                    <option value="Austria">{t('countries.austria', { ns: 'common' })}</option>
                    <option value="Kazakhstan">{t('countries.kazakhstan', { ns: 'common' })}</option>
                    <option value="Kyrgyzstan">{t('countries.kyrgyzstan', { ns: 'common' })}</option>
                    <option value="Tajikistan">{t('countries.tajikistan', { ns: 'common' })}</option>
                    <option value="Turkmenistan">{t('countries.turkmenistan', { ns: 'common' })}</option>
                    <option value="Russia">{t('countries.russia', { ns: 'common' })}</option>
                    <option value="USA">{t('countries.usa', { ns: 'common' })}</option>
                    <option value="UK">{t('countries.uk', { ns: 'common' })}</option>
                    <option value="Other">{t('countries.other', { ns: 'common' })}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.telegramOptional', { ns: 'common' })}</label>
                  <input
                    type="text" value={regForm.telegram} onChange={e => setRegForm({ ...regForm, telegram: e.target.value })}
                    placeholder={t('form.telegramPlaceholder', { ns: 'common' })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eu-blue focus:border-transparent outline-none"
                  />
                </div>
                {regError && <p className="text-red-500 text-sm">{regError}</p>}
                <button
                  type="submit" disabled={regLoading}
                  className="w-full py-3 bg-eu-blue text-white rounded-xl font-semibold hover:bg-eu-dark transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {regLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('register', { ns: 'common' })} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
