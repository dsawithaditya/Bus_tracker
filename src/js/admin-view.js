// Fleet Command Center (Transport Admin Dashboard)
import { state, setScheduleMode, assignRescueBus } from './state.js';
import { translations } from './translations.js';

export function renderAdminView(containerEl) {
  const t = translations[state.language] || translations.en;
  const busesList = Object.values(state.buses);
  const activeCount = busesList.filter(b => b.status === 'running' || b.status === 'delayed').length;
  const delayedCount = busesList.filter(b => b.status === 'delayed' || b.delayMinutes >= 5).length;
  const breakdownBus = busesList.find(b => b.status === 'breakdown');

  containerEl.innerHTML = `
    <div class="p-4 md:p-6 space-y-5 max-w-7xl mx-auto overflow-y-auto">
      
      <!-- Top Fleet Header & Schedule Mode Switcher -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div class="text-xs uppercase tracking-wider text-indigo-400 font-bold">Fleet Operations Command Center</div>
          <h1 class="text-2xl font-black text-white">Campus Transit Dispatch & Telemetry</h1>
        </div>

        <!-- Schedule Mode Switcher (Section 5 & Page 9 T10) -->
        <div class="flex items-center gap-2 bg-[#111827] p-1.5 rounded-xl border border-[#1F2937]">
          <span class="text-xs text-slate-400 font-medium px-2">Timetable Mode:</span>
          <button class="schedule-mode-btn px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            state.scheduleMode === 'regular' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="regular">${t.regular}</button>
          
          <button class="schedule-mode-btn px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            state.scheduleMode === 'exam' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="exam">${t.examShifts}</button>

          <button class="schedule-mode-btn px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            state.scheduleMode === 'half-day' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="half-day">${t.halfDay}</button>
        </div>
      </div>

      <!-- HIGH-PRIORITY BREAKDOWN ALERT BANNER & RESCUE DISPATCH (Section 5, 7.7) -->
      ${breakdownBus ? `
        <div class="p-4 rounded-xl bg-red-950/50 border-2 border-red-500 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-pulse">
          <div class="flex items-start gap-3">
            <span class="text-3xl">🚨</span>
            <div>
              <div class="text-sm font-black text-red-300">EMERGENCY BREAKDOWN: BUS ${breakdownBus.number} (${breakdownBus.regNo})</div>
              <div class="text-xs text-slate-300 mt-0.5">
                Stalled on ${state.routes.find(r => r.id === breakdownBus.routeId)?.name || 'Route'} • Driver: ${breakdownBus.driverName} (${breakdownBus.driverPhone})
              </div>
              <div class="text-xs text-amber-300 mt-1 font-semibold">
                💡 Recommended Action: Dispatch standby Rescue Bus 99 (at Campus Depot, 4 mins away).
              </div>
            </div>
          </div>
          <div>
            <button id="dispatch-rescue-bus-btn" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider uppercase shadow-lg transition whitespace-nowrap">
              🚀 1-Click Dispatch Rescue Bus 99
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Bento Grid Fleet Key Stats (Section 6 & 8.2) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div class="bento-card p-4">
          <div class="text-xs text-slate-400 uppercase font-semibold">Active Fleet</div>
          <div class="text-3xl font-black text-white font-mono mt-1">${activeCount} / ${busesList.length}</div>
          <div class="text-[11px] text-emerald-400 mt-1">● All active routes covered</div>
        </div>

        <div class="bento-card p-4">
          <div class="text-xs text-slate-400 uppercase font-semibold">Fleet Punctuality</div>
          <div class="text-3xl font-black text-emerald-400 font-mono mt-1">94.2%</div>
          <div class="text-[11px] text-slate-400 mt-1">Weekly target: >90%</div>
        </div>

        <div class="bento-card p-4">
          <div class="text-xs text-slate-400 uppercase font-semibold">Delays (>5 min)</div>
          <div class="text-3xl font-black font-mono mt-1 ${delayedCount > 0 ? 'text-amber-400' : 'text-slate-400'}">${delayedCount}</div>
          <div class="text-[11px] text-slate-400 mt-1">Traffic bottleneck on South Ave</div>
        </div>

        <div class="bento-card p-4">
          <div class="text-xs text-slate-400 uppercase font-semibold">Rescue Readiness</div>
          <div class="text-3xl font-black text-indigo-400 font-mono mt-1">1 Bus</div>
          <div class="text-[11px] text-slate-400 mt-1">Bus 99 Standby at Depot</div>
        </div>
      </div>

      <!-- Live Fleet Operations Table (Section 8.3) -->
      <div class="bento-card overflow-hidden">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span class="font-bold text-sm text-white">Live Buses & Driver Telemetry</span>
          </div>
          <span class="text-xs text-slate-400">Auto-refreshing every 3s</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#0B101D] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th class="p-3">Bus / Reg</th>
                <th class="p-3">Route Assigned</th>
                <th class="p-3">Driver</th>
                <th class="p-3">Speed</th>
                <th class="p-3">Status</th>
                <th class="p-3">Delay Reason</th>
                <th class="p-3">Occupancy</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              ${busesList.map(b => `
                <tr class="hover:bg-slate-800/40 transition">
                  <td class="p-3 font-bold text-white font-sans flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold text-xs">${b.number}</span>
                    <div>
                      <div>Bus ${b.number}</div>
                      <div class="text-[10px] text-slate-400 font-mono">${b.regNo}</div>
                    </div>
                  </td>
                  <td class="p-3 font-sans text-slate-300">
                    ${state.routes.find(r => r.id === b.routeId)?.name || '<span class="text-slate-500">Standby Depot</span>'}
                  </td>
                  <td class="p-3 font-sans text-slate-300">
                    <div>${b.driverName}</div>
                    <div class="text-[10px] text-slate-500">${b.driverPhone}</div>
                  </td>
                  <td class="p-3 text-slate-300">${b.speed} km/h</td>
                  <td class="p-3 font-sans">
                    ${b.status === 'running' ? `
                      <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">On Time</span>
                    ` : b.status === 'delayed' ? `
                      <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">+${b.delayMinutes}m Delayed</span>
                    ` : b.status === 'breakdown' ? `
                      <span class="px-2 py-0.5 rounded text-[11px] font-black bg-red-500/20 text-red-400 border border-red-500 animate-pulse">BREAKDOWN</span>
                    ` : `
                      <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">Standby</span>
                    `}
                  </td>
                  <td class="p-3 font-sans text-slate-400">
                    ${b.delayReason ? `
                      <span class="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 capitalize">${b.delayReason}</span>
                    ` : '—'}
                  </td>
                  <td class="p-3 font-sans">
                    <span class="capitalize text-slate-300">${b.occupancyLevel}</span>
                  </td>
                  <td class="p-3 font-sans">
                    <button class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 ping-bus-btn" data-bus="${b.id}">
                      Ping
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Announcements Composer (Section 6) -->
      <div class="bento-card p-4">
        <div class="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
          <span>📢 Post Fleet Notice / Route Diversion</span>
          <span class="text-[11px] text-slate-400">Broadcasts immediately to all Commuter & TV screens</span>
        </div>
        <div class="flex flex-col md:flex-row gap-3">
          <input type="text" id="admin-notice-input" placeholder="e.g. Route 14 diverted via North Gate due to road repair..." 
            class="flex-1 px-3.5 py-2 rounded-xl bg-[#0B101D] border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500">
          <button id="admin-post-notice-btn" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
            ${t.postNotice}
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach Listeners
  containerEl.querySelectorAll('.schedule-mode-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.getAttribute('data-mode');
      setScheduleMode(mode);
      alert(`Timetable switched to: ${mode.toUpperCase()} mode. All ETAs recalculated.`);
      renderAdminView(containerEl);
    };
  });

  const rescueBtn = containerEl.querySelector('#dispatch-rescue-bus-btn');
  if (rescueBtn) {
    rescueBtn.onclick = () => {
      assignRescueBus('bus_99', 'route_14');
      alert('Rescue Bus 99 has been dispatched to Route 14! Commuter route timeline updated.');
      renderAdminView(containerEl);
    };
  }

  const postNoticeBtn = containerEl.querySelector('#admin-post-notice-btn');
  const noticeInput = containerEl.querySelector('#admin-notice-input');
  if (postNoticeBtn && noticeInput) {
    postNoticeBtn.onclick = () => {
      const text = noticeInput.value.trim();
      if (text) {
        state.announcements.unshift({
          id: `ann_${Date.now()}`,
          title: 'Transport Office Bulletin',
          message: text,
          reasonTag: 'diversion',
          createdAt: 'Just now',
          active: true
        });
        noticeInput.value = '';
        alert('Notice published to all commuter apps and TV displays!');
        renderAdminView(containerEl);
      }
    };
  }
}

