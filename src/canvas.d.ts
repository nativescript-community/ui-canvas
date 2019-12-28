import { ImageSource } from '@nativescript/core/image-source/image-source';
import { Color } from '@nativescript/core/color/color';
import { View } from '@nativescript/core/ui/core/view';

export function createRect(x: number, y: number, w: number, h: number): Rect;
export function parseCap(value: string | number): Cap;
export function parseType(value: string | number): Style;
export function parseJoin(value: string | number): Join;

export function parseDashEffect(value: string): DashPathEffect;

// export * from './canvas.android'

export class Paint {
    color: Color | number | string;
    setColor(color: Color | number | string);

    strokeWidth: number;
    strokeCap: Cap;
    strokeJoin: Join;
    style: Style;
    textSize: number;

    public getAlpha(): number;
    public getStyle(): Style;
    public setStrokeMiter(value: number): void;
    public setARGB(a: number, r: number, g: number, b: number): void;
    // public setMaskFilter(param0: android.graphics.MaskFilter): android.graphics.MaskFilter;
    public measureText(text: string): number;
    public getTextSize(): number;
    public getTextBounds(text: string, index: number, bounds: number, rect: Rect): void;
    public getFontMetrics(): FontMetrics;
    public getFontMetrics(fontMetrics?: FontMetrics): number;
    public setPathEffect(param0: PathEffect);
    public isAntiAlias(): boolean;
    public setStrokeJoin(value: Join): void;
    // public getTextWidths(param0: native.Array<string>, param1: number, param2: number, param3: native.Array<number>): number;
    public getStrokeJoin(): Join;
    public getColor(): Color;
    public getShader(): any;
    public measureText(text: string, start: number, end: number): number;
    public setTypeface(newValue: Typeface): Typeface;
    public setStrokeWidth(value: number): void;
    public setStrokeCap(value: Cap): void;
    public isDither(): boolean;
    public setAlpha(value: number): void;
    public setTextAlign(param0: Align): void;
    public setStyle(value: Style): void;
    public getStrokeMiter(): number;
    // public getMaskFilter(): android.graphics.MaskFilter;
    public setDither(value: boolean): void;
    // public set(param0: android.graphics.Paint): void;
    public getTextAlign(): Align;
    public setAntiAlias(value: boolean): void;
    // public ascent(): number;
    // public getFillPath(param0: android.graphics.Path, param1: android.graphics.Path): boolean;
    public getStrokeWidth(): number;
    public getStrokeCap(): Cap;
    public setTextSize(value: number): void;
    public setShader(value: any): any;
    // public descent(): number;
    public setShadowLayer(radius: number, dx: number, dy: number, color: number | string | Color): void;
    public clearShadowLayer();
    // public getFontSpacing(): number;
}

export class StaticLayout {
    constructor(text: string, paint: Paint, width: number, align, spacingmult, spacingadd, includepad);
}

export class FontMetrics {
    ascent?: number;
    descent?: number;
    bottom?: number;
    leading?: number;
    top?: number;
}
export class Canvas {
    constructor(imageOrWidth: any /*  ImageSource | android.graphics.Bitmap | UIImage | number */, height?: number);

    clear(); // clear the canvas by filling with transparent color
    release(); // release all data (image and such). Only to be called on destroy
    getImage(): any; //android.graphics.Bitmap | UIImage;

    getDensity(): number;
    setDensity(density: number): void;
    getDrawFilter(): DrawFilter;
    setDrawFilter(filter: DrawFilter): void;

    rotate(degrees: number): void;
    rotate(degrees: number, px: number, py: number): void;
    scale(sx: number, sy: number, px: number, py: number): void;
    translate(dx: number, dy: number): void;
    skew(sx: number, sy: number): void;
    scale(sx: number, sy: number): void;
    // isHardwareAccelerated(): boolean;

    getClipBounds(): Rect;
    getHeight(): number;
    getWidth(): number;
    restore(): void;
    restoreToCount(count: number): void;
    save(): number;

    drawPaint(apint: Paint): void;

    drawARGB(a: number, r: number, g: number, b: number): void;
    drawRGB(r: number, g: number, b: number): void;
    drawColor(color: number | Color): void;

    drawBitmap(bitmap: any /* android.graphics.Bitmap | UIImage | ImageSource */, src: Rect, dest: Rect, paint: Paint): void;
    drawBitmap(bitmap: any /* android.graphics.Bitmap | UIImage | ImageSource */, x: number, y: number, paint: Paint): void;

    drawRect(left: number, top: number, right: number, bottom: number, paint: Paint): void;
    drawRect(rect: Rect, paint: Paint): void;
    drawRoundRect(left: number, top: number, right: number, bottom: number, rx: number, ry: number, paint: Paint): void;
    drawRoundRect(rect: Rect, rx: number, ry: number, paint: Paint): void;
    drawPoint(x: number, y: number, paint: Paint): void;
    drawText(text: string, start: number, end: number, x: number, y: number, paint: Paint): void;
    drawText(char: any[], index: number, count: number, x: number, y: number, paint: Paint): void;
    drawText(text: string, x: number, y: number, paint: Paint): void;
    drawTextOnPath(text: string, path: Path, hOffset: number, vOffset: number, paint: Paint): void;
    drawTextRun(text: string, start: number, end: number, contextStart: number, contextEnd: number, x: number, y: number, isRtl: boolean, paint: Paint): void;
    drawPosText(text: string, pos: number[], paint: Paint): void;

    drawPosText(text: string[], index: number, count: number, pos: number[], paint: Paint): void; // deprecated

    // saveLayer(param0: number, param1: number, param2: number, param3: number, param4: android.graphics.Paint, param5: number): number;
    drawPoints(pts: number[], paint: Paint): void;
    drawLine(startX: number, startY: number, stopX: number, stopY: number, paint: Paint): void;
    drawLines(pts: number[], offset: number, count: number, paint: Paint): void;
    drawLines(pts: number[], paint: Paint): void;
    drawCircle(cx: number, cy: number, radius: number, paint: Paint): void;

    drawArc(rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
    drawArc(left: number, top: number, right: number, bottom: number, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
    drawOval(rect: Rect, paint: Paint): void;
    drawOval(left: number, top: number, right: number, bottom: number, paint: Paint): void;
    drawPath(path: Path, paint: Paint): void;

    clipRect(rect: Rect): boolean;
    clipRect(left: number, top: number, right: number, bottom: number): boolean;
    clipRect(left: number, top: number, right: number, bottom: number, op: Op): boolean;
    clipRect(rect: Rect, op: Op): boolean;
    clipOutPath(path: Path): boolean;
    clipOutRect(left: number, top: number, right: number, bottom: number): boolean;
    clipOutRect(rect: Rect): boolean;
    clipPath(path: Path): boolean;
    clipPath(path: Path, op: Op): boolean;
    setBitmap(image);
    // getSaveCount(): number;
    // setMatrix(param0: android.graphics.Matrix): void;
    // getClipBounds(param0: android.graphics.Rect): boolean;
    // saveLayerAlpha(param0: number, param1: number, param2: number, param3: number, param4: number): number;
    // restoreToCount(param0: number): void;
    // saveLayerAlpha(param0: android.graphics.RectF, param1: number): number;
    // saveLayer(param0: number, param1: number, param2: number, param3: number, param4: Paint): number;
    // saveLayerAlpha(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): number;
    // drawPoints(param0: native.Array<number>, param1: number, param2: number, param3: android.graphics.Paint): void;
    drawView(view: View, rect?: Rect);
}
export class Typeface extends android.graphics.Typeface {}
export class Cap extends android.graphics.Paint.Cap {}
export class Join extends android.graphics.Paint.Join {}
export class Style extends android.graphics.Paint.Style {}
export class Align extends android.graphics.Paint.Align {}
export class Rect {
    public constructor(param0: number, param1: number, param2: number, param3: number);
    left: number;
    top: number;
    right: number;
    bottom: number;
    public inset(param0: number, param1: number): void;
    public union(param0: number, param1: number): void;
    public offsetTo(param0: number, param1: number): void;
    public offset(param0: number, param1: number): void;
    public height(): number;
    public width(): number;
    public centerX(): number;
    public centerY(): number;
    public intersect(param0: Rect): boolean;
    public contains(param0: Rect): boolean;
    public set(param0: Rect);
    public set(param0: number, param1: number, param2: number, param3: number);
    public contains(param0: number, param1: number, param2: number, param3: number): boolean;
    public intersect(param0: number, param1: number, param2: number, param3: number): boolean;
}
export class RadialGradient extends android.graphics.RadialGradient {}
export class LinearGradient extends android.graphics.LinearGradient {}
export class TileMode extends android.graphics.Shader.TileMode {}
export class Path {
    isRect(param0: Rect): boolean;
    rMoveTo(param0: number, param1: number): void;
    arcTo(param0: Rect, param1: number, param2: number, param3: boolean): void;
    arcTo(param0: Rect, param1: number, param2: number): void;
    offset(param0: number, param1: number): void;
    rCubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
    rQuadTo(param0: number, param1: number, param2: number, param3: number): void;
    addRoundRect(param0: Rect, param1: number, param2: number, param3: Direction): void;
    addRoundRect(param0: Rect, param1: number[], param2: Direction): void;
    offset(param0: number, param1: number, param2: Path): void;
    addPath(param0: Path, param1: Matrix): void;
    addPath(param0: Path, param1: number, param2: number): void;
    rLineTo(param0: number, param1: number): void;
    lineTo(param0: number, param1: number): void;
    quadTo(param0: number, param1: number, param2: number, param3: number): void;
    transform(param0: Matrix, param1: Path): void;
    reset(): void;
    addArc(param0: Rect, param1: number, param2: number): void;
    addPath(param0: Path): void;
    close(): void;
    addCircle(param0: number, param1: number, param2: number, param3: Direction): void;
    rewind(): void;
    setLastPoint(param0: number, param1: number): void;
    toggleInverseFillType(): void;
    moveTo(param0: number, param1: number): void;
    transform(param0: Matrix): void;
    setFillType(param0: FillType): void;
    isEmpty(): boolean;
    cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
    constructor();
    incReserve(param0: number): void;
    getFillType(): FillType;
    addRect(param0: number, param1: number, param2: number, param3: number, param4: Direction): void;
    addOval(param0: Rect, param1: Direction): void;
    constructor(param0: Path);
    addRect(param0: Rect, param1: Direction): void;
    isInverseFillType(): boolean;
    set(param0: Path): void;
}
export class DrawFilter extends android.graphics.DrawFilter {}
export class Op extends android.graphics.Region.Op {}
export class Direction extends android.graphics.Path.Direction {}
export class FillType extends android.graphics.Path.FillType {}
export class Matrix extends android.graphics.Matrix {
    mapRect(rect: Rect);
}
export class PathEffect extends android.graphics.PathEffect {}
export class DashPathEffect extends android.graphics.DashPathEffect {
    constructor(intervals: number[], phase: number);
}
// declare Paint extends get Canvas() {
//     return android.graphics.Canvas;
// },
// get Paint() {
//     return android.graphics.Paint;
// },
// get Cap() {
//     return android.graphics.Paint.Cap;
// },
// get Join() {
//     return android.graphics.Paint.Join;
// }

declare class CanvasView extends View {
    protected onDraw(canvas: Canvas);
    redraw();
    invalidate();
}

export function createImage(options: { width: number; height: number; scale?: number; config?: any }): ImageSource;
export function releaseImage(image: ImageSource);
