import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import {
  Matrix,
  digits,
  generateWaveFrames,
  generateLoaderFrames,
  pulse,
  snake,
  chevronLeft,
  chevronRight,
  ripple
} from 'react-native-dotgrid';

type Demo = 'digit' | 'wave' | 'loader' | 'vu' | 'pulse' | 'snake' | 'chevrons' | 'ripple' | 'showcase3x3';

export default function App() {
  const [demo, setDemo] = useState<Demo>('digit');
  const [levels, setLevels] = useState<number[]>(Array.from({ length: 12 }, () => 0));
  useEffect(() => {
    const id = setInterval(() => {
      setLevels(Array.from({ length: 12 }, () => Math.random()));
    }, 80);
    return () => clearInterval(id);
  }, []);

  const waveFrames = useMemo(() => generateWaveFrames(7, 7), []);
  const loaderFrames = useMemo(() => generateLoaderFrames(7, 12), []);
  const pulseFrames = useMemo(() => pulse(7, 12, 24), []);
  const rippleFrames = useMemo(() => ripple(7, 7, { length: 28, wavelength: 3.5, damping: 0.06 }), []);
  const palette = useMemo(() => ({ on: '#fff', off: '#222', background: 'transparent' }), []);

  // Gradient helper: spreads intensity around a set of centers
  const softPattern = (rows: number, cols: number, centers: Array<[number, number]>, falloff = 2) => {
    const out: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let v = 0;
        for (const [cr, cc] of centers) {
          const dr = r - cr;
          const dc = c - cc;
          const d2 = dr * dr + dc * dc;
          v = Math.max(v, Math.exp(-(d2) / (2 * falloff * falloff))); // 0..1
        }
        out[r][c] = Math.min(1, v);
      }
    }
    return out;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '600', marginBottom: 8 }}>react-native-dotgrid</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, justifyContent: 'center' }}>
        {(['digit', 'wave', 'loader', 'pulse', 'vu', 'snake', 'chevrons', 'ripple', 'showcase3x3'] as Demo[]).map((key) => (
          <Pressable key={key} onPress={() => setDemo(key)} style={{ paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: demo === key ? '#fff' : '#555', borderRadius: 6, marginHorizontal: 4 }}>
            <Text style={{ color: demo === key ? '#fff' : '#bbb' }}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
        {demo === 'digit' && <Matrix rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" palette={palette} />}
        {demo === 'wave' && <Matrix rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="Wave animation" palette={palette} />}
        {demo === 'loader' && <Matrix rows={7} cols={12} frames={loaderFrames} fps={18} loop ariaLabel="Loader" palette={palette} />}
        {demo === 'pulse' && <Matrix rows={7} cols={12} frames={pulseFrames} fps={16} loop ariaLabel="Pulse" palette={palette} />}
        {demo === 'vu' && <Matrix rows={7} cols={12} mode="vu" levels={levels} ariaLabel="VU meter" palette={palette} />}
        {demo === 'snake' && <Matrix rows={7} cols={12} frames={snake(7, 12)} fps={20} loop ariaLabel="Snake" palette={palette} />}
        {demo === 'chevrons' && (
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Matrix rows={7} cols={7} pattern={chevronLeft(7, 7)} ariaLabel="Chevron left" palette={palette} />
            <Matrix rows={7} cols={7} pattern={chevronRight(7, 7)} ariaLabel="Chevron right" palette={palette} />
          </View>
        )}
        {demo === 'ripple' && <Matrix rows={7} cols={7} frames={rippleFrames} fps={24} loop ariaLabel="Ripple" palette={palette} />}
        {demo === 'showcase3x3' && (
          <View style={{ gap: 6 }}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                {[0, 1, 2].map((col) => {
                  const key = `${row}-${col}`;
                  // Pick a pattern per cell
                  const cell = row * 3 + col;
                  const common = { rows: 7, cols: 7, palette } as const;
                  if (cell === 0) return <Matrix key={key} {...common} pattern={softPattern(7, 7, [[2, 2], [4, 4]], 1.8)} ariaLabel="soft dots" />;
                  if (cell === 1) return <Matrix key={key} {...common} frames={generateWaveFrames(7, 7)} fps={14} loop ariaLabel="wave" />;
                  if (cell === 2) return <Matrix key={key} {...common} pattern={softPattern(7, 7, [[0, 6]], 2.2)} ariaLabel="corner" />;
                  if (cell === 3) return <Matrix key={key} {...common} pattern={softPattern(7, 7, [[3, 0]], 1.6)} ariaLabel="edge" />;
                  if (cell === 4) return <Matrix key={key} {...common} frames={pulse(7, 7, 18)} fps={16} loop ariaLabel="pulse" />;
                  if (cell === 5) return <Matrix key={key} {...common} frames={ripple(7, 7, { length: 21, wavelength: 3.5 })} fps={18} loop ariaLabel="ripple" />;
                  if (cell === 6) return <Matrix key={key} {...common} frames={snake(7, 7, 4)} fps={24} loop ariaLabel="snake" />;
                  if (cell === 7) return <Matrix key={key} {...common} frames={generateLoaderFrames(7, 7)} fps={18} loop ariaLabel="loader" />;
                  return <Matrix key={key} {...common} pattern={softPattern(7, 7, [[5, 5], [1, 3], [3, 1]], 2)} ariaLabel="multi" />;
                })}
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
