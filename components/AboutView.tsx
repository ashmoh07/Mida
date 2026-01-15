
import React from 'react';
import { TranslationStrings } from '../types';

interface Props {
  t: TranslationStrings;
  onBack: () => void;
}

const AboutView: React.FC<Props> = ({ t, onBack }) => {
  return (
    <div className="flex flex-col min-h-screen p-6 max-w-lg mx-auto bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
          <i className="fa-solid fa-arrow-left text-xl dark:text-white"></i>
        </button>
        <h2 className="text-2xl font-bold ml-4 dark:text-white">{t.aboutUs}</h2>
      </div>

      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-500">
            <i className="fa-solid fa-fingerprint text-white text-5xl"></i>
          </div>
        </div>
        <h1 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight">
          {t.midaHukTitle}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 font-semibold px-4 italic leading-relaxed">
          "{t.midaHukDescription}"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-graduation-cap text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black ml-4 dark:text-white">{t.trainingTitle}</h3>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.trainingDesc}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-user-shield text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black ml-4 dark:text-white">{t.expertiseTitle}</h3>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.expertiseDesc}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-transparent hover:border-amber-200 dark:hover:border-amber-900 transition-all group">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-rocket text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black ml-4 dark:text-white">{t.innovationTitle}</h3>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.innovationDesc}
          </p>
        </div>
      </div>

      <div className="mt-auto py-8">
         <div className="bg-indigo-600 text-white rounded-[2rem] p-6 text-center shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h4 className="text-lg font-bold mb-2">Join the Elite Huk Community</h4>
            <div className="flex justify-center space-x-6">
              <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                <i className="fa-brands fa-telegram text-2xl"></i>
              </button>
              <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                <i className="fa-brands fa-youtube text-2xl"></i>
              </button>
              <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                <i className="fa-brands fa-github text-2xl"></i>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutView;
