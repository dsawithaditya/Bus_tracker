// Commuter Web App View Controller (Students, Faculty, Staff, Visitors)
import { state, voteOccupancy } from './state.js';
import { calculateETA, getDelayStatus, calculateCatchProbability, evaluateSignalState } from './eta-engine.js';
import { translations } from './translations.js';

export function renderCommuterView(containerEl, onBusSelect) {
  const t = translations[state.language] || translations.en;
  const currentBus = state.buses.bus_14;
  const targetStop = state.stops[state.currentUser.targetStopId] || { name: 'Jain University (Global Campus)' };
  const delayInfo = getDelayStatus(currentBus.delayMinutes);
  const signalInfo = evaluateSignalState(currentBus.lastPingTimestamp);

  // Preserve scroll position across live telemetry updates
  const savedScrollTop = containerEl.scrollTop;

  // ETA Calculation for Target Stop
  const remainingDist = 2400; // meters from current pos
  const etaData = calculateETA(remainingDist, currentBus.rollingSpeed, currentBus.trafficFactor, 1, 30);
  const catchProb = calculateCatchProbability(etaData.roundedMinutes, state.currentUser.walkingDistanceMeters);

  containerEl.innerHTML = `
    <div class="min-h-full flex flex-col p-4 space-y-3.5 pb-6">
      
      <!-- Top Search & Quick Jump -->
      <div class="relative">
        <button id="cmd-search-btn" class="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111827] border border-slate-800 hover:border-indigo-500/50 text-slate-400 text-xs transition">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-slate-300">${t.searchPlaceholder}</span>
          </div>
          <kbd class="hidden md:inline-flex items-center text-[10px] font-mono bg-[#1E293B] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+K</kbd>
        </button>
      </div>

      <!-- Main Live Arrival Card (Clean & Unified) -->
      <div class="bento-card p-4 bg-gradient-to-br from-[#111827] to-[#141d31] border border-slate-800">
        
        <!-- Header: Route + Live Status -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs shadow-sm">
              ${currentBus.number}
            </span>
            <span class="text-xs font-semibold text-white tracking-wide">
              ${currentBus.regNo}
            </span>
            <span class="text-[10px] text-slate-400 hidden sm:inline">• ${currentBus.fleetType}</span>
          </div>

          <div class="flex items-center gap-1.5">
            ${signalInfo.status === 'live' ? `
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>${t.live}</span>
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Estimated
              </span>
            `}
          </div>
        </div>

        <!-- Big Bold ETA & Next Stop -->
        <div class="flex items-baseline justify-between">
          <div>
            <div class="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              ${t.arrivalAt} <strong class="text-white">${targetStop.name}</strong>
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-0.5 flex items-baseline gap-2">
              <span id="commuter-eta-countdown">04:12</span>
              <span class="text-xs font-sans font-normal text-slate-400">${t.minutesAway}</span>
            </div>
          </div>

          <!-- Speed & Punctuality Badge -->
          <div class="text-right">
            <div class="text-xs font-bold font-mono ${currentBus.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}">
              ${currentBus.delayMinutes > 0 ? `+${currentBus.delayMinutes}m ${t.delayed}` : t.onTime}
            </div>
            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${currentBus.speed} km/h</div>
          </div>
        </div>

        <!-- Walk Indicator Strip -->
        <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span id="catch-prob-dot" class="w-2 h-2 rounded-full" style="background-color: ${catchProb.color};"></span>
            <span id="catch-prob-badge" class="font-semibold text-xs" style="color: ${catchProb.color};">${catchProb.message}</span>
            <span class="text-slate-500 text-[11px]">•</span>
            <span id="catch-prob-subtext" class="text-[11px] text-slate-400">${catchProb.subtext}</span>
          </div>

          <div class="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>🚶</span>
            <span id="walk-dist-label">${state.currentUser.walkingDistanceMeters}m</span>
          </div>
        </div>
      </div>

      <!-- Live Corridor Progress (Simplified & Clean) -->
      <div class="bento-card p-3.5 bg-[#0D1322] border border-slate-800">
        <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/80">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span class="font-bold text-xs text-white">Route 216-J Corridor</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">Banashankari ⇄ Harohalli</span>
        </div>

        <!-- 4 Key Stops Corridor -->
        <div class="space-y-2">
          
          <!-- Stop 1: Banashankari -->
          <div class="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/40 text-slate-500">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span class="line-through text-[11px]">Banashankari TTMC</span>
            </div>
            <span class="text-[10px] font-mono text-slate-600">${t.passed}</span>
          </div>

          <!-- Stop 2: Silk Institute -->
          <div class="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/40 text-slate-500">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span class="line-through text-[11px]">Silk Institute Metro</span>
            </div>
            <span class="text-[10px] font-mono text-slate-600">${t.passed}</span>
          </div>

          <!-- Stop 3: Jain University (Your Stop - Highlighted) -->
          <div class="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-white shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse"></span>
              <div>
                <span class="font-bold text-[11px] text-emerald-300">Jain University (Global Campus)</span>
                <span class="text-[10px] text-emerald-400/80 block font-normal">(${t.yourStop})</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">4 min</span>
          </div>

          <!-- Stop 4: Harohalli -->
          <div class="flex items-center justify-between text-xs py-1 px-2 rounded-lg text-slate-400">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span class="text-[11px]">Harohalli Bus Station</span>
            </div>
            <span class="text-[11px] font-mono text-slate-400">16 min</span>
          </div>

        </div>
      </div>

      <!-- Quick Action Utilities Box (Fixed & Compact Toolbar) -->
      <div class="bento-card p-3 bg-[#0B101D] border border-slate-800 shadow-sm">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            ${t.quickTools}
          </span>
          <span class="text-[10px] text-slate-500 font-mono">1-Tap</span>
        </div>
        <div class="grid grid-cols-4 gap-1.5">
          <button id="open-alert-modal-btn" class="p-2 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 hover:bg-slate-800/80 flex flex-col items-center justify-center text-center transition active:scale-95 shadow-sm group">
            <span class="text-sm mb-0.5 group-hover:scale-110 transition-transform">🔔</span>
            <span class="text-[11px] font-medium text-slate-200">${t.toolAlerts}</span>
            <span class="text-[9px] text-slate-400">5m</span>
          </button>

          <button id="open-pass-modal-btn" class="p-2 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 hover:bg-slate-800/80 flex flex-col items-center justify-center text-center transition active:scale-95 shadow-sm group">
            <span class="text-sm mb-0.5 group-hover:scale-110 transition-transform">🎟️</span>
            <span class="text-[11px] font-medium text-slate-200">${t.toolBusPass}</span>
            <span class="text-[9px] text-emerald-400 font-medium">Valid</span>
          </button>

          <button id="open-lf-modal-btn" class="p-2 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 hover:bg-slate-800/80 flex flex-col items-center justify-center text-center transition active:scale-95 shadow-sm group">
            <span class="text-sm mb-0.5 group-hover:scale-110 transition-transform">🎒</span>
            <span class="text-[11px] font-medium text-slate-200">${t.toolLostFound}</span>
            <span class="text-[9px] text-slate-400">2 items</span>
          </button>

          <button id="open-sos-modal-btn" class="p-2 rounded-xl bg-red-950/30 border border-red-500/40 hover:border-red-500 hover:bg-red-950/50 flex flex-col items-center justify-center text-center transition active:scale-95 shadow-sm group">
            <span class="text-sm mb-0.5 text-red-400 group-hover:scale-110 transition-transform">🚨</span>
            <span class="text-[11px] font-bold text-red-400">${t.toolSafetySos}</span>
            <span class="text-[9px] text-red-300">SOS</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Restore scroll position after DOM update
  if (savedScrollTop > 0) {
    containerEl.scrollTop = savedScrollTop;
  }

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
