
import React, { useState, useEffect } from 'react';
import { View, Language, Theme } from './types';
import { TRANSLATIONS } from './constants';
import EncryptionView from './components/EncryptionView';
import DecryptionView from './components/DecryptionView';
import SettingsView from './components/SettingsView';
import AboutView from './components/AboutView';
import AdMobPlaceholder from './components/AdMobPlaceholder';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // تحديث فئة Dark في الجذر (html) وتغيير خلفية الجسم (body)
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
      document.body.className = "bg-slate-900 text-slate-100 transition-colors duration-300";
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = "bg-gray-50 text-gray-900 transition-colors duration-300";
    }
  }, [theme]);

  const renderHome = () => (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-3 rtl:ml-3 rtl:mr-0">
            <i className="fa-solid fa-fingerprint text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black dark:text-white">{t.appName}</h1>
        </div>
        <button 
          onClick={() => setView(View.SETTINGS)}
          className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-gray-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-gear text-xl"></i>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-4 w-full max-w-sm mx-auto">
        <button 
          onClick={() => setView(View.ENCRYPT)}
          className="m3-card w-full h-40 bg-indigo-600 text-white shadow-xl flex flex-col items-center justify-center p-6 transition-all hover:bg-indigo-700 hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <i className="fa-solid fa-lock text-3xl"></i>
          </div>
          <span className="text-lg font-bold tracking-wide uppercase">{t.encrypt}</span>
        </button>

        <button 
          onClick={() => setView(View.DECRYPT)}
          className="m3-card w-full h-40 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl flex flex-col items-center justify-center p-6 transition-all hover:shadow-2xl border border-indigo-50 dark:border-slate-700 hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
            <i className="fa-solid fa-lock-open text-3xl"></i>
          </div>
          <span className="text-lg font-bold tracking-wide uppercase">{t.decrypt}</span>
        </button>

        <button 
          onClick={() => setView(View.ABOUT)}
          className="m3-card w-full h-40 bg-emerald-600 text-white shadow-xl flex flex-col items-center justify-center p-6 transition-all hover:bg-emerald-700 hover:-translate-y-1"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <i className="fa-solid fa-users text-3xl"></i>
          </div>
          <span className="text-lg font-bold tracking-wide uppercase">{t.aboutUs}</span>
        </button>
      </main>

      <footer className="p-6 mt-auto">
        <AdMobPlaceholder />
      </footer>
    </div>
  );

  switch (view) {
    case View.ENCRYPT:
      return <EncryptionView t={t} onBack={() => setView(View.HOME)} />;
    case View.DECRYPT:
      return <DecryptionView t={t} onBack={() => setView(View.HOME)} />;
    case View.SETTINGS:
      return (
        <SettingsView 
          t={t} 
          language={language} 
          theme={theme}
          onSetLanguage={setLanguage}
          onSetTheme={setTheme}
          onBack={() => setView(View.HOME)}
        />
      );
    case View.ABOUT:
      return <AboutView t={t} onBack={() => setView(View.HOME)} />;
    default:
      return renderHome();
  }
};

export default App;
