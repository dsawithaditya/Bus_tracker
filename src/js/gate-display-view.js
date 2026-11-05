// Gate Display Screen (Full-Screen TV Display for Campus Gates & Hostel Lobbies)
import { state } from './state.js';
import { getDelayStatus } from './eta-engine.js';
import { translations } from './translations.js';

export function renderGateDisplayView(containerEl) {
  const t = translations[state.language] || translations.en;
  
  // Next 6 departures
  const departures = [
    {
      routeNum: '14',
      dest: 'Main Campus Quad via Gate 2',
      bay: 'Bay 1',
      scheduled: '08:40 AM',
      etaMin: 6,
      status: state.buses.bus_14.status === 'breakdown' ? 'BREAKDOWN' : (state.buses.bus_14.delayMinutes > 5 ? 'DELAYED' : 'ON TIME'),
      delay: state.buses.bus_14.delayMinutes,
      accessible: true
    },
    {
      routeNum: '7',
      dest: 'Tech Complex via Metro Terminal',
      bay: 'Bay 3',
      scheduled: '08:45 AM',
      etaMin: 11,
      status: 'DELAYED',
      delay: 8,
      accessible: false
    },
    {
      routeNum: '21',
      dest: 'Medical Center & Faculty Quarters',
      bay: 'Bay 2',
      scheduled: '08:50 AM',
      etaMin: 16,
      status: 'ON TIME',
      delay: 0,
      accessible: true
    },
    {
      routeNum: '14B',
      dest: 'Hostel Block (Return Loop)',
      bay: 'Bay 1',
      scheduled: '09:00 AM',
      etaMin: 26,
      status: 'ON TIME',
      delay: 0,
      accessible: true
    },
    {
      routeNum: '99',
      dest: 'Depot Standby / Rescue Ready',
      bay: 'Bay 4',
      scheduled: 'STANDBY',
      etaMin: 0,
      status: 'STANDBY',
      delay: 0,
      accessible: true
    },
    {
      routeNum: '3',
      dest: 'City South Gate Express',
      bay: 'Bay 2',
      scheduled: '09:15 AM',
      etaMin: 41,
      status: 'ON TIME',
      delay: 1,
      accessible: true
    }
  ];

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  containerEl.innerHTML = `
    <div class="h-full bg-[#070A11] p-6 md:p-8 flex flex-col justify-between text-white font-sans overflow-hidden">
      
      <!-- Departures Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-lg font-bold">
            🚌
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold tracking-tight">Gate 1 • Live Departures</h1>
            <div class="text-xs text-slate-400">Campus Transit Authority</div>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <div class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Local Time</div>
            <div class="text-2xl font-bold font-mono text-emerald-400 tabular-nums">${nowTime}</div>
          </div>
          <div class="hidden sm:block px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-right">
            <div class="text-[10px] text-slate-400 uppercase">Timetable</div>
            <div class="text-xs font-semibold text-amber-300 uppercase">${state.scheduleMode}</div>
          </div>
        </div>
      </div>

      <!-- Departures Board -->
      <div class="my-4 flex-1 flex flex-col justify-center overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              <th class="py-2.5 px-3">Line</th>
              <th class="py-2.5 px-3">Destination</th>
              <th class="py-2.5 px-3">Bay</th>
              <th class="py-2.5 px-3 font-mono">Scheduled</th>
              <th class="py-2.5 px-3 font-mono">Live ETA</th>
              <th class="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 font-sans">
            ${departures.map(d => {
              let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              if (d.status === 'DELAYED') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              if (d.status === 'BREAKDOWN') badgeColor = 'bg-red-500/20 text-red-400 border-red-500';
              if (d.status === 'STANDBY') badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';

              return `
                <tr class="hover:bg-slate-900/50 transition font-medium">
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-sm font-bold">
                      ${d.routeNum}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-white font-semibold">
                    <div class="flex items-center gap-1.5">
                      <span>${d.dest}</span>
                      ${d.accessible ? '<span class="text-xs text-slate-400" title="Wheelchair accessible">♿</span>' : ''}
                    </div>
                  </td>
                  <td class="py-3 px-3 text-slate-300 font-mono text-xs">${d.bay}</td>
                  <td class="py-3 px-3 text-slate-400 font-mono text-xs">${d.scheduled}</td>
                  <td class="py-3 px-3 font-mono font-bold text-white">
                    ${d.etaMin > 0 ? `
                      <span class="text-emerald-400">${d.etaMin}</span> <span class="text-xs text-slate-400">min</span>
                    ` : '—'}
                  </td>
                  <td class="py-3 px-3">
                    <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}">
                      ${d.status} ${d.delay > 0 ? `(+${d.delay}m)` : ''}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Campus Bulletin Ticker -->
      <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold text-[10px] uppercase tracking-wider shrink-0">
          Notice
        </span>
        <div class="overflow-hidden whitespace-nowrap text-xs text-slate-300 font-medium">
          <marquee scrollamount="5">
            ${state.announcements[0]?.message || 'All buses operating on live schedule.'}
            &nbsp;&nbsp;•&nbsp;&nbsp;
            ${state.announcements[1]?.message || 'Lost & Found items held at Central Transport Office.'}
          </marquee>
        </div>
      </div>

    </div>
  `;
}
