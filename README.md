# Real-Time Campus Bus Tracking and Arrival Prediction
## Dark-Theme Web Application (Bangalore Transit & Jain University Corridor)

A production-grade, real-time campus transit tracking and arrival prediction web application designed with modern dark UI, 3D container scroll animations, and bilingual localization (English and Hindi).

Repository: [https://github.com/dsawithaditya/Bus_tracker.git](https://github.com/dsawithaditya/Bus_tracker.git)

---

### Project Structure

```text
Bus_tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml                   # Automated GitHub Pages CI/CD workflow
├── components/
│   ├── ui/
│   │   └── container-scroll-animation.tsx # Aceternity UI 3D Scroll component
│   └── demo.tsx                         # Component demo walkthrough
├── lib/
│   └── utils.ts                         # shadcn cn() classname merger utility
├── src/
│   ├── css/
│   │   └── style.css                    # Bento grid dark theme & 3D perspective styles
│   └── js/
│       ├── admin-view.js                # Fleet dispatch command console
│       ├── animations.js                # 3D Container scroll & micro-interactions
│       ├── app.js                       # Main application bootstrapper & GPS engine
│       ├── commuter-view.js             # Student commuter arrival deck & tools
│       ├── demo-suite.js                # Automated test runner (T1–T12)
│       ├── driver-view.js               # 2-Column driver telemetry cockpit
│       ├── eta-engine.js                # Traffic-adjusted ETA math & catch probability
│       ├── gate-display-view.js         # Full-screen TV departures board
│       ├── map-controller.js            # Leaflet & Google Maps tile controller
│       ├── modals.js                    # Modal dialogs & Web Audio chimes
│       ├── state.js                     # Reactive centralized state store
│       └── translations.js              # Bilingual English / Hindi localization engine
├── components.json                      # Official shadcn UI configuration file
├── index.html                           # Main web application entry point
├── package.json                         # Scripts & npm dependencies
├── tailwind.config.js                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
└── README.md                            # Documentation
```

---

### Key Capabilities

1. **Active Bangalore Corridor (Route 216-J)**
   - High-density highway coordinates along **Kanakapura Road (NH 948)** curving accurately along the road line:
     *Banashankari TTMC -> Konanakunte Cross -> Silk Institute Metro -> Purva Highlands -> KSIT -> Thalaghattapura -> Dayananda Sagar (DSATM) -> Guhantara -> Kaggalipura -> Art of Living -> Jain University Global Campus -> Harohalli*.
   - Live 60fps bus position interpolation updated every 3 seconds.

2. **Commuter Deck & Smart Predictions**
   - **Traffic-Adjusted ETA Formula**:
     $$\text{ETA} = \left(\frac{\text{remaining\_distance}}{\text{rolling\_speed}}\right) \times \text{traffic\_factor} + \text{dwell\_time}$$
   - **Catch-Probability Algorithm (Walk vs. Bus)**: Compares your walking distance against live bus arrival time to indicate whether to walk normally or hurry up.
   - **Quick Tools Toolbar**: Proximity arrival alarms (5 min away), Digital QR Bus Pass, Lost & Found repository ledger, and Safety SOS dispatch.

3. **Driver Telemetry Cockpit**
   - Streamlined 2-column dashboard fitted directly into the table frame with zero inner scrollbars or clipping:
     - Left Column: Live Speed, Heading, Next Stop (Jain University), Start/End Trip button, and Speed Limit indicator.
     - Right Column: 1-Tap Incident Quick-Reports (Traffic Delay, Mechanical Breakdown), Seat Occupancy Conductor Override, and Emergency SOS.

4. **3D Container Scroll Animation (Aceternity UI Style)**
   - Hardware-accelerated 3D scroll tilt effect applied to the live tracking table.
   - Tilts smoothly from 20deg perspective into 0deg flat view as you scroll down the page.

5. **Bilingual Localization (English & Hindi)**
   - Immediate one-click toggle (`EN / HI`) dynamically translating all navigation, status cards, routes, architecture, and FAQ content.

6. **Automated Test Suite (T1 through T12)**
   - Slide-out testing console for simulating normal gliding, traffic delays, GPS dropouts (estimated position / signal lost), stop geofence entry, proximity alerts, breakdown rescue bus recommendations, and expired pass checks.

---

### How to Run

#### Option 1: Zero-Install Static Server (Recommended)
You can open `index.html` directly using any HTTP server:
```bash
# Using Python
python -m http.server 3000

# Or using npx
npx serve . -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Modern Node.js / Vite Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Or build for production
npm run build
```
