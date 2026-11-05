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
  
  // Current user (Commuter in Bangalore)
  currentUser: {
    id: 'usr_blr_4091',
    name: 'Aarav Patel',
    role: 'student',
    rollNo: '23CS0482',
    department: 'Computer Science & Engineering',
    homeStopId: 'stop_domlur', // Domlur
    targetStopId: 'stop_itpl', // ITPL Tech Park
    firstClassTime: '08:30 AM',
    walkingDistanceMeters: 320, // default ~4 mins walk
    pass: {
      id: 'BMTC-PASS-2026-8831',
      validFrom: '2026-08-01',
      validTo: '2026-12-31',
      feeStatus: 'Active',
      qrToken: 'BMTC-TRANSIT:usr_blr_4091:ROUTE335E:VALID'
    }
  },

  scheduleMode: 'regular', // 'regular' | 'exam' | 'half-day'
  
  // Bangalore BMTC Routes
  routes: [
    {
      id: 'route_335e',
      name: 'Route 335-E: Majestic to ITPL / Kadugodi',
      shortName: '335-E',
      color: '#6366F1',
      active: true,
      stops: [
        'stop_majestic',
        'stop_corporation',
        'stop_richmond',
        'stop_domlur',
        'stop_hal',
        'stop_marathahalli',
        'stop_kundalahalli',
        'stop_itpl',
        'stop_kadugodi'
      ],
      path: [
        [12.9781, 77.5724], // Kempegowda Bus Station (Majestic)
        [12.9757, 77.5804], // Mysore Bank
        [12.9647, 77.5915], // Corporation Circle
        [12.9632, 77.5982], // Richmond Circle
        [12.9731, 77.6083], // Mayo Hall
        [12.9698, 77.6171], // Hosmat / Trinity
        [12.9634, 77.6385], // Domlur (Old Airport Road)
        [12.9587, 77.6481], // Manipal Hospital
        [12.9563, 77.6534], // Murugeshpalya
        [12.9538, 77.6687], // HAL Main Gate
        [12.9561, 77.7019], // Marathahalli Bridge
        [12.9575, 77.7196], // Kundalahalli Gate
        [12.9801, 77.7185], // Graphite India
        [12.9859, 77.7360], // ITPL (International Tech Park Bangalore)
        [12.9798, 77.7516], // Hope Farm Junction
        [12.9957, 77.7585]  // Kadugodi Bus Station
      ]
    },
    {
      id: 'route_500d',
      name: 'Route 500-D: Silk Board to Hebbal (Outer Ring Road)',
      shortName: '500-D',
      color: '#10B981',
      active: true,
      stops: [
        'stop_silkboard',
        'stop_hsr',
        'stop_bellandur',
        'stop_marathahalli',
        'stop_tinfactory',
        'stop_manyata',
        'stop_hebbal'
      ],
      path: [
        [12.9176, 77.6234], // Central Silk Board
        [12.9116, 77.6433], // HSR Layout
        [12.9260, 77.6762], // Bellandur EcoSpace
        [12.9370, 77.6910], // Kadubeesanahalli
        [12.9561, 77.7019], // Marathahalli Bridge
        [12.9850, 77.6850], // Mahadevapura
        [13.0006, 77.6625], // Tin Factory / KR Puram
        [13.0180, 77.6450], // Kasturi Nagar
        [13.0300, 77.6300], // Kalyannagar
        [13.0450, 77.6208], // Manyata Tech Park
        [13.0358, 77.5970]  // Hebbal Bus Station
      ]
    },
    {
      id: 'route_365',
      name: 'Route 365: Majestic to Electronic City Phase 1',
      shortName: '365',
      color: '#F59E0B',
      active: true,
      stops: [
        'stop_majestic',
        'stop_corporation',
        'stop_lalbagh',
        'stop_dairycircle',
        'stop_stjohns',
        'stop_silkboard',
        'stop_ecity'
      ],
      path: [
        [12.9781, 77.5724], // Majestic
        [12.9647, 77.5915], // Corporation
        [12.9507, 77.5848], // Lalbagh Main Gate
        [12.9372, 77.6033], // Dairy Circle
        [12.9298, 77.6186], // St. John's Hospital
        [12.9176, 77.6234], // Silk Board
        [12.8900, 77.6400], // Kudlu Gate
        [12.8452, 77.6602]  // Electronic City Phase 1
      ]
    }
  ],

  // Real Bangalore Bus Stops Database with 150m Geofences
  stops: {
    'stop_majestic': { id: 'stop_majestic', name: 'Kempegowda Bus Station (Majestic)', lat: 12.9781, lon: 77.5724, radius_m: 150, distanceFromStart: 0 },
    'stop_corporation': { id: 'stop_corporation', name: 'Corporation Circle', lat: 12.9647, lon: 77.5915, radius_m: 150, distanceFromStart: 2400 },
    'stop_richmond': { id: 'stop_richmond', name: 'Richmond Circle', lat: 12.9632, lon: 77.5982, radius_m: 150, distanceFromStart: 3200 },
    'stop_domlur': { id: 'stop_domlur', name: 'Domlur (Old Airport Road)', lat: 12.9634, lon: 77.6385, radius_m: 150, distanceFromStart: 7600 },
    'stop_hal': { id: 'stop_hal', name: 'HAL Main Gate', lat: 12.9538, lon: 77.6687, radius_m: 150, distanceFromStart: 11200 },
    'stop_marathahalli': { id: 'stop_marathahalli', name: 'Marathahalli Bridge', lat: 12.9561, lon: 77.7019, radius_m: 150, distanceFromStart: 15400 },
    'stop_kundalahalli': { id: 'stop_kundalahalli', name: 'Kundalahalli Gate', lat: 12.9575, lon: 77.7196, radius_m: 150, distanceFromStart: 17300 },
    'stop_itpl': { id: 'stop_itpl', name: 'ITPL Tech Park (Whitefield)', lat: 12.9859, lon: 77.7360, radius_m: 150, distanceFromStart: 21500 },
    'stop_kadugodi': { id: 'stop_kadugodi', name: 'Kadugodi Bus Station', lat: 12.9957, lon: 77.7585, radius_m: 150, distanceFromStart: 25200 },
    
    'stop_silkboard': { id: 'stop_silkboard', name: 'Central Silk Board', lat: 12.9176, lon: 77.6234, radius_m: 150, distanceFromStart: 0 },
    'stop_hsr': { id: 'stop_hsr', name: 'HSR Layout 14th Main', lat: 12.9116, lon: 77.6433, radius_m: 150, distanceFromStart: 2800 },
    'stop_bellandur': { id: 'stop_bellandur', name: 'Bellandur EcoSpace', lat: 12.9260, lon: 77.6762, radius_m: 150, distanceFromStart: 7100 },
    'stop_tinfactory': { id: 'stop_tinfactory', name: 'Tin Factory (KR Puram)', lat: 13.0006, lon: 77.6625, radius_m: 150, distanceFromStart: 16500 },
    'stop_manyata': { id: 'stop_manyata', name: 'Manyata Tech Park', lat: 13.0450, lon: 77.6208, radius_m: 150, distanceFromStart: 22800 },
    'stop_hebbal': { id: 'stop_hebbal', name: 'Hebbal Bus Station', lat: 13.0358, lon: 77.5970, radius_m: 150, distanceFromStart: 26500 },

    'stop_lalbagh': { id: 'stop_lalbagh', name: 'Lalbagh Main Gate', lat: 12.9507, lon: 77.5848, radius_m: 150, distanceFromStart: 4100 },
    'stop_dairycircle': { id: 'stop_dairycircle', name: 'Dairy Circle', lat: 12.9372, lon: 77.6033, radius_m: 150, distanceFromStart: 6800 },
    'stop_stjohns': { id: 'stop_stjohns', name: "St. John's Hospital", lat: 12.9298, lon: 77.6186, radius_m: 150, distanceFromStart: 9200 },
    'stop_ecity': { id: 'stop_ecity', name: 'Electronic City Toll Gate', lat: 12.8452, lon: 77.6602, radius_m: 150, distanceFromStart: 21000 }
  },

  // Active BMTC Buses Telemetry
  buses: {
    'bus_14': {
      id: 'bus_14',
      number: '335-E',
      regNo: 'KA-01-F-4521',
      fleetType: 'BMTC Volvo Vajra',
      routeId: 'route_335e',
      driverId: 'drv_01',
      driverName: 'Ramesh Gowda',
      driverPhone: '+91 98451 23450',
      accessible: true,
      capacity: 54,
      lat: 12.9561,
      lon: 77.7019, // Marathahalli Bridge
      heading: 65,
      speed: 34,
      rollingSpeed: 30,
      trafficFactor: 1.05,
      progressIndex: 0.62,
      currentStopIndex: 5,
      status: 'running',
      delayMinutes: 2,
      delayReason: null,
      lastPingTimestamp: Date.now(),
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'seats',
      occupancyVotes: [
        { level: 'seats', isConductor: false, time: Date.now() - 60000 },
        { level: 'seats', isConductor: true, time: Date.now() - 30000 }
      ],
      tripStartTime: '08:00 AM'
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
