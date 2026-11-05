// Main Application Orchestrator
import { state, setView, setLanguage, toggleLargeText, toggleLowDataMode, updateBusTelemetry } from './state.js';
import { CampusMapController } from './map-controller.js';
import { renderCommuterView } from './commuter-view.js';
import { renderDriverView } from './driver-view.js';
import { renderAdminView } from './admin-view.js';
import { renderGateDisplayView } from './gate-display-view.js';
import { DemoSuite } from './demo-suite.js';
import { initModals, playChime } from './modals.js';
import { translations, applyLanguageToDOM } from './translations.js';
import { initAnimations, animateViewEntrance } from './animations.js';

let mapController = null;
let demoSuite = null;
let simulationInterval = null;

// Toast notification helper (Disabled per design specifications)
export function showToast(message, type = 'indigo') {
  // Popups disabled
  return;
}

// Start GPS Simulation Loop (Section 7.8 pseudocode: runs every 3 seconds)
function startGpsSimulation() {
  if (simulationInterval) clearInterval(simulationInterval);

  simulationInterval = setInterval(() => {
    const bus = state.buses.bus_14;
    if (bus.status === 'breakdown' || bus.status === 'done') return;

    // Advance bus progress smoothly along its assigned route
    bus.progressIndex = (bus.progressIndex + 0.008) % 1.0;
    
    // Calculate current interpolated position along route path
    const route = state.routes.find(r => r.id === bus.routeId) || state.routes[0];
    if (route && route.path.length > 1) {
      const totalSegments = route.path.length - 1;
      const exactIndex = bus.progressIndex * totalSegments;
      const baseIndex = Math.floor(exactIndex);
      const fraction = exactIndex - baseIndex;
      const nextIndex = Math.min(baseIndex + 1, route.path.length - 1);

      const p1 = route.path[baseIndex];
      const p2 = route.path[nextIndex];

      bus.lat = p1[0] + (p2[0] - p1[0]) * fraction;
      bus.lon = p1[1] + (p2[1] - p1[1]) * fraction;

      // Calculate heading angle
      const dLat = p2[0] - p1[0];
      const dLon = p2[1] - p1[1];
      const angle = (Math.atan2(dLon, dLat) * 180 / Math.PI + 360) % 360;
      bus.heading = Math.round(angle);
    }

    bus.lastPingTimestamp = Date.now();
    updateBusTelemetry('bus_14', {
      lat: bus.lat,
      lon: bus.lon,
      heading: bus.heading,
      speed: bus.status === 'delayed' ? 16 : 32
    });

    if (mapController) {
      mapController.updateBusMarker(bus);
    }

    // Refresh active view if in commuter or driver (preserving scroll positions)
    if (state.activeView === 'commuter') {
      const dock = document.getElementById('commuter-dock');
      if (dock) {
        const savedScroll = dock.scrollTop;
        renderCommuterView(dock);
        if (savedScroll > 0) dock.scrollTop = savedScroll;
      }
    } else if (state.activeView === 'driver') {
      const driverLayout = document.getElementById('driver-layout');
      if (driverLayout) renderDriverView(driverLayout);
    } else if (state.activeView === 'gate') {
      const gateLayout = document.getElementById('gate-layout');
      if (gateLayout) renderGateDisplayView(gateLayout);
    }
  }, 3000);
}

// Switch Active View with Smooth Box Appearing Animation
function switchPortal(viewName) {
  state.activeView = viewName;

  const commuterLayout = document.getElementById('commuter-layout');
  const driverLayout = document.getElementById('driver-layout');
  const adminLayout = document.getElementById('admin-layout');
  const gateLayout = document.getElementById('gate-layout');

  // Hide all
  commuterLayout.classList.add('hidden');
  driverLayout.classList.add('hidden');
  adminLayout.classList.add('hidden');
  gateLayout.classList.add('hidden');

  // Update tab buttons active styling
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-view') === viewName;
    if (isTarget) {
      btn.className = 'nav-tab-btn px-3.5 py-1.5 rounded-lg transition text-white bg-indigo-600 shadow font-bold scale-100';
    } else {
      btn.className = 'nav-tab-btn px-3.5 py-1.5 rounded-lg transition text-slate-400 hover:text-white font-medium hover:bg-slate-800/40';
    }
  });

  if (viewName === 'commuter') {
    commuterLayout.classList.remove('hidden');
    animateViewEntrance(commuterLayout);
    const dock = document.getElementById('commuter-dock');
    if (dock) renderCommuterView(dock);
    if (mapController) mapController.invalidateSize();
  } else if (viewName === 'driver') {
    driverLayout.classList.remove('hidden');
    animateViewEntrance(driverLayout);
    renderDriverView(driverLayout);
  } else if (viewName === 'admin') {
    adminLayout.classList.remove('hidden');
    animateViewEntrance(adminLayout);
    renderAdminView(adminLayout);
  } else if (viewName === 'gate') {
    gateLayout.classList.remove('hidden');
    animateViewEntrance(gateLayout);
    renderGateDisplayView(gateLayout);
  }
}

// Global Keyboard Shortcut: Ctrl+K opens Command Search (Section 8.2)
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.openModal('search');
    }
  });
}

// Setup Demo Drawer & Test Case buttons
function initDemoSuite() {
  demoSuite = new DemoSuite(showToast);

  const drawer = document.getElementById('demo-drawer');
  const toggleBtn = document.getElementById('toggle-demo-drawer-btn');
  const closeBtn = document.getElementById('close-demo-drawer-btn');
  const runDemoBtn = document.getElementById('run-demo-script-btn');

  if (toggleBtn && drawer) {
    toggleBtn.onclick = () => drawer.classList.toggle('translate-x-full');
  }
  if (closeBtn && drawer) {
    closeBtn.onclick = () => drawer.classList.add('translate-x-full');
  }

  if (runDemoBtn) {
    runDemoBtn.onclick = () => {
      demoSuite.runFullDemoScript((stepInfo) => {
        showToast(`🎬 [${stepInfo.title}] ${stepInfo.desc}`, 'indigo');
      });
    };
  }

  // Individual test buttons T1-T12
  document.querySelectorAll('.test-case-btn').forEach(btn => {
    btn.onclick = () => {
      const test = btn.getAttribute('data-test');
      if (typeof demoSuite[`run${test}`] === 'function') {
        demoSuite[`run${test}`]();
      }
    };
  });
}

// Initial Bootstrapping
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Google Maps Controller centered on Bangalore & Jain University Transit Corridor
  mapController = new CampusMapController('leaflet-map-container');
  mapController.init(12.7800, 77.5100, 11);
  mapController.drawRoutes(state.routes);
  mapController.drawStops(state.stops, (stop) => {
    showToast(`🚏 Stop: <strong>${stop.name}</strong> • Geofence Radius: 150m. Distance: ${stop.distanceFromStart}m`, 'indigo');
  });

  // Plot initial active buses
  Object.values(state.buses).forEach(bus => {
    mapController.updateBusMarker(bus, (clickedBus) => {
      showToast(`🚌 Selected Bus <strong>${clickedBus.number}</strong> (${clickedBus.regNo}) • Driver: ${clickedBus.driverName} • Speed: ${clickedBus.speed} km/h`, 'emerald');
    });
  });

  // Focus Bus button
  const focusBtn = document.getElementById('recenter-bus-btn');
  if (focusBtn) {
    focusBtn.onclick = () => mapController.panToBus('bus_14');
  }

  // Google Maps Style Switcher (Dark -> Satellite -> Standard)
  const mapLayerBtn = document.getElementById('toggle-map-layer-btn');
  const mapLayerLabel = document.getElementById('map-layer-label');
  if (mapLayerBtn) {
    const styles = ['google-dark', 'google-satellite', 'google-standard'];
    const labels = {
      'google-dark': 'Satellite',
      'google-satellite': 'Standard',
      'google-standard': 'Dark Mode'
    };
    let currentIdx = 0;
    mapLayerBtn.onclick = () => {
      currentIdx = (currentIdx + 1) % styles.length;
      const nextStyle = styles[currentIdx];
      mapController.setGoogleMapStyle(nextStyle);
      if (mapLayerLabel) mapLayerLabel.textContent = labels[nextStyle];
      showToast(`Google Maps view: ${nextStyle.replace('google-', '').toUpperCase()}`, 'indigo');
    };
  }

  // Language toggle
  const langBtn = document.getElementById('toggle-lang-btn');
  const langLabel = document.getElementById('current-lang-label');
  if (langBtn) {
    langBtn.onclick = () => {
      const next = state.language === 'en' ? 'hi' : 'en';
      setLanguage(next);
      applyLanguageToDOM(next);
      if (langLabel) langLabel.textContent = next === 'hi' ? 'EN' : 'HI';
      switchPortal(state.activeView);
      showToast(`Language switched to: ${next === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`, 'indigo');
    };
  }

  // Large Text toggle
  const largeTextBtn = document.getElementById('toggle-large-text-btn');
  if (largeTextBtn) {
    largeTextBtn.onclick = () => {
      toggleLargeText();
      showToast(`Large Text Mode: ${state.largeText ? 'Enabled' : 'Disabled'}`, 'indigo');
    };
  }

  // Low Data Mode toggle
  const lowDataBtn = document.getElementById('toggle-low-data-btn');
  if (lowDataBtn) {
    lowDataBtn.onclick = () => {
      toggleLowDataMode();
      showToast(`Low Data Mode: ${state.lowDataMode ? 'Enabled (Map Paused)' : 'Disabled'}`, 'indigo');
    };
  }

  // Setup Navigation Tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchPortal(view);
    });
  });

  // Setup Modals and Audio
  initModals();

  // Setup Shortcuts
  initKeyboardShortcuts();

  // Setup Demo & Test Suite
  initDemoSuite();

  // Initialize Global Scroll & Click Animations
  initAnimations();

  // Initialize initial language bindings
  applyLanguageToDOM(state.language);

  // TurboStarter FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // TurboStarter Theme Switcher Dots
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      if (theme === 'indigo') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      showToast(`Theme accent updated: ${theme.toUpperCase()}`, 'indigo');
    });
  });

  // Hero Watch Demo Button
  const heroDemoBtn = document.getElementById('hero-start-demo-btn');
  if (heroDemoBtn) {
    heroDemoBtn.onclick = () => {
      const drawer = document.getElementById('demo-drawer');
      if (drawer) drawer.classList.remove('translate-x-full');
      if (demoSuite) {
        demoSuite.runFullDemoScript((stepInfo) => {
          showToast(`🎬 [${stepInfo.title}] ${stepInfo.desc}`, 'indigo');
        });
      }
    };
  }

  // Render initial commuter view dock
  const dock = document.getElementById('commuter-dock');
  if (dock) renderCommuterView(dock);

  // Start 3-second GPS Simulator
  startGpsSimulation();

  // Welcome Toast
  setTimeout(() => {
    showToast('Bangalore BMTC Transit live. Real-time bus positions and Google Maps active.', 'emerald');
  }, 1000);
});

