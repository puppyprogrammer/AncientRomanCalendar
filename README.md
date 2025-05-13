# Roman Chronometer ⏳🏛️

A lightweight React-Native showcase that answers the question:

> **What would a “home-screen clock” look like if we still lived in the Roman Empire—  
> complete with a real sundial, moving sun, variable-length *horae*, and modern hands layered on top?**

---

##  Features

* **Animated sky** – dawn → noon → dusk gradient, drifting clouds (Lottie)
* **Moving sun** – glides the full arc every 24 h and tints the scene
* **Stone sundial** – SVG base with gnomon; casts a dynamic shadow that tracks the sun
* **Roman civil date** – e.g. `ante diem XIX Kalendas Iunias`
* **A.U.C. year** – year _ab Urbe Condita_ (founding of Rome)
* **Consular header** – “Year of Donald J. Trump & James D. Vance”
* **Modern hands** – hour / minute / second overlay for instant readability
* **Wheat field** (todo) – gentle Lottie swaying in the foreground
* All visuals are code-drawn SVG or tiny JSON animations—APK size stays lean.

---

##  Quick start

```bash
# 1 – clone
git clone https://github.com/puppyprogrammer/AncientRomanCalendar.git
cd AncientRomanCalendar

# 2 – install JS deps
npm install          # or yarn

# 3 – link fonts / assets (RN ≥0.70)
npx react-native-asset

# 4 – Android
npx react-native run-android
