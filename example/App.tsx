import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Matrix, digits, generateWaveFrames } from '../src';

export default function App() {
  const [levels, setLevels] = useState<number[]>(Array.from({ length: 12 }, () => 0));
  useEffect(() => {
    const id = setInterval(() => {
      setLevels(Array.from({ length: 12 }, () => Math.random()));
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Matrix rows={7} cols={5} pattern={digits[5]} />
      </View>
      <View style={{ padding: 16 }}>
        <Matrix rows={7} cols={7} frames={generateWaveFrames(7, 7)} fps={20} loop />
      </View>
      <View style={{ padding: 16 }}>
        <Matrix rows={7} cols={12} mode="vu" levels={levels} />
      </View>
    </SafeAreaView>
  );
}

