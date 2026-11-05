// Internationalization support: English and Hindi (हिन्दी)
export const translations = {
  en: {
    // Nav & Brand
    brandName: "Campus Transit",
    navLiveTracker: "Live Tracker",
    navRoutes: "Routes",
    navHowItWorks: "How It Works",
    navArchitecture: "Architecture",
    navFaq: "FAQ",
    navRunTests: "Run Tests",
    navOpenTracker: "Open Tracker",
    
    // Hero
    heroBadge: "Real-time campus transit & arrival predictions",
    heroTitle1: "Campus bus tracking,",
    heroTitle2: "down to the minute.",
    heroSubtitle: "Track active buses along your route, check stop arrival times adjusted for traffic, and know whether to walk or wait.",
    heroOpenBtn: "Open Live Tracker",
    heroDemoBtn: "Run Demo Walkthrough",
    heroStatRoutes: "3 Active Corridors",
    heroStatFleet: "4 Fleet Buses",
    heroStatOnTime: "94% On-Time",
    heroStatGps: "3s GPS Ping",

    // Portal Tabs
    portalTitle: "Live Fleet Operations",
    portalSubtitle: "Route 216-J Active (Jain University Corridor)",
    tabCommuter: "Commuter",
    tabDriver: "Driver Console",
    tabAdmin: "Fleet Dispatch",
    tabGate: "Gate Departures",
    latencyLabel: "Latency:",

    // Commuter Card
    searchPlaceholder: "Search routes, stops, or buses... (Ctrl+K)",
    arrivalAt: "Arrival at",
    minAway: "min away",
    minutesAway: "minutes away",
    onTime: "On time",
    delayed: "Delayed",
    passed: "Passed",
    yourStop: "Your Stop",
    live: "LIVE GPS",
    capacity: "Capacity:",
    seatsAvailable: "Seats Available",
    standingOnly: "Standing Only",
    busFull: "Bus Full",
    walkingDistance: "Walking distance:",
    quickTools: "Quick Tools",
    toolAlerts: "Alerts",
    toolBusPass: "Bus Pass",
    toolLostFound: "Lost & Found",
    toolSafetySos: "Safety SOS",
    focusBus: "Focus 216-J",

    // Routes Section
    routesTitle: "Bangalore Transit Corridors",
    routesSubtitle: "High-frequency commuter corridors mapped live with Google Maps.",

    // How It Works Section
    howTitle: "How It Works",
    howSubtitle: "Practical transit features built specifically for campus and commuter travel.",
    how1Title: "Gliding GPS Tracking",
    how1Desc: "Buses update position every 3 seconds with smooth 60fps road interpolation instead of jumping across the map.",
    how2Title: "Traffic-Adjusted ETAs",
    how2Desc: "Calculates remaining distance, segment speed, and stop dwell times with confidence intervals.",
    how3Title: "Walk vs. Bus Timing",
    how3Desc: "Compares your walking distance against the live arrival time to show whether you should walk normally or hurry.",
    how4Title: "Standby Bus Dispatch",
    how4Desc: "When heavy delays or mechanical breakdowns occur, standby units can be dispatched in one click.",

    // Architecture
    archTitle: "System Architecture",
    archSubtitle: "Low-latency telemetry synchronization across driver cockpits, dispatch, and displays.",
    arch1Title: "Driver PWA",
    arch1Desc: "Browser Geolocation and Wake Lock stream GPS coordinates every 1–3s.",
    arch2Title: "WebSocket Broker",
    arch2Desc: "Sub-second broadcast of coordinates, speed, and delay tags to connected screens.",
    arch3Title: "ETA Engine",
    arch3Desc: "Road snapping, 150m stop geofence checking, and rolling speed estimates.",
    arch4Title: "Student & Gate Displays",
    arch4Desc: "Responsive mobile web app, dispatch dashboard, and full-screen TV displays.",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQ1: "How are stop arrival times calculated?",
    faqA1: "Arrival times use remaining route distance divided by rolling speed on that road segment, scaled by real-time traffic factors and stop dwell times.",
    faqQ2: "What happens if cellular reception drops?",
    faqA2: "If no GPS ping is received for 15s, the bus marker is labeled 'Estimated position' and glides along the route at its last speed. After 2 minutes, it falls back to timetable.",
    faqQ3: "Is student or commuter location tracked?",
    faqA3: "No. All walking distance calculations and proximity alarms run entirely locally inside your browser. No personal location data is ever stored.",
    faqQ4: "How does seat occupancy reporting work?",
    faqA4: "Commuters can submit crowd levels. To guarantee accuracy, verified driver and conductor reports immediately take precedence."
  },

  hi: {
    // Nav & Brand
    brandName: "कैंपस ट्रांजिट",
    navLiveTracker: "लाइव ट्रैकर",
    navRoutes: "रूट्स",
    navHowItWorks: "सुविधाएं",
    navArchitecture: "आर्किटेक्चर",
    navFaq: "सवाल-जवाब",
    navRunTests: "परीक्षण चलाएं",
    navOpenTracker: "ट्रैकर खोलें",
    
    // Hero
    heroBadge: "रीयल-टाइम बस ट्रैकिंग एवं आगमन भविष्यवाणी",
    heroTitle1: "कैंपस बस ट्रैकिंग,",
    heroTitle2: "हर मिनट की सटीक जानकारी।",
    heroSubtitle: "अपने रूट पर चलने वाली बसों को लाइव ट्रैक करें, ट्रैफ़िक अनुसार सही समय देखें और तय करें कि रुकना है या चलना है।",
    heroOpenBtn: "लाइव ट्रैकर खोलें",
    heroDemoBtn: "डेमो वॉकथ्रू चलाएं",
    heroStatRoutes: "3 सक्रिय रूट",
    heroStatFleet: "4 बसें सक्रिय",
    heroStatOnTime: "94% समय पर",
    heroStatGps: "3 सेकंड जीपीएस",

    // Portal Tabs
    portalTitle: "लाइव बस संचालन",
    portalSubtitle: "रूट 216-J सक्रिय (जैन यूनिवर्सिटी कॉरिडोर)",
    tabCommuter: "यात्री",
    tabDriver: "ड्राइवर कंसोल",
    tabAdmin: "कंट्रोल रूम",
    tabGate: "गेट प्रस्थान",
    latencyLabel: "विलंबता:",

    // Commuter Card
    searchPlaceholder: "रूट, स्टॉप या बस खोजें... (Ctrl+K)",
    arrivalAt: "पहुंचने का समय:",
    minAway: "मिनट दूर",
    minutesAway: "मिनट दूर",
    onTime: "समय पर",
    delayed: "देरी से",
    passed: "निकल चुकी",
    yourStop: "आपका स्टॉप",
    live: "लाइव GPS",
    capacity: "क्षमता:",
    seatsAvailable: "सीटें उपलब्ध",
    standingOnly: "केवल खड़े रहकर",
    busFull: "बस भरी हुई है",
    walkingDistance: "पैदल दूरी:",
    quickTools: "त्वरित साधन",
    toolAlerts: "अलर्ट",
    toolBusPass: "बस पास",
    toolLostFound: "खोया-पाया",
    toolSafetySos: "सुरक्षा SOS",
    focusBus: "बस 216-J पर फोकस",

    // Routes Section
    routesTitle: "बेंगलुरु ट्रांजिट कॉरिडोर",
    routesSubtitle: "गूगल मैप्स पर लाइव ट्रैक होने वाले प्रमुख बीएमटीसी बस रूट।",

    // How It Works Section
    howTitle: "यह कैसे काम करता है",
    howSubtitle: "कैंपस और दैनिक यात्रियों के लिए बनाई गई व्यावहारिक बस ट्रैकिंग सुविधाएं।",
    how1Title: "स्मूथ जीपीएस ग्लाइडिंग",
    how1Desc: "बसें मैप पर उछलने के बजाय हर 3 सेकंड में सड़क के साथ 60fps पर सुचारू रूप से आगे बढ़ती हैं।",
    how2Title: "ट्रैफ़िक-आधारित समय",
    how2Desc: "सड़क की गति, भीड़ और स्टॉप पर रुकने के समय को जोड़कर सटीक आगमन समय निकाला जाता है।",
    how3Title: "पैदल बनाम बस समय",
    how3Desc: "आपकी पैदल गति और बस के पहुंचने के समय की तुलना करके बताता है कि सामान्य चलें या जल्दी करें।",
    how4Title: "स्टैंडबाई बस डिस्पैच",
    how4Desc: "यदि किसी बस में ब्रेकडाउन या भारी देरी हो, तो कंट्रोल रूम से तुरंत रिज़र्व बस भेजी जा सकती है।",

    // Architecture
    archTitle: "सिस्टम आर्किटेक्चर",
    archSubtitle: "ड्राइवर, कंट्रोल रूम और गेट स्क्रीन के बीच बेहद कम विलंबता पर डेटा सिंक।",
    arch1Title: "ड्राइवर ऐप",
    arch1Desc: "ब्राउज़र जियोलोकेशन हर 1–3 सेकंड में जीपीएस निर्देशांक भेजता है।",
    arch2Title: "वेबसॉकेट ब्रोकर",
    arch2Desc: "सभी जुड़ी हुई स्क्रीन पर सेकंड से कम समय में लोकेशन और स्पीड ब्रॉडकास्ट।",
    arch3Title: "ईटीए इंजन",
    arch3Desc: "सड़क स्नैपिंग, 150 मीटर जियोफेंस और औसत गति से समय का सटीक आकलन।",
    arch4Title: "यात्री व गेट स्क्रीन",
    arch4Desc: "मोबाइल वेब ऐप, कंट्रोल रूम डैशबोर्ड और गेट के लिए फुल-स्क्रीन टीवी डिस्प्ले।",

    // FAQ
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqQ1: "बस के आने का समय कैसे निकाला जाता है?",
    faqA1: "रूट की बची हुई दूरी, वर्तमान गति, ट्रैफ़िक फ़ैक्टर और स्टॉप पर रुकने के समय को मिलाकर गणना की जाती है।",
    faqQ2: "यदि मोबाइल नेटवर्क कमजोर हो तो क्या होगा?",
    faqA2: "15 सेकंड तक सिग्नल न मिलने पर 'अनुमानित स्थिति' दिखती है। 2 मिनट बाद टाइमटेबल पर आधारित समय दिखाया जाता है।",
    faqQ3: "क्या यात्री की लोकेशन ट्रैक या सेव की जाती है?",
    faqA3: "नहीं। सभी गणनाएं पूरी तरह आपके अपने ब्राउज़र में होती हैं। कोई निजी लोकेशन डेटा सर्वर पर नहीं भेजा जाता।",
    faqQ4: "सीटों की स्थिति कैसे पता चलती है?",
    faqA4: "यात्री सीटों की स्थिति रिपोर्ट कर सकते हैं। कंडक्टर की रिपोर्ट को सर्वोच्च प्राथमिकता दी जाती है।"
  },

  kn: {
    // Nav & Brand
    brandName: "ಕ್ಯಾಂಪಸ್ ಟ್ರಾನ್ಸಿಟ್",
    navLiveTracker: "ಲೈವ್ ಟ್ರ್ಯಾಕರ್",
    navRoutes: "ಮಾರ್ಗಗಳು",
    navHowItWorks: "ಕಾರ್ಯವಿಧಾನ",
    navArchitecture: "ವಾಸ್ತುಶಿಲ್ಪ",
    navFaq: "ಪ್ರಶ್ನೋತ್ತರಗಳು",
    navRunTests: "ಪರೀಕ್ಷೆ ನಡೆಸಿ",
    navOpenTracker: "ಟ್ರ್ಯಾಕರ್ ತೆರೆಯಿರಿ",
    
    // Hero
    heroBadge: "ನೈಜ-ಸಮಯದ ಕ್ಯಾಂಪಸ್ ಸಾರಿಗೆ ಮತ್ತು ಆಗಮನ ಅಂದಾಜು",
    heroTitle1: "ಕ್ಯಾಂಪಸ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್,",
    heroTitle2: "ಪ್ರತಿ ನಿಮಿಷದ ನಿಖರ ಮಾಹಿತಿ.",
    heroSubtitle: "ನಿಮ್ಮ ಮಾರ್ಗದ ಬಸ್‌ಗಳನ್ನು ಲೈವ್ ಆಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಟ್ರಾಫಿಕ್ ಆಧಾರಿತ ಆಗಮನ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಡೆಯಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ ಎಂದು ತಿಳಿಯಿರಿ.",
    heroOpenBtn: "ಲೈವ್ ಟ್ರ್ಯಾಕರ್ ತೆರೆಯಿರಿ",
    heroDemoBtn: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
    heroStatRoutes: "3 ಸಕ್ರಿಯ ಕಾರಿಡಾರ್‌ಗಳು",
    heroStatFleet: "4 ಫ್ಲೀಟ್ ಬಸ್‌ಗಳು",
    heroStatOnTime: "94% ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ",
    heroStatGps: "3ಸೆ ಜಿಪಿಎಸ್ ಪಿಂಗ್",

    // Portal Tabs
    portalTitle: "ಲೈವ್ ಫ್ಲೀಟ್ ಕಾರ್ಯಾಚರಣೆ",
    portalSubtitle: "ಮಾರ್ಗ 216-J ಸಕ್ರಿಯ (ಜೈನ್ ವಿಶ್ವವಿದ್ಯಾಲಯ ಕಾರಿಡಾರ್)",
    tabCommuter: "ಪ್ರಯಾಣಿಕ",
    tabDriver: "ಚಾಲಕರ ಕನ್ಸೋಲ್",
    tabAdmin: "ನಿಯಂತ್ರಣ ಕೊಠಡಿ",
    tabGate: "ಗೇಟ್ ನಿರ್ಗಮನಗಳು",
    latencyLabel: "ವಿಳಂಬತೆ:",

    // Commuter Card
    searchPlaceholder: "ಮಾರ್ಗಗಳು, ನಿಲ್ದಾಣಗಳು ಅಥವಾ ಬಸ್‌ಗಳನ್ನು ಹುಡುಕಿ... (Ctrl+K)",
    arrivalAt: "ತಲುಪುವ ಸ್ಥಳ:",
    minAway: "ನಿಮಿಷ ದೂರ",
    minutesAway: "ನಿಮಿಷಗಳ ದೂರ",
    onTime: "ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ",
    delayed: "ವಿಳಂಬವಾಗಿದೆ",
    passed: "ಹಾದುಹೋಗಿದೆ",
    yourStop: "ನಿಮ್ಮ ನಿಲ್ದಾಣ",
    live: "ಲೈವ್ GPS",
    capacity: "ಸಾಮರ್ಥ್ಯ:",
    seatsAvailable: "ಆಸನಗಳು ಲಭ್ಯವಿದೆ",
    standingOnly: "ನಿಂತು ಪ್ರಯಾಣ ಮಾತ್ರ",
    busFull: "ಬಸ್ ಭರ್ತಿಯಾಗಿದೆ",
    walkingDistance: "ನಡೆಯುವ ದೂರ:",
    quickTools: "ತ್ವರಿತ ಸಾಧನಗಳು",
    toolAlerts: "ಎಚ್ಚರಿಕೆಗಳು",
    toolBusPass: "ಬಸ್ ಪಾಸ್",
    toolLostFound: "ಕಳೆದುಹೋದ ವಸ್ತುಗಳು",
    toolSafetySos: "ತುರ್ತು SOS",
    focusBus: "ಬಸ್ 216-J ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸಿ",

    // Routes Section
    routesTitle: "ಬೆಂಗಳೂರು ಸಾರಿಗೆ ಕಾರಿಡಾರ್‌ಗಳು",
    routesSubtitle: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿ ಗುರುತಿಸಲಾದ ಬಿಎಂಟಿಸಿ ಪ್ರಮುಖ ಬಸ್ ಮಾರ್ಗಗಳು.",

    // How It Works Section
    howTitle: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    howSubtitle: "ಕ್ಯಾಂಪಸ್ ಮತ್ತು ದೈನಂದಿನ ಪ್ರಯಾಣಿಕರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸುಲಭ ಸಾರಿಗೆ ಸೌಲಭ್ಯಗಳು.",
    how1Title: "ನಯವಾದ ಜಿಪಿಎಸ್ ಗ್ಲೈಡಿಂಗ್",
    how1Desc: "ಬಸ್‌ಗಳು ನಕ್ಷೆಯಲ್ಲಿ ಜಿಗಿಯುವ ಬದಲು ರಸ್ತೆಯ ಮಾರ್ಗದಲ್ಲಿ ಪ್ರತಿ 3 ಸೆಕೆಂಡಿಗೆ 60fps ನಯವಾಗಿ ಚಲಿಸುತ್ತವೆ.",
    how2Title: "ಟ್ರಾಫಿಕ್ ಆಧಾರಿತ ಇಟಿಎ",
    how2Desc: "ಉಳಿದ ದೂರ, ರಸ್ತೆಯ ಸರಾಸರಿ ವೇಗ ಮತ್ತು ನಿಲ್ದಾಣದ ನಿಲುಗಡೆ ಸಮಯವನ್ನು ಲೆಕ್ಕಹಾಕಿ ನಿಖರ ಸಮಯ ಒದಗಿಸುತ್ತದೆ.",
    how3Title: "ನಡಿಗೆ ಮತ್ತು ಬಸ್ ಸಮಯ ಹೋಲಿಕೆ",
    how3Desc: "ನಿಮ್ಮ ನಡಿಗೆಯ ದೂರ ಮತ್ತು ಬಸ್ ಆಗಮನ ಸಮಯವನ್ನು ಹೋಲಿಸಿ, ನಿಧಾನವಾಗಿ ನಡೆಯಬೇಕೇ ಅಥವಾ ವೇಗವಾಗಿ ಹೋಗಬೇಕೇ ಎಂದು ಸೂಚಿಸುತ್ತದೆ.",
    how4Title: "ಮೀಸಲು ಬಸ್ ನಿಯೋಜನೆ",
    how4Desc: "ಭಾರೀ ಟ್ರಾಫಿಕ್ ಅಥವಾ ಯಾಂತ್ರಿಕ ದೋಷ ಉಂಟಾದಾಗ, ನಿಯಂತ್ರಣ ಕೊಠಡಿಯಿಂದ ತಕ್ಷಣವೇ ಪರ್ಯಾಯ ಬಸ್ ಕಳುಹಿಸಬಹುದು.",

    // Architecture
    archTitle: "ವ್ಯವಸ್ಥೆಯ ವಾಸ್ತುಶಿಲ್ಪ",
    archSubtitle: "ಚಾಲಕರು, ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಮತ್ತು ಪ್ರದರ್ಶನ ಪರದೆಗಳ ನಡುವೆ ಕ್ಷಿಪ್ರ ಟೆಲಿಮೆಟ್ರಿ ಸಿಂಕ್ರೊನೈಸೇಶನ್.",
    arch1Title: "ಚಾಲಕರ ಅಪ್ಲಿಕೇಶನ್",
    arch1Desc: "ಬ್ರೌಸರ್ ಜಿಯೋಲೊಕೇಶನ್ ಪ್ರತಿ 1–3 ಸೆಕೆಂಡಿಗೆ ಜಿಪಿಎಸ್ ವಿವರಗಳನ್ನು ಕಳುಹಿಸುತ್ತದೆ.",
    arch2Title: "ವೆಬ್‌ಸಾಕೆಟ್ ಬ್ರೋಕರ್",
    arch2Desc: "ಸಂಪರ್ಕಿತ ಎಲ್ಲಾ ಪರದೆಗಳಿಗೆ ಕ್ಷಣಮಾತ್ರದಲ್ಲಿ ಸ್ಥಳ ಮತ್ತು ವೇಗದ ಮಾಹಿತಿಯನ್ನು ಪ್ರಸಾರ ಮಾಡುತ್ತದೆ.",
    arch3Title: "ಇಟಿಎ ಎಂಜಿನ್",
    arch3Desc: "ರಸ್ತೆ ಸ್ನ್ಯಾಪಿಂಗ್, 150 ಮೀಟರ್ ಜಿಯೋಫೆನ್ಸ್ ಮತ್ತು ಚಾಲನೆಯ ವೇಗದ ವಿಶ್ಲೇಷಣೆ.",
    arch4Title: "ವಿದ್ಯಾರ್ಥಿ ಮತ್ತು ಗೇಟ್ ಪ್ರದರ್ಶನ",
    arch4Desc: "ಮೊಬೈಲ್ ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್, ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಪೂರ್ಣ-ಪರದೆಯ ಟಿವಿ ಪ್ರದರ್ಶನ.",

    // FAQ
    faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    faqQ1: "ಬಸ್ ಆಗಮನದ ಸಮಯವನ್ನು ಹೇಗೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ?",
    faqA1: "ಉಳಿದ ರಸ್ತೆ ದೂರ, ಆ ಭಾಗದ ವೇಗ, ಲೈವ್ ಟ್ರಾಫಿಕ್ ಮತ್ತು ನಿಲ್ದಾಣದ ನಿಲುಗಡೆ ಸಮಯವನ್ನು ಆಧರಿಸಿ ಆಗಮನ ಸಮಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
    faqQ2: "ಮೊಬೈಲ್ ನೆಟ್‌ವರ್ಕ್ ಕಡಿತಗೊಂಡರೆ ಏನಾಗುತ್ತದೆ?",
    faqA2: "15 ಸೆಕೆಂಡುಗಳವರೆಗೆ ಜಿಪಿಎಸ್ ಸಿಗ್ನಲ್ ಸಿಗದಿದ್ದರೆ 'ಅಂದಾಜು ಸ್ಥಳ' ತೋರಿಸಲಾಗುತ್ತದೆ. 2 ನಿಮಿಷಗಳ ನಂತರ ವೇಳಾಪಟ್ಟಿಗೆ ಬದಲಾಗುತ್ತದೆ.",
    faqQ3: "ಪ್ರಯಾಣಿಕರ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿಗಳ ಸ್ಥಳವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತದೆಯೇ?",
    faqA3: "ಇಲ್ಲ. ನಡಿಗೆಯ ದೂರ ಮತ್ತು ಎಚ್ಚರಿಕೆಯ ಲೆಕ್ಕಾಚಾರಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ರನ್ ಆಗುತ್ತವೆ. ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಸ್ಥಳದ ಡೇಟಾವನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    faqQ4: "ಆಸನಗಳ ಲಭ್ಯತೆಯನ್ನು ಹೇಗೆ ವರದಿ ಮಾಡಲಾಗುತ್ತದೆ?",
    faqA4: "ಪ್ರಯಾಣಿಕರು ಜನದಟ್ಟಣೆಯನ್ನು ವರದಿ ಮಾಡಬಹುದು. ನಿಖರತೆಗಾಗಿ ಚಾಲಕರು ಮತ್ತು ನಿರ್ವಾಹಕರ ವರದಿಗಳಿಗೆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆ ನೀಡಲಾಗುತ್ತದೆ."
  }
};

// Apply translations across all [data-i18n] DOM elements
export function applyLanguageToDOM(lang = 'en') {
  const dict = translations[lang] || translations.en;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}
