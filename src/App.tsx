import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import WhatYouGet from './components/WhatYouGet';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ApprenticeshipsPage from './components/ApprenticeshipsPage';
import PreferencesPage from './components/PreferencesPage';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.replace(/^#\/?/, ''));
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace(/^#\/?/, ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

export default function App() {
  const rawRoute = useHashRoute();
  const [path, search] = rawRoute.split('?');
  const params = new URLSearchParams(search ?? '');

  useEffect(() => {
    if (path !== 'signup') return;
    const input = document.getElementById('signup-email');
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus();
  }, [path]);

  if (path === 'apprenticeships') {
    const initialPostcode = params.get('postcode') ?? undefined;
    const initialRadiusParam = params.get('radius');
    const initialRadiusMiles = initialRadiusParam ? Number(initialRadiusParam) : undefined;

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <ApprenticeshipsPage initialPostcode={initialPostcode} initialRadiusMiles={initialRadiusMiles} />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'preferences') {
    const manageToken = params.get('token') ?? undefined;

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <PreferencesPage manageToken={manageToken} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Stats />
        <WhatYouGet />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
