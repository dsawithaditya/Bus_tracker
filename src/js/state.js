// Centralized Reactive State Store with Real Bangalore BMTC Bus Data
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(data));
    }
  }
}

export const state = {
  activeView: 'commuter', // 'commuter' | 'driver' | 'admin' | 'gate'
  language: 'en',
  largeText: false,
  lowDataMode: false,
  mapStyle: 'google-dark', // 'google-dark' | 'google-satellite' | 'google-standard'
  
  // Current user (Student commuter at Jain University)
  currentUser: {
    id: 'usr_blr_4091',
    name: 'Aarav Patel',
    role: 'student',
    rollNo: '23JUCS0482',
    department: 'Jain University (FET - Computer Science)',
    homeStopId: 'stop_silkinstitute', // Silk Institute Metro
    targetStopId: 'stop_jainuniv', // Jain University Global Campus
    firstClassTime: '08:45 AM',
    walkingDistanceMeters: 280, // default ~3.5 mins walk
    pass: {
      id: 'JU-BMTC-PASS-2026-8831',
      validFrom: '2026-08-01',
      validTo: '2026-12-31',
      feeStatus: 'Active',
      qrToken: 'BMTC-CAMPUS:usr_blr_4091:ROUTE216J:VALID'
    }
  },

  scheduleMode: 'regular', // 'regular' | 'exam' | 'half-day'
  
  // Bangalore BMTC Routes (Featuring Jain University / Kanakapura Rd Corridor)
  routes: [
    {
      id: 'route_216j',
      name: 'Route 216-J: Banashankari to Jain University / Harohalli',
      shortName: '216-J',
      color: '#6366F1',
      active: true,
      stops: [
        'stop_banashankari',
        'stop_konanakunte',
        'stop_silkinstitute',
        'stop_kaggalipura',
        'stop_jainuniv',
        'stop_harohalli'
      ],
      path: [
        [12.9156, 77.5736], // Banashankari TTMC
        [12.9010, 77.5650], // Sarakki Signal
        [12.8885, 77.5582], // Konanakunte Cross
        [12.8750, 77.5450], // Vajrahalli
        [12.8631, 77.5312], // Silk Institute Metro Terminal
        [12.8350, 77.5180], // Thalaghattapura
        [12.7981, 77.5028], // Kaggalipura
        [12.7400, 77.4800], // Art of Living / Haragadde Cross
        [12.6462, 77.4418], // Jain University (JGI Global Campus)
        [12.6074, 77.4332]  // Harohalli Bus Stand & Industrial Area
      ]
    },
    {
      id: 'route_335e',
      name: 'Route 335-E: Majestic to ITPL',
      shortName: '335-E',
      color: '#10B981',
      active: true,
      stops: [
        'stop_majestic',
        'stop_richmond',
        'stop_domlur',
        'stop_hal',
        'stop_marathahalli',
        'stop_itpl'
      ],
      path: [
        [12.9781, 77.5724], // Majestic
        [12.9632, 77.5982], // Richmond Circle
        [12.9634, 77.6385], // Domlur
        [12.9538, 77.6687], // HAL Gate
        [12.9561, 77.7019], // Marathahalli Bridge
        [12.9859, 77.7360]  // ITPL
      ]
    },
    {
      id: 'route_500d',
      name: 'Route 500-D: Silk Board to Hebbal (ORR)',
      shortName: '500-D',
      color: '#F59E0B',
      active: true,
      stops: [
        'stop_silkboard',
        'stop_hsr',
        'stop_bellandur',
        'stop_marathahalli',
        'stop_tinfactory',
        'stop_hebbal'
      ],
      path: [
        [12.9176, 77.6234], // Silk Board
        [12.9116, 77.6433], // HSR
        [12.9260, 77.6762], // Bellandur EcoSpace
        [12.9561, 77.7019], // Marathahalli Bridge
        [13.0006, 77.6625], // Tin Factory
        [13.0358, 77.5970]  // Hebbal
      ]
    }
  ],

  // Real Bangalore Bus Stops Database with 150m Geofences
  stops: {
    'stop_banashankari': { id: 'stop_banashankari', name: 'Banashankari TTMC', lat: 12.9156, lon: 77.5736, radius_m: 150, distanceFromStart: 0 },
    'stop_konanakunte': { id: 'stop_konanakunte', name: 'Konanakunte Cross', lat: 12.8885, lon: 77.5582, radius_m: 150, distanceFromStart: 3800 },
    'stop_silkinstitute': { id: 'stop_silkinstitute', name: 'Silk Institute Metro', lat: 12.8631, lon: 77.5312, radius_m: 150, distanceFromStart: 8200 },
    'stop_kaggalipura': { id: 'stop_kaggalipura', name: 'Kaggalipura', lat: 12.7981, lon: 77.5028, radius_m: 150, distanceFromStart: 16500 },
    'stop_jainuniv': { id: 'stop_jainuniv', name: 'Jain University (Global Campus)', lat: 12.6462, lon: 77.4418, radius_m: 150, distanceFromStart: 34000 },
    'stop_harohalli': { id: 'stop_harohalli', name: 'Harohalli Bus Station', lat: 12.6074, lon: 77.4332, radius_m: 150, distanceFromStart: 39500 },

    'stop_majestic': { id: 'stop_majestic', name: 'Kempegowda Bus Station (Majestic)', lat: 12.9781, lon: 77.5724, radius_m: 150, distanceFromStart: 0 },
    'stop_richmond': { id: 'stop_richmond', name: 'Richmond Circle', lat: 12.9632, lon: 77.5982, radius_m: 150, distanceFromStart: 3200 },
    'stop_domlur': { id: 'stop_domlur', name: 'Domlur (Old Airport Road)', lat: 12.9634, lon: 77.6385, radius_m: 150, distanceFromStart: 7600 },
    'stop_hal': { id: 'stop_hal', name: 'HAL Main Gate', lat: 12.9538, lon: 77.6687, radius_m: 150, distanceFromStart: 11200 },
    'stop_marathahalli': { id: 'stop_marathahalli', name: 'Marathahalli Bridge', lat: 12.9561, lon: 77.7019, radius_m: 150, distanceFromStart: 15400 },
    'stop_itpl': { id: 'stop_itpl', name: 'ITPL Tech Park (Whitefield)', lat: 12.9859, lon: 77.7360, radius_m: 150, distanceFromStart: 21500 },

    'stop_silkboard': { id: 'stop_silkboard', name: 'Central Silk Board', lat: 12.9176, lon: 77.6234, radius_m: 150, distanceFromStart: 0 },
    'stop_hsr': { id: 'stop_hsr', name: 'HSR Layout 14th Main', lat: 12.9116, lon: 77.6433, radius_m: 150, distanceFromStart: 2800 },
    'stop_bellandur': { id: 'stop_bellandur', name: 'Bellandur EcoSpace', lat: 12.9260, lon: 77.6762, radius_m: 150, distanceFromStart: 7100 },
    'stop_tinfactory': { id: 'stop_tinfactory', name: 'Tin Factory (KR Puram)', lat: 13.0006, lon: 77.6625, radius_m: 150, distanceFromStart: 16500 },
    'stop_hebbal': { id: 'stop_hebbal', name: 'Hebbal Bus Station', lat: 13.0358, lon: 77.5970, radius_m: 150, distanceFromStart: 26500 }
  },

  // Active BMTC Buses Telemetry
  buses: {
    'bus_14': {
      id: 'bus_14',
      number: '216-J',
      regNo: 'KA-42-F-3388',
      fleetType: 'BMTC Campus Suvarna',
      routeId: 'route_216j',
      driverId: 'drv_01',
      driverName: 'Kishore Kumar',
      driverPhone: '+91 98451 99201',
      accessible: true,
      capacity: 52,
      lat: 12.7400,
      lon: 77.4800, // Approaching Jain University
      heading: 205,
      speed: 38,
      rollingSpeed: 36,
      trafficFactor: 1.02,
      progressIndex: 0.72,
      currentStopIndex: 3,
      status: 'running',
      delayMinutes: 0,
      delayReason: null,
      lastPingTimestamp: Date.now(),
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'seats',
      occupancyVotes: [
        { level: 'seats', isConductor: true, time: Date.now() - 30000 }
      ],
      tripStartTime: '08:15 AM'
    },
    'bus_7': {
      id: 'bus_7',
      number: '500-D',
      regNo: 'KA-57-F-1204',
      fleetType: 'BMTC Electric AC',
      routeId: 'route_500d',
      driverId: 'drv_02',
      driverName: 'Manjunath K',
      driverPhone: '+91 98452 88910',
      accessible: true,
      capacity: 48,
      lat: 12.9260,
      lon: 77.6762, // Bellandur EcoSpace
      heading: 45,
      speed: 22,
      rollingSpeed: 20,
      trafficFactor: 1.35,
      progressIndex: 0.35,
      currentStopIndex: 2,
      status: 'delayed',
      delayMinutes: 8,
      delayReason: 'traffic',
      lastPingTimestamp: Date.now() - 3000,
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'standing',
      occupancyVotes: [
        { level: 'standing', isConductor: true, time: Date.now() - 40000 }
      ],
      tripStartTime: '08:10 AM'
    },
    'bus_21': {
      id: 'bus_21',
      number: '365',
      regNo: 'KA-01-F-7812',
      fleetType: 'BMTC Green Line',
      routeId: 'route_365',
      driverId: 'drv_03',
      driverName: 'Venkatesh B',
      driverPhone: '+91 98453 55670',
      accessible: true,
      capacity: 52,
      lat: 12.9176,
      lon: 77.6234, // Silk Board
      heading: 160,
      speed: 30,
      rollingSpeed: 28,
      trafficFactor: 1.0,
      progressIndex: 0.45,
      currentStopIndex: 4,
      status: 'running',
      delayMinutes: 0,
      delayReason: null,
      lastPingTimestamp: Date.now() - 1000,
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'seats',
      occupancyVotes: [],
      tripStartTime: '08:15 AM'
    },
    'bus_99': {
      id: 'bus_99',
      number: '99-R',
      regNo: 'KA-01-FA-8899',
      fleetType: 'BMTC Standby Rescue',
      routeId: null,
      driverId: 'drv_rescue',
      driverName: 'Anand Kumar',
      driverPhone: '+91 98450 99999',
      accessible: true,
      capacity: 55,
      lat: 12.9634,
      lon: 77.6385, // Domlur BMTC Depot
      heading: 0,
      speed: 0,
      rollingSpeed: 0,
      trafficFactor: 1.0,
      progressIndex: 0,
      currentStopIndex: 0,
      status: 'standby',
      delayMinutes: 0,
      delayReason: null,
      lastPingTimestamp: Date.now(),
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'seats',
      occupancyVotes: [],
      tripStartTime: null
    }
  },

  // Proximity Alerts Set by Commuter
  activeAlerts: [
    {
      id: 'alt_01',
      busId: 'bus_14',
      stopId: 'stop_itpl', // ITPL Tech Park
      triggerType: 'minutes',
      triggerValue: 5,
      lastSent: false
    }
  ],

  // System Announcements Board
  announcements: [
    {
      id: 'ann_1',
      title: 'Outer Ring Road (ORR) Advisory',
      message: 'Route 500-D operating with +8 min delay near Bellandur EcoSpace due to metro pillar work.',
      reasonTag: 'traffic',
      createdAt: 'Today, 08:10 AM',
      active: true
    },
    {
      id: 'ann_2',
      title: 'Whitefield Corridor Transit',
      message: 'All Route 335-E Volvo services running with real-time GPS tracking between Majestic and ITPL.',
      reasonTag: 'schedule',
      createdAt: 'Today, 07:45 AM',
      active: true
    }
  ],

  // Lost and Found Bus Ledger
  lostAndFound: [
    {
      id: 'lf_01',
      busNumber: '335-E',
      tripTime: '08:00 AM Trip (Old Airport Rd)',
      item: 'Black Laptop Sleeve with Tech Park ID card',
      date: 'Today',
      status: 'held_at_office',
      reportedBy: 'Driver Ramesh Gowda'
    },
    {
      id: 'lf_02',
      busNumber: '500-D',
      tripTime: 'Yesterday, 06:15 PM',
      item: 'Blue Decathlon Umbrella',
      date: 'Yesterday',
      status: 'returned',
      reportedBy: 'Conductor'
    }
  ],

  // Breakdown & Rescue Event State
  breakdownEvent: null,

  // Event Bus for reactive rendering
  events: new EventEmitter()
};

// State Mutators & Actions
export function setView(viewName) {
  state.activeView = viewName;
  state.events.emit('view:changed', viewName);
}

export function setLanguage(lang) {
  state.language = lang;
  state.events.emit('language:changed', lang);
}

export function setMapStyle(style) {
  state.mapStyle = style;
  state.events.emit('mapStyle:changed', style);
}

export function toggleLargeText() {
  state.largeText = !state.largeText;
  document.body.classList.toggle('large-text-mode', state.largeText);
  state.events.emit('display:changed', { largeText: state.largeText });
}

export function toggleLowDataMode() {
  state.lowDataMode = !state.lowDataMode;
  document.body.classList.toggle('low-data-mode', state.lowDataMode);
  state.events.emit('display:changed', { lowDataMode: state.lowDataMode });
}

export function setScheduleMode(mode) {
  state.scheduleMode = mode;
  state.events.emit('schedule:changed', mode);
}

export function updateBusTelemetry(busId, updates) {
  if (!state.buses[busId]) return;
  Object.assign(state.buses[busId], updates);
  state.buses[busId].lastPingTimestamp = Date.now();
  state.events.emit('bus:updated', state.buses[busId]);
}

export function triggerDriverBreakdown(busId, reason = 'Engine coolant issue') {
  const bus = state.buses[busId];
  if (!bus) return;
  bus.status = 'breakdown';
  bus.speed = 0;
  bus.delayReason = 'breakdown';
  state.breakdownEvent = {
    busId,
    busNumber: bus.number,
    routeId: bus.routeId,
    location: { lat: bus.lat, lon: bus.lon },
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reason,
    rescueAssigned: false
  };
  state.events.emit('breakdown:triggered', state.breakdownEvent);
}

export function assignRescueBus(rescueBusId, targetRouteId) {
  const rescueBus = state.buses[rescueBusId];
  if (!rescueBus) return;
  rescueBus.status = 'running';
  rescueBus.routeId = targetRouteId;
  rescueBus.speed = 36;
  if (state.breakdownEvent) {
    state.breakdownEvent.rescueAssigned = true;
    state.breakdownEvent.rescueBusId = rescueBusId;
  }
  state.events.emit('rescue:dispatched', { rescueBusId, targetRouteId });
}

export function voteOccupancy(busId, level, isConductor = false) {
  const bus = state.buses[busId];
  if (!bus) return;
  if (isConductor) {
    bus.occupancyLevel = level;
    bus.occupancyVotes.unshift({ level, isConductor: true, time: Date.now() });
  } else {
    bus.occupancyVotes.unshift({ level, isConductor: false, time: Date.now() });
    const recent = bus.occupancyVotes
      .filter(v => Date.now() - v.time < 10 * 60 * 1000)
      .slice(0, 3);
    const counts = { seats: 0, standing: 0, full: 0 };
    recent.forEach(v => counts[v.level]++);
    if (counts.full >= 2) bus.occupancyLevel = 'full';
    else if (counts.standing >= 2) bus.occupancyLevel = 'standing';
    else if (counts.seats >= 2) bus.occupancyLevel = 'seats';
    else bus.occupancyLevel = level;
  }
  state.events.emit('bus:updated', bus);
}
