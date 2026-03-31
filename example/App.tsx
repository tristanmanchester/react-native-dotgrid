import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import {
  Matrix,
  digits,
  generateLoaderFrames,
  generateWaveFrames,
  pulse,
  ripple,
  snake,
  chevronLeft,
  chevronRight,
  type MatrixRenderer
} from 'react-native-dotgrid';

type Demo = 'digit' | 'wave' | 'loader' | 'vu' | 'pulse' | 'snake' | 'chevrons' | 'ripple' | 'showcase3x3' | 'benchmark';

type ScenarioProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const Button = ({
  active,
  label,
  onPress
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: active ? '#fff' : '#555',
      borderRadius: 6
    }}
  >
    <Text style={{ color: active ? '#fff' : '#bbb' }}>{label}</Text>
  </Pressable>
);

const ScenarioCard = ({ title, description, children }: ScenarioProps) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#2a2a2a',
      borderRadius: 16,
      padding: 16,
      gap: 12,
      backgroundColor: '#050505'
    }}
  >
    <View style={{ gap: 4 }}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#8d8d8d', fontSize: 12 }}>{description}</Text>
    </View>
    <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>{children}</View>
  </View>
);

export default function App() {
  const [demo, setDemo] = useState<Demo>('digit');
  const [renderer, setRenderer] = useState<MatrixRenderer>('skia');
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
  const rippleFrames = useMemo(() => ripple(7, 7, { length: 48, wavelength: 3.5, damping: 0.06, speed: 6 }), []);
  const palette = useMemo(() => ({ on: '#ffffff', off: '#222222', background: 'transparent' }), []);

  const benchmarkFrames = useMemo(
    () => ({
      wave16: generateWaveFrames(16, 16, { length: 32, amplitude: 5 }),
      wave24: generateWaveFrames(24, 24, { length: 48, amplitude: 7 }),
      pulse12: pulse(12, 12, 24)
    }),
    []
  );

  const common = { renderer, palette } as const;

  const showcaseGrid = (
    <View style={{ gap: 6 }}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
          {[0, 1, 2].map((col) => {
            const cell = row * 3 + col;
            if (cell === 0) return <Matrix key={cell} {...common} rows={7} cols={7} pattern={digits[0]} ariaLabel="digit zero" />;
            if (cell === 1) return <Matrix key={cell} {...common} rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="wave" />;
            if (cell === 2) return <Matrix key={cell} {...common} rows={7} cols={7} pattern={chevronLeft(7, 7)} ariaLabel="left chevron" />;
            if (cell === 3) return <Matrix key={cell} {...common} rows={7} cols={7} pattern={chevronRight(7, 7)} ariaLabel="right chevron" />;
            if (cell === 4) return <Matrix key={cell} {...common} rows={7} cols={7} frames={pulse(7, 7, 18)} fps={16} loop ariaLabel="pulse" />;
            if (cell === 5) return <Matrix key={cell} {...common} rows={7} cols={7} frames={ripple(7, 7, { length: 42, wavelength: 3.5, speed: 6 })} fps={24} loop ariaLabel="ripple" />;
            if (cell === 6) return <Matrix key={cell} {...common} rows={7} cols={7} frames={snake(7, 7, 4)} fps={24} loop ariaLabel="snake" />;
            if (cell === 7) return <Matrix key={cell} {...common} rows={7} cols={7} frames={generateLoaderFrames(7, 7)} fps={18} loop ariaLabel="loader" />;
            return <Matrix key={cell} {...common} rows={7} cols={7} mode="vu" levels={levels.slice(0, 7)} ariaLabel="vu mini" />;
          })}
        </View>
      ))}
    </View>
  );

  const benchmarkView = (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <ScenarioCard title="7x7 Wave" description="Small baseline animation.">
        <Matrix {...common} rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="7x7 wave benchmark" />
      </ScenarioCard>

      <ScenarioCard title="7x12 Loader" description="Common indicator width with more columns.">
        <Matrix {...common} rows={7} cols={12} frames={loaderFrames} fps={18} loop ariaLabel="7x12 loader benchmark" />
      </ScenarioCard>

      <ScenarioCard title="16x16 Wave" description="Mid-sized stress case for a single animated grid.">
        <Matrix {...common} rows={16} cols={16} size={7} gap={2} frames={benchmarkFrames.wave16} fps={24} loop ariaLabel="16x16 benchmark" />
      </ScenarioCard>

      <ScenarioCard title="24x24 Wave" description="Larger single-instance stress case.">
        <Matrix {...common} rows={24} cols={24} size={4} gap={1} frames={benchmarkFrames.wave24} fps={24} loop ariaLabel="24x24 benchmark" />
      </ScenarioCard>

      <ScenarioCard title="4x 12x12 Pulse" description="Four concurrent animations for dashboard-style load.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {Array.from({ length: 4 }, (_, index) => (
            <Matrix
              key={`pulse-${index}`}
              {...common}
              rows={12}
              cols={12}
              size={6}
              gap={2}
              frames={benchmarkFrames.pulse12}
              fps={18}
              loop
              ariaLabel={`12x12 pulse ${index + 1}`}
            />
          ))}
        </View>
      </ScenarioCard>

      <ScenarioCard title="12-column VU" description="Live updates every 80ms.">
        <Matrix {...common} rows={7} cols={12} mode="vu" levels={levels} ariaLabel="VU benchmark" />
      </ScenarioCard>

      <ScenarioCard title="3x3 Showcase" description="Mixed animation set close to a real gallery/demo screen.">
        {showcaseGrid}
      </ScenarioCard>
    </ScrollView>
  );

  const demoView = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
      {demo === 'digit' && <Matrix {...common} rows={7} cols={5} pattern={digits[5]} ariaLabel="Number five" />}
      {demo === 'wave' && <Matrix {...common} rows={7} cols={7} frames={waveFrames} fps={20} loop ariaLabel="Wave animation" />}
      {demo === 'loader' && <Matrix {...common} rows={7} cols={12} frames={loaderFrames} fps={18} loop ariaLabel="Loader" />}
      {demo === 'pulse' && <Matrix {...common} rows={7} cols={12} frames={pulseFrames} fps={16} loop ariaLabel="Pulse" />}
      {demo === 'vu' && <Matrix {...common} rows={7} cols={12} mode="vu" levels={levels} ariaLabel="VU meter" />}
      {demo === 'snake' && <Matrix {...common} rows={7} cols={12} frames={snake(7, 12)} fps={20} loop ariaLabel="Snake" />}
      {demo === 'chevrons' && (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Matrix {...common} rows={7} cols={7} pattern={chevronLeft(7, 7)} ariaLabel="Chevron left" />
          <Matrix {...common} rows={7} cols={7} pattern={chevronRight(7, 7)} ariaLabel="Chevron right" />
        </View>
      )}
      {demo === 'ripple' && <Matrix {...common} rows={7} cols={7} frames={rippleFrames} fps={24} loop ariaLabel="Ripple" />}
      {demo === 'showcase3x3' && showcaseGrid}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 12, gap: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>react-native-dotgrid</Text>
        <Text style={{ color: '#8d8d8d', fontSize: 12 }}>Default renderer: {renderer}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 12, justifyContent: 'center' }}>
        <Button active={renderer === 'skia'} label="skia" onPress={() => setRenderer('skia')} />
        <Button active={renderer === 'svg'} label="svg" onPress={() => setRenderer('svg')} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, padding: 12 }}
        style={{ flexGrow: 0 }}
      >
        {(['digit', 'wave', 'loader', 'pulse', 'vu', 'snake', 'chevrons', 'ripple', 'showcase3x3', 'benchmark'] as Demo[]).map((key) => (
          <Button key={key} active={demo === key} label={key} onPress={() => setDemo(key)} />
        ))}
      </ScrollView>

      {demo === 'benchmark' ? benchmarkView : demoView}
    </SafeAreaView>
  );
}
