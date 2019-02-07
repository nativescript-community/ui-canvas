import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { Color } from 'tns-core-modules/color/color';
import { View } from 'tns-core-modules/ui/core/view';

// export * from './canvas.android'

export class Paint extends android.graphics.Paint {
    color: Color | number | string;
    setColor(color: Color | number | string);

    strokeWidth: number;
    strokeCap: Cap;
    strokeJoin: Join;
    style: Style;
    s;
    textSize: number;
}
export class Canvas {
    constructor(imageOrWidth: ImageSource | android.graphics.Bitmap | UIImage | number, height?: number);
    getImage(): android.graphics.Bitmap | UIImage;
    drawBitmap(bitmap: android.graphics.Bitmap | UIImage | ImageSource, param1: Rect, param2: Rect, paint: Paint): void;
    drawBitmap(bitmap: android.graphics.Bitmap | UIImage | ImageSource, x: number, y: number, paint: Paint): void;
    clipOutRect(param0: number, param1: number, param2: number, param3: number): boolean;
    drawRoundRect(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number, param6: Paint): void;
    rotate(param0: number): void;
    drawTextRun(param0: string, param1: number, param2: number, param3: number, param4: number, param5: number, param6: number, param7: boolean, param8: Paint): void;
    // isHardwareAccelerated(): boolean;
    drawRoundRect(param0: Rect, param1: number, param2: number, param3: Paint): void;
    drawARGB(param0: number, param1: number, param2: number, param3: number): void;
    getWidth(): number;
    restore(): void;
    // drawBitmap(param0: android.graphics.Bitmap, param1: android.graphics.Matrix, param2: android.graphics.Paint): void;
    // drawBitmapMesh(param0: android.graphics.Bitmap, param1: number, param2: number, param3: native.Array<number>, param4: number, param5: native.Array<number>, param6: number, param7: android.graphics.Paint): void;
    // drawColor(param0: number, param1: android.graphics.PorterDuff.Mode): void;
    drawPoint(param0: number, param1: number, param2: Paint): void;
    drawPosText(param0: string[], param1: number, param2: number, param3: number[], param4: Paint): void;
    drawText(param0: string, param1: number, param2: number, param3: number, param4: number, param5: Paint): void;
    // saveLayer(param0: number, param1: number, param2: number, param3: number, param4: android.graphics.Paint, param5: number): number;
    drawPoints(param0: number[], param1: Paint): void;
    clipPath(param0: Path): boolean;
    // getSaveCount(): number;
    // setMatrix(param0: android.graphics.Matrix): void;
    // getClipBounds(param0: android.graphics.Rect): boolean;
    // saveLayerAlpha(param0: number, param1: number, param2: number, param3: number, param4: number): number;
    drawColor(param0: number | Color): void;
    clipOutRect(param0: Rect): boolean;
    drawOval(param0: Rect, param1: Paint): void;
    drawPaint(param0: Paint): void;
    drawText(param0: string[], param1: number, param2: number, param3: number, param4: number, param5: Paint): void;
    skew(param0: number, param1: number): void;
    getHeight(): number;
    drawLines(param0: number[], param1: number, param2: number, param3: Paint): void;
    drawRGB(param0: number, param1: number, param2: number): void;
    clipRect(param0: number, param1: number, param2: number, param3: number): boolean;
    clipRect(param0: number, param1: number, param2: number, param3: number, param4: Op): boolean;
    drawRect(param0: number, param1: number, param2: number, param3: number, param4: Paint): void;
    scale(param0: number, param1: number): void;
    getDensity(): number;
    save(param0: number): number;
    clipRect(param0: Rect): boolean;
    // restoreToCount(param0: number): void;
    scale(param0: number, param1: number, param2: number, param3: number): void;
    // saveLayerAlpha(param0: android.graphics.RectF, param1: number): number;
    setDensity(param0: number): void;
    rotate(param0: number, param1: number, param2: number): void;
    drawLine(param0: number, param1: number, param2: number, param3: number, param4: Paint): void;
    drawOval(param0: number, param1: number, param2: number, param3: number, param4: Paint): void;
    drawTextOnPath(param0: string, param1: Path, param2: number, param3: number, param4: Paint): void;
    translate(param0: number, param1: number): void;
    drawCircle(cx: number, cy: number, radius: number, param3: Paint): void;
    save(): number;
    getDrawFilter(): DrawFilter;
    drawLines(param0: number[], param1: Paint): void;
    drawPosText(param0: string, param1: number[], param2: Paint): void;
    clipRect(param0: Rect, param1: Op): boolean;
    getClipBounds(): Rect;
    // saveLayer(param0: number, param1: number, param2: number, param3: number, param4: Paint): number;
    drawArc(rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
    drawArc(left: number, top: number, right: number, bottom: number, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
    // saveLayerAlpha(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): number;
    clipOutPath(param0: Path): boolean;
    drawText(param0: string, param1: number, param2: number, param3: Paint): void;
    // drawPoints(param0: native.Array<number>, param1: number, param2: number, param3: android.graphics.Paint): void;
    drawPath(param0: Path, param1: Paint): void;
    drawRect(param0: Rect, param1: Paint): void;
    setDrawFilter(param0: DrawFilter): void;
    clipPath(param0: Path, param1: Op): boolean;
    drawView(view: View, rect?: Rect);
}
export class Cap extends android.graphics.Paint.Cap {}
export class Join extends android.graphics.Paint.Join {}
export class Style extends android.graphics.Paint.Style {}
export class Rect extends android.graphics.RectF {}
export class RadialGradient extends android.graphics.RadialGradient {}
export class LinearGradient extends android.graphics.LinearGradient {}
export class TileMode extends android.graphics.Shader.TileMode {}
export class Path {
    isRect(param0: android.graphics.RectF): boolean;
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
    finalize(): void;
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
    computeBounds(param0: Rect, param1: boolean): void;
    set(param0: Path): void;
}
export class DrawFilter extends android.graphics.DrawFilter {}
export class Op extends android.graphics.Region.Op {}
export class Direction extends android.graphics.Path.Direction {}
export class FillType extends android.graphics.Path.FillType {}
export class Matrix extends android.graphics.Matrix {}
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
