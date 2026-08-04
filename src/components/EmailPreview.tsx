import { Bell, MapPin, Briefcase, TrendingUp, Building2, Clock, ArrowUpRight } from 'lucide-react';

export default function EmailPreview() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-safety/15 to-teal/10 rounded-[2rem] blur-2xl" aria-hidden />

      {/* email window */}
      <div className="relative rounded-2xl bg-card border border-line shadow-[0_20px_60px_rgba(22,35,59,0.18)] overflow-hidden animate-float">
        {/* window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line/70 bg-paper-deep/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-ink-soft font-mono">apprentize — daily alert</span>
          </div>
        </div>

        {/* email body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 pb-4 border-b border-line/70">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
              <Bell className="w-5 h-5 text-safety" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-ink text-base leading-tight">3 new apprenticeships match your search</p>
              <p className="text-xs text-ink-soft mt-0.5">Today · Greater London · Levels 3–4</p>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {[
              { role: 'Software Dev Apprentice', company: 'Nebula Labs', level: 'Level 4', wage: '£18,000/yr', new: true },
              { role: 'Carpentry Apprentice', company: 'Oakwood Joinery', level: 'Level 3', wage: '£15,500/yr', new: true },
              { role: 'Healthcare Assistant (Apprentice)', company: 'Riverside Care', level: 'Level 3', wage: '£14,800/yr', new: false },
            ].map((job, i) => (
              <li
                key={job.role}
                className="animate-slide-in"
                style={{ animationDelay: `${0.2 + i * 0.12}s`, opacity: 0 }}
              >
                <a
                  href="#/apprenticeships"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-line/70 hover:border-ink/30 hover:bg-paper-deep/40 transition-all"
                >
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${job.new ? 'bg-safety/10' : 'bg-teal/10'}`}>
                    {job.new ? <TrendingUp className="w-4 h-4 text-safety" /> : <Briefcase className="w-4 h-4 text-teal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink text-sm truncate">{job.role}</p>
                      {job.new && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-safety bg-safety/10 px-1.5 py-0.5 rounded">New</span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> {job.company}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink-soft font-mono">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.level}</span>
                      <span>{job.wage}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="shrink-0 w-4 h-4 text-ink-soft/40 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#/apprenticeships"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink text-paper text-sm font-semibold py-3 hover:bg-ink/90 transition-colors"
          >
            View all 12 matches <ArrowUpRight className="w-4 h-4" />
          </a>

          <div className="mt-4 pt-4 border-t border-line/70 flex items-center justify-between text-[11px] text-ink-soft">
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Greater London</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Sent 7:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
