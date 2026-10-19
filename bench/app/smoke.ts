/**
 * Functional smoke test for the Android wrapper classes (ProxyClass forwarders).
 * Prints `SMOKE|<name>|ok|fail|<detail>` and `SMOKE_DONE|<passed>/<total>`.
 */
import { Canvas, ColorMatrixColorFilter, DashPathEffect, LayoutAlignment, LinearGradient, Paint, Path, RadialGradient, StaticLayout, Style, TileMode } from '@nativescript-community/ui-canvas';
import { Color, Font } from '@nativescript/core';

export function smoke() {
    let passed = 0;
    let total = 0;
    const check = (name: string, fn: () => any, expected?: any) => {
        total++;
        try {
            const r = fn();
            const ok = expected === undefined ? r !== false : r === expected;
            if (ok) passed++;
            console.log(`SMOKE|${name}|${ok ? 'ok' : 'fail'}|${ok ? '' : 'got ' + r + ' expected ' + expected}`);
        } catch (e) {
            console.log(`SMOKE|${name}|fail|threw ${e}`);
        }
    };
    const RED = -65536; // 0xFFFF0000
    const BLUE = -16776961; // 0xFF0000FF
    const px = (c: any, x: number, y: number) => c.getImage().getPixel(x, y);

    const canvas: any = new Canvas(100, 100);
    const paint: any = new Paint();
    paint.color = new Color('red');

    check('drawRect Color object paints red', () => {
        canvas.drawRect(10, 10, 50, 50, paint);
        return px(canvas, 20, 20);
    }, RED);
    check('clear() clears to transparent', () => {
        canvas.clear();
        return px(canvas, 20, 20);
    }, 0);
    check('drawColor with string', () => {
        canvas.drawColor('blue');
        return px(canvas, 5, 5);
    }, BLUE);
    check('setColor with string', () => {
        paint.setColor('red');
        canvas.drawRect(0, 0, 20, 20, paint);
        return px(canvas, 5, 5);
    }, RED);
    check('getWidth/getHeight on bitmap canvas are raw px', () => canvas.getWidth() === 100 && canvas.getHeight() === 100, true);
    check('save/restoreToCount', () => {
        const n = canvas.save();
        canvas.translate(10, 10);
        canvas.restoreToCount(n);
        return typeof n === 'number';
    });

    check('Path moveTo/lineTo/close + drawPath', () => {
        canvas.drawColor('white');
        const path: any = new Path();
        path.moveTo(10, 10);
        path.lineTo(60, 10);
        path.lineTo(60, 60);
        path.lineTo(10, 60);
        path.close();
        canvas.drawPath(path, paint);
        return px(canvas, 30, 30);
    }, RED);
    check('Path.addLines with a JS array (array unwrapping)', () => {
        const path: any = new Path();
        path.addLines([0, 0, 10, 10, 20, 0]);
        return true;
    });
    check('Path copy constructor with a wrapper argument', () => {
        const p1: any = new Path();
        p1.addRect(0, 0, 10, 10, android.graphics.Path.Direction.CW);
        return !!new Path(p1 as any);
    });
    check('drawLines with a JS array', () => {
        canvas.drawLines([0, 0, 50, 50, 0, 50, 50, 0], paint);
        return true;
    });

    check('Paint.setTextSize / getTextSize / textSize accessor', () => {
        paint.setTextSize(20);
        const a = paint.getTextSize();
        paint.textSize = 30;
        return a === 20 && paint.textSize === 30;
    });
    check('Paint.setStyle + strokeWidth', () => {
        paint.setStyle(Style.STROKE);
        paint.setStrokeWidth(3);
        return paint.getStrokeWidth() === 3;
    });
    check('Paint.setShadowLayer with a color string', () => {
        paint.setShadowLayer(3, 1, 1, 'black');
        return true;
    });
    check('Paint copy constructor keeps the size', () => {
        paint.setTextSize(22);
        const c: any = new Paint(paint);
        return c.getTextSize() === 22;
    });
    check('Paint.setTypeface(Font) returns the font', () => {
        const f = paint.setTypeface(Font.default);
        return f !== undefined;
    });
    check('Paint.getFontFamily / font accessors', () => typeof paint.font === 'object' && paint.fontFamily === paint.font.fontFamily);
    check('Paint font change reaches the native typeface', () => {
        paint.setFontFamily('serif');
        // getNative() applies the pending font
        return !!paint.getNative().getTypeface();
    });
    check('Paint.getFontMetrics + measureText', () => {
        paint.setTextSize(20);
        return paint.measureText('hello') > 0;
    });
    check('drawText', () => {
        canvas.drawText('hello', 10, 50, paint);
        return true;
    });

    check('LinearGradient with arrays + setShader (wrapper arg)', () => {
        const g: any = new LinearGradient(0, 0, 100, 0, ['red', 'blue'], [0, 1], TileMode.CLAMP);
        const p: any = new Paint();
        p.setStyle(Style.FILL);
        p.setShader(g);
        canvas.drawRect(0, 0, 100, 100, p);
        return px(canvas, 2, 50) !== px(canvas, 98, 50);
    });
    check('RadialGradient', () => {
        const g: any = new RadialGradient(50, 50, 40, 'red', 'blue', TileMode.CLAMP);
        const p: any = new Paint();
        p.setShader(g);
        canvas.drawCircle(50, 50, 40, p);
        return true;
    });
    check('DashPathEffect + setPathEffect', () => {
        const p: any = new Paint();
        p.setPathEffect(new DashPathEffect([5, 5], 0));
        canvas.drawLine(0, 0, 50, 50, p);
        return true;
    });
    check('ColorMatrixColorFilter + setColorFilter', () => {
        const p: any = new Paint();
        p.setColorFilter(new ColorMatrixColorFilter([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]));
        return true;
    });

    check('StaticLayout create/draw/getHeight/getActualWidth', () => {
        const p: any = new Paint();
        p.setTextSize(14);
        const sl: any = new StaticLayout('hello world, this wraps', p, 60, LayoutAlignment.ALIGN_NORMAL, 1, 0, true, null, 60, 100);
        sl.draw(canvas);
        return sl.getHeight() > 0 && sl.getActualWidth() > 0 && sl.getLineCount() > 1;
    });
    check('StaticLayout.getDesiredWidth (static)', () => StaticLayout.getDesiredWidth('abc', paint) > 0);

    check('unknown property reads are undefined (and repeatable)', () => {
        return (canvas as any).doesNotExist === undefined && (canvas as any).doesNotExist === undefined && (paint as any).then === undefined;
    });
    check('own fields still assignable after a cached miss', () => {
        const c: any = new Canvas(10, 10);
        const a = c.someField; // cached as undefined on the prototype
        c.someField = 5;
        const d: any = new Canvas(10, 10);
        return a === undefined && c.someField === 5 && d.someField === undefined;
    });
    check('second instance uses the already installed forwarders', () => {
        const c: any = new Canvas(20, 20);
        c.drawRect(0, 0, 20, 20, paint);
        return typeof c.drawRect === 'function' && c.getWidth() === 20;
    });
    check('instanceof Object / toString / hasOwnProperty still work', () => {
        return canvas instanceof Object && typeof canvas.toString() === 'string' && canvas.hasOwnProperty('mNative');
    });
    check('Canvas without native (no bitmap): methods are undefined, not a crash', () => {
        const c: any = new Canvas();
        return c.drawRect === undefined || typeof c.drawRect === 'function';
    });
    check('Canvas wrapping a native canvas + getWidth uses dips', () => {
        const nativeCanvas = new android.graphics.Canvas(android.graphics.Bitmap.createBitmap(100, 100, android.graphics.Bitmap.Config.ARGB_8888));
        const c: any = new Canvas(nativeCanvas);
        const w = c.getWidth();
        return w > 0 && w <= 100;
    });
    check('release() recycles', () => {
        const c: any = new Canvas(10, 10);
        c.release();
        return c.getImage() === null;
    });

    console.log(`SMOKE_DONE|${passed}/${total}`);
}
