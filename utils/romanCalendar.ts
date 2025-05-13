// utils/romanCalendar.ts
export interface RomanDateParts {
  civilLine: string;    // ante diem … Kalendas …
  monthLatin: string;   // Mensis Martius
  aucYear: number;      // 2778 (A.U.C.)
}

/* Latin month names & rules */
const months = [
  { lat: 'Ianuarius', nones: 5,  ides: 13, len: 31 },
  { lat: 'Februarius',nones: 5,  ides: 13, len: 28 }, // leap handled later
  { lat: 'Martius',   nones: 7,  ides: 15, len: 31 },
  { lat: 'Aprilis',   nones: 5,  ides: 13, len: 30 },
  { lat: 'Maius',     nones: 7,  ides: 15, len: 31 },
  { lat: 'Iunius',    nones: 5,  ides: 13, len: 30 },
  { lat: 'Iulius',    nones: 7,  ides: 15, len: 31 },
  { lat: 'Augustus',  nones: 5,  ides: 13, len: 31 },
  { lat: 'September', nones: 5,  ides: 13, len: 30 },
  { lat: 'October',   nones: 7,  ides: 15, len: 31 },
  { lat: 'November',  nones: 5,  ides: 13, len: 30 },
  { lat: 'December',  nones: 5,  ides: 13, len: 31 },
];

const ordinals = [
  '', 'pridie', 'ante diem III', 'ante diem IV', 'ante diem V',
  'ante diem VI', 'ante diem VII', 'ante diem VIII', 'ante diem IX',
  'ante diem X', 'ante diem XI', 'ante diem XII', 'ante diem XIII',
  'ante diem XIV', 'ante diem XV', 'ante diem XVI', 'ante diem XVII',
  'ante diem XVIII', 'ante diem XIX', 'ante diem XX',
];

/** Convert JS Date → Roman civil line, month name, A.U.C. year */
export function toRomanDate(d: Date): RomanDateParts {
  const y = d.getFullYear();
  const m = d.getMonth();              // 0-based
  const day = d.getDate();             // 1-based
  const leap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);

  const info = { ...months[m] };
  if (m === 1 && leap) info.len = 29;

  /* figure out next Kalends, Nones, or Ides */
  const kalendaeNext = info.len + 1;      // 1 of next month
  if (day === 1) return {
    civilLine: 'Kalendae ' + info.lat,
    monthLatin: 'Mensis ' + info.lat,
    aucYear: y + 753,
  };

  const refDay   = day <= info.nones ? info.nones
                  : day <= info.ides ? info.ides
                  : kalendaeNext;
  const refLabel = day <= info.nones ? 'Nonas'
                  : day <= info.ides ? 'Idus'
                  : 'Kalendas ' + months[(m + 1) % 12].lat;

  const diff = refDay - day + 1;          // inclusive counting
  const line = diff === 2 ? 'pridie ' + refLabel
             : diff === 1 ? refLabel      // never happens but keep
             : `${ordinals[diff]} ${refLabel}`;

  return {
    civilLine: line,
    monthLatin: 'Mensis ' + info.lat,
    aucYear: y + 753,
  };
}
