import { Color, Screen } from '@nativescript/core';
import { Canvas, Cap, Paint, Style, createRect, createRectF } from '@nativescript-community/ui-canvas';
import TWEEN from '@nativescript-community/tween';

let currentArcAngle = 0;

export function onNavigatedTo(args) {
    const page = args.object;
    page.bindingContext = args.context;
}

export function onDraw(args) {
    const canvas: Canvas = args.canvas;

    // const deviceScale = screen.mainScreen.scale;
    // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp

    const w = canvas.getWidth();
    const h = canvas.getHeight();
    const width = Math.min(w, h) - 40;

    const bgPaint = new Paint();
    bgPaint.setAntiAlias(true);
    bgPaint.setColor('yellow');
    bgPaint.strokeWidth = 10;

    bgPaint.color = 'yellow';
    bgPaint.setStyle(Style.STROKE);
    bgPaint.setStrokeCap(Cap.ROUND);
    canvas.drawArc(createRectF(20, 20, width, width), 90, currentArcAngle, false, bgPaint);
}

export function startAnimation(args) {
    const page = args.object.page;
    const canvas = page.getViewById('canvas');
    new TWEEN.Tween({ value: 0 })
        .to({ value: 360 }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(obj => {
            currentArcAngle = obj.value;
            canvas.redraw();
        })
        .start(0);
}
