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
    <div class="h-full bg-[#070A11] p-6 md:p-10 flex flex-col justify-between text-white font-sans overflow-hidden">
      
      <!-- Top TV Header Bar -->
      <div class="flex items-center justify-between border-b-2 border-indigo-500/40 pb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-600/30">
            🚌
          </div>
          <div>
            <div class="text-xs uppercase tracking-widest text-indigo-400 font-bold">University Transit Authority</div>
            <h1 class="text-3xl md:text-4xl font-black tracking-tight">${t.gateDepartures}</h1>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Local Time</div>
            <div class="text-3xl font-black font-mono text-emerald-400 tabular-nums">${nowTime}</div>
          </div>
          <div class="hidden md:block px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div class="text-[11px] text-slate-400 uppercase">Timetable Mode</div>
            <div class="text-sm font-bold text-amber-300 uppercase">${state.scheduleMode} SCHEDULE</div>
          </div>
        </div>
      </div>

      <!-- High-Contrast Giant Departures Board -->
      <div class="my-6 flex-1 flex flex-col justify-center">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-800 pb-3">
                <th class="py-3 px-4">Line</th>
                <th class="py-3 px-4">Destination</th>
                <th class="py-3 px-4">Platform / Bay</th>
                <th class="py-3 px-4 font-mono">Scheduled</th>
                <th class="py-3 px-4 font-mono">Live ETA</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 font-sans">
              ${departures.map(d => {
                let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
                if (d.status === 'DELAYED') badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
                if (d.status === 'BREAKDOWN') badgeColor = 'bg-red-500/20 text-red-400 border-red-500 animate-pulse';
                if (d.status === 'STANDBY') badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';

                return `
                  <tr class="hover:bg-slate-900/60 transition text-lg md:text-xl font-semibold">
                    <td class="py-4 px-4 font-black">
                      <span class="inline-flex items-center justify-center w-12 h-10 rounded-xl bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-mono text-xl shadow">
                        ${d.routeNum}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-white font-bold">
                      <div class="flex items-center gap-2">
                        <span>${d.dest}</span>
                        ${d.accessible ? '<span class="text-sm text-slate-400" title="Wheelchair accessible">♿</span>' : ''}
                      </div>
                    </td>
                    <td class="py-4 px-4 text-slate-300 font-mono font-bold">${d.bay}</td>
                    <td class="py-4 px-4 text-slate-400 font-mono text-base">${d.scheduled}</td>
                    <td class="py-4 px-4 font-mono font-black text-white">
                      ${d.etaMin > 0 ? `
                        <span class="text-2xl text-emerald-300">${d.etaMin}</span> <span class="text-sm text-slate-400">min</span>
                      ` : '—'}
                    </td>
                    <td class="py-4 px-4">
                      <span class="inline-block px-3.5 py-1 rounded-full text-xs font-black tracking-wider border ${badgeColor}">
                        ${d.status} ${d.delay > 0 ? `(+${d.delay}m)` : ''}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Ticker / Announcements Notice -->
      <div class="p-3.5 rounded-2xl bg-[#0F172A] border border-indigo-500/30 flex items-center gap-3">
        <span class="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shrink-0">
          CAMPUS NOTICE
        </span>
        <div class="overflow-hidden whitespace-nowrap text-sm text-slate-300 font-medium">
          <marquee scrollamount="6">
            ${state.announcements[0]?.message || 'All buses running with real-time GPS tracking. Scan QR code at bus bay to download mobile PWA.'}
            &nbsp;&nbsp;•&nbsp;&nbsp;
            ${state.announcements[1]?.message || 'Lost items can be claimed at Central Transport Office (Block B).'}
          </marquee>
        </div>
      </div>

    </div>
  `;
}

