// Google Maps Controller for Bangalore BMTC Bus Network with 60fps Gliding Markers
export class CampusMapController {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.currentTileLayer = null;
    this.currentStyle = 'google-dark'; // 'google-dark' | 'google-satellite' | 'google-standard'
    this.busMarkers = {};
    this.routePolylines = {};
    this.stopMarkers = {};
    this.geofenceCircles = {};
    this.targetPositions = {};
    this.animationFrameId = null;
    this.selectedBusId = 'bus_14';
  }

  init(initialLat = 12.9650, initialLon = 77.6500, initialZoom = 13) {
    if (this.map) return;

    // Initialize map centered on Bangalore transit corridor (Old Airport Road & IT Corridor)
    this.map = L.map(this.containerId, {
      center: [initialLat, initialLon],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Apply Google Maps Tile Layer
    this.setGoogleMapStyle(this.currentStyle);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Google Maps watermark badge at bottom left
    const googleBadge = L.control({ position: 'bottomleft' });
    googleBadge.onAdd = () => {
      const div = L.DomUtil.create('div', 'google-maps-attribution');
      div.innerHTML = `
        <div class="px-2 py-1 rounded bg-[#111827]/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md">
          <span class="font-bold text-white tracking-tight">Google</span>
          <span class="text-slate-400">Maps</span>
          <span class="text-slate-600">•</span>
          <span class="text-emerald-400 font-mono">Bangalore BMTC</span>
        </div>
      `;
      return div;
    };
    googleBadge.addTo(this.map);

    // Start 60fps interpolation loop
    this.startGlideLoop();
  }

  setGoogleMapStyle(style) {
    this.currentStyle = style;
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    let tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    let className = 'google-map-tile';

    if (style === 'google-dark') {
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      className = 'google-map-tile google-maps-dark';
    } else if (style === 'google-satellite') {
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      className = 'google-map-tile';
    } else if (style === 'google-standard') {
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      className = 'google-map-tile';
    }

    this.currentTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3'],
      className: className,
      attribution: '&copy; Google Maps &copy; BMTC Bangalore'
    }).addTo(this.map);
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }

  drawRoutes(routes) {
    routes.forEach(route => {
      if (this.routePolylines[route.id]) {
        this.map.removeLayer(this.routePolylines[route.id]);
      }
      
      const polyline = L.polyline(route.path, {
        color: route.color || '#6366F1',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'route-line-glow'
      }).addTo(this.map);

      this.routePolylines[route.id] = polyline;
    });
  }

  drawStops(stops, onStopClick) {
    Object.values(stops).forEach(stop => {
      // 150m geofence circle
      if (!this.geofenceCircles[stop.id]) {
        const circle = L.circle([stop.lat, stop.lon], {
          radius: stop.radius_m || 150,
          color: 'rgba(99, 102, 241, 0.25)',
          fillColor: 'rgba(99, 102, 241, 0.06)',
          fillOpacity: 0.3,
          weight: 1,
          dashArray: '4, 4'
        }).addTo(this.map);
        this.geofenceCircles[stop.id] = circle;
      }

      // Stop pin
      if (!this.stopMarkers[stop.id]) {
        const customIcon = L.divIcon({
          className: 'custom-stop-icon',
          html: `
            <div class="group relative flex items-center justify-center cursor-pointer" title="${stop.name}">
              <div class="stop-pin" id="pin-${stop.id}"></div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#111827] border border-[#1F2937] text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none opacity-90 font-medium">
                ${stop.name}
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([stop.lat, stop.lon], { icon: customIcon }).addTo(this.map);
        marker.on('click', () => {
          if (onStopClick) onStopClick(stop);
        });
        this.stopMarkers[stop.id] = marker;
      }
    });
  }

  updateBusMarker(bus, onClick) {
    const isSelected = bus.id === this.selectedBusId;
    const isDelayed = bus.status === 'delayed';
    const isBreakdown = bus.status === 'breakdown';
    const isEstimated = bus.isEstimated;

    let statusClass = '';
    if (isBreakdown) statusClass = 'breakdown';
    else if (isDelayed) statusClass = 'delayed';
    else if (isEstimated) statusClass = 'estimated';

    const beamOpacity = isBreakdown ? '0' : '1';

    // SVG Capsule Marker with Direction Beam
    const markerHtml = `
      <div class="bus-marker-container" style="transform: rotate(${bus.heading}deg);">
        <div class="bus-beam" style="opacity: ${beamOpacity};"></div>
        <div class="bus-capsule ${statusClass} ${isSelected ? 'ring-2 ring-indigo-400' : ''}" style="transform: rotate(-${bus.heading}deg);">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isBreakdown ? 'bg-red-500 animate-ping' : (isDelayed ? 'bg-amber-400' : 'bg-emerald-400')}"></span>
            <span class="font-bold text-xs text-white tracking-wide">${bus.number}</span>
          </div>
          <span class="text-[10px] text-slate-300 font-mono">${bus.speed} km/h</span>
        </div>
      </div>
    `;

    if (!this.busMarkers[bus.id]) {
      const icon = L.divIcon({
        className: 'bus-leaflet-icon',
        html: markerHtml,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
      });

      const marker = L.marker([bus.lat, bus.lon], { icon }).addTo(this.map);
      marker.on('click', () => {
        this.selectedBusId = bus.id;
        if (onClick) onClick(bus);
      });

      this.busMarkers[bus.id] = marker;
      this.targetPositions[bus.id] = {
        lat: bus.lat,
        lon: bus.lon,
        currentLat: bus.lat,
        currentLon: bus.lon,
        heading: bus.heading,
        bus
      };
    } else {
      const target = this.targetPositions[bus.id];
      target.lat = bus.lat;
      target.lon = bus.lon;
      target.heading = bus.heading;
      target.bus = bus;

      const icon = L.divIcon({
        className: 'bus-leaflet-icon',
        html: markerHtml,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
      });
      this.busMarkers[bus.id].setIcon(icon);
    }
  }

  // Smooth 60fps gliding interpolation
  startGlideLoop() {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const frame = () => {
      Object.keys(this.targetPositions).forEach(busId => {
        const item = this.targetPositions[busId];
        const marker = this.busMarkers[busId];
        if (!marker) return;

        item.currentLat = lerp(item.currentLat, item.lat, 0.12);
        item.currentLon = lerp(item.currentLon, item.lon, 0.12);

        marker.setLatLng([item.currentLat, item.currentLon]);
      });

      this.animationFrameId = requestAnimationFrame(frame);
    };

    this.animationFrameId = requestAnimationFrame(frame);
  }

  panToBus(busId) {
    const target = this.targetPositions[busId];
    if (target && this.map) {
      this.map.panTo([target.currentLat, target.currentLon], { animate: true, duration: 0.8 });
    }
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.map) this.map.remove();
  }
}
