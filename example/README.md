# Example (Expo)

Expo example app for:

- validating the default Skia `Picture` renderer;
- comparing `renderer="skia"` against `renderer="svg"`; and
- exercising fixed benchmark scenarios across several grid sizes.

The default path is native-first Skia. Use the SVG toggle as a fallback and regression oracle, not as a required startup dependency.

## Run

Install dependencies from the workspace root:

```bash
cd /Users/tristan/Projects/react-native-dotgrid
npm install
npm run example:web
```

For native development:

```bash
cd /Users/tristan/Projects/react-native-dotgrid
npm run example:ios
```

Use the in-app renderer toggle to flip between Skia and SVG, then switch to the `benchmark` screen to compare:

- single 7x7, 7x12, 16x16, and 24x24 grids;
- four concurrent 12x12 animations;
- a live 12-column VU meter; and
- the 3x3 showcase screen.

If you need to run Expo commands directly, do it from [/Users/tristan/Projects/react-native-dotgrid/example](/Users/tristan/Projects/react-native-dotgrid/example) after the root install has completed.
