// Rich Interactive Modals & Audio Chimes for Alerts and SOS
import { state } from './state.js';

// Web Audio API Sound Synthesizer for notifications and emergency alerts
export function playChime(type = 'notification') {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'notification') {
      // Pleasant transit two-tone chime (F5 -> A5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(698.46, audioCtx.currentTime); // F5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } else if (type === 'sos') {
      // Urgent siren sweep
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.9);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.9);
    }
  } catch (e) {
    // Audio context may require user interaction first
  }
}

export function initModals() {
  const modalContainer = document.getElementById('modal-root');
  if (!modalContainer) return;

  window.openModal = function(modalType) {
    modalContainer.classList.remove('hidden');
    modalContainer.innerHTML = getModalHTML(modalType);
    bindModalEvents(modalType);
  };

  window.closeModal = function() {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  };
}

function getModalHTML(type) {
  if (type === 'alert') {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bento-card p-6 max-w-md w-full bg-[#111827] border border-slate-700 shadow-2xl relative">
          <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
          
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">🔔</span>
            <div>
              <h3 class="text-lg font-bold text-white">Set Proximity Alert</h3>
              <p class="text-xs text-slate-400">Get notified once when your bus reaches the trigger.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Target Stop</label>
              <select class="w-full px-3 py-2 rounded-xl bg-[#0B101D] border border-slate-700 text-xs text-white">
                <option value="stop_5">Gate 2 (Your Saved Stop)</option>
                <option value="stop_6">Main Campus Quad</option>
                <option value="stop_3">Market Circle</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Trigger Threshold</label>
              <div class="grid grid-cols-2 gap-2">
                <button class="trigger-opt-btn p-3 rounded-xl bg-indigo-600/30 border border-indigo-500 text-xs font-bold text-indigo-300 text-left active">
                  <div class="text-base font-black">5 Minutes Away</div>
                  <div class="text-[10px] text-slate-400">Time-based trigger</div>
                </button>
                <button class="trigger-opt-btn p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 text-left hover:border-slate-600">
                  <div class="text-base font-black">2.0 km Away</div>
                  <div class="text-[10px] text-slate-400">Geofence radial trigger</div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Notification Channel</label>
              <div class="space-y-2 text-xs text-slate-300">
                <label class="flex items-center gap-2">
                  <input type="checkbox" checked class="accent-indigo-500 rounded">
                  <span>Web Push Notification (In-App & Browser)</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" checked class="accent-indigo-500 rounded">
                  <span>Telegram Bot (@CampusTransitBot)</span>
                </label>
              </div>
            </div>

            <button id="save-alert-btn" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition">
              Set Proximity Alarm
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'pass') {
    const p = state.currentUser.pass;
    const isFeeActive = p.feeStatus === 'Active';
    const currentTimeStr = new Date().toLocaleTimeString();

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bento-card p-6 max-w-sm w-full bg-[#111827] border border-slate-700 shadow-2xl relative text-center">
          <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
          
          <div class="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">University Transit System</div>
          <h3 class="text-xl font-black text-white">Digital Boarding Pass</h3>

          <!-- Moving Security Watermark Bar -->
          <div class="my-3 py-1 px-3 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-[11px] text-indigo-300 font-mono flex items-center justify-between">
            <span class="flex items-center gap-1.5"><span class="pulse-dot emerald"></span> VERIFIED</span>
            <span class="text-white font-bold" id="live-pass-clock">${currentTimeStr}</span>
          </div>

          <!-- Dynamic QR Code Representation -->
          <div class="p-4 bg-white rounded-2xl mx-auto my-3 inline-block shadow-lg">
            <svg class="w-44 h-44 text-slate-900 mx-auto" viewBox="0 0 100 100">
              <path fill="currentColor" d="M10 10h30v30h-30zM15 15v20h20v-20zM22 22h6v6h-6zM60 10h30v30h-30zM65 15v20h20v-20zM72 22h6v6h-6zM10 60h30v30h-30zM15 65v20h20v-20zM22 72h6v6h-6zM50 15h5v5h-5zM45 25h10v5h-10zM55 35h5v5h-5zM60 50h5v10h-5zM50 60h8v5h-8zM70 60h5v5h-5zM80 60h10v5h-10zM50 70h5v8h-5zM65 70h10v5h-10zM80 75h10v10h-10zM60 85h15v5h-15zM45 80h5v10h-5zM50 50h5v5h-5z"/>
            </svg>
          </div>

          <!-- Pass Details -->
          <div class="text-left space-y-1 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div class="flex justify-between">
              <span class="text-slate-400">Student:</span>
              <span class="font-bold text-white">${state.currentUser.name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Roll No:</span>
              <span class="font-mono text-white">${state.currentUser.rollNo}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Valid Routes:</span>
              <span class="text-indigo-400 font-bold">ALL ROUTES (14, 7, 21)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Semester Expiry:</span>
              <span class="text-slate-300 font-mono">${p.validTo}</span>
            </div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800">
              <span class="text-slate-400">Fee Status:</span>
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${
                isFeeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }">${p.feeStatus}</span>
            </div>
          </div>

          <!-- Test Toggle Button for Demo T12 -->
          <div class="mt-3">
            <button id="toggle-pass-status-btn" class="text-[11px] text-slate-400 underline hover:text-slate-200">
              Toggle Fee Status (Demo T12 Expired Pass)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'sos') {
    const bus = state.buses.bus_14;
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
        <div class="bento-card p-6 max-w-md w-full bg-[#111827] border-2 border-red-500/80 shadow-2xl relative text-left">
          <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
          
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-3xl animate-pulse">
              🚨
            </div>
            <div>
              <h3 class="text-lg font-black text-white">Emergency SOS & Safe-Drop</h3>
              <p class="text-xs text-red-300">Instant Alert to Campus Security & Warden</p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Current Trip:</span>
                <span class="font-bold text-white">Bus 14 (Route 14)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Live GPS Coordinates:</span>
                <span class="font-mono text-emerald-400">${bus.lat.toFixed(4)}, ${bus.lon.toFixed(4)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Driver Contact:</span>
                <span class="text-slate-200">${bus.driverName} (${bus.driverPhone})</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div class="font-bold text-indigo-300 mb-1">🔗 Shareable Trip Safe-Drop Link:</div>
              <div class="flex items-center gap-2">
                <input type="text" readonly value="https://campusbus.live/trip/share/TRIP-1402-AARAV" class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300">
                <button onclick="navigator.clipboard?.writeText('https://campusbus.live/trip/share/TRIP-1402-AARAV'); alert('Trip link copied! Valid for 2 hours.');" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500">
                  Copy
                </button>
              </div>
              <div class="text-[10px] text-slate-400 mt-1">Parents/warden can follow real-time bus movement without logging in.</div>
            </div>

            <!-- ONE-TAP EMERGENCY TRIGGER -->
            <button id="trigger-emergency-btn" class="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/40 transition">
              🚨 TRIGGER LIVE SOS DISPATCH
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'lost_found') {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bento-card p-6 max-w-md w-full bg-[#111827] border border-slate-700 shadow-2xl relative">
          <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
          
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">🎒</span>
            <div>
              <h3 class="text-lg font-bold text-white">Lost & Found Bus Ledger</h3>
              <p class="text-xs text-slate-400">Items tagged to bus number and trip timestamp</p>
            </div>
          </div>

          <div class="space-y-3">
            ${state.lostAndFound.map(item => `
              <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div class="flex justify-between items-start">
                  <div class="font-bold text-white">${item.item}</div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'returned' ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }">${item.status === 'returned' ? 'Returned to Owner' : 'Held at Transport Office'}</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">
                  Bus ${item.busNumber} • ${item.tripTime} • Reported by: ${item.reportedBy}
                </div>
              </div>
            `).join('')}

            <div class="pt-3 border-t border-slate-800">
              <div class="text-xs font-semibold text-slate-300 mb-2">Report a Lost Item on Bus</div>
              <div class="flex gap-2">
                <input type="text" id="lf-item-input" placeholder="e.g. Blue umbrella left on Bus 14..." class="flex-1 px-3 py-2 rounded-xl bg-[#0B101D] border border-slate-700 text-xs text-white">
                <button id="lf-submit-btn" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">Report</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'search') {
    return `
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bento-card p-4 max-w-lg w-full bg-[#111827] border border-slate-700 shadow-2xl relative">
          <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span class="text-lg text-slate-400">🔍</span>
            <input type="text" id="cmd-input" placeholder="Search route, stop or bus number..." class="flex-1 bg-transparent text-sm text-white focus:outline-none" autofocus>
            <kbd class="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">ESC to close</kbd>
          </div>

          <div class="mt-3 space-y-1 text-xs">
            <div class="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1">Quick Suggestions</div>
            <button class="cmd-jump-btn w-full p-2.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white" data-target="route_14">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-indigo-900 text-indigo-300 font-mono flex items-center justify-center font-bold text-xs">14</span>
                <span>Route 14 (Hostel to Main Campus)</span>
              </div>
              <span class="text-emerald-400 font-mono text-[11px]">Live (3 min away)</span>
            </button>

            <button class="cmd-jump-btn w-full p-2.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white" data-target="route_7">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-emerald-900 text-emerald-300 font-mono flex items-center justify-center font-bold text-xs">7</span>
                <span>Route 7 (Metro to Tech Complex)</span>
              </div>
              <span class="text-amber-400 font-mono text-[11px]">Delayed (+8m)</span>
            </button>

            <button class="cmd-jump-btn w-full p-2.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white" data-target="stop_5">
              <div class="flex items-center gap-2">
                <span class="text-base">🚏</span>
                <span>Gate 2 Boarding Point</span>
              </div>
              <span class="text-slate-400 text-[11px]">Buses: 14, 14B</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

function bindModalEvents(type) {
  const modalRoot = document.getElementById('modal-root');

  if (type === 'alert') {
    const saveBtn = modalRoot.querySelector('#save-alert-btn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        playChime('notification');
        alert('🔔 Proximity Alert Registered! You will receive a notification when Bus 14 is 5 minutes from Gate 2.');
        window.closeModal();
      };
    }
  }

  if (type === 'pass') {
    const toggleBtn = modalRoot.querySelector('#toggle-pass-status-btn');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const next = state.currentUser.pass.feeStatus === 'Active' ? 'Expired' : 'Active';
        state.currentUser.pass.feeStatus = next;
        state.events.emit('pass:updated', state.currentUser.pass);
        window.openModal('pass'); // re-render
      };
    }
  }

  if (type === 'sos') {
    const triggerBtn = modalRoot.querySelector('#trigger-emergency-btn');
    if (triggerBtn) {
      triggerBtn.onclick = () => {
        playChime('sos');
        alert('🚨 EMERGENCY SOS SENT!\n\nControl Room Notified.\nGPS Coordinates: 12.9775, 77.5975\nCampus Security Patrol Dispatched.\nDriver Audio Link Activated.');
        window.closeModal();
      };
    }
  }

  if (type === 'lost_found') {
    const submitBtn = modalRoot.querySelector('#lf-submit-btn');
    const input = modalRoot.querySelector('#lf-item-input');
    if (submitBtn && input) {
      submitBtn.onclick = () => {
        const itemVal = input.value.trim();
        if (itemVal) {
          state.lostAndFound.unshift({
            id: `lf_${Date.now()}`,
            busNumber: '14',
            tripTime: 'Current Trip',
            item: itemVal,
            date: 'Today',
            status: 'held_at_office',
            reportedBy: state.currentUser.name
          });
          alert('Report logged in bus ledger! Transport office notified.');
          window.openModal('lost_found');
        }
      };
    }
  }

  if (type === 'search') {
    modalRoot.querySelectorAll('.cmd-jump-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-target');
        alert(`Jumped to: ${target}`);
        window.closeModal();
      };
    });
  }

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
      window.removeEventListener('keydown', escHandler);
    }
  };
  window.addEventListener('keydown', escHandler);
}

