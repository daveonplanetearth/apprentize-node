import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import WhatYouGet from './components/WhatYouGet';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
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
