// App.tsx — retro-terminal UI with live Roman date & continuous sun
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

import Sky        from './components/Sky/Sky';
import Sundial    from './components/Sundial/Sundial';
import HeaderBar  from './components/HeaderBar/HeaderBar';
import { romanHourOfDay }  from './utils/romanTime';
import { toRomanDate }     from './utils/romanCalendar';

const RED  = '#B22222';
const FONT = {
  regular: 'Cinzel-Regular',
  bold:    'Cinzel-Bold',
};

export default function App() {
  /* ── live hora / vigilia ── */
  const [horaLabel, setHoraLabel] = useState(
    romanHourOfDay(new Date()).label.toUpperCase(),
  );

  /* ── live civil-date parts (Kalends/Nones/Ides, month, A.U.C.) ── */
  const [romanParts, setRomanParts] = useState(toRomanDate(new Date()));

  useEffect(() => {
    /* refresh every minute */
    const idHora  = setInterval(
      () => setHoraLabel(romanHourOfDay(new Date()).label.toUpperCase()),
      60_000,
    );
    const idDate  = setInterval(
      () => setRomanParts(toRomanDate(new Date())),
      60_000,
    );
    return () => {
      clearInterval(idHora);
      clearInterval(idDate);
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Sky />
      <HeaderBar />

      {/* faint scan-line overlay */}
      <View style={styles.scanlines} pointerEvents="none" />

      <View style={styles.panel}>
        {/* consular header */}
        <Text style={styles.header}>Year of</Text>
        <Text style={styles.header}>Donald J. Trump & James D. Vance</Text>

        <View style={styles.separator} />

        {/* dynamic Roman civil date */}
        <Text style={styles.body}>{romanParts.civilLine}</Text>
        <Text style={styles.body}>
          {romanParts.monthLatin} • Anno {romanParts.aucYear} ab Urbe Condita
        </Text>

        {/* historic time label */}
        <View style={{ height: 30 }} />
        <Text style={styles.clock}>{horaLabel}</Text>

        {/* sundial */}
        <Sundial />
      </View>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    width: '92%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,0,0,0.06)',
    backgroundSize: '100% 4px',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.94)',
  },
  header: {
    color: RED,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: RED,
    marginVertical: 8,
  },
  body: {
    color: RED,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT.regular,
    textAlign: 'center',
  },
  clock: {
    color: RED,
    fontSize: 40,
    letterSpacing: 2,
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
});
