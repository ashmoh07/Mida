
import React from 'react';
import { TranslationStrings, Language, Theme } from '../types';

interface Props {
  t: TranslationStrings;
  language: Language;
  theme: Theme;
  onSetLanguage: (lang: Language) => void;
  onSetTheme: (theme: Theme) => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ t, language, theme, onSetLanguage, onSetTheme, onBack }) => {
  return (
    <div className="flex flex-col min-h-screen p-6 max-w-lg mx-auto bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <i className={`fa-solid ${language === Language.AR ? 'fa-arrow-right' : 'fa-arrow-left'} text-xl dark:text-white`}></i>
        </button>
        <h2 className="text-2xl font-black mx-4 dark:text-white uppercase tracking-tight">{t.settings}</h2>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 rtl:ml-4 rtl:mr-0">
              <i className="fa-solid fa-language text-lg"></i>
            </div>
            <span className="font-bold text-gray-700 dark:text-slate-200">{t.language}</span>
          </div>
          <select 
            className="bg-transparent border-none outline-none font-black text-indigo-600 dark:text-indigo-400 text-right rtl:text-left cursor-pointer"
            value={language}
            onChange={(e) => onSetLanguage(e.target.value as Language)}
          >
            <option value={Language.EN}>English</option>
            <option value={Language.AR}>العربية</option>
          </select>
        </div>

        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 rtl:ml-4 rtl:mr-0">
              <i className={`fa-solid ${theme === Theme.DARK ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
            </div>
            <span className="font-bold text-gray-700 dark:text-slate-200">{t.theme}</span>
          </div>
          <button 
            onClick={() => onSetTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
            className="w-14 h-8 bg-gray-300 dark:bg-indigo-600 rounded-full relative transition-colors duration-300 shadow-inner"
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${theme === Theme.DARK ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
               <div className={`w-1 h-1 rounded-full ${theme === Theme.DARK ? 'bg-indigo-600' : 'bg-amber-500'}`}></div>
            </div>
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center">
         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mida Pro v2.5.0</p>
         <p className="text-[10px] text-gray-300 mt-1">Huk Universe Strategic Solution</p>
      </div>
    </div>
  );
};

export default SettingsView;
