import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';
import { Matrix, digits, generateWaveFrames, generateLoaderFrames, pulse } from 'react-native-dotgrid';

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
  const palette = useMemo(() => ({ on: '#fff', off: '#222', background: 'transparent' }), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '600', marginBottom: 8 }}>react-native-dotgrid</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, justifyContent: 'center' }}>
        {(['digit', 'wave', 'loader', 'pulse', 'vu'] as Demo[]).map((key) => (
          <Pressable key={key} onPress={() => setDemo(key)} style={{ paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: demo === key ? '#fff' : '#555', borderRadius: 6, marginHorizontal: 4 }}>
            <Text style={{ color: demo === key ? '#fff' : '#bbb' }}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {demo === 'digit' && <Matrix rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" palette={palette} />}
        {demo === 'wave' && <Matrix rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="Wave animation" palette={palette} />}
        {demo === 'loader' && <Matrix rows={7} cols={12} frames={loaderFrames} fps={18} loop ariaLabel="Loader" palette={palette} />}
        {demo === 'pulse' && <Matrix rows={7} cols={12} frames={pulseFrames} fps={16} loop ariaLabel="Pulse" palette={palette} />}
        {demo === 'vu' && <Matrix rows={7} cols={12} mode="vu" levels={levels} ariaLabel="VU meter" palette={palette} />}
      </View>
    </SafeAreaView>
  );
}
