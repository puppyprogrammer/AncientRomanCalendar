import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Polygon, Rect, Text as SvgText } from 'react-native-svg';

const RED = '#B22222';
const H   = 60;                          // total height (px)
const PAD = 12;                          // horizontal padding inside bar

export default function HeaderBar() {
  const { width } = Dimensions.get('window');

  return (
    <Svg
      width={width}
      height={H}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* pediment (triangle) */}
      <Polygon
        points={`${PAD},${H / 2} ${width - PAD},${H / 2} ${width / 2},5`}
        fill="none"
        stroke={RED}
        strokeWidth="1"
      />

      {/* entablature rectangle */}
      <Rect
        x={PAD}
        y={H / 2}
        width={width - PAD * 2}
        height={H / 2 - 5}
        stroke={RED}
        strokeWidth="1"
        fill="none"
      />

      {/* SPQR inscription */}
      <SvgText
        x={width / 2}
        y={H / 2 + (H / 2 - 5) / 2 + 2}
        fill={RED}
        fontSize="14"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        S · P · Q · R
      </SvgText>
    </Svg>
  );
}
