# ui-canvas benchmark

Minimal NativeScript 9 app that exercises `@nativescript-community/ui-canvas` and prints `BENCH|...` lines.

- `app/bench.ts`: offscreen suite (`run()`, bitmap `Canvas`) and on-screen suite (`runView()`, real `CanvasView`, time inside the draw callback).
  On Android the on-screen suite interleaves `wrapper` (current Proxy classes), `raw` (platform API directly) and `fwd` (hand-written forwarder, no Proxy).
- `app/app.ts`: runs both after launch. `package.json` installs the built `packages/ui-canvas` from a tarball (`npm pack` in `packages/ui-canvas`, then fix the `file:` path).
- `app/smoke.ts`: functional smoke test of the Android wrapper classes (pixel checks, array/wrapper arguments, paint font/colour/shadow, StaticLayout, unknown-property reads). Prints `SMOKE|...` and `SMOKE_DONE|passed/total`; 30/32 before and after the forwarder change (the two misses are existing behaviour: `clear()` draws transparent without clearing, and `hasOwnProperty` is forwarded to the Java object).
- `results-*.txt`: raw output. `*-before` / `*-after` are the Android Proxy replacement, run back to back on a dedicated emulator.

## Running

```bash
export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 ANDROID_HOME=$HOME/Library/Android/sdk
cd bench && npm install --legacy-peer-deps
ns run ios --no-hmr --no-watch            # results: xcrun simctl spawn booted log show --last 5m --predicate 'process == "benchapp"' | grep BENCH
ns run android --no-hmr --no-watch        # results: adb logcat -d -s JS | grep BENCH
```

For the `quickjs-ng` runtime set `android.runtimePackageName: '@nativescript/android-quickjs-ng'` and pass `--env.commonjs` (the static binding generator cannot read the `.mjs` bundle).

## Caveats

Simulator and emulator, debug builds, a busy machine. Absolute numbers swing 3-4x between runs, so only compare numbers from the same run (the on-screen suite is interleaved for that reason).
Tight-loop per-op numbers underestimate the Proxy cost: mixed frames are several times slower than the sum of their per-op loops.

## Android Proxy replacement (on-screen CanvasView, ms per frame in the draw callback)

Median of two interleaved passes, same emulator, same session.

| Runtime | Frame | Before | After | Raw native |
|---|---|---|---|---|
| V8 | 2000 rects | 3.95 | 3.06 | 3.0 |
| V8 | 500 rects + 100 lines + 30 texts | 1.41 | 1.14 | 1.1 |
| quickjs-ng | 2000 rects | 8.3 | 4.5 | 3.2 |
| quickjs-ng | 500 rects + 100 lines + 30 texts | 2.95 | 1.54 | 1.25 |
