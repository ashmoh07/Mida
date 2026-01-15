
import React from 'react';

const AdMobPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-16 bg-gray-200 border-y border-gray-300 flex items-center justify-center text-xs text-gray-400 font-mono my-4">
      <div className="text-center">
        <i className="fa-solid fa-rectangle-ad mr-2"></i>
        <span>GOOGLE ADMOB PLACEHOLDER</span>
        <div className="opacity-50">com.google.android.gms.ads.AdView</div>
      </div>
    </div>
  );
};

export default AdMobPlaceholder;
