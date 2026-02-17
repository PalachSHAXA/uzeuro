import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import homeEn from './locales/en/home.json';
import aboutEn from './locales/en/about.json';
import eventsEn from './locales/en/events.json';
import membershipEn from './locales/en/membership.json';
import publicationsEn from './locales/en/publications.json';
import webinarsEn from './locales/en/webinars.json';
import contactEn from './locales/en/contact.json';

import commonRu from './locales/ru/common.json';
import homeRu from './locales/ru/home.json';
import aboutRu from './locales/ru/about.json';
import eventsRu from './locales/ru/events.json';
import membershipRu from './locales/ru/membership.json';
import publicationsRu from './locales/ru/publications.json';
import webinarsRu from './locales/ru/webinars.json';
import contactRu from './locales/ru/contact.json';

import commonUz from './locales/uz/common.json';
import homeUz from './locales/uz/home.json';
import aboutUz from './locales/uz/about.json';
import eventsUz from './locales/uz/events.json';
import membershipUz from './locales/uz/membership.json';
import publicationsUz from './locales/uz/publications.json';
import webinarsUz from './locales/uz/webinars.json';
import contactUz from './locales/uz/contact.json';

const savedLang = localStorage.getItem('uzeuro_lang');
const browserLang = navigator.language.split('-')[0];
const defaultLang = savedLang || (['en', 'ru', 'uz'].includes(browserLang) ? browserLang : 'en');

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      home: homeEn,
      about: aboutEn,
      events: eventsEn,
      membership: membershipEn,
      publications: publicationsEn,
      webinars: webinarsEn,
      contact: contactEn,
    },
    ru: {
      common: commonRu,
      home: homeRu,
      about: aboutRu,
      events: eventsRu,
      membership: membershipRu,
      publications: publicationsRu,
      webinars: webinarsRu,
      contact: contactRu,
    },
    uz: {
      common: commonUz,
      home: homeUz,
      about: aboutUz,
      events: eventsUz,
      membership: membershipUz,
      publications: publicationsUz,
      webinars: webinarsUz,
      contact: contactUz,
    },
  },
  lng: defaultLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
