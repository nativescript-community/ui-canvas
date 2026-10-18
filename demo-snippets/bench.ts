/**
 * ui-canvas micro benchmarks. Offscreen bitmap Canvas, so only the JS<->native bridge and
 * the wrapper cost is measured, not on-screen compositing.
 *
 * Results are printed as `BENCH|<group>|<name>|<us per op median>|<us per op min>|<ops per batch>`
 * and the run ends with `BENCH_DONE`.
 *
 * Each `raw:` variant does the same drawing with the platform API directly (no wrapper),
 * so `wrapper - raw` is what the wrapper costs.
 */
import { Canvas, LayoutAlignment, Paint, Path, StaticLayout } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core';

const now: () => number = (global as any).performance?.now ? () => (global as any).performance.now() : () => Date.now();

const TARGET_MS = 60;
const REPS = 7;
const results: any[] = [];

function bench(group: string, name: string, fn: (n: number) => void, perOp = 1) {
    // calibrate
    let n = 50;
    for (;;) {
        const s = now();
        fn(n);
        const d = now() - s;
        if (d > 15 || n > 2e6) {
            n = Math.max(10, Math.round((n * TARGET_MS) / Math.max(d, 0.5)));
            break;
        }
        n *= 4;
    }
    fn(n); // warmup
    const samples: number[] = [];
    for (let r = 0; r < REPS; r++) {
        const s = now();
        fn(n);
        samples.push(((now() - s) * 1000) / (n * perOp));
    }
    samples.sort((a, b) => a - b);
    const median = samples[REPS >> 1];
    const min = samples[0];
    results.push({ group, name, median, min, n });
    console.log(`BENCH|${group}|${name}|${median.toFixed(3)}|${min.toFixed(3)}|${n}`);
}

export function run() {
    console.log('BENCH_START|' + (__IOS__ ? 'ios' : 'android'));
    const W = 400;
    const H = 400;
    const canvas: any = new Canvas(W, H);
    const paint: any = new Paint();
    paint.color = new Color('red');
    paint.strokeWidth = 2;
    paint.setTextSize(14);

    // ---- 1. unit bridge cost ----
    bench('unit', 'empty js loop', (n) => {
        let x = 0;
        for (let i = 0; i < n; i++) {
            x += i;
        }
        return x as any;
    });
    if (__ANDROID__) {
        const nc: android.graphics.Canvas = canvas.getNative();
        const np: android.graphics.Paint = paint.getNative();
        bench('unit', 'raw: paint.setStrokeWidth (1 java call)', (n) => {
            for (let i = 0; i < n; i++) {
                np.setStrokeWidth(2);
            }
        });
        bench('unit', 'raw: canvas.save+restore (2 java calls)', (n) => {
            for (let i = 0; i < n; i++) {
                nc.save();
                nc.restore();
            }
        });
    } else {
        const ctx = canvas.ctx;
        bench('unit', 'raw: CGContextSetAlpha (1 c call)', (n) => {
            for (let i = 0; i < n; i++) {
                CGContextSetAlpha(ctx, 1);
            }
        });
        bench('unit', 'raw: CGContextSave+Restore (2 c calls)', (n) => {
            for (let i = 0; i < n; i++) {
                CGContextSaveGState(ctx);
                CGContextRestoreGState(ctx);
            }
        });
    }

    // ---- 2. primitives, wrapper vs raw ----
    bench('wrapper', 'canvas.save+restore', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.save();
            canvas.restore();
        }
    });
    bench('wrapper', 'canvas.translate', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.translate(1, 1);
        }
        canvas.translate(-n, -n);
    });
    bench('wrapper', 'canvas.getWidth', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.getWidth();
        }
    });
    bench('wrapper', 'paint.color = Color', (n) => {
        const c = new Color('green');
        for (let i = 0; i < n; i++) {
            paint.color = c;
        }
    });
    bench('wrapper', 'paint.color = string', (n) => {
        for (let i = 0; i < n; i++) {
            paint.color = 'green';
        }
    });
    paint.color = new Color('red');
    bench('wrapper', 'paint.setStrokeWidth', (n) => {
        for (let i = 0; i < n; i++) {
            paint.setStrokeWidth(2);
        }
    });
    bench('wrapper', 'drawRect(l,t,r,b,paint)', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.drawRect(10, 10, 60, 60, paint);
        }
    });
    bench('wrapper', 'drawLine', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.drawLine(10, 10, 200, 90, paint);
        }
    });
    bench('wrapper', 'drawCircle', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.drawCircle(100, 100, 30, paint);
        }
    });
    bench('wrapper', 'drawText(short)', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.drawText('Hello world', 10, 100, paint);
        }
    });
    bench('wrapper', 'drawRoundRect(RectF)', (n) => {
        // RectF alloc is part of what callers pay
        for (let i = 0; i < n; i++) {
            canvas.drawRoundRect(10, 10, 60, 60, 5, 5, paint);
        }
    });

    const path: any = new Path();
    path.moveTo(0, 0);
    for (let i = 1; i <= 20; i++) {
        path.lineTo(i * 10, (i % 2) * 40);
    }
    bench('wrapper', 'drawPath(20 pts, prebuilt)', (n) => {
        for (let i = 0; i < n; i++) {
            canvas.drawPath(path, paint);
        }
    });
    bench(
        'wrapper',
        'path build (new Path + 100 lineTo) per lineTo',
        (n) => {
            for (let i = 0; i < n; i++) {
                const p: any = new Path();
                p.moveTo(0, 0);
                for (let j = 1; j < 100; j++) {
                    p.lineTo(j, j % 40);
                }
            }
        },
        100
    );

    // ---- 3. platform raw equivalents ----
    if (__ANDROID__) {
        const nc: android.graphics.Canvas = canvas.getNative();
        const np: android.graphics.Paint = paint.getNative();
        const npath = path.getNative();
        bench('raw', 'raw drawRect', (n) => {
            for (let i = 0; i < n; i++) {
                nc.drawRect(10, 10, 60, 60, np);
            }
        });
        bench('raw', 'raw drawLine', (n) => {
            for (let i = 0; i < n; i++) {
                nc.drawLine(10, 10, 200, 90, np);
            }
        });
        bench('raw', 'raw drawCircle', (n) => {
            for (let i = 0; i < n; i++) {
                nc.drawCircle(100, 100, 30, np);
            }
        });
        bench('raw', 'raw drawText(short)', (n) => {
            for (let i = 0; i < n; i++) {
                nc.drawText('Hello world', 10, 100, np);
            }
        });
        bench('raw', 'raw drawPath', (n) => {
            for (let i = 0; i < n; i++) {
                nc.drawPath(npath, np);
            }
        });
        bench('raw', 'raw getWidth', (n) => {
            for (let i = 0; i < n; i++) {
                nc.getWidth();
            }
        });
        bench(
            'raw',
            'raw path build per lineTo',
            (n) => {
                for (let i = 0; i < n; i++) {
                    const p = new com.akylas.canvas.CanvasPath();
                    p.moveTo(0, 0);
                    for (let j = 1; j < 100; j++) {
                        p.lineTo(j, j % 40);
                    }
                }
            },
            100
        );
        // what a massifmaps-style prototype forwarder would cost: JS class, fixed arity, no Proxy
        class Fwd {
            constructor(public n: android.graphics.Canvas) {}
            drawRect(l, t, r, b, p) {
                this.n.drawRect(l, t, r, b, p.mNative);
            }
            drawLine(a, b, c, d, p) {
                this.n.drawLine(a, b, c, d, p.mNative);
            }
            drawCircle(x, y, r, p) {
                this.n.drawCircle(x, y, r, p.mNative);
            }
            drawText(t, x, y, p) {
                this.n.drawText(t, x, y, p.mNative);
            }
            drawPath(pa, p) {
                this.n.drawPath(pa.mNative, p.mNative);
            }
            save() {
                return this.n.save();
            }
            restore() {
                this.n.restore();
            }
        }
        const f = new Fwd(nc);
        const pm: any = paint;
        const pam: any = path;
        // fetch mNative once so we don't measure the proxy trap on the field read
        const rawP = { mNative: pm.mNative };
        const rawPath = { mNative: pam.mNative };
        bench('forwarder', 'fwd drawRect', (n) => {
            for (let i = 0; i < n; i++) {
                f.drawRect(10, 10, 60, 60, rawP);
            }
        });
        bench('forwarder', 'fwd drawLine', (n) => {
            for (let i = 0; i < n; i++) {
                f.drawLine(10, 10, 200, 90, rawP);
            }
        });
        bench('forwarder', 'fwd drawCircle', (n) => {
            for (let i = 0; i < n; i++) {
                f.drawCircle(100, 100, 30, rawP);
            }
        });
        bench('forwarder', 'fwd drawText(short)', (n) => {
            for (let i = 0; i < n; i++) {
                f.drawText('Hello world', 10, 100, rawP);
            }
        });
        bench('forwarder', 'fwd drawPath', (n) => {
            for (let i = 0; i < n; i++) {
                f.drawPath(rawPath, rawP);
            }
        });
        bench('forwarder', 'fwd save+restore', (n) => {
            for (let i = 0; i < n; i++) {
                f.save();
                f.restore();
            }
        });
    } else {
        const ctx = canvas.ctx;
        const cgColor = UIColor.redColor.CGColor;
        CGContextSetStrokeColorWithColor(ctx, cgColor);
        CGContextSetFillColorWithColor(ctx, cgColor);
        bench('raw', 'raw drawRect (Begin+AddRect+DrawPath, state preset)', (n) => {
            for (let i = 0; i < n; i++) {
                CGContextBeginPath(ctx);
                CGContextAddRect(ctx, CGRectMake(10, 10, 50, 50));
                CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFill);
            }
        });
        bench('raw', 'raw drawLine (Begin+Move+AddLine+DrawPath)', (n) => {
            for (let i = 0; i < n; i++) {
                CGContextBeginPath(ctx);
                CGContextMoveToPoint(ctx, 10, 10);
                CGContextAddLineToPoint(ctx, 200, 90);
                CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
            }
        });
        bench('raw', 'raw CGRectMake only', (n) => {
            for (let i = 0; i < n; i++) {
                CGRectMake(10, 10, 50, 50);
            }
        });
        // isolates the ~15 CG state calls the wrapper issues around every draw
        bench('raw', 'startApplyPaint+finishApplyPaint only', (n) => {
            for (let i = 0; i < n; i++) {
                const p = canvas.startApplyPaint(paint);
                canvas.finishApplyPaint(p);
            }
        });
        bench('raw', 'paint.getUIColor()', (n) => {
            for (let i = 0; i < n; i++) {
                paint.getUIColor();
            }
        });
        bench('raw', 'paint.getUIFont()', (n) => {
            for (let i = 0; i < n; i++) {
                paint.getUIFont();
            }
        });
        bench('raw', 'UIGraphicsPushContext+Pop', (n) => {
            for (let i = 0; i < n; i++) {
                UIGraphicsPushContext(ctx);
                UIGraphicsPopContext();
            }
        });
    }

    // ---- 4. static layout (canvaslabel hot object) ----
    const lp: any = new Paint();
    lp.color = new Color('black');
    lp.setTextSize(14);
    const text = 'The quick brown fox jumps over the lazy dog, several times over.';
    let sl: any;
    bench('text', 'StaticLayout create (cold)', (n) => {
        for (let i = 0; i < n; i++) {
            sl = new StaticLayout(text, lp, 200, LayoutAlignment.ALIGN_NORMAL, 1, 0, true, null, 200, 100);
        }
    });
    sl = new StaticLayout(text, lp, 200, LayoutAlignment.ALIGN_NORMAL, 1, 0, true, null, 200, 100);
    bench('text', 'StaticLayout draw (cached)', (n) => {
        for (let i = 0; i < n; i++) {
            sl.draw(canvas, 100);
        }
    });
    bench('text', 'StaticLayout getHeight+getWidth', (n) => {
        for (let i = 0; i < n; i++) {
            sl.getHeight();
            sl.getWidth();
        }
    });

    // ---- 5. frame-like composites ----
    const frame = (rects: number, lines: number, texts: number, paths: number) => (n: number) => {
        for (let i = 0; i < n; i++) {
            canvas.save();
            for (let r = 0; r < rects; r++) {
                canvas.drawRect(r % 300, r % 200, (r % 300) + 20, (r % 200) + 20, paint);
            }
            for (let l = 0; l < lines; l++) {
                canvas.drawLine(l % 300, 0, 300 - (l % 300), 300, paint);
            }
            for (let t = 0; t < texts; t++) {
                canvas.drawText('label ' + t, 10, 10 + (t % 300), paint);
            }
            for (let p = 0; p < paths; p++) {
                canvas.drawPath(path, paint);
            }
            canvas.restore();
        }
    };
    bench('frame', 'chart-ish: 500 rect + 100 line + 30 text + 5 path (us per FRAME)', frame(500, 100, 30, 5));
    bench('frame', 'dense: 2000 rect (us per FRAME)', frame(2000, 0, 0, 0));
    bench('frame', 'text heavy: 200 drawText (us per FRAME)', frame(0, 0, 200, 0));

    console.log('BENCH_DONE');
    return results;
}
