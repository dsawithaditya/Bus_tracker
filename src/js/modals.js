// Interactive Modals & Audio Chimes for Alerts and SOS
import { state } from './state.js';
import { showToast } from './app.js';

// Web Audio API Sound Synthesizer for notifications and alerts
export function playChime(type = 'notification') {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'notification') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(698.46, audioCtx.currentTime); // F5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'sos') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    }
  } catch (e) {
    // Audio context may require user gesture
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
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop-anim">
        <div class="bento-card p-5 max-w-sm w-full bg-[#111827] border border-slate-700 shadow-2xl relative modal-box-anim">
          <button onclick="closeModal()" class="absolute top-3.5 right-3.5 text-slate-400 hover:text-white text-lg">&times;</button>
          
          <div class="flex items-center gap-2.5 mb-3">
            <span class="text-xl">🔔</span>
            <div>
              <h3 class="text-sm font-bold text-white">Arrival Alert</h3>
              <p class="text-xs text-slate-400">Receive a one-time alert before the bus reaches your stop.</p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Boarding Stop</label>
              <select class="w-full px-3 py-1.5 rounded-lg bg-[#0B101D] border border-slate-700 text-xs text-white">
                <option value="stop_domlur">Domlur (Old Airport Road)</option>
                <option value="stop_hal">HAL Main Gate</option>
                <option value="stop_marathahalli">Marathahalli Bridge</option>
                <option value="stop_itpl">ITPL Tech Park (Whitefield)</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Alert Trigger</label>
              <div class="grid grid-cols-2 gap-2">
                <button class="trigger-opt-btn p-2.5 rounded-lg bg-indigo-600/30 border border-indigo-500 text-left active">
                  <div class="font-bold text-white text-xs">5 minutes away</div>
                  <div class="text-[10px] text-slate-400">Time estimate</div>
                </button>
                <button class="trigger-opt-btn p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-left hover:border-slate-600">
                  <div class="font-bold text-white text-xs">2.0 km away</div>
                  <div class="text-[10px] text-slate-400">Radial distance</div>
                </button>
              </div>
            </div>

            <div class="pt-1">
              <label class="flex items-center gap-2 text-slate-300 text-xs">
                <input type="checkbox" checked class="accent-indigo-500 rounded">
                <span>Browser and in-app push notification</span>
              </label>
            </div>

            <button id="save-alert-btn" class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition mt-2 shadow-md">
              Save Alert
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
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop-anim">
        <div class="bento-card p-5 max-w-xs w-full bg-[#111827] border border-slate-700 shadow-2xl relative text-center modal-box-anim">
          <button onclick="closeModal()" class="absolute top-3.5 right-3.5 text-slate-400 hover:text-white text-lg">&times;</button>
          
          <div class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">BMTC Digital Commuter Pass</div>
          <h3 class="text-base font-bold text-white">${state.currentUser.name}</h3>

          <!-- Watermark clock -->
          <div class="my-2.5 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-emerald-400 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> VALID</span>
            <span class="text-white font-bold" id="live-pass-clock">${currentTimeStr}</span>
          </div>

          <!-- QR Code representation -->
          <div class="p-3 bg-white rounded-xl mx-auto my-2 inline-block">
            <svg class="w-36 h-36 text-slate-900 mx-auto" viewBox="0 0 100 100">
              <path fill="currentColor" d="M10 10h30v30h-30zM15 15v20h20v-20zM22 22h6v6h-6zM60 10h30v30h-30zM65 15v20h20v-20zM72 22h6v6h-6zM10 60h30v30h-30zM15 65v20h20v-20zM22 72h6v6h-6zM50 15h5v5h-5zM45 25h10v5h-10zM55 35h5v5h-5zM60 50h5v10h-5zM50 60h8v5h-8zM70 60h5v5h-5zM80 60h10v5h-10zM50 70h5v8h-5zM65 70h10v5h-10zM80 75h10v10h-10zM60 85h15v5h-15zM45 80h5v10h-5zM50 50h5v5h-5z"/>
            </svg>
          </div>

          <!-- Pass Details -->
          <div class="text-left space-y-1 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <div class="flex justify-between">
              <span class="text-slate-400">Pass ID:</span>
              <span class="font-mono text-white">${p.id}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Valid Through:</span>
              <span class="font-mono text-slate-300">${p.validTo}</span>
            </div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800">
              <span class="text-slate-400">Status:</span>
              <span class="px-2 py-0.2 rounded text-[10px] font-semibold ${
                isFeeActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }">${p.feeStatus}</span>
            </div>
          </div>

          <button id="toggle-pass-status-btn" class="mt-2 text-[10px] text-slate-400 hover:text-slate-200 underline">
            Toggle Status (Simulate Test T12)
          </button>
        </div>
      </div>
    `;
  }

  if (type === 'sos') {
    const bus = state.buses.bus_14;
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md modal-backdrop-anim">
        <div class="bento-card p-5 max-w-sm w-full bg-[#111827] border border-red-500/70 shadow-2xl relative text-left modal-box-anim">
          <button onclick="closeModal()" class="absolute top-3.5 right-3.5 text-slate-400 hover:text-white text-lg">&times;</button>
          
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-lg text-red-400">
              🚨
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Emergency Safety Alert</h3>
              <p class="text-xs text-red-300">Direct notification to Transit Security & Control</p>
            </div>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Bus Unit:</span>
                <span class="font-bold text-white">${bus.number} (${bus.regNo})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Coordinates:</span>
                <span class="font-mono text-emerald-400">${bus.lat.toFixed(4)}, ${bus.lon.toFixed(4)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Driver Contact:</span>
                <span class="text-slate-200">${bus.driverName} (${bus.driverPhone})</span>
              </div>
            </div>

            <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div class="text-[11px] font-medium text-indigo-300 mb-1">Shareable Live Trip Link:</div>
              <div class="flex items-center gap-1.5">
                <input type="text" readonly value="https://campusbus.live/trip/share/BLR-335E-4521" class="flex-1 px-2 py-1 rounded bg-[#0B101D] border border-slate-700 text-[10px] font-mono text-slate-300">
                <button onclick="navigator.clipboard?.writeText('https://campusbus.live/trip/share/BLR-335E-4521');" class="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500">
                  Copy
                </button>
              </div>
            </div>

            <button id="trigger-emergency-btn" class="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wide transition mt-1 shadow-md active:scale-95">
              Send Emergency SOS
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'lost_found') {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop-anim">
        <div class="bento-card p-5 max-w-sm w-full bg-[#111827] border border-slate-700 shadow-2xl relative modal-box-anim">
          <button onclick="closeModal()" class="absolute top-3.5 right-3.5 text-slate-400 hover:text-white text-lg">&times;</button>
          
          <div class="flex items-center gap-2.5 mb-3">
            <span class="text-xl">🎒</span>
            <div>
              <h3 class="text-sm font-bold text-white">Lost & Found</h3>
              <p class="text-xs text-slate-400">Items tagged by bus number and trip date</p>
            </div>
          </div>

          <div class="space-y-2 text-xs">
            ${state.lostAndFound.map(item => `
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div class="flex justify-between items-start">
                  <span class="font-semibold text-white">${item.item}</span>
                  <span class="px-1.5 py-0.2 rounded text-[10px] font-medium ${
                    item.status === 'returned' ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-300'
                  }">${item.status === 'returned' ? 'Returned' : 'Held at Office'}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  Bus ${item.busNumber} • ${item.tripTime}
                </div>
              </div>
            `).join('')}

            <div class="pt-2 border-t border-slate-800">
              <div class="text-[11px] font-medium text-slate-300 mb-1">Report a Found or Lost Item</div>
              <div class="flex gap-2">
                <input type="text" id="lf-item-input" placeholder="Item description and bus..." class="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B101D] border border-slate-700 text-xs text-white">
                <button id="lf-submit-btn" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs active:scale-95">Log</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'search') {
    return `
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm modal-backdrop-anim">
        <div class="bento-card p-3 max-w-md w-full bg-[#111827] border border-slate-700 shadow-2xl relative modal-box-anim">
          <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span class="text-slate-400 text-sm">🔍</span>
            <input type="text" id="cmd-input" placeholder="Search route, stop, or bus number..." class="flex-1 bg-transparent text-xs text-white focus:outline-none" autofocus>
            <kbd class="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">ESC</kbd>
          </div>

          <div class="mt-2 space-y-1 text-xs">
            <button class="cmd-jump-btn w-full p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white active:scale-98" data-target="route_335e">
              <div class="flex items-center gap-2">
                <span class="w-12 h-5 rounded bg-indigo-900 text-indigo-300 font-mono flex items-center justify-center font-bold text-xs">335-E</span>
                <span>Majestic to ITPL / Kadugodi</span>
              </div>
              <span class="text-emerald-400 font-mono text-[10px]">On time</span>
            </button>

            <button class="cmd-jump-btn w-full p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white active:scale-98" data-target="route_500d">
              <div class="flex items-center gap-2">
                <span class="w-12 h-5 rounded bg-emerald-900 text-emerald-300 font-mono flex items-center justify-center font-bold text-xs">500-D</span>
                <span>Silk Board to Hebbal (ORR)</span>
              </div>
              <span class="text-amber-400 font-mono text-[10px]">+8m delay</span>
            </button>

            <button class="cmd-jump-btn w-full p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-white active:scale-98" data-target="stop_domlur">
              <div class="flex items-center gap-2">
                <span>🚏</span>
                <span>Domlur (Old Airport Road)</span>
              </div>
              <span class="text-slate-400 text-[10px]">Bus 335-E, 500-D</span>
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
        showToast('🔔 Alert active: You will be notified 5 minutes before Bus 335-E reaches your stop.', 'emerald');
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
        showToast(`Pass status switched: ${next}`, next === 'Active' ? 'emerald' : 'coral');
        window.openModal('pass');
      };
    }
  }

  if (type === 'sos') {
    const triggerBtn = modalRoot.querySelector('#trigger-emergency-btn');
    if (triggerBtn) {
      triggerBtn.onclick = () => {
        playChime('sos');
        showToast('🚨 Emergency SOS dispatched to BMTC Central Control & Police with live GPS.', 'coral');
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
            busNumber: '335-E',
            tripTime: 'Current Trip',
            item: itemVal,
            date: 'Today',
            status: 'held_at_office',
            reportedBy: state.currentUser.name
          });
          showToast(`🎒 Item "${itemVal}" logged into Lost & Found repository.`, 'indigo');
          window.openModal('lost_found');
        }
      };
    }
  }

  if (type === 'search') {
    modalRoot.querySelectorAll('.cmd-jump-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-target');
        window.closeModal();
      };
    });
  }

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
      window.removeEventListener('keydown', escHandler);
    }
  };
  window.addEventListener('keydown', escHandler);
}
