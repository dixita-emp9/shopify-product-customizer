import React, { Suspense, lazy, useEffect, useState } from 'react';

const App = lazy(() => import('../../App'));

export default function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-100 border-t-pink-600"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Initialising Workspace...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-100 border-t-pink-600"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Canvas...</p>
      </div>
    }>
      <App />
    </Suspense>
  );
}