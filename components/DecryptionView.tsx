
import React, { useState } from 'react';
import { TranslationStrings } from '../types';
import { decryptData } from '../utils/crypto';
import { extractDataFromImage } from '../utils/stega';
import AdMobPlaceholder from './AdMobPlaceholder';

interface Props {
  t: TranslationStrings;
  onBack: () => void;
}

const DecryptionView: React.FC<Props> = ({ t, onBack }) => {
  const [encoded, setEncoded] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string, name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleProcess = async () => {
    setError(null);
    if (!encoded) return setError(t.errorNoImage);
    if (password.length < 8) return setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");

    try {
      setLoading(true);
      setProgress(20);
      setLoadingStatus("جاري فحص البصمة الرقمية للصورة...");
      
      const extracted = await extractDataFromImage(encoded);
      
      setProgress(60);
      setLoadingStatus("جاري فك التشفير (AES-256)...");
      const decryptedBytes = await decryptData(extracted.data, password);
      
      setProgress(90);
      setLoadingStatus("تحضير الملف للاستعادة...");
      const blob = new Blob([decryptedBytes], { type: extracted.type });
      const url = URL.createObjectURL(blob);
      
      setProgress(100);
      setResult({ url, name: extracted.name });
      setLoading(false);
    } catch (e: any) {
      setError(e.message.includes("كلمة المرور") ? "كلمة المرور غير صحيحة." : e.message);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-lg mx-auto bg-white dark:bg-slate-900 transition-colors duration-300">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-24 h-24 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="absolute text-lg font-black text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>

          <div className="w-64 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xl font-bold text-gray-800 dark:text-white text-center px-6 mb-2">{loadingStatus}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 animate-pulse">يرجى الانتظار، جاري معالجة البيانات...</p>
        </div>
      )}

      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <i className="fa-solid fa-arrow-left text-xl dark:text-white rtl:rotate-180"></i>
        </button>
        <h2 className="text-2xl font-black ml-4 rtl:mr-4 rtl:ml-0 dark:text-white uppercase tracking-tighter">{t.decrypt}</h2>
      </div>

      <div className="space-y-6 flex-grow">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase">الصورة المؤمنة (MIDA PNG)</label>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 dark:border-slate-700 rounded-3xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-all group">
            <i className="fa-solid fa-magnifying-glass-chart text-4xl text-blue-400 group-hover:scale-110 transition-transform mb-3"></i>
            <span className="text-sm text-gray-500 truncate px-4 w-full text-center font-bold">
              {encoded ? encoded.name : "اختر الصورة لاستعادة الملف"}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={e => setEncoded(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">{t.password}</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-bold flex items-center">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}

        {!result ? (
          <button onClick={handleProcess} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all active:scale-95">
            استخراج الملف الآن
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 text-green-700 rounded-2xl text-center font-bold border border-green-200 shadow-sm">
              {isRedirecting ? "تم الاستخراج! جاري العودة..." : "تم فك التشفير واستعادة الملف!"}
            </div>
            <a 
              href={result.url} 
              download={result.name} 
              onClick={handleDownload}
              className="flex items-center justify-center w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all"
            >
              <i className="fa-solid fa-file-arrow-down mr-2 rtl:ml-2 rtl:mr-0"></i> تحميل {result.name}
            </a>
          </div>
        )}
      </div>
      <AdMobPlaceholder />
    </div>
  );
};

export default DecryptionView;
