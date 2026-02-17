import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Users, GraduationCap, Award, Globe, CheckCircle, ChevronDown, FileText, BookOpen } from 'lucide-react';
import { submitMembershipApplication } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const tierIds = ['full', 'associate', 'academic', 'honorary'] as const;

const tierIcons: Record<string, typeof Users> = {
  full: Users,
  associate: Globe,
  academic: GraduationCap,
  honorary: Award,
};

const formStepKeys = [
  { number: 1, key: 'personalInfo' },
  { number: 2, key: 'professional' },
  { number: 3, key: 'specialization' },
  { number: 4, key: 'review' },
];

const specializationKeys = [
  'internationalLaw',
  'euLaw',
  'corporateLaw',
  'commercialArbitration',
  'intellectualProperty',
  'dataProtection',
  'energy',
  'banking',
  'taxLaw',
  'labor',
  'realEstate',
  'criminalLaw',
  'humanRights',
  'environmentalLaw',
  'other',
];

export default function MembershipPage() {
  const { t } = useTranslation(['membership', 'common']);
  const regulationsSections = t('regulations.sections', { returnObjects: true }) as Array<{
    number: string; title: string; content: string[];
  }>;
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [openRegSection, setOpenRegSection] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    title: '',
    experience: '',
    specializations: [] as string[],
    motivation: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

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

      if (tiersRef.current) {
        gsap.fromTo(
          tiersRef.current.querySelectorAll('.tier-card'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: tiersRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setCurrentStep(1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const submitForm = async () => {
    try {
      await submitMembershipApplication({
        ...formData,
        tier: selectedTier,
        company: formData.organization,
      });
    } catch { /* API may not be connected yet */ }
    setIsSubmitted(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-xl text-eu-dark mb-6">
              {t('form.personalInformation')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-eu-dark mb-2">
                  {t('form.firstName')} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                  placeholder={t('form.firstNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-eu-dark mb-2">
                  {t('form.lastName')} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                  placeholder={t('form.lastNamePlaceholder')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.emailAddress', { ns: 'common' })} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                placeholder={t('form.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.phoneNumber', { ns: 'common' })}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                placeholder={t('form.phonePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.country')} *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
              >
                <option value="">{t('form.selectCountry')}</option>
                <option value="uzbekistan">{t('countries.uzbekistan', { ns: 'common' })}</option>
                <option value="germany">{t('countries.germany', { ns: 'common' })}</option>
                <option value="france">{t('countries.france', { ns: 'common' })}</option>
                <option value="netherlands">{t('countries.netherlands', { ns: 'common' })}</option>
                <option value="belgium">{t('countries.belgium', { ns: 'common' })}</option>
                <option value="other">{t('countries.other', { ns: 'common' })}</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-xl text-eu-dark mb-6">
              {t('form.professionalBackground')}
            </h3>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.organization')}
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                placeholder={t('form.organizationPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.jobTitle')}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
                placeholder={t('form.jobTitlePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.experience')} *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors"
              >
                <option value="">{t('form.selectExperience')}</option>
                <option value="0-2">{t('form.experienceOptions.0-2')}</option>
                <option value="3-5">{t('form.experienceOptions.3-5')}</option>
                <option value="6-10">{t('form.experienceOptions.6-10')}</option>
                <option value="11-15">{t('form.experienceOptions.11-15')}</option>
                <option value="15+">{t('form.experienceOptions.15+')}</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-xl text-eu-dark mb-6">
              {t('form.areasOfSpecialization')}
            </h3>
            <p className="text-sm text-eu-text-secondary mb-4">
              {t('form.selectAreasHint')}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {specializationKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSpecializationToggle(key)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                    formData.specializations.includes(key)
                      ? 'bg-eu-blue text-white'
                      : 'bg-eu-card text-eu-dark hover:bg-eu-blue/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t(`specializations.${key}`)}</span>
                    {formData.specializations.includes(key) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-eu-dark mb-2">
                {t('form.whyJoin')}
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-eu-border focus:border-eu-blue outline-none transition-colors resize-none"
                placeholder={t('form.whyJoinPlaceholder')}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-xl text-eu-dark mb-6">
              {t('form.reviewApplication')}
            </h3>
            <div className="space-y-4 bg-eu-card rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-eu-text-tertiary">{t('form.name')}</span>
                  <p className="font-medium text-eu-dark">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-eu-text-tertiary">{t('form.email')}</span>
                  <p className="font-medium text-eu-dark">{formData.email}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-eu-text-tertiary">{t('form.organizationLabel')}</span>
                  <p className="font-medium text-eu-dark">{formData.organization || t('form.notSpecified')}</p>
                </div>
                <div>
                  <span className="text-sm text-eu-text-tertiary">{t('form.position')}</span>
                  <p className="font-medium text-eu-dark">{formData.title || t('form.notSpecified')}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-eu-text-tertiary">{t('form.specializations')}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.specializations.length > 0 ? (
                    formData.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-eu-blue/10 text-eu-blue text-xs rounded-full"
                      >
                        {t(`specializations.${spec}`)}
                      </span>
                    ))
                  ) : (
                    <span className="text-eu-text-secondary">{t('form.noneSelected')}</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-eu-text-secondary">
              {t('form.termsAgreement')}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center glass-card rounded-3xl p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-eu-dark mb-4">
            {t('form.submitted.title')}
          </h2>
          <p className="text-eu-text-secondary mb-8">
            {t('form.submitted.description')}
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            {t('returnHome', { ns: 'common' })}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (currentStep === 0) {
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

        {/* Membership Tiers */}
        <section ref={tiersRef} className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-eu-dark mb-4">
                {t('chooseTier.title')} <span className="text-eu-blue">{t('chooseTier.titleHighlight')}</span> {t('chooseTier.titleEnd')}
              </h2>
              <p className="text-eu-text-secondary max-w-xl mx-auto">
                {t('chooseTier.description')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tierIds.map((tierId) => {
                const TierIcon = tierIcons[tierId];
                const features = t(`tiers.${tierId}.features`, { returnObjects: true }) as string[];
                return (
                  <div
                    key={tierId}
                    className="tier-card group"
                  >
                    <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-eu-blue/10 flex items-center justify-center mb-4 group-hover:bg-eu-blue transition-colors duration-300">
                        <TierIcon className="w-7 h-7 text-eu-blue group-hover:text-white transition-colors duration-300" />
                      </div>

                      {/* Title & Price */}
                      <h3 className="font-heading font-semibold text-xl text-eu-dark mb-2">
                        {t(`tiers.${tierId}.title`)}
                      </h3>
                      <p className="text-sm text-eu-text-secondary mb-4">
                        {t(`tiers.${tierId}.description`)}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-heading font-bold text-eu-blue">
                          {tierId === 'honorary' ? t('pricing.na') : t('pricing.free')}
                        </span>
                        <span className="text-sm text-eu-text-secondary ml-1">
                          {tierId === 'honorary' ? t('pricing.lifetime') : t('pricing.untilDec2026')}
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 flex-grow">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-eu-text-secondary">
                            <Check className="w-4 h-4 text-eu-blue flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <button
                        onClick={() => handleTierSelect(tierId)}
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                          tierId === 'honorary'
                            ? 'bg-eu-card text-eu-text-secondary cursor-not-allowed'
                            : 'bg-eu-blue text-white hover:bg-eu-dark'
                        }`}
                        disabled={tierId === 'honorary'}
                      >
                        {tierId === 'honorary' ? t('byInvitation', { ns: 'common' }) : t('select', { ns: 'common' })}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benefits Section */}
            <div className="mt-20 glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-heading font-semibold text-eu-dark mb-8 text-center">
                {t('benefits.title')}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(t('benefits.items', { returnObjects: true }) as Array<{ title: string; desc: string }>).map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-eu-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-eu-gold" />
                    </div>
                    <div>
                      <h4 className="font-medium text-eu-dark">{benefit.title}</h4>
                      <p className="text-sm text-eu-text-secondary">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Membership Regulations */}
        <section className="py-20 lg:py-32 bg-eu-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-eu-gold border border-eu-gold/30 rounded-full mb-6">
                {t('regulations.label')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-4">
                {t('regulations.title')} <span className="text-eu-gold">{t('regulations.titleHighlight')}</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                {t('regulations.description')}
              </p>
            </div>

            {/* Key Facts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { icon: CheckCircle, value: t('regulations.keyFacts.free'), label: t('regulations.keyFacts.freeLabel') },
                { icon: Users, value: t('regulations.keyFacts.categories'), label: t('regulations.keyFacts.categoriesLabel') },
                { icon: BookOpen, value: t('regulations.keyFacts.areas'), label: t('regulations.keyFacts.areasLabel') },
                { icon: FileText, value: t('regulations.keyFacts.articles'), label: t('regulations.keyFacts.articlesLabel') },
              ].map((item) => (
                <div key={item.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-eu-gold/30 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-eu-gold mx-auto mb-3" />
                  <div className="text-2xl font-heading font-bold text-eu-gold mb-1">{item.value}</div>
                  <div className="text-sm text-white/60">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Regulations Accordion — Two columns on desktop */}
            <div className="grid lg:grid-cols-2 gap-x-6 gap-y-3">
              {[regulationsSections.slice(0, 6), regulationsSections.slice(6)].map((column, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  {column.map((section, idx) => {
                    const globalIdx = colIdx === 0 ? idx : idx + 6;
                    return (
                      <div
                        key={section.number}
                        className={`rounded-2xl border transition-all duration-300 ${
                          openRegSection === globalIdx
                            ? 'bg-white/10 border-eu-gold/30'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <button
                          onClick={() => setOpenRegSection(openRegSection === globalIdx ? null : globalIdx)}
                          className="w-full flex items-center gap-3 p-4 text-left"
                        >
                          <span className="w-9 h-9 rounded-lg bg-eu-gold/20 text-eu-gold flex items-center justify-center font-heading font-bold text-xs flex-shrink-0">
                            {section.number}
                          </span>
                          <span className="font-heading font-semibold text-base flex-grow">
                            {section.title}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-white/40 transition-transform duration-300 flex-shrink-0 ${
                              openRegSection === globalIdx ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openRegSection === globalIdx && (
                          <div className="px-4 pb-5 pl-16 space-y-2.5">
                            {section.content.map((item, i) =>
                              /^(Article|Статья|Modda)\s/.test(item) ? (
                                <h4 key={i} className="font-semibold text-eu-gold/80 text-sm pt-3 first:pt-0">
                                  {item}
                                </h4>
                              ) : (
                                <p key={i} className="text-white/60 text-sm leading-relaxed">
                                  {item}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <p className="text-center text-white/40 text-xs mt-12 max-w-xl mx-auto">
              {t('regulations.footer')}
            </p>
          </div>
        </section>
      </div>
    );
  }

  const SelectedTierIcon = selectedTier ? tierIcons[selectedTier] : null;

  return (
    <div className="pt-20 min-h-screen bg-eu-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            {formStepKeys.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-eu-blue text-white'
                        : currentStep === step.number
                        ? 'bg-eu-blue text-white ring-4 ring-eu-blue/20'
                        : 'bg-eu-card text-eu-text-secondary'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors duration-300 ${
                      currentStep >= step.number ? 'text-eu-blue' : 'text-eu-text-tertiary'
                    }`}
                  >
                    {t(`form.steps.${step.key}`)}
                  </span>
                </div>
                {/* Connector line */}
                {index < formStepKeys.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] rounded-full transition-colors duration-300 ${
                      currentStep > step.number ? 'bg-eu-blue' : 'bg-eu-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8">
          {/* Selected Tier Display */}
          {selectedTier && SelectedTierIcon && (
            <div className="mb-8 p-4 bg-eu-blue/5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-eu-blue/10 flex items-center justify-center">
                <SelectedTierIcon className="w-6 h-6 text-eu-blue" />
              </div>
              <div>
                <p className="text-sm text-eu-text-tertiary">{t('form.selectedTier')}</p>
                <p className="font-medium text-eu-dark">{selectedTier ? t(`tiers.${selectedTier}.title`) : ''}</p>
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-eu-border">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'text-eu-text-tertiary cursor-not-allowed'
                  : 'text-eu-dark hover:bg-eu-card'
              }`}
            >
              <ArrowLeft size={18} />
              {t('previous', { ns: 'common' })}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="btn-primary inline-flex items-center gap-2"
              >
                {t('continue', { ns: 'common' })}
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={submitForm}
                className="btn-primary inline-flex items-center gap-2"
              >
                {t('form.submitApplication')}
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
