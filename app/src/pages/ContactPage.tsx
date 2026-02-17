import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Send, CheckCircle, Clock } from 'lucide-react';
import { submitContact } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
];

const subjectKeys = [
  'generalInquiry',
  'membership',
  'events',
  'publications',
  'partnerships',
  'media',
] as const;

export default function ContactPage() {
  const { t } = useTranslation(['contact', 'common']);

  const officeHours = [
    { day: t('hours.monFri'), hours: t('hours.monFriTime') },
    { day: t('hours.sat'), hours: t('hours.satTime') },
    { day: t('hours.sun'), hours: t('hours.sunTime') },
  ];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.querySelectorAll('.animate-item'),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact(formData);
    } catch { /* API may not be connected yet */ }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      {/* Contact Info & Form */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left - Contact Info */}
            <div ref={infoRef} className="lg:col-span-2 space-y-8">
              {/* Email */}
              <div className="animate-item flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-eu-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-eu-blue transition-colors duration-300">
                  <Mail className="w-5 h-5 text-eu-blue group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-eu-dark mb-1">{t('email')}</h4>
                  <a
                    href="mailto:info@uzeuro.uz"
                    className="text-eu-text-secondary hover:text-eu-blue transition-colors"
                  >
                    info@uzeuro.uz
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="animate-item flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-eu-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-eu-gold transition-colors duration-300">
                  <Phone className="w-5 h-5 text-eu-gold group-hover:text-eu-dark transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-eu-dark mb-1">{t('phone')}</h4>
                  <a
                    href="tel:+998711234567"
                    className="text-eu-text-secondary hover:text-eu-blue transition-colors"
                  >
                    +998 71 123 4567
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="animate-item flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-eu-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-eu-blue transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-eu-blue group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-eu-dark mb-1">{t('mainOffice')}</h4>
                  <p className="text-eu-text-secondary">
                    {t('addressMain')}
                    <br />
                    <span className="text-sm text-eu-text-tertiary">{t('addressEU')}</span>
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="animate-item glass-card rounded-2xl p-6">
                <h4 className="font-heading font-semibold text-eu-dark mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-eu-blue" />
                  {t('officeHours')}
                </h4>
                <div className="space-y-2">
                  {officeHours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-sm">
                      <span className="text-eu-text-secondary">{schedule.day}</span>
                      <span className="text-eu-dark font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="animate-item">
                <h4 className="font-heading font-semibold text-eu-dark mb-4">{t('followUs')}</h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-12 h-12 rounded-xl bg-eu-card flex items-center justify-center text-eu-text-secondary hover:bg-eu-blue hover:text-white transition-all duration-300 hover:scale-110"
                      aria-label={social.name}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="lg:col-span-3 glass-card rounded-3xl p-8"
            >
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-eu-dark mb-2">
                    {t('messageSent')}
                  </h3>
                  <p className="text-eu-text-secondary">
                    {t('messageSentDesc')}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-heading font-semibold text-eu-dark mb-6">
                    {t('sendMessage')}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder=" "
                        required
                        className="peer w-full px-4 py-3 bg-eu-card rounded-xl border-2 border-transparent focus:border-eu-blue outline-none transition-colors placeholder-transparent"
                      />
                      <label className="absolute left-4 top-3 text-eu-text-secondary text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-eu-blue peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:text-xs bg-white px-1">
                        {t('yourName')}
                      </label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder=" "
                        required
                        className="peer w-full px-4 py-3 bg-eu-card rounded-xl border-2 border-transparent focus:border-eu-blue outline-none transition-colors placeholder-transparent"
                      />
                      <label className="absolute left-4 top-3 text-eu-text-secondary text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-eu-blue peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:text-xs bg-white px-1">
                        {t('emailAddress')}
                      </label>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative mb-6">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-eu-card rounded-xl border-2 border-transparent focus:border-eu-blue outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">{t('form.selectSubject', { ns: 'common' })}</option>
                      {subjectKeys.map((key) => (
                        <option key={key} value={key}>
                          {t(`subjects.${key}`, { ns: 'common' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="relative mb-6">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      rows={5}
                      className="peer w-full px-4 py-3 bg-eu-card rounded-xl border-2 border-transparent focus:border-eu-blue outline-none transition-colors placeholder-transparent resize-none"
                    />
                    <label className="absolute left-4 top-3 text-eu-text-secondary text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-eu-blue peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:text-xs bg-white px-1">
                      {t('yourMessage')}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2 group"
                  >
                    {t('sendMessage', { ns: 'common' })}
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
