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
        [12.9156, 77.57358],
        [12.9178, 77.57345],
        [12.91758, 77.57408],
        [12.91697, 77.57364],
        [12.91537, 77.5737],
        [12.9114, 77.57293],
        [12.9019, 77.57352],
        [12.89948, 77.57286],
        [12.89736, 77.57142],
        [12.89333, 77.56764],
        [12.88841, 77.56219],
        [12.88707, 77.56041],
        [12.88488, 77.55383],
        [12.88318, 77.54772],
        [12.88274, 77.5471],
        [12.876, 77.54415],
        [12.87518, 77.54326],
        [12.87433, 77.54139],
        [12.87325, 77.53997],
        [12.86442, 77.53301],
        [12.86244, 77.53048],
        [12.85745, 77.52734],
        [12.85349, 77.52335],
        [12.85192, 77.52258],
        [12.84906, 77.52222],
        [12.84228, 77.51767],
        [12.83875, 77.51684],
        [12.837, 77.51615],
        [12.83426, 77.51405],
        [12.82931, 77.51278],
        [12.82799, 77.5128],
        [12.82493, 77.51376],
        [12.82305, 77.51399],
        [12.82135, 77.51451],
        [12.82038, 77.51411],
        [12.8201, 77.51284],
        [12.81977, 77.51241],
        [12.81718, 77.51136],
        [12.81655, 77.51135],
        [12.81436, 77.51201],
        [12.81257, 77.51203],
        [12.81164, 77.51186],
        [12.80938, 77.51072],
        [12.80465, 77.51059],
        [12.80422, 77.51033],
        [12.80379, 77.50931],
        [12.79974, 77.50828],
        [12.79836, 77.50758],
        [12.79728, 77.50601],
        [12.7966, 77.50546],
        [12.79446, 77.50542],
        [12.7908, 77.50469],
        [12.78471, 77.50189],
        [12.7828, 77.50022],
        [12.77904, 77.49479],
        [12.77516, 77.49268],
        [12.7702, 77.49138],
        [12.76946, 77.49079],
        [12.76837, 77.48908],
        [12.76736, 77.4883],
        [12.75381, 77.48454],
        [12.75226, 77.48467],
        [12.75005, 77.48601],
        [12.74568, 77.48779],
        [12.74308, 77.48825],
        [12.73828, 77.48844],
        [12.7281, 77.48713],
        [12.72572, 77.48562],
        [12.72303, 77.48435],
        [12.71795, 77.48248],
        [12.71563, 77.48237],
        [12.71267, 77.48148],
        [12.71022, 77.48203],
        [12.70669, 77.48207],
        [12.703, 77.48095],
        [12.69891, 77.47901],
        [12.69737, 77.47793],
        [12.69581, 77.47595],
        [12.69423, 77.47155],
        [12.69335, 77.47029],
        [12.69142, 77.4687],
        [12.67321, 77.46274],
        [12.67199, 77.46215],
        [12.67115, 77.46118],
        [12.66963, 77.45831],
        [12.66759, 77.45604],
        [12.65868, 77.44482],
        [12.65044, 77.43919],
        [12.64226, 77.43692],
        [12.64008, 77.43522],
        [12.63772, 77.43436],
        [12.63565, 77.43293],
        [12.63386, 77.43225],
        [12.62806, 77.43103],
        [12.62174, 77.43202],
        [12.62091, 77.43246],
        [12.61963, 77.43368],
        [12.61827, 77.43407],
        [12.61818, 77.43805],
        [12.61828, 77.43831],
        [12.61953, 77.43904],
        [12.62079, 77.44038],
        [12.6232, 77.44177],
        [12.62425, 77.44366],
        [12.62532, 77.44462],
        [12.62558, 77.4461],
        [12.62749, 77.44629],
        [12.62851, 77.44613],
        [12.62858, 77.44569],
        [12.62936, 77.44526],
        [12.62982, 77.44463],
        [12.63206, 77.44406],
        [12.63216, 77.44319],
        [12.63292, 77.44228],
        [12.63414, 77.44136],
        [12.63527, 77.4409],
        [12.63631, 77.44],
        [12.6383, 77.43944],
        [12.64048, 77.4373],
        [12.64087, 77.43658],
        [12.64048, 77.4373],
        [12.6383, 77.43944],
        [12.63631, 77.44],
        [12.63527, 77.4409],
        [12.63414, 77.44136],
        [12.63292, 77.44228],
        [12.63216, 77.44319],
        [12.63206, 77.44406],
        [12.62982, 77.44463],
        [12.62936, 77.44526],
        [12.62858, 77.44569],
        [12.62851, 77.44613],
        [12.62749, 77.44629],
        [12.62558, 77.4461],
        [12.62532, 77.44462],
        [12.62425, 77.44366],
        [12.6232, 77.44177],
        [12.62079, 77.44038],
        [12.61953, 77.43904],
        [12.61828, 77.43831],
        [12.61827, 77.43407],
        [12.60913, 77.43523],
        [12.60235, 77.43452],
        [12.5969, 77.43439],
        [12.59409, 77.43371],
        [12.59695, 77.43427],
        [12.60235, 77.43443],
        [12.60291, 77.43346],
        [12.60337, 77.43358],
        [12.60428, 77.43295],
        [12.60586, 77.43255]
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
        [12.97738, 77.57239],
        [12.97734, 77.57098],
        [12.97592, 77.57102],
        [12.97477, 77.57076],
        [12.97456, 77.57231],
        [12.97383, 77.57291],
        [12.97314, 77.57488],
        [12.9736, 77.57524],
        [12.97284, 77.57722],
        [12.97332, 77.57755],
        [12.9719, 77.5807],
        [12.9711, 77.58204],
        [12.96766, 77.58545],
        [12.96693, 77.58736],
        [12.96778, 77.58746],
        [12.96767, 77.58864],
        [12.96573, 77.5896],
        [12.96602, 77.59255],
        [12.96594, 77.59533],
        [12.96683, 77.5948],
        [12.96689, 77.59499],
        [12.96523, 77.59591],
        [12.96495, 77.59702],
        [12.96419, 77.59666],
        [12.9637, 77.59771],
        [12.96335, 77.59756],
        [12.96225, 77.59904],
        [12.96285, 77.59967],
        [12.96363, 77.60112],
        [12.96315, 77.60129],
        [12.96282, 77.60319],
        [12.96474, 77.60369],
        [12.96474, 77.6051],
        [12.9644, 77.60671],
        [12.96608, 77.60675],
        [12.96777, 77.60632],
        [12.9709, 77.60481],
        [12.97376, 77.61091],
        [12.97444, 77.61111],
        [12.97263, 77.61919],
        [12.97302, 77.62173],
        [12.97505, 77.6253],
        [12.96919, 77.62897],
        [12.97169, 77.63598],
        [12.96932, 77.63599],
        [12.9684, 77.63626],
        [12.9667, 77.63714],
        [12.96484, 77.63889],
        [12.96435, 77.63866],
        [12.96407, 77.63909],
        [12.96331, 77.63876],
        [12.96361, 77.63834],
        [12.96232, 77.63763],
        [12.96102, 77.63868],
        [12.95962, 77.6509],
        [12.95911, 77.65929],
        [12.95933, 77.66098],
        [12.95923, 77.66226],
        [12.95847, 77.6664],
        [12.95706, 77.66631],
        [12.95848, 77.6663],
        [12.95786, 77.67244],
        [12.95719, 77.6744],
        [12.95451, 77.68013],
        [12.95515, 77.6878],
        [12.95713, 77.69922],
        [12.95687, 77.70435],
        [12.95655, 77.70432],
        [12.95685, 77.70172],
        [12.95582, 77.70177],
        [12.95582, 77.70158],
        [12.95607, 77.70145],
        [12.95582, 77.70177],
        [12.95685, 77.70172],
        [12.95704, 77.6992],
        [12.95657, 77.6964],
        [12.95713, 77.69922],
        [12.9558, 77.71699],
        [12.956, 77.72814],
        [12.95627, 77.73172],
        [12.9571, 77.73687],
        [12.95701, 77.74335],
        [12.95674, 77.74476],
        [12.9571, 77.7456],
        [12.96123, 77.7476],
        [12.96775, 77.74952],
        [12.97469, 77.75055],
        [12.98364, 77.75224],
        [12.98624, 77.74527],
        [12.98753, 77.74019],
        [12.98753, 77.73671],
        [12.98729, 77.73671],
        [12.98726, 77.73702],
        [12.98667, 77.73702],
        [12.98665, 77.73601]
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
        [12.91722, 77.62284],
        [12.91033, 77.62709],
        [12.91191, 77.63244],
        [12.91249, 77.63241],
        [12.91234, 77.63813],
        [12.91144, 77.63807],
        [12.91142, 77.63954],
        [12.91144, 77.63807],
        [12.91612, 77.63816],
        [12.91649, 77.63947],
        [12.91753, 77.64108],
        [12.92183, 77.64466],
        [12.92365, 77.64666],
        [12.92425, 77.64776],
        [12.92454, 77.65018],
        [12.9243, 77.65198],
        [12.9236, 77.65539],
        [12.92195, 77.66024],
        [12.92085, 77.66517],
        [12.92472, 77.67383],
        [12.93012, 77.68498],
        [12.93396, 77.68941],
        [12.9344, 77.68973],
        [12.93465, 77.68954],
        [12.93461, 77.68909],
        [12.93465, 77.68954],
        [12.9344, 77.68973],
        [12.93492, 77.69046],
        [12.93887, 77.69464],
        [12.94316, 77.69736],
        [12.94794, 77.69902],
        [12.95656, 77.701],
        [12.96519, 77.70204],
        [12.96697, 77.70203],
        [12.96851, 77.70134],
        [12.98972, 77.68843],
        [13.00014, 77.68114],
        [13.00033, 77.67997],
        [12.99998, 77.67644],
        [12.99526, 77.66592],
        [12.99565, 77.66621],
        [12.99811, 77.67154],
        [12.99842, 77.6715],
        [12.99826, 77.67098],
        [12.99842, 77.6715],
        [12.99814, 77.67159],
        [13.00042, 77.67651],
        [13.00016, 77.67663],
        [12.99992, 77.67635],
        [12.99724, 77.67054],
        [12.99548, 77.66618],
        [12.99551, 77.66541],
        [12.99592, 77.66496],
        [12.99831, 77.66359],
        [13.00372, 77.66307],
        [13.00202, 77.65979],
        [13.00358, 77.65765],
        [13.00434, 77.65562],
        [13.00458, 77.6541],
        [13.00531, 77.65327],
        [13.00637, 77.6473],
        [13.00645, 77.64518],
        [13.00881, 77.64576],
        [13.00995, 77.6445],
        [13.00912, 77.64334],
        [13.01393, 77.64242],
        [13.01412, 77.63792],
        [13.01509, 77.63107],
        [13.01609, 77.62928],
        [13.01494, 77.62855],
        [13.01457, 77.62714],
        [13.01547, 77.62762],
        [13.02156, 77.62875],
        [13.02338, 77.62948],
        [13.02445, 77.63026],
        [13.02538, 77.63047],
        [13.02692, 77.62029],
        [13.02845, 77.6206],
        [13.02836, 77.6196],
        [13.02784, 77.61895],
        [13.02769, 77.61757],
        [13.02792, 77.61689],
        [13.02884, 77.61587],
        [13.02871, 77.61572],
        [13.0279, 77.61619],
        [13.02649, 77.61443],
        [13.02935, 77.61],
        [13.02985, 77.60843],
        [13.03005, 77.60849],
        [13.03015, 77.60805],
        [13.02926, 77.60753],
        [13.0299, 77.60472],
        [13.03486, 77.60465],
        [13.03513, 77.6021],
        [13.03503, 77.60066],
        [13.0358, 77.59701]
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
      lon: 77.4780, // Approaching Jain University along NH 948
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
