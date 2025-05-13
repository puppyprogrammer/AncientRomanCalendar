import React, { useEffect, useState } from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import { romanHourOfDay } from '../../utils/romanTime';

const { width, height } = Dimensions.get('window');
const SKY_H  = height * 0.55;
const LAND_H = height * 0.45;
const SUN_R  = 28;

const dawn   = ['#012c5c', '#0b3b7a'];   // top→bottom colors at dawn
const noon   = ['#1577c0', '#3ca5e8'];
const dusk   = ['#012c5c', '#143c66'];

export default function Sky() {
  /* sun position */
  const [sunXY, setSunXY] = useState({ x: width / 2, y: SKY_H });

  /* animated cloud offset */
  const cloudX = new Animated.Value(0);

  useEffect(() => {
    /* sun ticker */
    const tick = () => {
      const now  = new Date();
      const hrs  = now.getHours() + now.getMinutes() / 60;
      const angle = (180 - (hrs - 6) * 15) * (Math.PI / 180);
      const r = Math.min(SKY_H, width / 2) - SUN_R - 6;
      setSunXY({
        x: width / 2 + r * Math.cos(angle),
        y: SKY_H     - r * Math.sin(angle),
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    /* looping cloud drift */
    Animated.loop(
      Animated.timing(cloudX, {
        toValue: -width,
        duration: 60_000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [cloudX]);

  /* choose gradient based on hour */
  const h = new Date().getHours();
  const grad = h < 9 ? dawn : h < 16 ? noon : dusk;

  return (
    <>
      {/* animated gradient sky */}
      <LinearGradient
        colors={grad}
        style={{ position: 'absolute', top: 0, left: 0, width, height: SKY_H }}
      />

      {/* clouds */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: width * 2,          // two widths so we can loop
          height: SKY_H,
          transform: [{ translateX: cloudX }],
          opacity: 0.25,
        }}
      >
        <LottieView
          source={require('../../assets/lottie/clouds.json')}
          autoPlay
          loop
          resizeMode="cover"
          style={{ width: width * 2, height: SKY_H }}
        />
      </Animated.View>

      {/* land strip */}
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Rect x="0" y={SKY_H} width={width} height={LAND_H} fill="#044400" />

        {/* sun disk */}
        <Circle
          cx={sunXY.x}
          cy={sunXY.y}
          r={SUN_R}
          fill="#FDB813"
          stroke="#FD7"
          strokeWidth="2"
        />
      </Svg>
    </>
  );
}
