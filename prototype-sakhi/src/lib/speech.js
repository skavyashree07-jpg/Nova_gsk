import { languages } from './i18n.js';
export const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition || null;
export const speechLocale = code => languages.find(lang => lang.code === code)?.speech || 'en-IN';
