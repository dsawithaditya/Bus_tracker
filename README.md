# Real-Time Campus Bus Tracking and Arrival Prediction
## Dark-Theme Web Application (Project Blueprint Implementation)

A comprehensive, production-grade real-time campus transit tracking and arrival prediction web app built strictly according to the 10-page project blueprint specification.

---

### 🌟 Key Pillars Implemented

1. **Commuter Web App (Students, Faculty, Staff, Visitors)**
   - **Modern Dark UI**: `#090D16` canvas, `#111827` bento surfaces, `#6366F1` electric indigo accents.
   - **Interactive Dark Map**: Leaflet map with CartoDB Dark Matter tiles, glowing GeoJSON routes, 150m geofence stop circles, and 60fps smoothly gliding SVG bus markers with directional light beams.
   - **"Your Bus Today" Saved Profile Card**: Quick glance for saved home stop, target stop (Gate 2), first class time, and live status.
   - **Smart Arrival Prediction (ETA)**: Implements Section 7.1 mathematical formula:
     $$\text{ETA} = \left(\frac{\text{remaining\_distance}}{\text{rolling\_5min\_speed}}\right) \times \text{traffic\_factor} + \text{dwell\_time\_of\_stops\_before\_it}$$
     Includes confidence intervals (e.g., `11 min (9 to 13)`).
   - **Metro-Style Vertical Route Timeline**: Clear stop progression (passed stops dimmed, current bus marker between stops, minutes to upcoming stops).
   - **Catch-Probability Algorithm (Walk vs Bus)**:
     $$\text{buffer} = \text{bus\_ETA} - \text{walking\_time} - 1\text{ min safety}$$
     Displays:
     - $\ge 3\text{ min}$: `Walk normally (n min buffer)` (Emerald)
     - $0 \le \text{buffer} < 3\text{ min}$: `Hurry up! (n min buffer)` (Amber)
     - $< 0$: `Missed - next bus in 20 min` (Coral)
     Includes an interactive walking distance slider for instant testing.
   - **Live Occupancy Meter**: Shows Seats Available (Green), Standing Only (Amber), and Full Bus (Red), with crowd voting and conductor override.
   - **Proximity Alerts ("Notify Me")**: Time-based (5 min away) or radial geofence (2 km away) triggers with audio chimes.
   - **Digital QR Bus Pass**: Live dynamic timestamp watermark, student details, semester expiry, and fee status check.
   - **Night Shuttle Safe-Drop & Emergency SOS**: Generates 2-hour shareable trip links and triggers immediate dispatch alert.
   - **Lost & Found Bus Ledger**: Search and log lost items tagged by bus and trip time.
   - **Low-Data Mode & Multi-Language**: Text-only ETA board toggle for weak mobile networks, English & Hindi (`हिन्दी`) toggle, and large-text accessibility toggle.

2. **Driver Telemetry App (PWA Cockpit)**
   - High-contrast, tactile cockpit layout with extra-large touch buttons ($\ge 48\text{px}$).
   - One-tap **Start / End Trip** with live GPS streaming.
   - Three quick reports:
     - 🚧 **Traffic Delay** (+5 to 10 min bottleneck)
     - ⚠️ **Breakdown** (instantly alerts route passengers & requests rescue bus)
     - 💺 **Seats Status** (conductor override)
   - Screen Wake Lock API simulation.
   - Vehicle safety pre-trip checklist (Fuel, Tyres, Lights, Brakes).
   - Emergency SOS dispatch.

3. **Fleet Command Center (Transport Admin Dashboard)**
   - Bento grid statistics: Active fleet, on-time percentage (94.2%), delayed count, rescue readiness.
   - **Schedule Mode Switcher**: Instant one-click switch between `Regular`, `Exam Shifts`, and `Half-Day` timetables (recalculates all countdowns across all screens).
   - **Breakdown Rerouting & Rescue Bus Dispatch**: When a breakdown occurs, a high-priority banner recommends the nearest standby bus (Bus 99 at Depot) with 1-click dispatch.
   - **Fleet Notice & Announcements Composer**: Instantly broadcasts alerts and route diversions to all student apps and TV screens.
   - Live telemetry table with real-time status, driver phone numbers, speed, and delay reasons.

4. **Gate Display Screen (Full-Screen TV / Kiosk Display)**
   - High-contrast departures board designed for 1080p / 4K lobby & bus gate displays.
   - Large fonts, Bay / Platform assignments, Scheduled vs Live ETA countdowns, and delay badges.
   - Live scrolling campus notice marquee ticker.

5. **Demo Suite & Automated Test Runner (Sections 11 & 12)**
   - Slide-out drawer containing:
     - **4-Minute Guided Presentation Script**: Step-by-step walkthrough covering the problem, live tracking, traffic delay, proximity alert, catch-probability, breakdown & rescue bus, exam mode, and TV display.
     - **Individual Test Cases T1 through T12**:
       - `T1`: Bus moves normally (gliding marker, dropping ETA)
       - `T2`: Bus speed halves (ETA rises, Amber delay status)
       - `T3`: No GPS for 20s (Marker labeled "Estimated position")
       - `T4`: No GPS for 3 min ("Signal lost" badge + timetable fallback)
       - `T5`: Bus enters 150m stop circle slowly ($< 10\text{ km/h}$) $\to$ logs arrival
       - `T6`: Alert set to 5 min away $\to$ single notification
       - `T7`: Driver taps Breakdown $\to$ subscribers notified & rescue bus suggested
       - `T8`: Mixed occupancy reports $\to$ conductor override
       - `T9`: Walk 4 min with ETA 10 / 5 / 3 min $\to$ Walk normally / Hurry up / Missed
       - `T10`: Exam schedule mode switch $\to$ all countdowns update
       - `T11`: 100+ simulated subscribers load test
       - `T12`: Expired bus pass scan $\to$ access denied

---

### 🚀 Running the Project

Open `http://localhost:3000` in any web browser, or run:
```bash
python -m http.server 3000
```
All assets are self-contained with no external build requirements.

