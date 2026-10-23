import { TrendingUp, MapPin, Search, Link2, Eye, Share2, Briefcase, Layers } from 'lucide-react';

const features = [
  { icon: Layers, title: 'Apprenticeships & jobs in one place', body: 'Browse every live apprenticeship in England alongside entry-level jobs nearby. One search, one set of alerts — no need to check separate sites.' },
  { icon: Briefcase, title: 'Earn while you search', body: 'Waiting for the right apprenticeship to open? Find a local job now so you are earning — not just waiting. The right apprenticeship comes up, and you are ready.' },
  { icon: TrendingUp, title: 'Daily checks, not weekly', body: 'The official Find An Apprenticeship service emails you weekly. We check every day — so you hear about new roles the day they open, not six days later.' },
  { icon: Search, title: 'Search by area and courses', body: 'Only interested in certain kinds of work? Pick whole apprenticeship areas like "Digital" or "Construction", or narrow it down to specific courses — your alerts and search results only show what matches.' },
  { icon: Eye, title: 'Clean, scannable emails', body: 'No clutter. Each alert lists the new matching apprenticeships and jobs with salary, level, and company — plus a direct link straight to the application page.' },
  { icon: MapPin, title: 'Location-aware', body: 'Set your postcode and how far you are willing to travel — apprenticeships and jobs near you get surfaced first.' },
  { icon: Share2, title: 'Share to WhatsApp', body: 'Spot a role a friend or family member would love? Share any listing straight to WhatsApp from the browse page — one tap, no copy-paste.' },
  { icon: Link2, title: 'Direct apply links', body: 'Every listing links straight to the official posting or employer. No middleman, no redirects, no job-board paywalls.' },
];

export default function WhatYouGet() {
  return (
    <section id="what" className="relative py-20 sm:py-28 bg-paper-deep/30 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full glossy-pill px-3 py-1 text-sm font-bold uppercase tracking-widest text-safety">What you get</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Apprenticeships and jobs, working together.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            The official Find an Apprenticeship service is great — but it only covers apprenticeships and only notifies you once a week. Apprentize gives you both apprenticeships and local jobs, checked daily.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bubble-card p-6 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-safety/20 to-safety/5 flex items-center justify-center transition-transform group-hover:scale-110 shadow-[inset_0_1px_0_white]">
                <f.icon className="w-5 h-5 text-safety" />
              </div>
              <h3 className="mt-4 font-display font-bold text-ink text-lg">{f.title}</h3>
              <p className="mt-2 text-ink-soft leading-relaxed text-[15px]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
