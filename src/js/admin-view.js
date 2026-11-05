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
    <div class="p-4 md:p-6 space-y-4 max-w-7xl mx-auto pb-8">
      
      <!-- Console Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h1 class="text-lg font-bold text-white">Fleet Dispatch Console</h1>
          <p class="text-xs text-slate-400">Live monitoring, route schedule controls, and standby dispatch</p>
        </div>

        <!-- Timetable Switcher -->
        <div class="flex items-center gap-1.5 bg-[#111827] p-1 rounded-xl border border-slate-800 text-xs">
          <span class="text-slate-400 px-2 font-medium">Schedule:</span>
          <button class="schedule-mode-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
            state.scheduleMode === 'regular' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="regular">Regular</button>
          
          <button class="schedule-mode-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
            state.scheduleMode === 'exam' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="exam">Exam Schedule</button>

          <button class="schedule-mode-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
            state.scheduleMode === 'half-day' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }" data-mode="half-day">Half-Day</button>
        </div>
      </div>

      <!-- Breakdown Incident Banner & Standby Dispatch -->
      ${breakdownBus ? `
        <div class="p-3.5 rounded-xl bg-red-950/40 border border-red-500/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="text-xl">⚠️</span>
            <div>
              <div class="text-xs font-bold text-red-300">Vehicle Breakdown: Bus ${breakdownBus.number} (${breakdownBus.regNo})</div>
              <div class="text-[11px] text-slate-300 mt-0.5">
                Stalled on ${state.routes.find(r => r.id === breakdownBus.routeId)?.name || 'Route'} • Driver: ${breakdownBus.driverName}
              </div>
              <div class="text-[11px] text-amber-300 font-medium mt-0.5">
                Recommendation: Standby Bus 99-R is ready at Domlur Depot (4 min away).
              </div>
            </div>
          </div>
          <div>
            <button id="dispatch-rescue-bus-btn" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wide transition whitespace-nowrap shadow-md">
              Dispatch Standby Bus 99-R
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Fleet Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bento-card p-3.5">
          <div class="text-[11px] text-slate-400 uppercase font-semibold">Active Fleet</div>
          <div class="text-2xl font-bold text-white font-mono mt-0.5">${activeCount} / ${busesList.length}</div>
          <div class="text-[10px] text-emerald-400 mt-0.5">All scheduled routes staffed</div>
        </div>

        <div class="bento-card p-3.5">
          <div class="text-[11px] text-slate-400 uppercase font-semibold">Punctuality Today</div>
          <div class="text-2xl font-bold text-emerald-400 font-mono mt-0.5">94.2%</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Target: &gt;90% on-time</div>
        </div>

        <div class="bento-card p-3.5">
          <div class="text-[11px] text-slate-400 uppercase font-semibold">Delays (&gt;5m)</div>
          <div class="text-2xl font-bold font-mono mt-0.5 ${delayedCount > 0 ? 'text-amber-400' : 'text-slate-400'}">${delayedCount}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Silk Board bottleneck</div>
        </div>

        <div class="bento-card p-3.5">
          <div class="text-[11px] text-slate-400 uppercase font-semibold">Standby Units</div>
          <div class="text-2xl font-bold text-indigo-400 font-mono mt-0.5">1 Ready</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Bus 99-R at Domlur Depot</div>
        </div>
      </div>

      <!-- Live Fleet Operations Table -->
      <div class="bento-card overflow-hidden">
        <div class="p-3 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-bold text-xs text-white">Active Fleet Telemetry</span>
          </div>
          <span class="text-[11px] text-slate-500 font-mono">Updates every 3s</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[700px]">
            <thead class="bg-[#0B101D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th class="p-2.5">Bus</th>
                <th class="p-2.5">Assigned Route</th>
                <th class="p-2.5">Driver</th>
                <th class="p-2.5">Speed</th>
                <th class="p-2.5">Status</th>
                <th class="p-2.5">Incident / Note</th>
                <th class="p-2.5">Capacity</th>
                <th class="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              ${busesList.map(b => `
                <tr class="hover:bg-slate-800/30 transition text-xs">
                  <td class="p-2.5 font-bold text-white font-sans flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-indigo-950 border border-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold text-xs">${b.number}</span>
                    <span>Bus ${b.number}</span>
                  </td>
                  <td class="p-2.5 font-sans text-slate-300">
                    ${state.routes.find(r => r.id === b.routeId)?.name || '<span class="text-slate-500">Standby at Depot</span>'}
                  </td>
                  <td class="p-2.5 font-sans text-slate-300">${b.driverName}</td>
                  <td class="p-2.5 text-slate-300">${b.speed} km/h</td>
                  <td class="p-2.5 font-sans">
                    ${b.status === 'running' ? `
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">On Time</span>
                    ` : b.status === 'delayed' ? `
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">+${b.delayMinutes}m</span>
                    ` : b.status === 'breakdown' ? `
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500">Breakdown</span>
                    ` : `
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">Standby</span>
                    `}
                  </td>
                  <td class="p-2.5 font-sans text-slate-400 capitalize">
                    ${b.delayReason || '—'}
                  </td>
                  <td class="p-2.5 font-sans capitalize text-slate-300 text-[11px]">
                    ${b.occupancyLevel}
                  </td>
                  <td class="p-2.5 font-sans">
                    <button class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] border border-slate-700 ping-bus-btn" data-bus="${b.id}">
                      Ping
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Broadcast Notice Composer -->
      <div class="bento-card p-3.5">
        <div class="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>Broadcast Route Notice</span>
          <span class="text-[10px] text-slate-400">Broadcasts to all rider phones and gate displays</span>
        </div>
        <div class="flex gap-2">
          <input type="text" id="admin-notice-input" placeholder="e.g. Route 14 diverted via North Gate due to road work..." 
            class="flex-1 px-3 py-2 rounded-xl bg-[#0B101D] border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500">
          <button id="admin-post-notice-btn" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
            Send Notice
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
      renderAdminView(containerEl);
    };
  });

  const rescueBtn = containerEl.querySelector('#dispatch-rescue-bus-btn');
  if (rescueBtn) {
    rescueBtn.onclick = () => {
      assignRescueBus('bus_99', 'route_14');
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
          title: 'Transport Notice',
          message: text,
          reasonTag: 'diversion',
          createdAt: 'Just now',
          active: true
        });
        noticeInput.value = '';
        renderAdminView(containerEl);
      }
    };
  }
}
