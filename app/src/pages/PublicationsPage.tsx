import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, FileText, Newspaper, BarChart3, ArrowRight, Download, Calendar, User, Loader2 } from 'lucide-react';
import { publicationsApi, incrementDownload } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<string, typeof BookOpen> = {
  all: BookOpen,
  articles: FileText,
  research: BarChart3,
  reports: FileText,
  newsletters: Newspaper,
};

interface Publication {
  id: number;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  image_url: string;
  file_url: string;
  downloads: number;
  created_at: string;
}

export default function PublicationsPage() {
  const { t } = useTranslation(['publications', 'common']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const publicationsRef = useRef<HTMLDivElement>(null);

  const categories = Object.entries(t('categories', { returnObjects: true }) as Record<string, string>).map(
    ([id, label]) => ({ id, label, icon: categoryIcons[id] || BookOpen })
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await publicationsApi.getAll('published');
        setPublications(data);
      } catch {
        setPublications([]);
      }
      setLoading(false);
    }
    load();
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
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || publications.length === 0) return;
    const ctx = gsap.context(() => {
      if (publicationsRef.current) {
        gsap.fromTo(
          publicationsRef.current.querySelectorAll('.publication-card'),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: publicationsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [loading, publications, activeCategory]);

  const filteredPublications = activeCategory === 'all'
    ? publications
    : publications.filter((p) => p.category === activeCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownload = async (pub: Publication) => {
    if (pub.file_url) {
      window.open(pub.file_url, '_blank');
      try {
        const result = await incrementDownload(pub.id);
        setPublications(prev => prev.map(p => p.id === pub.id ? { ...p, downloads: result.downloads ?? p.downloads + 1 } : p));
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-eu-blue/5 to-eu-gold/5">
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

      {/* Category Filter */}
      <section className="py-8 border-b border-eu-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-eu-dark">{t('filterBy', { ns: 'common' })}</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-eu-blue text-white'
                      : 'bg-eu-card text-eu-dark hover:bg-eu-blue/10'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section ref={publicationsRef} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-eu-blue animate-spin mb-4" />
              <p className="text-eu-text-secondary">{t('loadingPublications')}</p>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-eu-border mx-auto mb-4" />
              <p className="text-eu-text-secondary text-lg">{t('noPublications')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.map((pub) => (
                <div key={pub.id} className="publication-card group">
                  <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {pub.image_url ? (
                        <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-eu-blue/20 to-eu-gold/20 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-eu-blue/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-eu-dark/60 to-transparent" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-eu-dark text-xs font-medium capitalize">
                        {pub.category}
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-eu-gold text-eu-dark text-xs font-medium flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {pub.downloads || 0}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-lg text-eu-dark mb-3 group-hover:text-eu-blue transition-colors line-clamp-2">
                        {pub.title}
                      </h3>
                      <p className="text-eu-text-secondary text-sm mb-4 line-clamp-2">
                        {pub.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-eu-text-secondary mb-4">
                        {pub.author && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-eu-blue" />
                            <span>{pub.author}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-eu-blue" />
                          <span>{formatDate(pub.created_at)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(pub)}
                        disabled={!pub.file_url}
                        className={`w-full py-3 rounded-xl border-2 font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                          pub.file_url
                            ? 'border-eu-blue text-eu-blue hover:bg-eu-blue hover:text-white'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {pub.file_url ? t('download', { ns: 'common' }) : t('noFileAvailable', { ns: 'common' })}
                        {pub.file_url && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
