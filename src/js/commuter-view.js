// Commuter Web App View Controller (Students, Faculty, Staff, Visitors)
import { state, voteOccupancy } from './state.js';
import { calculateETA, getDelayStatus, calculateCatchProbability, evaluateSignalState } from './eta-engine.js';
import { translations } from './translations.js';

export function renderCommuterView(containerEl, onBusSelect) {
  const t = translations[state.language] || translations.en;
  const currentBus = state.buses.bus_14;
  const targetStop = state.stops[state.currentUser.targetStopId];
  const delayInfo = getDelayStatus(currentBus.delayMinutes);
  const signalInfo = evaluateSignalState(currentBus.lastPingTimestamp);

  // ETA Calculation for Target Stop (Gate 2)
  const remainingDist = 1800; // meters from current pos
  const etaData = calculateETA(remainingDist, currentBus.rollingSpeed, currentBus.trafficFactor, 1, 30);
  const catchProb = calculateCatchProbability(etaData.roundedMinutes, state.currentUser.walkingDistanceMeters);

  containerEl.innerHTML = `
    <div class="h-full flex flex-col justify-between p-4 md:p-5 overflow-y-auto space-y-4">
      
      <!-- Search & Jump (Ctrl+K) -->
      <div class="relative">
        <button id="cmd-search-btn" class="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 text-slate-400 text-xs transition">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-slate-300">Search routes, stops, or buses...</span>
          </div>
          <kbd class="hidden md:inline-flex items-center text-[10px] font-mono bg-[#1E293B] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+K</kbd>
        </button>
      </div>

      <!-- Route Notice (if active) -->
      ${state.announcements.length > 0 ? `
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <span class="text-amber-400 font-bold">📢</span>
          <div>
            <div class="font-medium text-amber-300">${state.announcements[0].title}</div>
            <div class="text-slate-300 text-[11px] mt-0.5">${state.announcements[0].message}</div>
          </div>
        </div>
      ` : ''}

      <!-- Next Bus Arrival Card -->
      <div class="bento-card p-4 relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#151e33] border border-[#1F2937]">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-white tracking-wide">Route 14 • Bus ${currentBus.number}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              Class ${state.currentUser.firstClassTime}
            </span>
          </div>

          <!-- Live Signal Status -->
          <div>
            ${signalInfo.status === 'live' ? `
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span class="pulse-dot emerald"></span> LIVE
              </span>
            ` : signalInfo.status === 'estimated' ? `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Estimated position
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                Signal lost (Timetable)
              </span>
            `}
          </div>
        </div>

        <!-- Destination & Arrival Countdown -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div class="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Arrival at ${targetStop.name}</div>
            <div class="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-0.5 flex items-baseline gap-2">
              <span id="commuter-eta-countdown">${String(etaData.roundedMinutes).padStart(2, '0')}:24</span>
              <span class="text-xs font-sans font-normal text-slate-400">minutes away</span>
            </div>
            
            <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Expected:</span>
              <span class="font-mono text-slate-300">${etaData.confidenceMin}–${etaData.confidenceMax} min</span>
              ${currentBus.delayMinutes > 0 ? `
                <span class="text-amber-400 font-medium ml-1">
                  • +${currentBus.delayMinutes}m delay ${currentBus.delayReason ? `(${currentBus.delayReason})` : ''}
                </span>
              ` : '<span class="text-emerald-400 font-medium ml-1">• On time</span>'}
            </div>
          </div>

          <!-- Catch-Probability Matrix -->
          <div class="p-2.5 rounded-xl bg-[#0B101D] border border-slate-800 min-w-[160px]">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-2 h-2 rounded-full" style="background-color: ${catchProb.color};"></span>
              <span class="text-xs font-bold" style="color: ${catchProb.color};">${catchProb.message}</span>
            </div>
            <div class="text-[10px] text-slate-400">${catchProb.subtext}</div>
            
            <div class="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Walking distance:</span>
              <span class="font-mono text-slate-300" id="walk-dist-label">${state.currentUser.walkingDistanceMeters}m</span>
            </div>
            <input type="range" id="walk-slider" min="80" max="800" step="40" value="${state.currentUser.walkingDistanceMeters}" 
              class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1">
          </div>
        </div>

        <!-- Occupancy Status & Voting -->
        <div class="mt-3.5 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-400 text-[11px]">Capacity:</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
              currentBus.occupancyLevel === 'seats' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              currentBus.occupancyLevel === 'standing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-red-500/10 text-red-400 border border-red-500/30'
            }">
              ${currentBus.occupancyLevel === 'seats' ? 'Seats Available' :
                currentBus.occupancyLevel === 'standing' ? 'Standing Only' : 'Bus Full'}
            </span>
          </div>

          <div class="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Report:</span>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700" data-level="seats">Seats</button>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700" data-level="standing">Stand</button>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700" data-level="full">Full</button>
          </div>
        </div>
      </div>

      <!-- Route Stop Timeline -->
      <div class="bento-card p-4">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span class="font-bold text-xs text-white">Route 14 Timeline</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">6 Stops Total</span>
        </div>

        <div class="space-y-2.5 relative pl-3">
          <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

          <!-- Stops -->
          <div class="flex items-center justify-between text-xs text-slate-500 py-0.5">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></span>
              <span class="line-through text-slate-500 text-[11px]">Hostel Block</span>
            </div>
            <span class="text-[10px] text-slate-600 font-mono">Passed</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 py-0.5">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></span>
              <span class="line-through text-slate-500 text-[11px]">Library Road</span>
            </div>
            <span class="text-[10px] text-slate-600 font-mono">Passed</span>
          </div>

          <!-- Active Bus Indicator -->
          <div class="relative py-0.5 flex items-center pl-7 text-[11px] text-indigo-400 font-semibold">
            <span class="absolute left-2 w-4 h-4 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[9px] text-white font-mono z-10">
              14
            </span>
            <span class="bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-500/30 text-[10px]">
              En route to Market Circle (${currentBus.speed} km/h)
            </span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-200 py-0.5">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-indigo-400 z-10"></span>
              <span class="font-medium text-white text-[11px]">Market Circle</span>
            </div>
            <span class="text-xs font-mono text-indigo-400 font-semibold">3 min</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-300 py-0.5">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-500 z-10"></span>
              <span class="text-[11px]">Bus Depot</span>
            </div>
            <span class="text-xs font-mono text-slate-300">7 min</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1 bg-emerald-950/20 px-2 rounded-lg border border-emerald-900/40">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-emerald-300 z-10"></span>
              <span class="font-semibold text-white text-[11px]">Gate 2 (Your Stop)</span>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">11 min</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-300 py-0.5">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-500 z-10"></span>
              <span class="text-[11px]">Main Campus Quad</span>
            </div>
            <span class="text-xs font-mono text-slate-300">14 min</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Utilities -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button id="open-alert-modal-btn" class="p-2.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-sm mb-1">🔔</span>
          <span class="text-xs font-medium text-slate-200">Alerts</span>
          <span class="text-[10px] text-slate-400">5 min away</span>
        </button>

        <button id="open-pass-modal-btn" class="p-2.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-sm mb-1">🎟️</span>
          <span class="text-xs font-medium text-slate-200">Bus Pass</span>
          <span class="text-[10px] text-emerald-400">Active</span>
        </button>

        <button id="open-lf-modal-btn" class="p-2.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-sm mb-1">🎒</span>
          <span class="text-xs font-medium text-slate-200">Lost & Found</span>
          <span class="text-[10px] text-slate-400">2 items</span>
        </button>

        <button id="open-sos-modal-btn" class="p-2.5 rounded-xl bg-red-950/30 border border-red-500/40 hover:border-red-500/70 flex flex-col items-center justify-center text-center transition">
          <span class="text-sm mb-1 text-red-400">🚨</span>
          <span class="text-xs font-bold text-red-400">Safety SOS</span>
          <span class="text-[10px] text-red-300">Live GPS</span>
        </button>
      </div>

    </div>
  `;

  // Attach event listeners
  const walkSlider = containerEl.querySelector('#walk-slider');
  const walkLabel = containerEl.querySelector('#walk-dist-label');
  if (walkSlider) {
    walkSlider.addEventListener('input', (e) => {
      const dist = parseInt(e.target.value, 10);
      state.currentUser.walkingDistanceMeters = dist;
      if (walkLabel) walkLabel.textContent = `${dist}m`;
      renderCommuterView(containerEl, onBusSelect);
    });
  }

  // Occupancy quick voting buttons
  containerEl.querySelectorAll('.vote-occupancy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.getAttribute('data-level');
      voteOccupancy('bus_14', level, false);
      renderCommuterView(containerEl, onBusSelect);
    });
  });

  // Modal open handlers
  setupModals(containerEl);
}

function setupModals(containerEl) {
  const alertBtn = containerEl.querySelector('#open-alert-modal-btn');
  const passBtn = containerEl.querySelector('#open-pass-modal-btn');
  const lfBtn = containerEl.querySelector('#open-lf-modal-btn');
  const sosBtn = containerEl.querySelector('#open-sos-modal-btn');
  const cmdBtn = containerEl.querySelector('#cmd-search-btn');

  if (alertBtn) alertBtn.onclick = () => window.openModal('alert');
  if (passBtn) passBtn.onclick = () => window.openModal('pass');
  if (lfBtn) lfBtn.onclick = () => window.openModal('lost_found');
  if (sosBtn) sosBtn.onclick = () => window.openModal('sos');
  if (cmdBtn) cmdBtn.onclick = () => window.openModal('search');
}
