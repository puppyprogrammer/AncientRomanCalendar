// utils/romanTime.ts
//
// • sunriseSunset(date)  → { sunrise: Date, sunset: Date }
// • romanHourOfDay(date) → { label: string, isDay: boolean, fraction: number }

const LAT = 41.9;   // Rome
const LON = 12.5;   // (unused—hour length, not local clock, matters here)

/** quick sunrise/sunset, accuracy ±2 min  */
export function sunriseSunset(d: Date) {
  const rad = Math.PI / 180;
  const n   =
    Math.floor(
      275 * (d.getMonth() + 1) / 9 -
      (d.getMonth() < 2 ? 0 : (d.getMonth() + 1 + 2) / 12) +
      d.getDate() - 30
    ) + 1;                               // day of year (1-366)

  const J  = n + ((6 - LON / 15) / 24);  // solar noon estimate
  const M  = (0.9856 * J) - 3.289;       // mean anomaly
  const L  =
    M + (1.916 * Math.sin(M * rad)) +
    (0.020 * Math.sin(2 * M * rad)) + 282.634;
  const RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;

  const Lquadrant  = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  const RAcorr     = (RA + (Lquadrant - RAquadrant)) / 15;

  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(LAT * rad)) /
               (cosDec * Math.cos(LAT * rad));

  const H = (360 - Math.acos(cosH) / rad) / 15;        // sunrise ha angle
  const T = H + RAcorr - (0.06571 * J) - 6.622;        // local mean time
  const UTsunrise = (T - LON / 15 + 24) % 24;
  const UTsunset  = (UTsunrise + 12) % 24;

  const toDate = (h: number) => {
    const dt = new Date(d);
    dt.setUTCHours(0, 0, 0, 0);
    dt.setUTCMinutes(h * 60);
    return dt;
  };
  return { sunrise: toDate(UTsunrise), sunset: toDate(UTsunset) };
}

/** returns hora / vigilia label + daylight fraction (0–1) */
export function romanHourOfDay(now: Date) {
  const { sunrise, sunset } = sunriseSunset(now);
  const t      = now.getTime();
  const daylen = sunset.getTime() - sunrise.getTime();

  if (t < sunrise.getTime()) {
    // before sunrise → vigilia quarta (fourth watch of night)
    const idx = Math.floor((sunrise.getTime() - t) / (daylen / 4));
    const names = ['quarta', 'tertia', 'secunda', 'prima'];
    return { label: `vigilia ${names[idx]}`, isDay: false, fraction: 0 };
  }
  if (t >= sunset.getTime()) {
    const idx = Math.floor((t - sunset.getTime()) / (daylen / 4));
    const names = ['prima', 'secunda', 'tertia', 'quarta'];
    return { label: `vigilia ${names[idx]}`, isDay: false, fraction: 0 };
  }

  // daylight – variable-length horae
  const frac = (t - sunrise.getTime()) / daylen;      // 0-1
  const idx  = Math.floor(frac * 12);                 // 0-11
  const numerals =
    ['prima', 'secunda', 'tertia', 'quarta', 'quinta', 'sexta',
     'septima', 'octava', 'nona', 'decima', 'undecima', 'duodecima'];
  return { label: `hora ${numerals[idx]}`, isDay: true, fraction: frac };
}
