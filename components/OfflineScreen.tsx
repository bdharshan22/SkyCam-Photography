import React from 'react';

const OfflineScreen: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-zinc-900/95 text-white p-6">
      <div className="max-w-2xl text-center">
        <div className="mb-6">
          <svg width="140" height="140" viewBox="0 0 24 24" className="mx-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8l-3 3v5a2 2 0 0 0 2 2h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 16l3 3v1a2 2 0 0 1-2 2h-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeOpacity="0.12" strokeWidth="2"/>
          </svg>
          <h2 className="text-3xl font-serif font-bold">You appear to be offline</h2>
        </div>

        <p className="text-zinc-300 mb-6">We couldn't connect to the network. Some features may be unavailable. Please check your connection and try again.</p>

        <div className="flex items-center justify-center gap-4">
          <button onClick={onRetry} className="px-5 py-3 bg-brand-600 text-white rounded shadow">Retry</button>
          <button onClick={() => window.location.reload()} className="px-5 py-3 border border-zinc-700 text-white rounded">Reload Page</button>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;
