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
    <div class="h-full flex flex-col justify-between p-4 md:p-6 overflow-y-auto space-y-4">
      
      <!-- Top Search & Quick Jump (Ctrl+K) -->
      <div class="relative">
        <button id="cmd-search-btn" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 text-slate-400 text-sm transition">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-xs md:text-sm text-slate-300">${t.searchPlaceholder}</span>
          </div>
          <kbd class="hidden md:inline-flex items-center gap-1 text-[11px] font-mono bg-[#1E293B] text-slate-400 px-2 py-0.5 rounded border border-slate-700">Ctrl+K</kbd>
        </button>
      </div>

      <!-- Announcements Banner (if active) -->
      ${state.announcements.length > 0 ? `
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <span class="text-amber-400 font-bold text-sm">📢</span>
          <div>
            <div class="font-semibold text-amber-300">${state.announcements[0].title}</div>
            <div class="text-slate-300 mt-0.5">${state.announcements[0].message}</div>
          </div>
        </div>
      ` : ''}

      <!-- "YOUR BUS TODAY" HERO BENTO CARD (Section 6 & 8.4) -->
      <div class="bento-card p-5 relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#151e33] border border-[#1F2937]">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-bold tracking-wider text-indigo-400">${t.yourBusToday}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              ${state.currentUser.firstClassTime} Class
            </span>
          </div>
          <!-- Signal & Status Chip -->
          <div class="flex items-center gap-2">
            ${signalInfo.status === 'live' ? `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span class="pulse-dot emerald"></span> LIVE
              </span>
            ` : signalInfo.status === 'estimated' ? `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                ⚠️ Estimated position
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                🛑 Signal lost (Timetable)
              </span>
            `}
          </div>
        </div>

        <!-- Bus Destination & Big ETA Display -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">BUS ${currentBus.number} TO ${targetStop.name.toUpperCase()}</div>
            <div class="text-4xl md:text-5xl font-black text-white font-mono tracking-tight mt-1 flex items-baseline gap-2">
              <span id="commuter-eta-countdown">${String(etaData.roundedMinutes).padStart(2, '0')}:24</span>
              <span class="text-xs md:text-sm font-sans font-normal text-slate-400">mins away</span>
            </div>
            <!-- Confidence Range (Section 6) -->
            <div class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Confidence:</span>
              <span class="font-mono text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                ${etaData.confidenceMin} to ${etaData.confidenceMax} min
              </span>
              ${currentBus.delayMinutes > 0 ? `
                <span class="text-amber-400 text-[11px] font-medium ml-1">
                  • +${currentBus.delayMinutes}m delay ${currentBus.delayReason ? `(${currentBus.delayReason})` : ''}
                </span>
              ` : '<span class="text-emerald-400 text-[11px] font-medium ml-1">• On Schedule</span>'}
            </div>
          </div>

          <!-- Catch Probability Pill (Section 7.3) -->
          <div class="p-3 rounded-xl bg-[#0B101D] border border-[#1F2937] flex flex-col justify-center min-w-[170px]">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${catchProb.color};"></span>
              <span class="text-xs font-bold" style="color: ${catchProb.color};">${catchProb.message}</span>
            </div>
            <div class="text-[11px] text-slate-400">${catchProb.subtext}</div>
            
            <!-- Walk distance slider for interactive testing -->
            <div class="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Walk dist:</span>
              <span class="font-mono text-slate-300" id="walk-dist-label">${state.currentUser.walkingDistanceMeters}m</span>
            </div>
            <input type="range" id="walk-slider" min="80" max="800" step="40" value="${state.currentUser.walkingDistanceMeters}" 
              class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1">
          </div>
        </div>

        <!-- Occupancy Meter & Voting (Section 5 & 7.4) -->
        <div class="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-400">Occupancy:</span>
            <span class="px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
              currentBus.occupancyLevel === 'seats' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              currentBus.occupancyLevel === 'standing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-red-500/10 text-red-400 border border-red-500/30'
            }">
              ${currentBus.occupancyLevel === 'seats' ? '🟢 Seats Available' :
                currentBus.occupancyLevel === 'standing' ? '🟡 Standing Room Only' : '🔴 Full Bus'}
            </span>
          </div>

          <div class="flex items-center gap-1.5 text-xs text-slate-400">
            <span class="text-[11px]">Crowd report:</span>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700" data-level="seats">Seats</button>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] border border-slate-700" data-level="standing">Stand</button>
            <button class="vote-occupancy-btn px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-300 text-[11px] border border-slate-700" data-level="full">Full</button>
          </div>
        </div>
      </div>

      <!-- METRO-STYLE ROUTE TIMELINE (Section 4 & 8.4) -->
      <div class="bento-card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span class="font-bold text-sm text-white">${t.route14Title}</span>
          </div>
          <span class="text-[11px] text-slate-400 font-mono">6 Stops Total</span>
        </div>

        <div class="space-y-3 relative pl-3">
          <!-- Continuous route vertical line -->
          <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

          <!-- Stops List -->
          <div class="flex items-center justify-between text-xs text-slate-500 py-1">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></span>
              <span class="line-through text-slate-500">Hostel Block</span>
            </div>
            <span class="text-[11px] text-slate-600 font-mono">passed</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 py-1">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></span>
              <span class="line-through text-slate-500">Library Road</span>
            </div>
            <span class="text-[11px] text-slate-600 font-mono">passed</span>
          </div>

          <!-- Animated Bus Marker in Timeline -->
          <div class="relative py-1 flex items-center pl-7 text-[11px] text-indigo-400 font-semibold">
            <span class="absolute left-2 w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-[10px] text-white font-mono animate-bounce z-10">
              14
            </span>
            <span class="bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
              Approaching Market Circle (${currentBus.speed} km/h)
            </span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-200 py-1">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-indigo-400 z-10"></span>
              <span class="font-medium text-white">Market Circle</span>
            </div>
            <span class="text-xs font-mono text-indigo-400 font-semibold">3 min</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-300 py-1">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-500 z-10"></span>
              <span>Bus Depot</span>
            </div>
            <span class="text-xs font-mono text-slate-300">7 min</span>
          </div>

          <div class="flex items-center justify-between text-xs text-emerald-400 py-1 bg-emerald-950/20 px-2 rounded-lg border border-emerald-900/40">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-emerald-300 z-10"></span>
              <span class="font-bold text-white">Gate 2 (Your Stop)</span>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">11 min</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-300 py-1">
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-500 z-10"></span>
              <span>Main Campus Quad</span>
            </div>
            <span class="text-xs font-mono text-slate-300">14 min</span>
          </div>
        </div>
      </div>

      <!-- QUICK ACTION UTILITY BUTTONS (Section 2, 4, 5) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <button id="open-alert-modal-btn" class="p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-lg mb-1">🔔</span>
          <span class="text-xs font-medium text-slate-200">${t.notifyMe}</span>
          <span class="text-[10px] text-slate-400">5 min / 2 km away</span>
        </button>

        <button id="open-pass-modal-btn" class="p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-lg mb-1">🎟️</span>
          <span class="text-xs font-medium text-slate-200">${t.digitalPass}</span>
          <span class="text-[10px] text-emerald-400">Semester Active</span>
        </button>

        <button id="open-lf-modal-btn" class="p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 flex flex-col items-center justify-center text-center transition">
          <span class="text-lg mb-1">🎒</span>
          <span class="text-xs font-medium text-slate-200">${t.lostFound}</span>
          <span class="text-[10px] text-slate-400">2 active items</span>
        </button>

        <button id="open-sos-modal-btn" class="p-3 rounded-xl bg-red-950/30 border border-red-500/40 hover:border-red-500/70 flex flex-col items-center justify-center text-center transition group">
          <span class="text-lg mb-1 group-hover:scale-110 transition">🚨</span>
          <span class="text-xs font-bold text-red-400">${t.sosButton}</span>
          <span class="text-[10px] text-red-300">Safe Drop & GPS</span>
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
      alert(`Reported: ${level.toUpperCase()} occupancy. Conductor majority applied.`);
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

