// Core Logic & Algorithmic Engine matching Section 7 of Blueprint

export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Section 7.1 Arrival prediction (ETA)
 * ETA = (remaining_distance / rolling_5min_speed) * traffic_factor + dwell_time_of_stops_before_it
 * 
 * @param {number} remainingDistanceMeters 
 * @param {number} rollingSpeedKmh 
 * @param {number} trafficFactor 
 * @param {number} stopsBeforeCount 
 * @param {number} dwellTimePerStopSeconds 
 * @returns {object} { etaMinutes, confidenceMin, confidenceMax, formatted }
 */
export function calculateETA(
  remainingDistanceMeters,
  rollingSpeedKmh = 25,
  trafficFactor = 1.0,
  stopsBeforeCount = 0,
  dwellTimePerStopSeconds = 30
) {
  // Speed safety floor of 5 km/h as per section 7.8 pseudocode
  const effectiveSpeedKmh = Math.max(5, rollingSpeedKmh);
  const speedMetersPerSec = (effectiveSpeedKmh * 1000) / 3600;

  // Travel time in seconds
  const travelTimeSeconds = (remainingDistanceMeters / speedMetersPerSec) * trafficFactor;
  // Dwell time added by intermediate stops
  const totalDwellSeconds = stopsBeforeCount * dwellTimePerStopSeconds;
  
  const totalEtaSeconds = travelTimeSeconds + totalDwellSeconds;
  const etaMinutesExact = totalEtaSeconds / 60;
  const etaMinutesRounded = Math.max(1, Math.round(etaMinutesExact));

  // Section 6: ETA confidence range (e.g. 11 min (9 to 13))
  // Range widens when trafficFactor > 1.1 or speed is erratic
  const variance = Math.max(1, Math.round(etaMinutesRounded * 0.18 * trafficFactor));
  const confidenceMin = Math.max(1, etaMinutesRounded - variance);
  const confidenceMax = etaMinutesRounded + variance;

  return {
    exactMinutes: etaMinutesExact,
    roundedMinutes: etaMinutesRounded,
    confidenceMin,
    confidenceMax,
    displayString: `${etaMinutesRounded} min (${confidenceMin} to ${confidenceMax})`
  };
}

/**
 * Section 7.2 Delay status colors
 * Under 5 min late: Emerald (On time)
 * 5 to 15 min late: Amber (Delayed)
 * Over 15 min late: Red (Severely delayed)
 */
export function getDelayStatus(delayMinutes) {
  if (delayMinutes < 5) {
    return {
      color: '#10B981',
      glow: 'glow-emerald',
      label: 'On time',
      action: 'None',
      badgeClass: 'emerald',
      statusKey: 'on_time'
    };
  } else if (delayMinutes <= 15) {
    return {
      color: '#F59E0B',
      glow: 'glow-amber',
      label: 'Delayed',
      action: 'Show delay reason, notify subscribers',
      badgeClass: 'amber',
      statusKey: 'delayed'
    };
  } else {
    return {
      color: '#EF4444',
      glow: 'glow-coral',
      label: 'Severely delayed',
      action: 'Alert admin, suggest backup bus',
      badgeClass: 'coral',
      statusKey: 'severely_delayed'
    };
  }
}

/**
 * Section 7.3 Catch-probability (walk vs bus)
 * buffer = bus_ETA - walking_time - 1 min safety
 * Walking time = distance to stop / about 80 m per minute
 */
export function calculateCatchProbability(busEtaMinutes, walkingDistanceMeters) {
  const WALKING_SPEED_METERS_PER_MIN = 80;
  const walkingTimeMinutes = Math.max(1, Math.round(walkingDistanceMeters / WALKING_SPEED_METERS_PER_MIN));
  const SAFETY_BUFFER_MIN = 1;

  const buffer = busEtaMinutes - walkingTimeMinutes - SAFETY_BUFFER_MIN;

  if (buffer >= 3) {
    return {
      category: 'safe',
      color: '#10B981',
      glow: 'glow-emerald',
      message: `Walk normally (${buffer} min buffer)`,
      subtext: `ETA ${busEtaMinutes} min vs ${walkingTimeMinutes} min walk`,
      icon: 'walk'
    };
  } else if (buffer >= 0) {
    return {
      category: 'hurry',
      color: '#F59E0B',
      glow: 'glow-amber',
      message: `Hurry up! (${buffer} min buffer)`,
      subtext: `ETA ${busEtaMinutes} min vs ${walkingTimeMinutes} min walk`,
      icon: 'zap'
    };
  } else {
    return {
      category: 'missed',
      color: '#EF4444',
      glow: 'glow-coral',
      message: `Missed - next bus in 20 min`,
      subtext: `ETA ${busEtaMinutes} min, walk is ${walkingTimeMinutes} min`,
      icon: 'alert-triangle'
    };
  }
}

/**
 * Section 7.5 Stop arrival and geofence check
 * Bus inside circle (150m) and slower than 10 km/h = arrived
 */
export function checkGeofenceArrival(busLat, busLon, stopLat, stopLon, currentSpeedKmh, radiusMeters = 150) {
  const distance = calculateDistanceMeters(busLat, busLon, stopLat, stopLon);
  const isInside = distance <= radiusMeters;
  const isArrived = isInside && currentSpeedKmh < 10;
  return { distance, isInside, isArrived };
}

/**
 * Section 7.6 Lost-signal handling
 * No GPS ping for 15s: "Estimated position" label
 * No GPS ping for 120s: "Signal lost" badge + fall back to timetable
 */
export function evaluateSignalState(lastPingTimestamp) {
  const elapsedSec = (Date.now() - lastPingTimestamp) / 1000;
  if (elapsedSec > 120) {
    return { status: 'lost', label: 'Signal lost', fallbackTimetable: true };
  } else if (elapsedSec > 15) {
    return { status: 'estimated', label: 'Estimated position', fallbackTimetable: false };
  }
  return { status: 'live', label: 'LIVE', fallbackTimetable: false };
}

