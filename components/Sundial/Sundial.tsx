// components/Sundial/Sundial.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { romanHourOfDay } from '../../utils/romanTime';

const RED  = '#B22222';
const SIZE = 140;
const R    = SIZE / 2;

export default function Sundial() {
  const [angles, setAngles] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();

      /* --- hour shadow (sun) --- */
      const { fraction } = romanHourOfDay(now);             // 0-1 daylight
      const hourAngle = -90 + fraction * 180;               // -90..+90

      /* --- minute hand (full circle / hr) --- */
      const minFrac   = (now.getMinutes() * 60 + now.getSeconds()) / 3600;
      const minuteAngle = -90 + minFrac * 360;

      /* --- second hand (full circle / 60 s) --- */
      const secFrac   = (now.getSeconds() + now.getMilliseconds() / 1000) / 60;
      const secondAngle = -90 + secFrac * 360;

      setAngles({ hour: hourAngle, minute: minuteAngle, second: secondAngle });
    };

    tick();
    const id = setInterval(tick, 200);   // update 5× per s for smooth second hand
    return () => clearInterval(id);
  }, []);

  /* helpers */
  const toXY = (angleDeg: number, radius = R) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: R + radius * Math.cos(rad),
      y: R + radius * Math.sin(rad),
    };
  };

  const hourXY   = toXY(angles.hour,   R - 2);
  const minuteXY = toXY(angles.minute, R - 6);
  const secondXY = toXY(angles.second, R - 10);

  return (
    <View style={{ width: SIZE, height: SIZE, alignSelf: 'center' }}>
      <Svg width={SIZE} height={SIZE}>
        {/* dial outline */}
        <Circle cx={R} cy={R} r={R - 1} stroke={RED} strokeWidth="1" fill="none" />

        {/* fixed gnomon */}
        <Line x1={R} y1={R} x2={R} y2={R - 18} stroke={RED} strokeWidth="2" />

        {/* hour shadow */}
        <Line x1={R} y1={R} x2={hourXY.x}   y2={hourXY.y}   stroke={RED} strokeWidth="2" />

        {/* minute hand */}
        <Line x1={R} y1={R} x2={minuteXY.x} y2={minuteXY.y} stroke={RED} strokeWidth="1.5" />

        {/* second hand */}
        <Line
          x1={R}
          y1={R}
          x2={secondXY.x}
          y2={secondXY.y}
          stroke={RED}
          strokeWidth="1"
          opacity={0.3}
        />
      </Svg>
    </View>
  );
}
