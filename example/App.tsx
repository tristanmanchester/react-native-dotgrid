import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import { Matrix, digits, generateWaveFrames, generateLoaderFrames, pulse } from '../src';

type Demo = 'digit' | 'wave' | 'loader' | 'vu' | 'pulse';

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

  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 }}>
        {(['digit', 'wave', 'loader', 'pulse', 'vu'] as Demo[]).map((key) => (
          <Pressable key={key} onPress={() => setDemo(key)} style={{ padding: 8, borderWidth: 1, borderColor: demo === key ? '#12f45a' : '#444', borderRadius: 6 }}>
            <Text style={{ color: demo === key ? '#12f45a' : '#eee' }}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ padding: 16 }}>
        {demo === 'digit' && <Matrix rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" />}
        {demo === 'wave' && <Matrix rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="Wave animation" />}
        {demo === 'loader' && <Matrix rows={7} cols={12} frames={loaderFrames} fps={18} loop ariaLabel="Loader" />}
        {demo === 'pulse' && <Matrix rows={7} cols={12} frames={pulseFrames} fps={16} loop ariaLabel="Pulse" />}
        {demo === 'vu' && <Matrix rows={7} cols={12} mode="vu" levels={levels} ariaLabel="VU meter" />}
      </View>
    </SafeAreaView>
  );
}
