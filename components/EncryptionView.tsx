
import React, { useState } from 'react';
import { TranslationStrings } from '../types';
import { validatePassword, encryptData } from '../utils/crypto';
import { hideDataInImage } from '../utils/stega';
import AdMobPlaceholder from './AdMobPlaceholder';

interface Props {
  t: TranslationStrings;
  onBack: () => void;
}

const EncryptionView: React.FC<Props> = ({ t, onBack }) => {
  const [carrier, setCarrier] = useState<File | null>(null);
  const [secret, setSecret] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleProcess = async () => {
    setError(null);
    if (!carrier) return setError(t.errorNoImage);
    if (!secret) return setError(t.errorNoFile);
    
    if (!validatePassword(password)) {
      return setError(t.errorInvalidPassword);
    }

    try {
      setLoading(true);
      setProgress(10);
      setLoadingStatus("جاري قراءة الملف السري...");
      
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          setProgress(30);
          const fileData = new Uint8Array(reader.result as ArrayBuffer);
          
          setLoadingStatus("تشفير البيانات (AES-256)...");
          setProgress(50);
          const encrypted = await encryptData(fileData, password);
          
          setLoadingStatus("دمج البيانات داخل الصورة (LSB)...");
          setProgress(70);
          const encodedUrl = await hideDataInImage(carrier, encrypted, {
            name: secret.name,
            type: secret.type
          });
          
          setProgress(100);
          setResultUrl(encodedUrl);
          setLoading(false);
        } catch (e: any) {
          setError("فشل التشفير: " + e.message);
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(secret);
    } catch (e: any) {
      setError("حدث خطأ غير متوقع.");
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
            <div className="w-24 h-24 border-4 border-indigo-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="absolute text-lg font-black text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          
          <div className="w-64 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xl font-bold text-gray-800 dark:text-white text-center px-6 mb-2">{loadingStatus}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 animate-pulse">يرجى عدم إغلاق التطبيق...</p>
        </div>
      )}

      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <i className="fa-solid fa-arrow-left text-xl dark:text-white rtl:rotate-180"></i>
        </button>
        <h2 className="text-2xl font-black ml-4 rtl:mr-4 rtl:ml-0 dark:text-white">{t.encrypt}</h2>
      </div>

      <div className="space-y-6 flex-grow">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">{t.carrierImage}</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-3xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all group">
            <i className="fa-solid fa-image text-3xl text-indigo-400 group-hover:scale-110 transition-transform mb-2"></i>
            <span className="text-sm text-gray-500 truncate px-4 font-medium">
              {carrier ? carrier.name : t.selectImage}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={e => setCarrier(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">{t.secretFile}</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-200 dark:border-slate-700 rounded-3xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all group">
            <i className="fa-solid fa-file-shield text-3xl text-emerald-400 group-hover:scale-110 transition-transform mb-2"></i>
            <span className="text-sm text-gray-500 truncate px-4 font-medium">
              {secret ? secret.name : t.selectFile}
            </span>
            <input type="file" className="hidden" onChange={e => setSecret(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">{t.password}</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <p className="text-[11px] text-indigo-500 font-bold px-2">{t.passwordHint}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-bold flex items-center animate-pulse">
            <i className="fa-solid fa-circle-xmark mr-2"></i> {error}
          </div>
        )}

        {!resultUrl ? (
          <button onClick={handleProcess} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
            {t.process}
          </button>
        ) : (
          <div className="space-y-4">
             <div className="p-4 bg-green-100 text-green-700 rounded-2xl text-center font-bold border border-green-200">
              {isRedirecting ? "تم التحميل! جاري العودة للرئيسية..." : "تم التشفير بنجاح! جاهز للتحميل"}
            </div>
            <a 
              href={resultUrl} 
              download={`mida_secure_${Date.now()}.png`} 
              onClick={handleDownload}
              className="flex items-center justify-center w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all"
            >
              <i className="fa-solid fa-download mr-2 rtl:ml-2 rtl:mr-0"></i> تحميل الملف المؤمن
            </a>
          </div>
        )}
      </div>
      <AdMobPlaceholder />
    </div>
  );
};

export default EncryptionView;
