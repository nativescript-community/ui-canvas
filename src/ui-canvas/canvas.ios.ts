/* eslint-disable no-redeclare */
import { CSSType, Color, Font, ImageSource, Utils, View } from '@nativescript/core';
import { FontStyleType, FontWeightType } from '@nativescript/core/ui/styling/font';
import { Canvas as ICanvas, FontMetrics as IFontMetrics, Matrix as IMatrix, Paint as IPaint, Path as IPath, PorterDuffXfermode as IPorterDuffXfermode, Rect as IRect, RectF as IRectF } from './canvas';
import type { CanvasView } from './index.ios';
export * from './canvas.common';

const identity = CGAffineTransformIdentity;

function NSTextAlignmentFromAlign(align: Align) {
    if (align === Align.CENTER) {
        return NSTextAlignment.Center;
    } else if (align === Align.RIGHT) {
        return NSTextAlignment.Right;
    }
    return NSTextAlignment.Left;
}

function DEGREES_TO_RADIANS(x) {
    return (Math.PI * x) / 180.0;
}
function CGAffineTransformMakeSkew(sx, sy) {
    return CGAffineTransformMake(1, DEGREES_TO_RADIANS(sx), DEGREES_TO_RADIANS(sy), 1, 0, 0);
}
const FloatConstructor = interop.sizeof(interop.types.id) === 4 ? Float32Array : Float64Array;

function applyAttributesToNSAttributedString(text: NSAttributedString, attrs: NSMutableDictionary<any, any>) {
    if (!attrs) {
        if (text instanceof NSMutableAttributedString) {
            return text;
        }
        return NSMutableAttributedString.alloc().initWithAttributedString(text);
    }
    const result = NSMutableAttributedString.alloc().initWithAttributedString(text);
    const range = { location: 0, length: result.length } as NSRange;
    attrs.enumerateKeysAndObjectsUsingBlock((p1: KeyType, p2: any) => {
        result.addAttributeValueRange(p1, p2, range);
    });
    return result;
}

interface PaintDecoratorOptions {
    withFont?: boolean;
}

function paintPropertyGenerator(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>, options: PaintDecoratorOptions) {
    const originalMethod = descriptor.value as Function; // save a reference to the original method

    // NOTE: Do not use arrow syntax here. Use a function expression in
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function (...args: any[]) {
        let index = args.length - 1;
        let paint = args[index];
        let actualPaint;
        if (paint instanceof Paint) {
            actualPaint = (this as Canvas).startApplyPaint(paint, options.withFont === true);
            args[index] = actualPaint;
        } else {
            index = args.length - 2;
            paint = args[index];
            if (paint instanceof Paint) {
                actualPaint = (this as Canvas).startApplyPaint(paint, options.withFont === true);
                args[index] = actualPaint;
            } else {
                actualPaint = (this as Canvas).startApplyPaint();
            }
        }
        const result = originalMethod.apply(this, args);
        (this as Canvas).finishApplyPaint(actualPaint);
        return result;
    };

    return descriptor;
}
function paint(target: any, k?, desc?: TypedPropertyDescriptor<any>): any;
function paint(options: PaintDecoratorOptions): (target: any, k?, desc?: TypedPropertyDescriptor<any>) => any;
function paint(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return paintPropertyGenerator(target, key, descriptor, args[0] || {});
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return paintPropertyGenerator(args[startIndex], args[startIndex + 1], args[args.length - 1], options || {});
    }
}

export enum Style {
    FILL,
    STROKE,
    FILL_AND_STROKE
}
export enum Cap {
    ROUND = CGLineCap.kCGLineCapRound,
    SQUARE = CGLineCap.kCGLineCapSquare,
    BUT = CGLineCap.kCGLineCapButt
}

export enum Join {
    BEVEL = CGLineJoin.kCGLineJoinBevel,
    MITER = CGLineJoin.kCGLineJoinMiter,
    ROUND = CGLineJoin.kCGLineJoinRound
}
export enum Align {
    LEFT = 0,
    RIGHT = 1,
    CENTER = 2
}

export enum Direction {
    CCW,
    CW
}
export enum TileMode {
    CLAMP,
    MIRROR,
    REPEAT
}
export enum FillType {
    EVEN_ODD,
    INVERSE_EVEN_ODD,
    INVERSE_WINDING,
    WINDING
}

export enum Op {
    DIFFERENCE,
    INTERSECT,
    REPLACE,
    REVERSE_DIFFERENCE,
    UNION,
    XOR
}

export enum LayoutAlignment {
    ALIGN_NORMAL,
    ALIGN_CENTER,
    ALIGN_OPPOSITE
}

export enum PorterDuffMode {
    ADD = CGBlendMode.kCGBlendModeNormal,
    CLEAR = CGBlendMode.kCGBlendModeClear,
    DARKEN = CGBlendMode.kCGBlendModeDarken,
    DST = CGBlendMode.kCGBlendModeNormal,
    DST_ATOP = CGBlendMode.kCGBlendModeDestinationAtop,
    DST_IN = CGBlendMode.kCGBlendModeDestinationIn,
    DST_OUT = CGBlendMode.kCGBlendModeDestinationOut,
    DST_OVER = CGBlendMode.kCGBlendModeDestinationOver,
    LIGHTEN = CGBlendMode.kCGBlendModeLighten,
    MULTIPLY = CGBlendMode.kCGBlendModeMultiply,
    OVERLAY = CGBlendMode.kCGBlendModeOverlay,
    SCREEN = CGBlendMode.kCGBlendModeScreen,
    SRC = CGBlendMode.kCGBlendModeNormal,
    SRC_ATOP = CGBlendMode.kCGBlendModeSourceAtop,
    SRC_IN = CGBlendMode.kCGBlendModeSourceIn,
    SRC_OUT = CGBlendMode.kCGBlendModeSourceOut,
    SRC_OVER = CGBlendMode.kCGBlendModeNormal,
    XOR = CGBlendMode.kCGBlendModeXOR
}

function createCGRect(l, t, r, b) {
    return CGRectMake(l, t, r - l, b - t);
}

export class Rect implements IRect {
    _rect: CGRect;
    _left: number;
    _top: number;
    _right: number;
    _bottom: number;

    private updateCGRect() {
        this.cgRect = createCGRect(this._left, this._top, this._right, this._bottom);
    }

    get left() {
        return this._left;
    }
    set left(value: number) {
        this._left = value;
        this.updateCGRect();
    }
    get top() {
        return this._top;
    }
    set top(value: number) {
        this._top = value;
        this.updateCGRect();
    }
    get right() {
        return this._right;
    }
    set right(value: number) {
        this._right = value;
        this.updateCGRect();
    }
    get bottom() {
        return this._bottom;
    }
    set bottom(value: number) {
        this._bottom = value;
        this.updateCGRect();
    }
    get cgRect() {
        return this._rect;
    }
    set cgRect(rect: CGRect) {
        this._rect = rect;
        this._left = this._rect.origin.x;
        this._top = this._rect.origin.y;
        this._right = this._left + this._rect.size.width;
        this._bottom = this._top + this._rect.size.height;
    }

    // public set(rect: Rect) {
    //     this.cgRect = rect.cgRect;
    // }
    public set(...args) {
        if (args.length === 1) {
            if (args[0] instanceof Rect) {
                this.cgRect = args[0].cgRect;
            } else {
                this.cgRect = args[0];
            }
        } else {
            this._left = args[0];
            this._top = args[1];
            this._right = args[2];
            this._bottom = args[3];
            this.updateCGRect();
        }
    }
    public inset(dx: number, dy: number): void {
        this.cgRect = CGRectInset(this.cgRect, dx, dy);
    }
    public union(...params): void {
        // this.cgRect = CGRectOffset(this.cgRect, dx, dy);
        console.error('Method not implemented:', 'union');
    }
    public offsetTo(x: number, y: number): void {
        this.cgRect = CGRectMake(x, y, this._rect.size.width, this._rect.size.height);
    }
    public offset(dx: number, dy: number): void {
        this.cgRect = CGRectOffset(this.cgRect, dx, dy);
    }
    public centerX(): number {
        return this.cgRect.origin.x + this.cgRect.size.width / 2;
    }
    public centerY(): number {
        return this.cgRect.origin.y + this.cgRect.size.height / 2;
    }
    public intersect(...args) {
        const length = args.length;
        let rect: CGRect;
        if (length === 4) {
            rect = createCGRect(args[0], args[1], args[2], args[3]);
        } else if (length === 1) {
            rect = (args[0] as Rect).cgRect;
        }
        const result = CGRectIntersection(this.cgRect, rect);
        if (!CGRectIsNull(result)) {
            this.cgRect = result;
            return true;
        }
        return false;
    }
    public contains(...args) {
        const length = args.length;
        let rect: CGRect;
        if (length === 4) {
            rect = createCGRect(args[0], args[1], args[2], args[3]);
        } else if (length === 1) {
            rect = (args[0] as Rect).cgRect;
        }
        return CGRectContainsRect(this.cgRect, rect);
    }
    constructor(...args) {
        this.set.apply(this, args);
    }

    toString() {
        return `Rect(${this.left},${this.top},${this.right},${this.bottom})`;
    }
    // constructor(rect: CGRect) {
    //     this._rect = rect;
    // }

    width() {
        return this._rect.size.width;
    }
    height() {
        return this._rect.size.height;
    }
}
export class RectF extends Rect {}

export class Matrix implements IMatrix {
    mTransform: CGAffineTransform;
    constructor(transform?) {
        this.mTransform = transform || CGAffineTransformIdentity;
    }
    // fake method for tsc errors because IMatrix extends android Matrix
    dump() {}
    mapRect(rect: Rect) {
        rect.cgRect = CGRectApplyAffineTransform(rect.cgRect, this.mTransform);
        return true;
    }
    public setRotate(degrees: number, px: number = 0, py: number = 0) {
        this.mTransform = CGAffineTransformMakeRotation(DEGREES_TO_RADIANS(degrees));
        if (px !== 0 || py !== 0) {
            this.postConcat(CGAffineTransformMakeTranslation(px, py));
            this.preConcat(CGAffineTransformMakeTranslation(-px, -py));
        }
    }

    static MSCALE_X = 0;
    static MSKEW_X = 1;
    static MTRANS_X = 2;
    static MSKEW_Y = 3;
    static MSCALE_Y = 4;
    static MTRANS_Y = 5;
    static MPERSP_0 = 6;
    static MPERSP_1 = 7;
    static MPERSP_2 = 8;
    public getValues(param: number[]): void {
        if (param) {
            param[0] = this.mTransform.a;
            param[1] = this.mTransform.c;
            param[2] = this.mTransform.tx;
            param[3] = this.mTransform.b;
            param[4] = this.mTransform.d;
            param[5] = this.mTransform.ty;
            param[6] = 0;
            param[7] = 0;
            param[8] = 1;
        }
    }
    public setScale(sx: number, sy: number, px: number = 0, py: number = 0) {
        this.mTransform = CGAffineTransformMakeScale(sx, sy);
        if (px !== 0 || py !== 0) {
            this.postConcat(CGAffineTransformMakeTranslation(px, py));
            this.preConcat(CGAffineTransformMakeTranslation(-px, -py));
        }
    }
    public preScale(sx: number, sy: number, px?: number, py?: number): boolean {
        const mat = new Matrix();
        mat.setScale(sy, sy, px, py);
        return this.preConcat(mat);
    }
    public setConcat(mat1: IMatrix, mat2: IMatrix): boolean {
        this.mTransform = CGAffineTransformConcat((mat1 as Matrix).mTransform, (mat2 as Matrix).mTransform);
        return true;
    }
    public postSkew(sx: number, sy: number, px?: number, py?: number) {
        const mat = new Matrix();
        mat.setSkew(sy, sy, px, py);
        return this.postConcat(mat);
    }

    public postScale(sx: number, sy: number, px?: number, py?: number) {
        const mat = new Matrix();
        mat.setScale(sx, sy, px, py);
        return this.postConcat(mat);
    }
    public preSkew(sx: number, sy: number, px?: number, py?: number) {
        const mat = new Matrix();
        mat.setSkew(sy, sy, px, py);
        return this.preConcat(mat);
    }
    public mapPoints(...args) {
        let src: number[];
        let dstIndex: number = 0,
            srcIndex: number = 0,
            pointCount: number;
        const pts: number[] = args[0];
        if (args.length <= 2) {
            src = args[1];
        } else {
            dstIndex = args[1] || 0;
            srcIndex = args[3] || 0;
            pointCount = args[4];
            src = args[2];
        }
        src = src || pts;
        pointCount = Math.floor(pointCount || src.length);
        for (let index = 0; index < pointCount; index += 2) {
            const cgPoint = CGPointApplyAffineTransform(CGPointMake(src[index + srcIndex], src[index + srcIndex + 1]), this.mTransform);
            pts[index + dstIndex] = cgPoint.x;
            pts[index + dstIndex + 1] = cgPoint.y;
        }
    }
    // public mapVectors(param0: native.Array<number>, param1: native.Array<number>): void;
    // public mapVectors(param0: native.Array<number>): void;
    // public mapVectors(param0: native.Array<number>, param1: number, param2: native.Array<number>, param3: number, param4: number): void;
    public mapVectors(...args) {
        this.mapPoints.apply(this, args);
    }
    public setPolyToPoly(param0: number[], param1: number, param2: number[], param3: number, param4: number): boolean {
        console.error('Method not implemented:', 'setPolyToPoly');
        return false;
    }
    public postRotate(degrees: number, px?: number, py?: number) {
        const mat = new Matrix();
        mat.setRotate(degrees, px, py);
        return this.postConcat(mat);
    }
    public mapRadius(param0: number): number {
        console.error('Method not implemented:', 'mapRadius');
        return -1;
    }
    public set(mat: IMatrix): void {
        this.mTransform = CGAffineTransformConcat(CGAffineTransformIdentity, (mat as Matrix).mTransform);
    }
    public preRotate(degrees: number, px?: number, py?: number) {
        const mat = new Matrix();
        mat.setRotate(degrees, px, py);
        return this.preConcat(mat);
    }
    public postTranslate(tx: number, ty: number): boolean {
        return this.postConcat(CGAffineTransformMakeTranslation(tx, ty));
    }
    // public setSinCos(param0: number, param1: number, param2: number, param3: number): void;
    // public setSinCos(param0: number, param1: number): void;
    public setSinCos(sin: number, cos: number, px = 0, py = 0) {
        this.mTransform = CGAffineTransformIdentity;
        this.mTransform.a = cos;
        this.mTransform.b = -sin;
        this.mTransform.c = sin;
        this.mTransform.d = cos;
        if (px !== 0 || py !== 0) {
            this.postConcat(CGAffineTransformMakeTranslation(px, py));
            this.preConcat(CGAffineTransformMakeTranslation(-px, -py));
        }
    }
    public rectStaysRect(): boolean {
        console.error('Method not implemented:', 'rectStaysRect');
        return false;
    }
    public equals(mat: IMatrix): boolean {
        return CGAffineTransformEqualToTransform(this.mTransform, (mat as Matrix).mTransform);
    }
    public isAffine(): boolean {
        return true;
    }
    // public setSkew(param0: number, param1: number): void;
    // public setSkew(param0: number, param1: number, param2: number, param3: number): void;
    public setSkew(sx: number, sy: number, px: number = 0, py: number = 0) {
        this.mTransform = CGAffineTransformMakeSkew(sx, sy);
        if (px !== 0 || py !== 0) {
            this.postConcat(CGAffineTransformMakeTranslation(px, py));
            this.preConcat(CGAffineTransformMakeTranslation(-px, -py));
        }
    }
    public reset(): void {
        this.mTransform = CGAffineTransformIdentity;
    }
    public toString(): string {
        return this.toShortString();
    }
    public toShortString(): string {
        return `Matrix{[${this.mTransform.a}, ${this.mTransform.c}, ${this.mTransform.tx}],[${this.mTransform.b}, ${this.mTransform.d}, ${this.mTransform.ty}],[0, 0, 1]}`;
    }
    public setTranslate(tx: number, ty: number): void {
        this.mTransform = CGAffineTransformMakeTranslation(tx, ty);
    }
    public postConcat(mat: IMatrix | CGAffineTransform): boolean {
        this.mTransform = CGAffineTransformConcat(this.mTransform, (mat as Matrix).mTransform || (mat as CGAffineTransform));
        return true;
    }

    public preConcat(mat: IMatrix | CGAffineTransform): boolean {
        this.mTransform = CGAffineTransformConcat((mat as Matrix).mTransform || (mat as CGAffineTransform), this.mTransform);
        return true;
    }
    public setRectToRect(param0: IRectF, param1: IRectF, param2: any): boolean {
        console.error('Method not implemented:', 'centsetRectToRecterY');
        return false;
    }
    public isIdentity(): boolean {
        return CGAffineTransformIsIdentity(this.mTransform);
    }
    // public toString(): string {
    //     return NSStringFromCGAffineTransform(this._transform);
    // }
    public preTranslate(tx: number, ty: number): boolean {
        return this.preConcat(CGAffineTransformMakeTranslation(tx, ty));
    }
    public setValues(values: number[]): void {
        this.mTransform = CGAffineTransformMake(values[0], values[3], values[1], values[4], values[2], values[5]);
        // this._transform.a = values[0];
        // this._transform.c = values[1];
        // this._transform.tx = values[2];
        // this._transform.b = values[3];
        // this._transform.d = values[4];
        // this._transform.ty = values[5];
    }
    public invert(output: IMatrix): boolean {
        (output as Matrix).mTransform = CGAffineTransformInvert(this.mTransform);
        return !this.equals(output);
    }
    public hashCode(): number {
        console.error('Method not implemented:', 'hashCode');
        return -1;
    }
    public wait(...args) {
        console.error('Method not implemented:', 'wait');
    }
    public clone(...args) {
        console.error('Method not implemented:', 'clone');
    }
    public notify(...args): void {
        console.error('Method not implemented:', 'notify');
    }
    public getClass(...args): any {
        console.error('Method not implemented:', 'getClass');
    }
    public finalize(): void {
        console.error('Method not implemented:', 'finalize');
    }
    public notifyAll(): void {
        console.error('Method not implemented:', 'notifyAll');
    }
}

export class PathEffect {}
export class DashPathEffect extends PathEffect {
    constructor(
        public intervals: number[],
        public phase: number
    ) {
        super();
    }
}

export class Path implements IPath {
    private mPath: any;
    private mBPath?: UIBezierPath;
    mFillType: FillType;

    getOrCreateBPath() {
        if (!this.mBPath) {
            if (this.mPath) {
                this.mBPath = UIBezierPath.bezierPathWithCGPath(this.mPath);
            } else {
                this.mBPath = UIBezierPath.bezierPath();
            }
        }
        return this.mBPath;
    }
    getCGPath() {
        if (this.mBPath) {
            return this.mBPath.CGPath;
        }
        return this.mPath;
    }
    getBPath() {
        if (this.mBPath) {
            return this.mBPath;
        }
        return undefined;
    }
    setBPath(bPath: UIBezierPath) {
        this.mBPath = bPath;
        // this._path = this._bPath.CGPath;
    }
    constructor() {
        this.mPath = CGPathCreateMutable();
        this.mFillType = FillType.WINDING;
        // this._path = UIBezierPath.bezierPath();
    }
    computeBounds(rect: RectF, exact: boolean) {
        if (this.mBPath) {
            rect.cgRect = this.mBPath.bounds;
        } else {
            rect.cgRect = CGPathGetBoundingBox(this.mPath);
        }
    }

    isRect(rect: Rect): boolean {
        return CGPathIsRect(this.getCGPath(), new interop.Reference(rect.cgRect));
    }
    getCurrentPoint() {
        const path = this.getCGPath();
        if (CGPathIsEmpty(path)) {
            this.moveTo(0, 0);
        }
        return CGPathGetCurrentPoint(this.getCGPath());
    }
    rMoveTo(dx: number, dy: number): void {
        const currentPoint = this.getCurrentPoint();
        this.moveTo(dx + currentPoint.x, dy + currentPoint.y);
    }
    addLines(points: number[], offset?: number, length?: number, close?: boolean) {
        // const pts = args[0] as number[];
        if (points.length <= 0 || points.length % 2 !== 0) {
            console.error('wrong points number');
        }
        UIBezierPath.addLinesOffsetCountCloseToPath(points, offset, length, close, this.mPath);
    }
    setLines(points: number[], offset?: number, length?: number, close?: boolean) {
        this.reset();
        this.addLines(points, offset, length, close);
    }
    addCubicLines(points: number[], offset?: number, length?: number, close?: boolean) {
        // const pts = args[0] as number[];
        if (points.length < 8) {
            console.error('wrong points number');
        }

        // let starttime = Date.now();
        // let count = length || points.length;
        // CGPathMoveToPoint(this._path, null, points[0], points[1]);
        // for (let i = 2; i < count; i += 6) {
        //     CGPathAddCurveToPoint(this._path, null, points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
        // }
        // if (close === true) {
        //     CGPathCloseSubpath(this._path);
        // }
        UIBezierPath.addCubicLinesOffsetCountCloseToPath(points, offset, length, close, this.mPath);
    }
    setCubicLines(points: number[], offset?: number, length?: number, close?: boolean) {
        this.reset();
        this.addCubicLines(points, offset, length, close);
    }
    arcTo(rect: Rect, startAngle: number, sweepAngle: number, forceMoveTo?: boolean) {
        const center = CGPointMake(rect.centerX(), rect.centerY());
        let t = CGAffineTransformMakeTranslation(center.x, center.y);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, rect.height() / rect.width()), t);
        if (this.mBPath) {
            this.mBPath.addArcWithCenterRadiusStartAngleEndAngleClockwise(center, rect.width() / 2, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, sweepAngle < 0);
            this.mBPath.applyTransform(t);
        } else {
            CGPathAddArc(this.mPath, new interop.Reference(t), 0, 0, rect.width() / 2, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, sweepAngle < 0);
        }
    }
    //@ts-ignore
    offset(dx: number, dy: number, output?: Path) {
        const t = CGAffineTransformMakeTranslation(dx, dy);
        // if (this._bPath) {
        // this._bPath.bez
        if (this.mBPath) {
            if (output) {
                output.mBPath = UIBezierPath.bezierPathWithCGPath(this.getCGPath());
                output.mBPath.applyTransform(t);
            } else {
                this.mBPath.applyTransform(t);
            }
        } else {
            (output || this).mPath = CGPathCreateMutableCopyByTransformingPath(this.mPath, new interop.Reference(t));
        }
    }
    rCubicTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        const currentPoint = this.getCurrentPoint();
        const x = currentPoint.x;
        const y = currentPoint.y;
        this.cubicTo(x1 + x, y1 + y, x2 + x, y2 + y, x3 + x, y3 + y);
    }
    rQuadTo(cpx: number, cpy: number, x: number, y: number): void {
        const currentPoint = this.getCurrentPoint();
        const dx = currentPoint.x;
        const dy = currentPoint.y;
        this.quadTo(cpx + dx, cpy + dy, x + dx, y + dy);
    }
    addRoundRect(...params) {
        // TODO: direction is ignored!
        const length = params.length;
        let rect: CGRect;
        let rx, ry;
        if (length === 7) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
            rx = params[4];
            ry = params[5];
        } else if (length === 4) {
            rect = (params[0] as Rect).cgRect;
            rx = params[1];
            ry = params[2];
        }
        if (this.mBPath) {
            this.mBPath.appendPath(UIBezierPath.bezierPathWithRoundedRectByRoundingCornersCornerRadii(rect, UIRectCorner.AllCorners, CGSizeMake(rx, ry)));
        } else {
            CGPathAddRoundedRect(this.mPath, null, rect, rx, ry);
        }
    }
    addPath(...params) {
        const length = params.length;
        const path = params[0] as Path;
        if (length === 1) {
            if (this.mBPath) {
                this.mBPath.appendPath(path.getBPath());
            } else {
                CGPathAddPath(this.mPath, null, path.mPath);
            }
            // param0: IPath, param1: number, param2: number
        } else if (length === 2) {
            const mat = params[1] as Matrix;
            if (this.mBPath) {
                this.mBPath.appendPath(path.getBPath());
            } else {
                CGPathAddPath(this.mPath, new interop.Reference(mat.mTransform), path.mPath);
            }
            // param0: IPath, param1: number, param2: number
        } else if (length === 3) {
            if (this.mBPath) {
            } else {
                const t = CGAffineTransformMakeTranslation(params[1], params[2]);
                CGPathAddPath(this.mPath, new interop.Reference(t), path.mPath);
            }
            // param0: IPath, param1: Matrix
        }
    }
    rLineTo(param0: number, param1: number): void {
        console.error('Method not implemented:', 'rLineTo');
    }
    lineTo(x: number, y: number): void {
        CGPathAddLineToPoint(this.mPath, null, x, y);
    }
    quadTo(cpx: number, cpy: number, x: number, y: number): void {
        CGPathAddQuadCurveToPoint(this.mPath, null, cpx, cpy, x, y);
    }
    //@ts-ignore
    transform(mat: Matrix, output?: Path) {
        const path = CGPathCreateCopyByTransformingPath(this.mPath, new interop.Reference(mat.mTransform));
        if (output) {
            output.mPath = path;
        } else {
            this.mPath = path;
        }
    }
    reset(): void {
        if (this.mBPath) {
            this.mBPath.removeAllPoints();
        } else {
            this.mPath = CGPathCreateMutable();
        }
    }
    addArc(...params): void {
        const length = params.length;
        const path = params[0];
        let rect: CGRect, sweepAngle, startAngle;
        if (length === 6) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
            // rect = new Rect(params[0], params[1], params[2], params[3]);
            startAngle = params[4];
            sweepAngle = params[5];
        } else if (length === 3) {
            rect = (params[0] as Rect).cgRect;
            startAngle = params[1];
            sweepAngle = params[2];
        }
        const w = rect.size.width;
        const h = rect.size.height;
        const cx = rect.origin.x + w * 0.5;
        const cy = rect.origin.y + h * 0.5;
        const r = rect.size.width * 0.5;
        // const center = CGPointMake(rect.centerX(), rect.centerY());
        let t = CGAffineTransformMakeTranslation(cx, cy);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, h / w), t);
        CGPathAddArc(this.mPath, new interop.Reference(t), 0, 0, r, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, false);
        // CGPathMoveToPoint(this._path, null, center.x, center.y);
    }
    close(): void {
        // CGPathCloseSubpath(this._path);
    }
    addCircle(x: number, y: number, r: number, d: Direction): void {
        if (d === Direction.CW) {
            CGPathAddEllipseInRect(this.mPath, null, CGRectMake(x - r, y - r, 2 * r, 2 * r));
        } else {
            const t = CGAffineTransformMakeScale(-1, 1);
            CGPathAddEllipseInRect(this.mPath, new interop.Reference(t), CGRectMake(x - r, y - r, 2 * r, 2 * r));
        }
    }
    rewind(): void {
        this.reset();
    }
    setLastPoint(param0: number, param1: number): void {
        console.error('Method not implemented:', 'setLastPoint');
    }
    toggleInverseFillType(): void {
        switch (this.mFillType) {
            case FillType.EVEN_ODD:
                this.mFillType = FillType.INVERSE_EVEN_ODD;
                break;
            case FillType.INVERSE_EVEN_ODD:
                this.mFillType = FillType.EVEN_ODD;
                break;
            case FillType.WINDING:
                this.mFillType = FillType.INVERSE_WINDING;
                break;
            case FillType.INVERSE_WINDING:
                this.mFillType = FillType.WINDING;
                break;
        }
    }
    moveTo(x: number, y: number): void {
        CGPathMoveToPoint(this.mPath, null, x, y);
    }
    setFillType(value: FillType): void {
        this.mFillType = value;
    }
    isEmpty(): boolean {
        console.error('Method not implemented:', 'isEmpty');
        return false;
    }
    cubicTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        CGPathAddCurveToPoint(this.mPath, null, cp1x, cp1y, cp2x, cp2y, x, y);
    }
    incReserve(param0: number): void {
        console.error('Method not implemented:', 'incReserve');
    }
    getFillType(): FillType {
        return this.mFillType;
    }
    addRect(...params) {
        const length = params.length;
        let rect: CGRect;
        if (length === 5) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 2) {
            rect = (params[0] as Rect).cgRect;
        }
        CGPathAddRect(this.mPath, null, rect);
    }
    addOval(...params): void {
        const length = params.length;
        let rect: CGRect;
        if (length === 5) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 2) {
            rect = (params[0] as Rect).cgRect;
        }
        CGPathAddEllipseInRect(this.mPath, null, rect);
    }
    isInverseFillType(): boolean {
        return this.mFillType === FillType.INVERSE_EVEN_ODD || this.mFillType === FillType.INVERSE_WINDING;
    }
    //@ts-ignore
    set(path: Path): void {
        this.mPath = CGPathCreateMutableCopy(path.mPath);
    }
}

export class FontMetrics implements IFontMetrics {
    ascent: number;
    descent: number;
    bottom: number;
    leading: number;
    top: number;
}

export class Paint implements IPaint {
    mColor: Color = new Color('black');
    style: Style = Style.FILL;
    align: Align = Align.LEFT;
    mFont: Font;
    strokeWidth = 0;
    strokeMiter = 0;
    strokeCap: Cap = Cap.BUT;
    strokeJoin: Join = Join.BEVEL;
    antiAlias = true;
    dither;
    alpha = 255;
    letterSpacing: number = 0;
    currentContext: any;
    shadowLayer?: {
        radius: number;
        dx: number;
        dy: number;
        color: Color;
    };
    shader;
    colorFilter;
    pathEffect: PathEffect;
    xfermode: IPorterDuffXfermode;
    mTextAttribs: NSMutableDictionary<any, any>;
    constructor(paint?: Paint) {
        if (paint) {
            this.mColor = paint.mColor;
            this.style = paint.style;
            this.align = paint.align;
            this.mFont = paint.mFont;
            this.strokeWidth = paint.strokeWidth;
            this.strokeMiter = paint.strokeMiter;
            this.strokeCap = paint.strokeCap;
            this.strokeJoin = paint.strokeJoin;
            this.antiAlias = paint.antiAlias;
            this.dither = paint.dither;
            this.alpha = paint.alpha;
            this.shadowLayer = paint.shadowLayer;
            this.shader = paint.shader;
            this.pathEffect = paint.pathEffect;
            this.xfermode = paint.xfermode;
        }
    }
    //@ts-ignore
    getTextPath(text: string, start: number, end: number, x: number, y: number, path: Path) {
        const bPath = UIBezierPath.fromStringWithFont(text.slice(start, end), this.getUIFont());
        const bounds = bPath.bounds;
        bPath.applyTransform(CGAffineTransformMakeTranslation(bounds.size.width, -bounds.size.height));
        if (x !== 0 || y !== 0) {
            bPath.applyTransform(CGAffineTransformMakeTranslation(x, y));
        }
        path.setBPath(bPath);
        // path._path = bPath.CGPath;
    }
    public setFilterBitmap(param0: boolean) {}

    public setTextAlign(align: Align): void {
        this.align = align;
        this.mTextAttribs = null;
    }
    public getTextAlign(): Align {
        return this.align;
    }

    public setShadowLayer(radius: number, dx: number, dy: number, color: number | Color | string): void {
        color = color instanceof Color ? color : new Color(color as any);
        this.shadowLayer = {
            radius: radius / 1,
            dx,
            dy,
            color: new Color(color.a / 1, color.r, color.g, color.b)
        };
    }
    public clearShadowLayer() {
        this.shadowLayer = undefined;
    }

    public getAlpha(): number {
        return this.alpha;
    }
    public getStyle(): Style {
        return this.style;
    }
    public setStrokeMiter(value: number): void {
        this.strokeMiter = value;
    }
    public setARGB(a: number, r: number, g: number, b: number): void {
        this.mColor = new Color(a, r, g, b);
    }
    public measureText(text: string | NSAttributedString, start = 0, end?) {
        if (end === undefined) {
            end = text.length;
        }
        if (text instanceof NSAttributedString) {
            const rect = new Rect();
            this.getTextBounds(text, start, end, rect);
            return rect.width();
        }
        return UIDrawingText.measureTextFromToAttributes(text, start, end, this.getDrawTextAttribs());
    }
    public getTextBounds(text: string | NSAttributedString, start: number, end: number, rect: Rect): void {
        if (text instanceof NSAttributedString) {
            rect.cgRect = applyAttributesToNSAttributedString(text, this.getDrawTextAttribs()).boundingRectWithSizeOptionsContext(
                CGSizeMake(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
                NSStringDrawingOptions.UsesDeviceMetrics,
                null
            );
        } else {
            rect.cgRect = UIDrawingText.getTextBoundsFromToAttributes(text, start, end, this.getDrawTextAttribs());
        }
    }
    public isAntiAlias(): boolean {
        return this.antiAlias;
    }
    public setStrokeJoin(value: Join): void {
        this.strokeJoin = value;
    }
    public getStrokeJoin(): Join {
        return this.strokeJoin;
    }
    public getShader() {
        return this.shader;
    }
    public getColorFilter() {
        return this.colorFilter;
    }
    public setStrokeWidth(value: number): void {
        this.strokeWidth = value;
    }
    public setStrokeCap(value: Cap): void {
        this.strokeCap = value;
    }
    public isDither(): boolean {
        return this.dither;
    }
    public setAlpha(value: number): void {
        this.alpha = value;
    }
    public setStyle(value: Style): void {
        this.style = value;
    }
    public getStrokeMiter(): number {
        return this.strokeMiter;
    }
    public setDither(value: boolean): void {
        this.dither = value;
    }
    public setAntiAlias(value: boolean): void {
        this.antiAlias = value;
    }
    public getStrokeWidth(): number {
        return this.strokeWidth;
    }
    public getStrokeCap(): Cap {
        return this.strokeCap;
    }
    public setShader(value: any) {
        if (this.shader) {
            this.shader.release();
        }
        this.shader = value;
    }
    public setColorFilter(value: any) {
        if (this.colorFilter) {
            this.colorFilter.release();
        }
        this.colorFilter = value;
    }
    setFont(font: Font) {
        if (font === this.mFont) {
            return;
        }
        this.mFont = font;
        this.mTextAttribs = null;
    }
    public setTypeface(font: Font | UIFont): Font {
        if (this.font === font) {
            return this.mFont;
        }
        if (font instanceof Font) {
            this.setFont(font);
            return this.mFont;
        } else if (font) {
            this.mFont['_uiFont'] = font;
        } else {
            this.mFont = null;
        }
        this.mTextAttribs = null;
        return this.mFont;
    }
    getFont() {
        if (!this.mFont) {
            this.mFont = Font.default;
        }
        return this.mFont;
    }
    get font() {
        return this.getFont();
    }
    set font(font: Font) {
        this.setFont(font);
    }

    setFontFamily(familyName: string) {
        if (this.mFont && this.mFont.fontFamily === familyName) {
            return;
        }
        this.mFont = this.font.withFontFamily(familyName);
        this.mTextAttribs = null;
    }
    set fontFamily(familyName: string) {
        this.setFontFamily(familyName);
    }
    get fontFamily() {
        return this.getFontFamily();
    }
    getFontFamily() {
        return this.font.fontFamily || this.getUIFont().familyName;
    }

    set fontWeight(weight: FontWeightType) {
        if (this.mFont && this.mFont.fontWeight === weight) {
            return;
        }
        this.setFontWeight(weight);
    }
    setFontWeight(weight: FontWeightType) {
        this.mFont = this.font.withFontWeight(weight);
        this.mTextAttribs = null;
    }
    set fontStyle(style: FontStyleType) {
        this.setFontStyle(style);
    }
    setFontStyle(style: FontStyleType) {
        if (this.mFont && this.mFont.fontStyle === style) {
            return;
        }
        this.mFont = this.font.withFontStyle(style);
        this.mTextAttribs = null;
    }

    getUIFont(): UIFont {
        return this.font.getUIFont(UIFont.systemFontOfSize(UIFont.labelFontSize));
    }
    getUIColor() {
        return this.mColor && (this.mColor.ios as UIColor);
    }

    public getTextSize(): number {
        return this.mFont ? this.mFont.fontSize : UIFont.labelFontSize;
    }

    set textSize(textSize) {
        this.setTextSize(textSize);
    }
    get textSize() {
        return this.getTextSize();
    }
    setTextSize(textSize) {
        if (this.mFont && this.mFont.fontSize === textSize) {
            return;
        }
        this.mFont = this.font.withFontSize(textSize);
        this.mTextAttribs = null;
    }
    getLetterSpacing() {
        return this.letterSpacing;
    }
    setLetterSpacing(spacing) {
        if (this.letterSpacing === spacing) {
            return;
        }
        this.letterSpacing = spacing;
        this.mTextAttribs = null;
    }
    get color(): Color | number | string {
        return this.mColor;
    }
    set color(color: Color | number | string) {
        this.setColor(color);
    }
    setColor(color: Color | number | string) {
        if (color instanceof Color) {
            this.mColor = color;
        } else if (!!color) {
            this.mColor = new Color(color as any);
        } else {
            this.mColor = undefined;
        }
        if (this.mColor) {
            // on android setColor sets the alpha too
            const c = this.mColor;
            this.alpha = c.a;
            // we want to ignore color alpha because on android it is not used but
            // on ios it will add up
            this.mColor = new Color(255, c.r, c.g, c.b);
        } else {
            this.alpha = 255;
        }
        this.mTextAttribs = null;
    }
    getColor(): Color {
        return this.mColor;
    }

    clear() {
        if (this.shader) {
            this.shader.clear();
            this.shader = null;
        }
        if (this.colorFilter) {
            this.colorFilter.clear();
            this.colorFilter = null;
        }
    }
    public setPathEffect(param0: PathEffect) {
        this.pathEffect = param0;
    }

    public setXfermode(param0: IPorterDuffXfermode): IPorterDuffXfermode {
        this.xfermode = param0;
        return param0;
    }
    public getXfermode(): IPorterDuffXfermode {
        return this.xfermode;
    }

    public getFontMetrics(fontMetrics?: FontMetrics): any {
        let returnFontMetrics = false;
        if (!fontMetrics) {
            fontMetrics = new FontMetrics();
            returnFontMetrics = true;
        }
        // if (fontMetrics) {
        const uiFont = this.getUIFont();
        fontMetrics.ascent = -uiFont.ascender;
        fontMetrics.descent = -uiFont.descender;
        fontMetrics.bottom = 0;
        fontMetrics.top = -uiFont.ascender;
        fontMetrics.leading = uiFont.leading;

        if (returnFontMetrics) {
            return fontMetrics;
        } else {
            return fontMetrics.descent - fontMetrics.ascent;
        }
    }

    drawShader(ctx, shouldStrkedPath = true) {
        if (this.shader instanceof LinearGradient) {
            const color = UIColor.clearColor;
            CGContextSetFillColorWithColor(ctx, color.CGColor);
            CGContextSetStrokeColorWithColor(ctx, color.CGColor);
            const g = this.shader;
            const options = g.tileMode === TileMode.CLAMP ? CGGradientDrawingOptions.kCGGradientDrawsBeforeStartLocation | CGGradientDrawingOptions.kCGGradientDrawsAfterEndLocation : 0;
            // const path = CGContextCopyPath(ctx);
            CGContextSaveGState(ctx);
            if (shouldStrkedPath && this.style === Style.STROKE) {
                CGContextReplacePathWithStrokedPath(ctx);
            }
            CGContextClip(ctx);
            CGContextDrawLinearGradient(ctx, g.gradient, CGPointMake(g.x0, g.y0), CGPointMake(g.x1, g.y1), options);
            CGContextRestoreGState(ctx);
            // CGContextAddPath(ctx, path);
        } else if (this.shader instanceof RadialGradient) {
            const color = UIColor.clearColor;
            CGContextSetFillColorWithColor(ctx, color.CGColor);
            CGContextSetStrokeColorWithColor(ctx, color.CGColor);
            const g = this.shader;
            const options = g.tileMode === TileMode.CLAMP ? CGGradientDrawingOptions.kCGGradientDrawsBeforeStartLocation | CGGradientDrawingOptions.kCGGradientDrawsAfterEndLocation : 0;
            if (this.style === Style.STROKE) {
                CGContextReplacePathWithStrokedPath(ctx);
            }
            // const path = CGContextCopyPath(ctx);
            CGContextSaveGState(ctx);
            CGContextClip(ctx);
            CGContextDrawRadialGradient(ctx, g.gradient, CGPointMake(g.centerX, g.centerY), 0, CGPointMake(g.centerX, g.centerY), g.radius, options);
            CGContextRestoreGState(ctx);
            // CGContextAddPath(ctx, path);
        } else if (this.shader instanceof BitmapShader) {
            const color = UIColor.clearColor;
            CGContextSetFillColorWithColor(ctx, color.CGColor);
            CGContextSetStrokeColorWithColor(ctx, color.CGColor);
            const g = this.shader;
            const source: UIImage = g.image;

            const w = source.size.width;
            const h = source.size.height;
            const rect = new Rect(CGRectMake(0, 0, w, h));

            let transform = CGAffineTransformMakeTranslation(0, rect.cgRect.size.height);
            transform = CGAffineTransformScale(transform, 1.0, -1.0);
            if (this.shader.localMatrix) {
                this.shader.localMatrix.mapRect(rect);
            }
            rect.cgRect = CGRectApplyAffineTransform(rect.cgRect, transform);

            // draw original image
            CGContextSaveGState(ctx);
            CGContextClip(ctx);
            CGContextConcatCTM(ctx, transform);
            CGContextDrawImage(ctx, rect.cgRect, source.CGImage);
            CGContextRestoreGState(ctx);
            // CGContextAddPath(ctx, path);
        }
    }
    getDrawTextAttribs() {
        if (!this.mTextAttribs) {
            const iosFont = this.getUIFont();
            this.mTextAttribs = NSMutableDictionary.dictionaryWithObjectsForKeys([iosFont], [NSFontAttributeName]);
            const color = this.getUIColor();
            if (color) {
                this.mTextAttribs.setObjectForKey(color, NSForegroundColorAttributeName);
            }
            if (this.letterSpacing !== 0) {
                this.mTextAttribs.setObjectForKey(this.letterSpacing * iosFont.pointSize, NSKernAttributeName);
            }
            if (this.align === Align.CENTER) {
                const paragraphStyle = NSMutableParagraphStyle.new();
                paragraphStyle.alignment = NSTextAlignment.Center;
                this.mTextAttribs.setObjectForKey(paragraphStyle, NSParagraphStyleAttributeName);
            } else if (this.align === Align.RIGHT) {
                const paragraphStyle = NSMutableParagraphStyle.new();
                paragraphStyle.alignment = NSTextAlignment.Right;
                this.mTextAttribs.setObjectForKey(paragraphStyle, NSParagraphStyleAttributeName);
            }
        }
        return this.mTextAttribs;
    }
}

export class Canvas implements ICanvas {
    mCgContext: any; // CGContextRef;
    mPaint: Paint = new Paint();
    needsApplyDefaultPaint = true;
    mWidth: number;
    mHeight: number;
    mScale = 1;
    view: WeakRef<CanvasView>;

    setBitmap(image) {
        // if (image instanceof ImageSource) {
        //     this._bitmap = image.android;
        // } else {
        //     this._bitmap = image;
        // }
        // this.setBitmap(this._bitmap);
    }

    release(): any {
        this.mCgContext = null;
        if (this.mPaint) {
            this.mPaint.clear();
        }
    }
    clear() {
        this.drawColor('transparent');
    }
    get ctx() {
        return this.mCgContext;
    }
    setContext(context, width, height): any {
        // console.error('setContext', context, width, height);
        this.mCgContext = context;
        this.mWidth = width;
        this.mHeight = height;
    }
    getDensity(): number {
        // console.error('Method not implemented:', 'centerY');
        return this.mScale;
    }
    setDensity(density: number): void {
        this.mScale = density;
        // TODO: recreate context when possible
    }
    getDrawFilter(): any {
        console.error('Method not implemented:', 'getDrawFilter');
    }
    setDrawFilter(filter: any): void {
        console.error('Method not implemented:', 'setDrawFilter');
    }

    rotate(...args) {
        // rotate(degrees: number) {}
        // rotate(degrees: number, px: number, py: number): void;
        // rotate(degrees: any, px?: any, py?: any)
        const length = args.length;
        const degrees = args[0];
        const ctx = this.ctx;

        if (length === 3) {
            const px = args[1];
            const py = args[2];
            CGContextTranslateCTM(ctx, px, py);
            CGContextRotateCTM(ctx, (Math.PI / 180) * degrees);
            CGContextTranslateCTM(ctx, -px, -py);
        } else {
            CGContextRotateCTM(ctx, (Math.PI / 180) * degrees);
        }
    }

    scale(...args) {
        // scale(sx: number, sy: number, px: number, py: number): void;
        // scale(sx: number, sy: number): void;
        // scale(sx: any, sy: any, px?: any, py?: any)
        const length = args.length;
        const ctx = this.ctx;
        const sx = args[0];
        const sy = args[1];

        if (length === 4) {
            const px = args[2];
            const py = args[3];
            CGContextTranslateCTM(ctx, px, py);
            CGContextScaleCTM(ctx, sx, sy);
            CGContextTranslateCTM(ctx, -px, -py);
        } else {
            CGContextScaleCTM(ctx, sx, sy);
        }
    }

    translate(dx: number, dy: number): void {
        CGContextTranslateCTM(this.ctx, dx, dy);
    }
    skew(sx: number, sy: number): void {
        console.error('Method not implemented:', 'skew');
    }

    // setMatrix(matrix: Matrix) {
    //     CGContextConcatCTM(this.ctx, matrix.mTransform);
    // }
    getMatrix(): Matrix {
        return new Matrix(CGContextGetCTM(this.ctx));
    }

    getClipBounds(): IRect {
        return new Rect(CGContextGetClipBoundingBox(this.ctx));
    }
    restoreCount = 0;
    restore(): void {
        CGContextRestoreGState(this.ctx);
        this.restoreCount--;
    }
    restoreToCount(count): void {
        while (this.restoreCount >= count) {
            this.restore();
        }
    }
    save(): number {
        this.restoreCount++;
        CGContextSaveGState(this.ctx);
        return this.restoreCount;
    }

    @paint
    //@ts-ignore
    drawPaint(paint: Paint): void {
        // this.save();
        const ctx = this.ctx;
        if (paint.shader) {
            paint.drawShader(ctx);
        } else {
            CGContextFillRect(ctx, CGRectMake(0, 0, this.mWidth, this.mHeight));
        }
        // this.restore();
    }

    drawARGB(a: number, r: number, g: number, b: number): void {
        this.save();
        const ctx = this.ctx;
        CGContextSetRGBFillColor(ctx, r / 255, g / 255, b / 255, a / 255);
        CGContextFillRect(ctx, CGRectMake(0, 0, this.mWidth, this.mHeight));
        this.restore();
    }

    drawRGB(r: number, g: number, b: number): void {
        this.drawARGB(255, r, g, b);
    }

    drawColor(color: number | Color | string): void {
        const ctx = this.ctx;
        const actualColor = color instanceof Color ? color : new Color(color as any);
        this.save();

        CGContextSetFillColorWithColor(ctx, actualColor.ios.CGColor);
        CGContextFillRect(ctx, CGRectMake(0, 0, this.mWidth, this.mHeight));
        this.restore();
    }

    @paint
    drawBitmap(...args) {
        // drawBitmap(bitmap: globalAndroid.graphics.Bitmap | UIImage | ImageSource, src: IRect, dest: IRect, paint: IPaint): void;
        // drawBitmap(bitmap: globalAndroid.graphics.Bitmap | UIImage | ImageSource, x: number, y: number, paint: IPaint): void;
        // drawBitmap(bitmap: any, x: any, y: any, paint: any)
        const ctx = this.ctx;
        let image: UIImage = args[0];
        if (image instanceof ImageSource) {
            image = image.ios;
        }
        if (!image) {
            return;
        }
        const length = args.length;
        const paint = args[length - 1] as Paint;
        let cgImage;
        if (paint?.colorFilter) {
            const ciFilter = paint.colorFilter.ciFilter;
            const tmp = CIImage.alloc().initWithImage(image);
            ciFilter.setValueForKey(tmp, 'inputImage');

            const outputRect = tmp.extent;
            const context = CIContext.contextWithOptions(null);
            cgImage = context.createCGImageFromRect(ciFilter.outputImage, outputRect);
            // image = UIImage.imageWithCGImageScaleOrientation(cgim, image.scale, image.imageOrientation);
        } else {
            cgImage = image.CGImage;
        }

        if (args[1] instanceof Matrix) {
            CGContextConcatCTM(ctx, args[1].mTransform);
            CGContextTranslateCTM(ctx, 0, image.size.height);
            CGContextScaleCTM(ctx, 1.0, -1.0);
            CGContextDrawImage(ctx, CGRectMake(0, 0, image.size.width, image.size.height), cgImage);
        } else {
            const src = args[1] instanceof Rect ? args[1].cgRect : null;
            const dst = args[2] instanceof Rect ? args[2].cgRect : CGRectMake(args[1], args[2], image.size.width, image.size.height);
            if (src) {
                cgImage = CGImageCreateWithImageInRect(cgImage, src);
            }
            CGContextTranslateCTM(ctx, 0, dst.origin.y + dst.size.height);
            CGContextScaleCTM(ctx, 1.0, -1.0);
            CGContextDrawImage(ctx, CGRectMake(dst.origin.x, 0, dst.size.width, dst.size.height), cgImage);
        }
    }

    //@ts-ignore
    drawPoint(x: number, y: number, paint: Paint): void {
        this.drawLine(x, y, x, y, paint);
    }
    drawPoints(...args): void {
        // drawLines(pts: number[], offset: number, count: number, paint: IPaint): void;
        // drawLines(pts: number[], paint: IPaint): void;

        const pts = args[0] as number[];
        if (pts.length <= 0 || pts.length % 4 !== 0) {
            console.error('wrong points number');
        }

        const length = args.length;
        const paint = args[length - 1] as Paint;
        const ctx = this.ctx;
        let offset = 0;
        let count = pts.length;
        let rect: CGRect;
        if (length === 4) {
            offset = args[1];
            count = args[2];
        }
        CGContextBeginPath(ctx);
        for (let index = offset; index < count / 2; index++) {
            CGContextMoveToPoint(ctx, pts[offset], pts[offset + 1]);
            CGContextAddLineToPoint(ctx, pts[offset], pts[offset + 1]);
        }
        this._drawPath(paint, ctx);
    }
    @paint
    //@ts-ignore
    drawLine(startX: number, startY: number, stopX: number, stopY: number, paint: Paint): void {
        const oldStyle = paint.style;
        paint.style = Style.STROKE;
        const ctx = this.ctx;
        CGContextBeginPath(ctx);
        CGContextMoveToPoint(ctx, startX, startY);
        CGContextAddLineToPoint(ctx, stopX, stopY);
        this._drawPath(paint, ctx);
        paint.style = oldStyle;
    }
    @paint
    drawLines(...args) {
        // drawLines(pts: number[], offset: number, count: number, paint: IPaint): void;
        // drawLines(pts: number[], paint: IPaint): void;

        let pts = args[0];
        if (pts.length <= 0 || pts.length % 2 !== 0) {
            console.error('wrong points number');
        }

        let matrix: Matrix = args[args.length - 1];
        if (matrix instanceof Matrix) {
            args.pop();
        } else {
            matrix = undefined;
        }

        const length = args.length;

        const paint = args[length - 1] as Paint;
        // const oldStyle = paint.style;
        paint.style = Style.STROKE;
        // const ctx = this.ctx;
        let offset = 0;
        let count = pts.length;
        // let rect: CGRect;
        if (length === 4) {
            offset = args[1];
            count = args[2];
        }
        // const startTime = Date.now();

        if (Array.isArray(pts)) {
            pts = FloatConstructor.from(pts);
        }
        UIDrawingPath.drawLineSegmentsCountInContextWithTransform(pts, count, this.ctx, matrix ? matrix.mTransform : identity);
    }

    concat(mat: Matrix) {
        CGContextConcatCTM(this.ctx, mat.mTransform);
    }
    @paint
    //@ts-ignore
    drawCircle(cx: number, cy: number, radius: number, paint: Paint): void {
        const ctx = this.ctx;
        const hR = radius / 2;
        const rect = CGRectMake(cx - radius, cy - radius, radius * 2, radius * 2);
        CGContextBeginPath(ctx);
        CGContextAddEllipseInRect(ctx, rect);
        this._drawPath(paint, ctx);
    }
    drawOval(...args) {
        // drawOval(rect: IRect, paint: IPaint): void;
        // drawOval(left: number, top: number, right: number, bottom: number, paint: IPaint): void;
        // drawOval(left: any, top: any, right?: any, bottom?: any, paint?: any)
        console.error('Method not implemented:', 'drawOval');
    }
    @paint
    //@ts-ignore
    drawPath(path: Path, paint: Paint): void {
        const ctx = this.ctx;
        this._drawPath(paint, ctx, path);
    }
    clipOutPath(path: IPath): boolean {
        console.error('Method not implemented:', 'clipOutPath');
        return false;
    }
    clipOutRect(...args) {
        // clipOutRect(left: number, top: number, right: number, bottom: number): boolean;
        // clipOutRect(rect: IRect): boolean;
        const ctx = this.ctx;
        let rect: CGRect;
        if (length === 4) {
            rect = createCGRect(args[0], args[1], args[2], args[3]);
        } else if (length === 1) {
            rect = (args[0] as Rect).cgRect;
        }
        const currentRect = CGContextGetClipBoundingBox(ctx);
        console.error('Method not implemented:', 'clipOutRect');
        return false;
    }
    clipPath(...args) {
        const path = args[0] as Path;
        const op = args[1] as Op;
        const ctx = this.ctx;
        if (op !== undefined) {
            const cgPath = ctx.path;
            let clipPath = cgPath ? UIBezierPath.bezierPathWithCGPath(cgPath) : UIBezierPath.bezierPathWithRect(CGRectMake(0, 0, this.mWidth, this.mHeight));
            if (op === Op.DIFFERENCE) {
                clipPath.appendPath(path.getOrCreateBPath().bezierPathByReversingPath());
            } else if (op === Op.REVERSE_DIFFERENCE) {
                clipPath = clipPath.bezierPathByReversingPath();
                clipPath.appendPath(path.getOrCreateBPath());
            } else if (op === Op.UNION) {
                clipPath.appendPath(path.getOrCreateBPath());
            } else if (op === Op.REPLACE) {
                CGContextResetClip(ctx);
                clipPath = path.getOrCreateBPath();
            } else if (op === Op.INTERSECT) {
                console.error('clipPath Op.INTERSECT not implemented yet');
            } else if (op === Op.XOR) {
                console.error('clipPath Op.INTERSECT not implemented yet');
            }
            CGContextAddPath(ctx, clipPath.CGPath);
            CGContextClip(ctx);
        } else {
            CGContextAddPath(ctx, path.getCGPath());
            CGContextClip(ctx);
        }
        // clipPath(path: IPath): boolean;
        // clipPath(path: IPath, op: Op): boolean;
        // clipPath(path: any, op?: any)
        return true;
    }
    @paint
    drawView(view: View, rect?: Rect) {
        if (!view.nativeView) {
            (view as any)._setupAsRootView({});
            (view as any)._isAddedToNativeVisualTree = true;
            (view as any).callLoaded();
        }
        if (view.nativeView) {
            const uiView = view.nativeView as UIView;
            if (rect) {
                // Lay the view out with the known dimensions
                view.layout(0, 0, rect.width(), rect.height());

                // Translate the canvas so the view is drawn at the proper coordinates
                this.save();
                this.translate(rect.left, rect.top);
            }
            // uiView.drawLayerInContext(uiView.layer, this.ctx);
            uiView.drawViewHierarchyInRectAfterScreenUpdates(rect.cgRect, true);
            if (rect) {
                this.restore();
            }
        }
    }
    getWidth() {
        return this.mWidth;
    }
    getHeight() {
        return this.mHeight;
    }
    constructor(imageOrWidth: ImageSource | UIImage | number, height?: number) {
        if (imageOrWidth instanceof ImageSource) {
            this.mCgContext = this._createContextFromImage(imageOrWidth.ios);
        } else if (imageOrWidth instanceof UIImage) {
            this.mCgContext = this._createContextFromImage(imageOrWidth);
        } else if (imageOrWidth > 0 && height > 0) {
            this.mCgContext = this._createContext(imageOrWidth, height);
        }
        // CGContextFillRect(this._cgContext);
    }

    startApplyPaint(paint?: Paint, withFont = false) {
        this.save();
        if (!paint) {
            paint = this.mPaint;
            if (this.needsApplyDefaultPaint) {
                this.needsApplyDefaultPaint = false;
            } else {
                return paint;
            }
        } else {
            if (paint !== this.mPaint) {
                this.needsApplyDefaultPaint = true;
            }
        }

        const ctx = this.mCgContext;
        paint.currentContext = ctx;
        CGContextSetAlpha(ctx, paint.alpha / 255);
        CGContextSetShouldAntialias(ctx, paint.antiAlias);
        CGContextSetShouldSmoothFonts(ctx, paint.antiAlias);

        if (paint.shadowLayer) {
            const s = paint.shadowLayer;
            CGContextSetShadowWithColor(ctx, CGSizeMake(s.dx, s.dy), s.radius, s.color.ios.CGColor);
        } else {
            CGContextSetShadow(ctx, CGSizeZero, 0);
        }
        if (paint.strokeWidth) {
            CGContextSetLineWidth(ctx, paint.strokeWidth);
        }
        if (paint.strokeCap) {
            CGContextSetLineCap(ctx, paint.strokeCap as any);
        }
        if (paint.strokeJoin) {
            CGContextSetLineJoin(ctx, paint.strokeJoin as any);
        }
        if (!!paint.pathEffect) {
            if (paint.pathEffect instanceof DashPathEffect) {
                const intervals = paint.pathEffect.intervals;
                const length = intervals.length;
                CGContextSetLineDash(ctx, paint.pathEffect.phase, FloatConstructor.from(intervals) as any, length);
            }
        }
        if (paint.color) {
            const color = paint.getUIColor();
            CGContextSetStrokeColorWithColor(ctx, color.CGColor);
            CGContextSetFillColorWithColor(ctx, color.CGColor);
        }

        if (paint.xfermode) {
            CGContextSetBlendMode(ctx, (paint.xfermode as PorterDuffXfermode).mode);
        }

        return paint;
    }
    finishApplyPaint(paint) {
        paint.currentContext = null;
        this.restore();
    }

    _createContextFromImage(source: UIImage) {
        const w = source.size.width;
        const h = source.size.height;
        this.mWidth = w;
        this.mHeight = h;
        const rect = CGRectMake(0, 0, w, h);

        UIGraphicsBeginImageContextWithOptions(source.size, false, source.scale);
        const context = UIGraphicsGetCurrentContext();
        // draw black background to preserve color of transparent pixels
        CGContextSetBlendMode(context, CGBlendMode.kCGBlendModeNormal);

        // draw original image
        CGContextSaveGState(context);
        CGContextTranslateCTM(context, 0, source.size.height);
        CGContextScaleCTM(context, 1.0, -1.0);
        CGContextDrawImage(context, rect, source.CGImage);
        CGContextRestoreGState(context);

        return context;
    }

    _createContext(w, h) {
        this.mWidth = w;
        this.mHeight = h;
        let context = null;
        const scaleFactor = this.mScale;
        const bitmapBytesPerRow = w * 4 * scaleFactor; // 1
        const colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB); // 2
        context = CGBitmapContextCreate(
            null, // 4
            w * scaleFactor,
            h * scaleFactor,
            8, // bits per component
            bitmapBytesPerRow,
            colorSpace,
            CGImageAlphaInfo.kCGImageAlphaPremultipliedLast
        );
        CGContextScaleCTM(context, 1 / scaleFactor, 1 / scaleFactor);
        CGColorSpaceRelease(colorSpace); // 6
        return context; // 7
    }

    @paint
    fillRect(x: number, y: number, w: number, h: number, paint?: Paint) {
        const ctx = this.ctx;
        CGContextBeginPath(ctx);
        CGContextAddRect(ctx, createCGRect(x, y, w, h));
        this._drawPath(paint, ctx);
    }

    @paint
    drawRect(...params) {
        const length = params.length;
        const paint = params[length - 1] as Paint;
        const ctx = this.ctx;
        let rect: CGRect;
        if (length === 5) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 2) {
            rect = (params[0] as Rect).cgRect;
        }
        CGContextBeginPath(ctx);
        CGContextAddRect(ctx, rect);
        this._drawPath(paint, ctx);
    }

    // @paint
    // drawImage(x: number, y: number, w: number, h: number, image: ImageSource | UIImage) {
    //     const ctx = this.ctx;
    //     const theImage: UIImage = image instanceof ImageSource ? image.ios : image;
    //     CGContextDrawImage(ctx, createCGRect(x, y, w, h), theImage.CGImage);
    // }
    clipRect(...params) {
        const ctx = this.ctx;
        const length = params.length;
        let rect: CGRect;
        if (length === 4) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 1) {
            rect = (params[0] as Rect).cgRect;
        }
        CGContextClipToRect(ctx, rect);
        return true;
    }
    private _drawPath(paint: Paint, ctx, path?) {
        let bPath: UIBezierPath;
        let cgPath;
        if (path instanceof Path) {
            bPath = path.getBPath();
            cgPath = path.getCGPath();
        } else if (path instanceof UIBezierPath) {
            bPath = path;
            cgPath = bPath.CGPath;
        } else {
            cgPath = path;
        }
        function createBPath() {
            if (!bPath) {
                if (!cgPath) {
                    cgPath = CGContextCopyPath(ctx);
                }
                bPath = UIBezierPath.bezierPathWithCGPath(cgPath);
            }
        }
        if (paint.shader && !cgPath) {
            cgPath = CGContextCopyPath(ctx);
        }
        if (path && (path._fillType === FillType.INVERSE_WINDING || path._fillType === FillType.INVERSE_EVEN_ODD)) {
            createBPath();
            bPath = bPath.bezierPathByReversingPath();
            cgPath = bPath.CGPath;
        }
        if (paint.pathEffect instanceof DashPathEffect) {
            createBPath();
            const intervals = paint.pathEffect.intervals;
            const length = intervals.length;
            bPath.setLineDashCountPhase(FloatConstructor.from(intervals) as any, length, paint.pathEffect.phase);
        }

        if (cgPath && paint.shader) {
            if (paint.style === Style.STROKE) {
                const cgStrokedPath = CGPathCreateCopyByStrokingPath(cgPath, null, paint.strokeWidth, paint.strokeCap as any, paint.strokeJoin as any, 0);
                CGContextAddPath(ctx, cgStrokedPath);
            } else {
                CGContextAddPath(ctx, cgPath);
            }
            paint.drawShader(ctx, false);
        } else {
            if (bPath) {
                bPath.lineWidth = paint.strokeWidth;
                bPath.lineCapStyle = paint.strokeCap as any;
                bPath.lineJoinStyle = paint.strokeJoin as any;

                UIGraphicsPushContext(ctx);
                if (paint.style === Style.FILL) {
                    paint.getUIColor().setFill();
                    bPath.fill();
                } else if (paint.style === Style.STROKE) {
                    paint.getUIColor().setStroke();
                    bPath.stroke();
                } else {
                    paint.getUIColor().setStroke();
                    paint.getUIColor().setFill();
                    bPath.fill();
                    bPath.stroke();
                }
                UIGraphicsPopContext();
            } else {
                if (cgPath) {
                    CGContextAddPath(ctx, cgPath);
                }
                if (paint.style === Style.FILL) {
                    // CGContextFillPath(ctx);
                    if (path && (path._fillType === FillType.EVEN_ODD || path._fillType === FillType.INVERSE_EVEN_ODD)) {
                        CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathEOFill);
                    } else {
                        CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFill);
                    }
                } else if (paint.style === Style.STROKE) {
                    CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
                } else {
                    if (path && (path._fillType === FillType.EVEN_ODD || path._fillType === FillType.INVERSE_EVEN_ODD)) {
                        CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathEOFillStroke);
                    } else {
                        CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFillStroke);
                    }
                }
            }
        }
    }

    @paint
    drawRoundRect(...params) {
        // drawRoundRect(left: number, top: number, right: number, bottom: number, rx: number, ry: number, paint: IPaint): void;
        // drawRoundRect(rect: IRect, rx: number, ry: number, paint: IPaint): void;
        // drawRoundRect(left: any, top: any, right: any, bottom: any, rx?: any, ry?: any, paint?: any)
        const length = params.length;
        const paint = params[length - 1] as Paint;
        const ctx = this.ctx;
        let radius, rect: CGRect;
        if (length === 7) {
            radius = Math.max(params[4], params[5]);
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else {
            radius = Math.max(params[1], params[2]);
            rect = (params[0] as Rect).cgRect;
        }
        const path = UIBezierPath.bezierPathWithRoundedRectCornerRadius(rect, radius);
        // CGContextAddPath(ctx, path.CGPath);
        this._drawPath(paint, ctx, path);
    }

    @paint
    drawArc(...params) {
        // drawArc(rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
        // drawArc(left: number, top: number, right: number, bottom: number, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void;
        const length = params.length;
        const paint = params[length - 1] as Paint;
        const ctx = this.ctx;

        let rect: CGRect,
            sweepAngle,
            startAngle,
            useCenter = false;
        if (length === 8) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
            sweepAngle = params[5];
            startAngle = params[4];
            useCenter = params[6];
        } else if (length === 5) {
            rect = (params[0] as Rect).cgRect;
            sweepAngle = params[2];
            startAngle = params[1];
            useCenter = params[3];
        }
        const w = rect.size.width;
        const h = rect.size.height;
        const cx = rect.origin.x + w * 0.5;
        const cy = rect.origin.y + h * 0.5;
        const r = rect.size.width * 0.5;

        const path = CGPathCreateMutable();
        let t = CGAffineTransformMakeTranslation(cx, cy);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, h / w), t);
        if (useCenter) {
            CGPathMoveToPoint(path, null, cx, cy);
            // CGContextMoveToPoint(ctx, cx, cy);
        }
        CGPathAddArc(path, new interop.Reference(t), 0, 0, r, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, false);
        if (useCenter) {
            CGPathAddLineToPoint(path, null, cx, cy);
            // CGContextAddLineToPoint(ctx, cx, cy);
        }
        CGContextAddPath(ctx, path);

        this._drawPath(paint, ctx);

        // CFRelease(path);
    }
    @paint
    drawText(...params) {
        // const startTime = Date.now();
        // drawText(text: string, start: number, end: number, x: number, y: number, paint: Paint): void;
        // drawText(char: any[], index: number, count: number, x: number, y: number, paint: Paint): void;
        // drawText(text: string, x: number, y: number, paint: Paint): void;
        const length = params.length;
        const paint = params[length - 1] as Paint;
        const ctx = this.ctx;

        let x, y, text;
        if (length === 6) {
            text = params[0];
            x = params[3];
            y = params[4];
        } else if (length === 4) {
            text = params[0];
            x = params[1];
            y = params[2];
        }
        // const nsstring = NSString.stringWithUTF8String(text);
        // const attrString = NSAttributedString.alloc().initWithStringAttributes(text.replace(/\n/g, ' '), attribs);
        let offsetx = x;
        const offsety = y;
        if (paint.align !== Align.LEFT) {
            const width = paint.measureText(text);
            if (paint.align === Align.RIGHT) {
                offsetx -= width;
            } else {
                offsetx -= width / 2;
            }
        }
        UIGraphicsPushContext(ctx);
        if (paint.style === Style.FILL) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFill);
        } else if (paint.style === Style.STROKE) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextStroke);
        } else {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFillStroke);
        }
        const font = paint.getUIFont();
        const color = paint.getUIColor();
        if (text instanceof NSAttributedString) {
            UIDrawingText.drawAttributedStringXYFontColor(applyAttributesToNSAttributedString(text, paint.getDrawTextAttribs()), offsetx, offsety - font.ascender, font, color);
        } else if (paint.letterSpacing !== undefined) {
            UIDrawingText.drawStringXYWithAttributes(text, offsetx, offsety - font.ascender, paint.getDrawTextAttribs());
        } else {
            UIDrawingText.drawStringXYFontColor(text, offsetx, offsety - font.ascender, font, color);
        }
        UIGraphicsPopContext();
    }

    @paint
    //@ts-ignore
    drawTextOnPath(text: string | NSAttributedString, path: Path, hOffset: number, vOffset: number, paint: Paint): void {
        const ctx = this.ctx;
        const bPath = path.getOrCreateBPath();
        if (hOffset !== 0 || vOffset !== 0) {
            bPath.applyTransform(CGAffineTransformMakeTranslation(hOffset, vOffset));
            // const offsetpath = new Path();
            // path.offset(hOffset, vOffset, offsetpath);
            // bPath = UIBezierPath.bezierPathWithCGPath(offsetpath._path);
            // } else {
            // bPath =path.getOrCreateBPath();
        }
        if (paint.style === Style.FILL) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFill);
        } else if (paint.style === Style.STROKE) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextStroke);
        } else {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFillStroke);
        }
        UIGraphicsPushContext(ctx);
        if (text instanceof NSAttributedString) {
            bPath.drawAttributedStringWithAlignment(applyAttributesToNSAttributedString(text, paint.getDrawTextAttribs()), NSTextAlignmentFromAlign(paint.getTextAlign()));
        } else {
            bPath.drawStringWithAttributesWithAlignment(text, paint.getDrawTextAttribs(), NSTextAlignmentFromAlign(paint.getTextAlign()));
        }
        UIGraphicsPopContext();
    }
    drawTextRun(text: string, start: number, end: number, contextStart: number, contextEnd: number, x: number, y: number, isRtl: boolean, paint: IPaint): void {
        console.error('Method not implemented:', 'drawTextRun');
    }
    drawPosText(...arg) {
        // drawPosText(text: string, pos: number[], paint: IPaint): void;
        // drawPosText(text: string[], index: number, count: number, pos: number[], paint: IPaint): void;
        // drawPosText(text: any, index: any, count: any, pos?: any, paint?: any)
        console.error('Method not implemented:', 'drawPosText');
    }

    getCGImage() {
        return CGBitmapContextCreateImage(this.ctx);
    }

    getImage() {
        const imageRef = CGBitmapContextCreateImage(this.ctx);
        const result = UIImage.imageWithCGImageScaleOrientation(imageRef, this.mScale, UIImageOrientation.Up);
        // CGImageRelease(imageRef);
        return result;
    }
}

export function createImage(options: { width: number; height: number; scale?: number }) {
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(options.width, options.height), false, options.scale || 0);
    const output = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return output ? new ImageSource(output) : null;
}
export function releaseImage(image: ImageSource) {}

export class LinearGradient {
    mGradient;
    constructor(
        public x0: number,
        public y0: number,
        public x1: number,
        public y1: number,
        public colors: any,
        public stops: any,
        public tileMode: TileMode
    ) {}
    get gradient() {
        if (!this.mGradient) {
            if (Array.isArray(this.colors)) {
                let stopsRef = null;
                if (this.stops) {
                    const CGFloatArray = interop.sizeof(interop.types.id) === 4 ? Float32Array : Float64Array;
                    const buffer = CGFloatArray.from(this.stops.map((s) => Math.max(0, Math.min(1, s))));
                    stopsRef = buffer;
                }

                const cgColors = this.colors.map((c) => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this.mGradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, stopsRef);
                if (this.mGradient) {
                    CFRetain(this.mGradient);
                }
            } else {
                const cgColors = [this.colors, this.stops].map((c) => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this.mGradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, null);
                if (this.mGradient) {
                    CFRetain(this.mGradient);
                }
            }
        }
        return this.mGradient;
    }
    release() {
        if (this.mGradient) {
            CFRelease(this.mGradient);
            this.mGradient = undefined;
        }
    }
}
export class ColorMatrixColorFilter {
    _ciFilter;
    constructor(private values: number[]) {}
    get ciFilter() {
        if (!this._ciFilter) {
            this._ciFilter = CIFilter.filterWithName('CIColorMatrix');
            const value = this.values;
            this._ciFilter.setValueForKey(CIVector.vectorWithValuesCount(new FloatConstructor(value.slice(0, 4)).buffer as any, 4), 'inputRVector');
            this._ciFilter.setValueForKey(CIVector.vectorWithValuesCount(new FloatConstructor(value.slice(5, 9)).buffer as any, 4), 'inputGVector');
            this._ciFilter.setValueForKey(CIVector.vectorWithValuesCount(new FloatConstructor(value.slice(10, 14)).buffer as any, 4), 'inputBVector');
            this._ciFilter.setValueForKey(CIVector.vectorWithValuesCount(new FloatConstructor(value.slice(15, 19)).buffer as any, 4), 'inputAVector');
            this._ciFilter.setValueForKey(CIVector.vectorWithValuesCount(new FloatConstructor([value[4], value[9], value[14], value[19]]).buffer as any, 4), 'inputBiasVector');
        }
        return this._ciFilter;
    }
    release() {
        if (this._ciFilter) {
            this._ciFilter = undefined;
        }
    }
}

class Shader {
    localMatrix: Matrix;

    getLocalMatrix(localM: Matrix): boolean {
        if (this.localMatrix && !this.localMatrix.isIdentity()) {
            localM.set(this.localMatrix);
            return true;
        }
        return false;
    }
    setLocalMatrix(localM: Matrix) {
        if (localM) {
            if (!this.localMatrix) {
                this.localMatrix = new Matrix();
            }
            this.localMatrix.set(localM);
        } else {
            this.localMatrix = null;
        }
    }
}
export class RadialGradient extends Shader {
    mGradient;
    constructor(
        public centerX: number,
        public centerY: number,
        public radius: number,
        public colors: any,
        public stops: any,
        public tileMode: TileMode
    ) {
        super();
    }
    get gradient() {
        if (!this.mGradient) {
            if (Array.isArray(this.colors)) {
                const cgColors = this.colors.map((c) => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this.mGradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, null);
                CFRetain(this.mGradient);
            } else {
                const cgColors = [this.colors, this.stops].map((c) => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this.mGradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, null);
                CFRetain(this.mGradient);
            }
        }
        return this.mGradient;
    }
    release() {
        if (this.mGradient) {
            CFRelease(this.mGradient);
            this.mGradient = undefined;
        }
    }
}
export class BitmapShader extends Shader {
    constructor(
        public bitmap: any,
        public tileX: any,
        public tileY: any
    ) {
        super();
    }
    get image() {
        if (this.bitmap instanceof ImageSource) {
            return this.bitmap.ios;
        }
        return this.bitmap;
    }
    release() {}
}
export class PorterDuffXfermode {
    constructor(public mode?: number) {}
}

function lineBreakToLineBreakMode(value: string) {
    switch (value) {
        case 'end':
            return NSLineBreakMode.ByTruncatingTail;
        case 'start':
            return NSLineBreakMode.ByTruncatingHead;
        case 'middle':
            return NSLineBreakMode.ByTruncatingMiddle;
        default:
        case 'none':
            return NSLineBreakMode.ByWordWrapping;
    }
}

export class StaticLayout {
    rect: CGRect;
    nsAttributedString: NSAttributedString;
    mToDraw: NSMutableAttributedString;
    public constructor(
        private text: any,
        private paint: Paint,
        private width: number,
        private align: LayoutAlignment,
        private spacingmult?,
        private spacingadd?,
        private includepad?,
        private ellipsize?,
        private ellipsizedWidth?
    ) {
        if (text instanceof NSAttributedString) {
            this.nsAttributedString = text;
            // } else if (!(text instanceof NSMutableAttributedString)) {
            //     text = NSMutableAttributedString.alloc().initWithStringAttributes(text, this.paint.getDrawTextAttribs());
        } else {
            this.nsAttributedString = NSAttributedString.alloc().initWithString(text + '');
        }
    }
    createAttributedStringToDraw(canvas?) {
        if (this.mToDraw) {
            return;
        }

        const nsAttributedString: NSMutableAttributedString = NSMutableAttributedString.alloc().initWithStringAttributes(this.nsAttributedString.string, this.paint.getDrawTextAttribs());

        const paragraphStyle = NSMutableParagraphStyle.alloc().init();
        switch (this.align) {
            case LayoutAlignment.ALIGN_CENTER:
                paragraphStyle.alignment = NSTextAlignment.Center;
                break;
            case LayoutAlignment.ALIGN_NORMAL:
                paragraphStyle.alignment = NSTextAlignment.Left;
                break;
            case LayoutAlignment.ALIGN_OPPOSITE:
                paragraphStyle.alignment = NSTextAlignment.Right;
                break;
        }

        if (this.ellipsize) {
            // for now we only support end because we cant get NSLineBreakStrategy.Standard to work with
            // others
            // paragraphStyle.lineBreakMode = lineBreakToLineBreakMode(this.ellipsize);
            paragraphStyle.lineBreakStrategy = NSLineBreakStrategy.Standard;
        }
        const fullRange = { location: 0, length: nsAttributedString.length };
        this.mToDraw = nsAttributedString;
        this.nsAttributedString.enumerateAttributesInRangeOptionsUsingBlock(fullRange, 0 as any, (attributes: NSDictionary<string, any>, range: NSRange, p3: any) => {
            nsAttributedString.addAttributesRange(attributes, range);
        });
        nsAttributedString.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, fullRange);
    }
    draw(canvas: Canvas, maxHeight = Number.MAX_VALUE) {
        canvas.startApplyPaint(this.paint);
        const ctx = canvas.ctx;
        this.createAttributedStringToDraw(canvas);
        // const attributes = this.paint.getDrawTextAttribs();
        // if (this.align || this.ellipsize) {
        //     let paragraphStyle = attributes.objectForKey(NSParagraphStyleAttributeName) as NSMutableParagraphStyle;
        //     if (!paragraphStyle) {
        //         paragraphStyle = NSMutableParagraphStyle.alloc().init();
        //         attributes.setObjectForKey(paragraphStyle, NSParagraphStyleAttributeName);
        //     }
        //     switch (this.align) {
        //         case LayoutAlignment.ALIGN_CENTER:
        //             paragraphStyle.alignment = NSTextAlignment.Center;
        //             break;
        //         case LayoutAlignment.ALIGN_NORMAL:
        //             paragraphStyle.alignment = NSTextAlignment.Left;
        //             break;
        //         case LayoutAlignment.ALIGN_OPPOSITE:
        //             paragraphStyle.alignment = NSTextAlignment.Right;
        //             break;
        //     }
        //     if (this.ellipsize) {
        //         paragraphStyle.lineBreakMode = lineBreakToLineBreakMode(this.ellipsize);
        //     }
        // }
        // console.log('this.nsAttributedString', this.nsAttributedString);
        // console.log('attributes', attributes);
        // UIGraphicsPushContext(ctx);
        // UIDrawingText.drawAttributedStringXYWidthHeightWithAttributes(this.nsAttributedString, 0, 0, this.width, maxHeight, attributes);

        UIGraphicsPushContext(ctx);

        this.mToDraw.drawWithRectOptionsContext(
            CGRectMake(0, 0, this.width, maxHeight),
            NSStringDrawingOptions.UsesLineFragmentOrigin | NSStringDrawingOptions.TruncatesLastVisibleLine | NSStringDrawingOptions.UsesFontLeading,
            null
        );
        UIGraphicsPopContext();
        canvas.finishApplyPaint(this.paint);
    }
    getPaint() {
        return this.paint;
    }
    static getDesiredWidth(source, paint) {
        const layout = new StaticLayout(source, paint, Number.MAX_SAFE_INTEGER, LayoutAlignment.ALIGN_NORMAL);
        return layout.getBounds().size.width;
    }
    getBounds() {
        if (!this.rect) {
            this.createAttributedStringToDraw();
            this.rect = this.mToDraw.boundingRectWithSizeOptionsContext(CGSizeMake(this.width, Number.MAX_VALUE), NSStringDrawingOptions.UsesLineFragmentOrigin, null);
        }
        return this.rect;
    }
    getWidth() {
        if (this.width) {
            return this.width;
        }
        let result = this.getBounds().size.width;
        if (isNaN(result)) {
            result = this.width;
        } else {
            result = Math.max(result, this.width);
        }
        return result;
    }
    getHeight() {
        const result = this.getBounds().size.height;
        return result;
    }
}
