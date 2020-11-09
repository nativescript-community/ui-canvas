import { Color } from '@nativescript/core';
import { Canvas, Paint, Style, createRect } from '@nativescript-community/ui-canvas';

export function onNavigatedTo(args) {
    const page = args.object;
    page.bindingContext = args.context;
}

export function onDraw(args) {
    const canvas: Canvas = args.canvas;

    // const deviceScale = screen.mainScreen.scale;
    // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
    // canvas.setDensity(Math.round(scale * 160));
    // canvas.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
    console.log('onDraw canvas:', canvas.getWidth(), canvas.getHeight());

    const bgPaint = new Paint();
    bgPaint.setAntiAlias(true);
    bgPaint.setTextSize(16);
    bgPaint.setColor('yellow');
    bgPaint.strokeWidth = 10;

    // rect
    canvas.drawRect(createRect(0, 0, 100, 100), bgPaint);
    bgPaint.setStyle(Style.STROKE);
    bgPaint.setColor(new Color(255, 0, 255, 0));
    canvas.drawRect(createRect(10, 10, 80, 80), bgPaint);
    bgPaint.setStyle(Style.STROKE);
    bgPaint.strokeWidth = 1;
    bgPaint.setColor(new Color(255, 255, 255, 0));
    canvas.drawRect(createRect(0, 0, 50, 50), bgPaint);
    bgPaint.setStyle(Style.FILL);
    bgPaint.setColor(new Color(255, 0, 0, 0));
    canvas.drawText('test', 0, 20, bgPaint);
}

export function onNavigationButtonTap(args) {
    args.object.page.frame.goBack();
}
