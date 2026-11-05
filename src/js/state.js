// Centralized Reactive State Store matching Section 9 Data Model

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

// Realistic campus coordinates (centred on a sprawling modern university campus)
const CAMPUS_BASE_LAT = 12.9716;
const CAMPUS_BASE_LON = 77.5946;

export const state = {
  activeView: 'commuter', // 'commuter' | 'driver' | 'admin' | 'gate'
  language: 'en',
  largeText: false,
  lowDataMode: false,
  
  // Current user (Student commuter by default)
  currentUser: {
    id: 'usr_st_4091',
    name: 'Aarav Patel',
    role: 'student',
    rollNo: '23CS0482',
    department: 'Computer Science & Engineering',
    homeStopId: 'stop_1', // Hostel Block A
    targetStopId: 'stop_5', // Gate 2 (or Main Campus)
    firstClassTime: '08:30 AM',
    walkingDistanceMeters: 320, // default ~4 mins walk
    pass: {
      id: 'PASS-FALL-2026-8831',
      validFrom: '2026-08-01',
      validTo: '2026-12-31',
      feeStatus: 'Active', // 'Active' | 'Expired'
      qrToken: 'CAMPUS-PASS:usr_st_4091:ROUTE14:VALID'
    }
  },

  scheduleMode: 'regular', // 'regular' | 'exam' | 'half-day'
  
  // Available Routes
  routes: [
    {
      id: 'route_14',
      name: 'Route 14 - Hostel to Main Campus',
      shortName: '14',
      color: '#6366F1',
      active: true,
      stops: ['stop_1', 'stop_2', 'stop_3', 'stop_4', 'stop_5', 'stop_6'],
      path: [
        [12.9720, 77.5880], // Stop 1 Hostel Block
        [12.9735, 77.5905],
        [12.9750, 77.5930], // Stop 2 Library Road
        [12.9768, 77.5960],
        [12.9785, 77.5995], // Stop 3 Market Circle
        [12.9810, 77.6025],
        [12.9830, 77.6050], // Stop 4 Bus Depot
        [12.9860, 77.6090], // Stop 5 Gate 2
        [12.9880, 77.6120],
        [12.9905, 77.6150]  // Stop 6 Main Campus Quad
      ]
    },
    {
      id: 'route_7',
      name: 'Route 7 - Metro Station to Tech Complex',
      shortName: '7',
      color: '#10B981',
      active: true,
      stops: ['stop_m1', 'stop_m2', 'stop_m3', 'stop_6'],
      path: [
        [12.9650, 77.5820],
        [12.9700, 77.5900],
        [12.9780, 77.6020],
        [12.9905, 77.6150]
      ]
    },
    {
      id: 'route_21',
      name: 'Route 21 - Faculty Quarters to Medical Center',
      shortName: '21',
      color: '#F59E0B',
      active: true,
      stops: ['stop_f1', 'stop_f2', 'stop_6'],
      path: [
        [12.9600, 77.6000],
        [12.9750, 77.6080],
        [12.9905, 77.6150]
      ]
    }
  ],

  // Stops database with 150m geofence radius
  stops: {
    'stop_1': { id: 'stop_1', name: 'Hostel Block', lat: 12.9720, lon: 77.5880, radius_m: 150, distanceFromStart: 0 },
    'stop_2': { id: 'stop_2', name: 'Library Road', lat: 12.9750, lon: 77.5930, radius_m: 150, distanceFromStart: 850 },
    'stop_3': { id: 'stop_3', name: 'Market Circle', lat: 12.9785, lon: 77.5995, radius_m: 150, distanceFromStart: 1800 },
    'stop_4': { id: 'stop_4', name: 'Bus Depot', lat: 12.9830, lon: 77.6050, radius_m: 150, distanceFromStart: 2700 },
    'stop_5': { id: 'stop_5', name: 'Gate 2', lat: 12.9860, lon: 77.6090, radius_m: 150, distanceFromStart: 3400 },
    'stop_6': { id: 'stop_6', name: 'Main Campus', lat: 12.9905, lon: 77.6150, radius_m: 150, distanceFromStart: 4500 },
    
    'stop_m1': { id: 'stop_m1', name: 'Metro Terminal', lat: 12.9650, lon: 77.5820, radius_m: 150, distanceFromStart: 0 },
    'stop_m2': { id: 'stop_m2', name: 'South Avenue', lat: 12.9700, lon: 77.5900, radius_m: 150, distanceFromStart: 1200 },
    'stop_m3': { id: 'stop_m3', name: 'Tech Park Gate', lat: 12.9780, lon: 77.6020, radius_m: 150, distanceFromStart: 2800 },

    'stop_f1': { id: 'stop_f1', name: 'Faculty Enclave', lat: 12.9600, lon: 77.6000, radius_m: 150, distanceFromStart: 0 },
    'stop_f2': { id: 'stop_f2', name: 'Health Center', lat: 12.9750, lon: 77.6080, radius_m: 150, distanceFromStart: 2100 }
  },

  // Active Buses Telemetry
  buses: {
    'bus_14': {
      id: 'bus_14',
      number: '14',
      regNo: 'KA-01-EQ-9814',
      routeId: 'route_14',
      driverId: 'drv_01',
      driverName: 'Rajesh Kumar',
      driverPhone: '+91 98765 43210',
      accessible: true, // ramp/low floor
      capacity: 52,
      lat: 12.9775,
      lon: 77.5975,
      heading: 42,
      speed: 32, // km/h
      rollingSpeed: 30, // km/h over last 5 min
      trafficFactor: 1.05,
      progressIndex: 0.38, // along route 14
      currentStopIndex: 2, // passed stop 1 & 2, approaching stop 3
      status: 'running', // 'running' | 'delayed' | 'severely_delayed' | 'breakdown' | 'done'
      delayMinutes: 2,
      delayReason: null, // 'traffic' | 'breakdown' | 'rain' | 'event' | 'road work'
      lastPingTimestamp: Date.now(),
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'seats', // 'seats' | 'standing' | 'full'
      occupancyVotes: [
        { level: 'seats', isConductor: false, time: Date.now() - 60000 },
        { level: 'seats', isConductor: true, time: Date.now() - 30000 }
      ],
      tripStartTime: '08:00 AM'
    },
    'bus_7': {
      id: 'bus_7',
      number: '7',
      regNo: 'KA-01-EQ-7707',
      routeId: 'route_7',
      driverId: 'drv_02',
      driverName: 'Suresh Patil',
      driverPhone: '+91 98765 12345',
      accessible: false,
      capacity: 45,
      lat: 12.9720,
      lon: 77.5930,
      heading: 38,
      speed: 28,
      rollingSpeed: 25,
      trafficFactor: 1.25,
      progressIndex: 0.55,
      currentStopIndex: 1,
      status: 'delayed',
      delayMinutes: 8,
      delayReason: 'traffic',
      lastPingTimestamp: Date.now() - 4000,
      isEstimated: false,
      signalLost: false,
      occupancyLevel: 'standing',
      occupancyVotes: [
        { level: 'standing', isConductor: true, time: Date.now() - 40000 }
      ],
      tripStartTime: '08:05 AM'
    },
    'bus_21': {
      id: 'bus_21',
      number: '21',
      regNo: 'KA-01-EQ-2121',
      routeId: 'route_21',
      driverId: 'drv_03',
      driverName: 'Vikram Singh',
      driverPhone: '+91 98765 89012',
      accessible: true,
      capacity: 50,
      lat: 12.9690,
      lon: 77.6040,
      heading: 25,
      speed: 34,
      rollingSpeed: 32,
      trafficFactor: 1.0,
      progressIndex: 0.40,
      currentStopIndex: 1,
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
      number: '99',
      regNo: 'KA-01-EQ-9999',
      routeId: null,
      driverId: 'drv_rescue',
      driverName: 'Anand Verma',
      driverPhone: '+91 98765 99999',
      accessible: true,
      capacity: 55,
      lat: 12.9830,
      lon: 77.6050, // stationed at Bus Depot
      heading: 0,
      speed: 0,
      rollingSpeed: 0,
      trafficFactor: 1.0,
      progressIndex: 0,
      currentStopIndex: 0,
      status: 'standby', // available rescue bus
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
      stopId: 'stop_5', // Gate 2
      triggerType: 'minutes', // 'minutes' | 'km'
      triggerValue: 5, // 5 minutes away
      lastSent: false
    }
  ],

  // System Announcements Board (Page 4 & 8)
  announcements: [
    {
      id: 'ann_1',
      title: 'North Campus Marathon Notice',
      message: 'Route 14 and 7 operating with 5-10 min diversion near Sports Complex.',
      reasonTag: 'event',
      createdAt: 'Today, 07:30 AM',
      active: true
    },
    {
      id: 'ann_2',
      title: 'Exam Week Timetable',
      message: 'Exam shift buses start at 07:15 AM and 01:15 PM from all residential blocks.',
      reasonTag: 'schedule',
      createdAt: 'Yesterday',
      active: true
    }
  ],

  // Lost and Found Bus Ledger (Section 5 & 9)
  lostAndFound: [
    {
      id: 'lf_01',
      busNumber: '14',
      tripTime: '08:00 AM Trip',
      item: 'Black HP Laptop Bag with ID card',
      date: 'Today',
      status: 'held_at_office', // 'held_at_office' | 'returned'
      reportedBy: 'Driver Rajesh Kumar'
    },
    {
      id: 'lf_02',
      busNumber: '7',
      tripTime: 'Yesterday, 05:30 PM',
      item: 'Silver Milton Thermos Flask',
      date: 'Yesterday',
      status: 'returned',
      reportedBy: 'Conductor'
    }
  ],

  // Breakdown & Rescue Event State (Section 7.7)
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

export function triggerDriverBreakdown(busId, reason = 'Engine overheating') {
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
  rescueBus.speed = 35;
  if (state.breakdownEvent) {
    state.breakdownEvent.rescueAssigned = true;
    state.breakdownEvent.rescueBusId = rescueBusId;
  }
  state.events.emit('rescue:dispatched', { rescueBusId, targetRouteId });
}

export function voteOccupancy(busId, level, isConductor = false) {
  const bus = state.buses[busId];
  if (!bus) return;
  // If conductor, override immediately (Section 7.4)
  if (isConductor) {
    bus.occupancyLevel = level;
    bus.occupancyVotes.unshift({ level, isConductor: true, time: Date.now() });
  } else {
    bus.occupancyVotes.unshift({ level, isConductor: false, time: Date.now() });
    // Majority of last 3 reports within last 10 minutes (Section 7.4)
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

