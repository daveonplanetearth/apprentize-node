import { TrendingUp, MapPin, Filter, Clock, Link2, Eye, Share2 } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Daily checks, not weekly', body: "Find An Apprenticeship emails you weekly. We check every day — so you hear about new roles the day they open, not six days later." },
  { icon: Filter, title: 'Sector & region filters', body: 'Pick the industry, the area, and the level you care about. We only email you when a role genuinely matches your criteria.' },
  { icon: Eye, title: 'Clean, scannable emails', body: 'No clutter. Each alert lists the new matching roles with salary, level, and company — plus a direct link straight to the application page.' },
  { icon: MapPin, title: 'Location-aware', body: 'Filter by city, region, or distance from your postcode. Apprenticeships near you get surfaced first.' },
  { icon: Share2, title: 'Share to WhatsApp', body: 'Spot a role a friend or family member would love? Share any apprenticeship straight to WhatsApp from the browse page — one tap, no copy-paste.' },
  { icon: Link2, title: 'Direct apply links', body: 'Every listing links straight to the official posting. No middleman, no redirects, no job-board paywalls.' },
  { icon: Clock, title: 'No app, no dashboard', body: 'You never have to open an app or remember to check a site. Your inbox does the work.' },
];

export default function WhatYouGet() {
  return (
    <section id="what" className="relative py-20 sm:py-28 bg-paper-deep/40 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">What you get</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Everything the weekly alert misses.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            The official service is great — but it only notifies you once a week. Apprentize fills the gap.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-card border border-line p-6 transition-all hover:border-ink/25 hover:shadow-[0_8px_30px_rgba(22,35,59,0.06)] hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-lg bg-safety/10 flex items-center justify-center transition-transform group-hover:scale-110">
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
