// Driver Telemetry App (PWA View) - Built for phones & high-contrast in-cab cockpits
import { state, triggerDriverBreakdown, voteOccupancy, updateBusTelemetry } from './state.js';
import { translations } from './translations.js';

export function renderDriverView(containerEl) {
  const t = translations[state.language] || translations.en;
  const bus = state.buses.bus_14;
  const isTripRunning = bus.status === 'running' || bus.status === 'delayed';

  containerEl.innerHTML = `
    <div class="max-w-md mx-auto p-4 md:p-6 space-y-4 pb-8">
      
      <!-- Driver Top Header -->
      <div class="bento-card p-4 flex items-center justify-between border-slate-800">
        <div>
          <div class="text-[11px] text-slate-400 font-medium">Driver Console • Route ${bus.number} Corridor</div>
          <div class="text-base font-bold text-white font-mono mt-0.5">Bus ${bus.number} (${bus.regNo})</div>
          <div class="text-xs text-slate-400">Driver: ${bus.driverName}</div>
        </div>
        <div class="text-right">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GPS Active</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-1">Screen Awake</div>
        </div>
      </div>

      <!-- Telemetry Speed & Next Stop HUD -->
      <div class="grid grid-cols-3 gap-2.5 text-center">
        <div class="bento-card p-3">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Speed</div>
          <div class="text-xl font-bold text-white font-mono mt-0.5" id="driver-speed-val">${bus.speed} <span class="text-[10px] font-normal text-slate-400">km/h</span></div>
        </div>
        <div class="bento-card p-3">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Heading</div>
          <div class="text-xl font-bold text-white font-mono mt-0.5">${bus.heading}°</div>
        </div>
        <div class="bento-card p-3">
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Next Stop</div>
          <div class="text-xs font-semibold text-emerald-400 truncate mt-1">Jain University</div>
        </div>
      </div>

      <!-- Start / End Trip Primary Button -->
      <div>
        <button id="driver-toggle-trip-btn" class="w-full py-4 rounded-xl text-base font-bold tracking-wide shadow-lg flex items-center justify-center gap-2 transition ${
          isTripRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }">
          <span>${isTripRunning ? 'End Active Trip' : 'Start Scheduled Trip'}</span>
        </button>
      </div>

      <!-- Incident & Status Reports -->
      <div class="space-y-3">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Route Incident Reports</div>
        
        <div class="grid grid-cols-2 gap-2.5">
          <!-- Traffic Delay Button -->
          <button id="driver-traffic-delay-btn" class="p-3.5 rounded-xl bg-[#111827] border border-amber-500/40 hover:bg-amber-950/20 text-left transition">
            <div class="text-lg mb-1">🚧</div>
            <div class="text-xs font-bold text-amber-300">Report Delay</div>
            <div class="text-[10px] text-slate-400 mt-0.5">+6 min traffic hold</div>
          </button>

          <!-- Breakdown Button -->
          <button id="driver-breakdown-btn" class="p-3.5 rounded-xl bg-[#111827] border border-red-500/40 hover:bg-red-950/20 text-left transition">
            <div class="text-lg mb-1">⚠️</div>
            <div class="text-xs font-bold text-red-400">Report Breakdown</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Request Standby Bus</div>
          </button>
        </div>

        <!-- Seat Occupancy Override -->
        <div class="bento-card p-3.5">
          <div class="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Seat Capacity (Conductor Override)</span>
            <span class="text-[10px] text-slate-400 capitalize">Current: ${bus.occupancyLevel}</span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button class="driver-seat-btn py-2 rounded-lg text-xs font-semibold transition ${
              bus.occupancyLevel === 'seats' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }" data-level="seats">
              Seats OK
            </button>
            <button class="driver-seat-btn py-2 rounded-lg text-xs font-semibold transition ${
              bus.occupancyLevel === 'standing' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }" data-level="standing">
              Standing
            </button>
            <button class="driver-seat-btn py-2 rounded-lg text-xs font-semibold transition ${
              bus.occupancyLevel === 'full' ? 'bg-red-500 text-white' : 'bg-slate-800 text-red-300 hover:bg-slate-700'
            }" data-level="full">
              Full Bus
            </button>
          </div>
        </div>

        <!-- Speed Limit Status -->
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400 text-[11px]">Campus Speed Limit: 40 km/h</span>
          <span class="text-emerald-400 font-mono text-[11px] font-semibold">NORMAL (${bus.speed} km/h)</span>
        </div>

        <!-- EMERGENCY SOS BUTTON -->
        <button id="driver-sos-btn" class="w-full py-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs tracking-wider shadow-md transition flex items-center justify-center gap-1.5">
          <span>🚨</span>
          <span>EMERGENCY SOS TO DISPATCH</span>
        </button>
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
