// Driver Telemetry App (PWA View) - Built for phones & high-contrast in-cab cockpits
import { state, triggerDriverBreakdown, voteOccupancy, updateBusTelemetry } from './state.js';
import { translations } from './translations.js';

export function renderDriverView(containerEl) {
  const t = translations[state.language] || translations.en;
  const bus = state.buses.bus_14;
  const isTripRunning = bus.status === 'running' || bus.status === 'delayed';

  containerEl.innerHTML = `
    <div class="max-w-md mx-auto p-4 md:p-6 space-y-4">
      
      <!-- Driver Top Header & Wake Lock Status -->
      <div class="bento-card p-4 flex items-center justify-between border-slate-800">
        <div>
          <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider">Driver Cockpit (PWA)</div>
          <div class="text-lg font-black text-white font-mono">BUS ${bus.number} • ${bus.regNo}</div>
          <div class="text-xs text-slate-400">Driver: ${bus.driverName}</div>
        </div>
        <div class="text-right">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GPS LIVE</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
            <span>☀️ Screen Awake</span>
          </div>
        </div>
      </div>

      <!-- Telemetry Speed & Heading HUD -->
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bento-card p-3">
          <div class="text-[11px] text-slate-400 uppercase">Speed</div>
          <div class="text-2xl font-black text-white font-mono mt-0.5" id="driver-speed-val">${bus.speed} <span class="text-xs font-normal text-slate-400">km/h</span></div>
        </div>
        <div class="bento-card p-3">
          <div class="text-[11px] text-slate-400 uppercase">Heading</div>
          <div class="text-2xl font-black text-white font-mono mt-0.5">${bus.heading}°</div>
        </div>
        <div class="bento-card p-3">
          <div class="text-[11px] text-slate-400 uppercase">Next Stop</div>
          <div class="text-sm font-bold text-indigo-400 truncate mt-1">Market Circle</div>
        </div>
      </div>

      <!-- PRIMARY BIG ACTION: START / END TRIP -->
      <div>
        <button id="driver-toggle-trip-btn" class="w-full py-5 rounded-2xl text-lg font-black tracking-wider shadow-lg flex items-center justify-center gap-3 transition ${
          isTripRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }">
          <span class="text-2xl">${isTripRunning ? '⏹️' : '▶️'}</span>
          <span>${isTripRunning ? t.endTrip : t.startTrip}</span>
        </button>
      </div>

      <!-- 3 QUICK REPORT BUTTONS (Section 3 & 8.3) -->
      <div class="space-y-3">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick In-Route Reports</div>
        
        <!-- Report 1: Traffic Delay -->
        <div class="grid grid-cols-2 gap-2.5">
          <button id="driver-traffic-delay-btn" class="p-4 rounded-xl bg-[#111827] border border-amber-500/40 hover:bg-amber-950/20 text-left transition">
            <div class="text-2xl mb-1">🚧</div>
            <div class="text-sm font-bold text-amber-300">${t.reportTraffic}</div>
            <div class="text-xs text-slate-400 mt-0.5">+5 to 10 min bottleneck</div>
          </button>

          <!-- Report 2: Breakdown -->
          <button id="driver-breakdown-btn" class="p-4 rounded-xl bg-[#111827] border border-red-500/40 hover:bg-red-950/20 text-left transition">
            <div class="text-2xl mb-1">⚠️</div>
            <div class="text-sm font-bold text-red-400">${t.reportBreakdown}</div>
            <div class="text-xs text-slate-400 mt-0.5">Request Rescue Bus</div>
          </button>
        </div>

        <!-- Report 3: Seats Status (Conductor Override) -->
        <div class="bento-card p-4">
          <div class="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
            <span>${t.updateSeats} (Conductor Override)</span>
            <span class="text-[11px] text-slate-400">Current: ${bus.occupancyLevel.toUpperCase()}</span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button class="driver-seat-btn py-3 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              bus.occupancyLevel === 'seats' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }" data-level="seats">
              <span>🟢</span>
              <span>Seats OK</span>
            </button>
            <button class="driver-seat-btn py-3 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              bus.occupancyLevel === 'standing' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }" data-level="standing">
              <span>🟡</span>
              <span>Standing</span>
            </button>
            <button class="driver-seat-btn py-3 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              bus.occupancyLevel === 'full' ? 'bg-red-500 text-white' : 'bg-slate-800 text-red-300 hover:bg-slate-700'
            }" data-level="full">
              <span>🔴</span>
              <span>Bus Full</span>
            </button>
          </div>
        </div>

        <!-- Over-speed Alert Indicator (Section 6) -->
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400">🛡️</span>
            <span class="text-slate-300">Speed Governor Limit: 50 km/h</span>
          </div>
          <span class="text-emerald-400 font-mono font-bold">NORMAL</span>
        </div>

        <!-- Pre-trip checklist button (Section 6) -->
        <button id="driver-checklist-btn" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 flex items-center justify-center gap-2">
          <span>📋</span>
          <span>Pre-Trip Vehicle Inspection Checklist (4/4 Completed)</span>
        </button>

        <!-- EMERGENCY SOS BUTTON -->
        <button id="driver-sos-btn" class="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black tracking-wider shadow-lg flex items-center justify-center gap-2 mt-2">
          <span class="text-xl">🚨</span>
          <span>EMERGENCY SOS TO TRANSPORT OFFICE</span>
        </button>
      </div>

    </div>
  `;

  // Bind Buttons
  const toggleTripBtn = containerEl.querySelector('#driver-toggle-trip-btn');
  const trafficBtn = containerEl.querySelector('#driver-traffic-delay-btn');
  const breakdownBtn = containerEl.querySelector('#driver-breakdown-btn');
  const sosBtn = containerEl.querySelector('#driver-sos-btn');
  const checklistBtn = containerEl.querySelector('#driver-checklist-btn');

  if (toggleTripBtn) {
    toggleTripBtn.onclick = () => {
      const nextStatus = bus.status === 'running' ? 'done' : 'running';
      updateBusTelemetry('bus_14', { status: nextStatus, speed: nextStatus === 'running' ? 32 : 0 });
      alert(nextStatus === 'running' ? 'Trip Started! GPS streaming active.' : 'Trip Ended. GPS standby.');
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
      alert('Traffic delay (+6m) logged and broadcasted to commuters on Route 14.');
      renderDriverView(containerEl);
    };
  }

  if (breakdownBtn) {
    breakdownBtn.onclick = () => {
      if (confirm('Confirm reporting vehicle breakdown? This will alert all route passengers and notify transport command.')) {
        triggerDriverBreakdown('bus_14', 'Engine coolant leak');
        alert('Breakdown dispatched! Commuters notified & rescue bus recommendation sent to admin.');
        renderDriverView(containerEl);
      }
    };
  }

  containerEl.querySelectorAll('.driver-seat-btn').forEach(btn => {
    btn.onclick = () => {
      const level = btn.getAttribute('data-level');
      voteOccupancy('bus_14', level, true); // conductor override = true
      alert(`Occupancy set to: ${level.toUpperCase()} (Conductor Override applied)`);
      renderDriverView(containerEl);
    };
  });

  if (sosBtn) {
    sosBtn.onclick = () => {
      alert('🚨 EMERGENCY SOS SENT! Transport control room notified with exact GPS coordinates (12.9775, 77.5975).');
    };
  }

  if (checklistBtn) {
    checklistBtn.onclick = () => {
      alert('Pre-trip checklist verified: Fuel: Full (88%), Tyre Pressure: 120 PSI, Brakes: Checked, First Aid Kit: Stocked.');
    };
  }
}

