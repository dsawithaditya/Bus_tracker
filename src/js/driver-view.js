// Driver Telemetry App (PWA View) - Built for phones & high-contrast in-cab cockpits
import { state, triggerDriverBreakdown, voteOccupancy, updateBusTelemetry } from './state.js';
import { translations } from './translations.js';

export function renderDriverView(containerEl) {
  const t = translations[state.language] || translations.en;
  const bus = state.buses.bus_14;
  const isTripRunning = bus.status === 'running' || bus.status === 'delayed';

  containerEl.innerHTML = `
    <div class="max-w-4xl mx-auto p-4 md:p-5 space-y-3.5">
      
      <!-- Driver Top Header (Spans full width) -->
      <div class="bento-card p-3.5 px-4 flex items-center justify-between border-slate-800 bg-[#0E1526]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-base">
            👨‍✈️
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white font-mono">Bus ${bus.number} (${bus.regNo})</span>
              <span class="text-slate-600">•</span>
              <span class="text-[11px] text-slate-400">Driver: ${bus.driverName}</span>
            </div>
            <div class="text-[11px] text-indigo-300 font-medium mt-0.5">Route ${bus.number} (Kanakapura Road • Jain University Corridor)</div>
          </div>
        </div>
        <div class="text-right flex items-center gap-3">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GPS Active (3s)</span>
          </div>
        </div>
      </div>

      <!-- 2-Column Cockpit Dashboard Grid (Fits in table without inner vertical scroll) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        <!-- LEFT COLUMN: Telemetry & Controls -->
        <div class="space-y-3">
          
          <!-- Telemetry Speed, Heading, Next Stop HUD -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bento-card p-2.5 bg-[#0B101D]">
              <div class="text-[10px] text-slate-400 uppercase font-semibold">Speed</div>
              <div class="text-xl font-bold text-white font-mono mt-0.5" id="driver-speed-val">${bus.speed} <span class="text-[10px] font-normal text-slate-400">km/h</span></div>
            </div>
            <div class="bento-card p-2.5 bg-[#0B101D]">
              <div class="text-[10px] text-slate-400 uppercase font-semibold">Heading</div>
              <div class="text-xl font-bold text-white font-mono mt-0.5">${bus.heading}°</div>
            </div>
            <div class="bento-card p-2.5 bg-[#0B101D]">
              <div class="text-[10px] text-slate-400 uppercase font-semibold">Next Stop</div>
              <div class="text-xs font-semibold text-emerald-400 truncate mt-1">Jain University</div>
            </div>
          </div>

          <!-- Start / End Trip Primary Button -->
          <button id="driver-toggle-trip-btn" class="w-full py-3 px-4 rounded-xl text-sm font-bold tracking-wide shadow-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            isTripRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }">
            <span>${isTripRunning ? '⏹️ End Active Trip' : '▶️ Start Scheduled Trip'}</span>
          </button>

          <!-- Speed Limit Status Strip -->
          <div class="p-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span>⚡</span>
              <span class="text-slate-400 text-[11px]">Campus Speed Limit: 40 km/h</span>
            </div>
            <span class="text-emerald-400 font-mono text-[11px] font-semibold">NORMAL (${bus.speed} km/h)</span>
          </div>

        </div>

        <!-- RIGHT COLUMN: Incident Dispatch & Capacity Overrides -->
        <div class="space-y-3">
          
          <!-- Route Incident Reports -->
          <div class="bento-card p-3 bg-[#0B101D] space-y-2">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Incident Quick-Reports</span>
              <span class="text-[10px] text-slate-500 font-mono">1-Tap Notify</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button id="driver-traffic-delay-btn" class="p-2.5 rounded-lg bg-[#111827] border border-amber-500/40 hover:bg-amber-950/20 text-left transition cursor-pointer">
                <div class="flex items-center gap-1.5">
                  <span class="text-base">🚧</span>
                  <span class="text-xs font-bold text-amber-300">Report Delay</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-1">+6 min traffic hold</div>
              </button>

              <button id="driver-breakdown-btn" class="p-2.5 rounded-lg bg-[#111827] border border-red-500/40 hover:bg-red-950/20 text-left transition cursor-pointer">
                <div class="flex items-center gap-1.5">
                  <span class="text-base">⚠️</span>
                  <span class="text-xs font-bold text-red-400">Breakdown</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-1">Request Standby Bus</div>
              </button>
            </div>
          </div>

          <!-- Seat Occupancy Override -->
          <div class="bento-card p-3 bg-[#0B101D]">
            <div class="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Seat Capacity (Conductor Override)</span>
              <span class="text-[10px] text-slate-400 capitalize">Current: ${bus.occupancyLevel}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button class="driver-seat-btn py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                bus.occupancyLevel === 'seats' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }" data-level="seats">
                Seats OK
              </button>
              <button class="driver-seat-btn py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                bus.occupancyLevel === 'standing' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }" data-level="standing">
                Standing
              </button>
              <button class="driver-seat-btn py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                bus.occupancyLevel === 'full' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-800 text-red-300 hover:bg-slate-700'
              }" data-level="full">
                Full Bus
              </button>
            </div>
          </div>

          <!-- EMERGENCY SOS BUTTON -->
          <button id="driver-sos-btn" class="w-full py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs tracking-wider shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🚨</span>
            <span>EMERGENCY SOS TO DISPATCH</span>
          </button>

        </div>

      </div>

    </div>
  `;

  // Bind Buttons
  const toggleTripBtn = containerEl.querySelector('#driver-toggle-trip-btn');
  const trafficBtn = containerEl.querySelector('#driver-traffic-delay-btn');
  const breakdownBtn = containerEl.querySelector('#driver-breakdown-btn');
  const sosBtn = containerEl.querySelector('#driver-sos-btn');

  if (toggleTripBtn) {
    toggleTripBtn.onclick = () => {
      const nextStatus = bus.status === 'running' ? 'done' : 'running';
      updateBusTelemetry('bus_14', { status: nextStatus, speed: nextStatus === 'running' ? 32 : 0 });
      renderDriverView(containerEl);
    };
  }

  if (trafficBtn) {
    trafficBtn.onclick = () => {
      updateBusTelemetry('bus_14', {
        delayMinutes: bus.delayMinutes + 6,
        delayReason: 'traffic',
        status: 'delayed',
        trafficFactor: 1.3
      });
      renderDriverView(containerEl);
    };
  }

  if (breakdownBtn) {
    breakdownBtn.onclick = () => {
      if (confirm('Report vehicle breakdown? This will alert route riders and recommend a standby bus to dispatch.')) {
        triggerDriverBreakdown('bus_14', 'Coolant leak');
        renderDriverView(containerEl);
      }
    };
  }

  containerEl.querySelectorAll('.driver-seat-btn').forEach(btn => {
    btn.onclick = () => {
      const level = btn.getAttribute('data-level');
      voteOccupancy('bus_14', level, true);
      renderDriverView(containerEl);
    };
  });

  if (sosBtn) {
    sosBtn.onclick = () => {
      alert('Emergency alert sent to campus dispatch with current coordinates (12.9775, 77.5975).');
    };
  }
}
