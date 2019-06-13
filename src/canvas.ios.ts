import { Font } from 'tns-core-modules/ui/styling/font';
import { Color, View } from 'tns-core-modules/ui/core/view';
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { Canvas as ICanvas, Paint as IPaint, Path as IPath, Rect as IRect } from './canvas';
import { CanvasBase, DEFAULT_SCALE } from './canvas.common';

export * from './canvas.common';

const  FloatConstructor = interop.sizeof(interop.types.id) === 4 ? Float32Array : Float64Array;

const enum MemberType {
    Static,
    Instance
}

function timelineProfileFunctionFactory<F extends Function>(fn: F, name: string, type: MemberType = MemberType.Instance): F {
    let result;
    if (type === MemberType.Instance) {
        result = function() {
            // const start = time();
            console.log(name);
            try {
                return fn.apply(this, arguments);
            } finally {
                // const end = time();
                // console.log(`Timeline: Modules: ${name} ${this}  (${start}ms. - ${end}ms.)`);
            }
        };
    } else {
        result = function() {
            // const start = time();
            // console.log(`calling method: ${name}`);
            try {
                return fn.apply(this, arguments);
            } finally {
                // const end = time();
                // console.log(`Timeline: Modules: ${name}  (${start}ms. - ${end}ms.)`);
            }
        };
    }
    return result;
}
function profile(target?: string | Function | Object, key?, descriptor?: PropertyDescriptor): any {
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;

    let className = '';
    if (target && target.constructor && target.constructor.name) {
        className = target.constructor.name + '.';
    }

    const name = className + key;

    // editing the descriptor/value parameter
    descriptor.value = timelineProfileFunctionFactory(originalMethod, name, MemberType.Instance);

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}

function paint(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value as Function; // save a reference to the original method

    // NOTE: Do not use arrow syntax here. Use a function expression in
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function(...args: any[]) {
        const paint = args[args.length - 1];
        let actualPaint;
        if (paint instanceof Paint) {
            actualPaint = this.startApplyPaint(paint);
            args[args.length - 1] = actualPaint;
        } else {
            actualPaint = this.startApplyPaint();
        }
        const result = originalMethod.apply(this, args);
        this.finishApplyPaint(actualPaint);
        return result;
    };

    return descriptor;
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

function createCGRect(l, t, r, b) {
    return CGRectMake(l, t, r - l, b - t);
}

export class Rect implements IRect {
    get cgRect() {
        return this._rect;
    }
    set cgRect(rect: CGRect) {
        this._rect = rect;
    }

    public set(rect: Rect) {
        this._rect = rect.cgRect;
    }
    public inset(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    public union(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    public offsetTo(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    public offset(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    public centerX(): number {
        console.error('Method not implemented.');
        return -1;
    }
    public centerY(): number {
        console.error('Method not implemented.');
        return -1;
    }
    public intersect(...params) {
        const length = params.length;
        if (length === 4) {
            // param0: number, param1: number, param2: number, param3: number
        } else if (length === 1) {
            // param0: IRect
        }
        console.error('Method not implemented.');
        return false;
    }
    public contains(...params) {
        const length = params.length;
        if (length === 4) {
            // param0: number, param1: number, param2: number, param3: number
        } else if (length === 1) {
            // param0: IRect
        }
        console.error('Method not implemented.');
        return false;
    }
    _rect: CGRect;
    left: number;
    top: number;
    right: number;
    bottom: number;
    constructor(...args) {
        if (args.length === 1) {
            this._rect = args[0];
            this.left = this._rect.origin.x;
            this.top = this._rect.origin.y;
            this.right = this.left + this._rect.size.width;
            this.bottom = this.top + this._rect.size.height;
        } else {
            const l = (this.left = args[0]);
            const t = (this.top = args[1]);
            const r = (this.right = args[2]);
            const b = (this.bottom = args[3]);
            this._rect = createCGRect(l, t, r, b);
        }
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

export class Matrix {}

export class PathEffect {}
export class DashPathEffect extends PathEffect {
    constructor(public intervals: number[], public phase: number) {
        super();
    }
}

export class Path implements IPath {
    _path: any;
    _fillType: FillType;
    constructor() {
        this._path = CGPathCreateMutable();
        // this._path = UIBezierPath.bezierPath();
    }
    isRect(rect: Rect): boolean {
        return CGPathIsRect(this._path, new interop.Reference(rect.cgRect));
    }
    rMoveTo(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    arcTo(rect: Rect, startAngle: number, sweepAngle: number, forceMoveTo?: boolean) {
        const center = CGPointMake(rect.centerX(), rect.centerY());
        let t = CGAffineTransformMakeTranslation(center.x, center.y);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, rect.height() / rect.width()), t);
        CGPathAddArc(this._path, new interop.Reference(t), 0, 0, rect.width() / 2, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, true);
    }
    offset(dx: number, dy: number, output?: Path) {
        const t = CGAffineTransformMakeTranslation(dx, dy);
        if (output) {
            output._path = CGPathCreateMutableCopyByTransformingPath(this._path, new interop.Reference(t));
        } else {
            this._path = CGPathCreateMutableCopyByTransformingPath(this._path, new interop.Reference(t));
        }
    }
    rCubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void {
        console.error('Method not implemented.');
    }
    rQuadTo(param0: number, param1: number, param2: number, param3: number): void {
        console.error('Method not implemented.');
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
        CGPathAddRoundedRect(this._path, null, rect, rx, ry);
    }
    addPath(...params) {
        // TODO: Matrix is ignored
        const length = params.length;
        const path = params[0];
        if (length === 1) {
            CGPathAddPath(this._path, null, path);
            // param0: IPath, param1: number, param2: number
        } else if (length === 2) {
            CGPathAddPath(this._path, null, path);
            // param0: IPath, param1: number, param2: number
        } else if (length === 3) {
            const t = CGAffineTransformMakeTranslation(params[1], params[2]);
            CGPathAddPath(this._path, new interop.Reference(t), path);

            // param0: IPath, param1: Matrix
        }
    }
    rLineTo(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    lineTo(x: number, y: number): void {
        CGPathAddLineToPoint(this._path, null, x, y);
    }
    quadTo(cpx: number, cpy: number, x: number, y: number): void {
        CGPathAddQuadCurveToPoint(this._path, null, cpx, cpy, x, y);
    }
    transform(param0: Matrix, param1?: IPath) {
        console.error('Method not implemented.');
    }
    reset(): void {
        this._path = CGPathCreateMutable();
    }
    addArc(...params): void {
        const length = params.length;
        const path = params[0];
        let rect: Rect, sweepAngle, startAngle;
        if (length === 6) {
            rect = new Rect(params[0], params[1], params[2], params[3]);
            startAngle = params[4];
            sweepAngle = params[5];
        } else if (length === 3) {
            rect = params[0] as Rect;
            startAngle = params[1];
            sweepAngle = params[2];
        }
        const center = CGPointMake(rect.centerX(), rect.centerY());
        let t = CGAffineTransformMakeTranslation(center.x, center.y);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, rect.height() / rect.width()), t);
        CGPathAddArc(this._path, new interop.Reference(t), 0, 0, rect.width() / 2, (startAngle * Math.PI) / 180, ((startAngle + sweepAngle) * Math.PI) / 180, true);
    }
    close(): void {
        CGPathCloseSubpath(this._path);
    }
    addCircle(x: number, y: number, r: number, d: Direction): void {
        CGPathAddEllipseInRect(this._path, null, CGRectMake(x - r, y - r, 2 * r, 2 * r));
    }
    rewind(): void {
        this.reset();
    }
    setLastPoint(param0: number, param1: number): void {
        console.error('Method not implemented.');
    }
    toggleInverseFillType(): void {
        console.error('Method not implemented.');
    }
    moveTo(x: number, y: number): void {
        CGPathMoveToPoint(this._path, null, x, y);
    }
    setFillType(value: FillType): void {
        this._fillType = value;
    }
    isEmpty(): boolean {
        console.error('Method not implemented.');
        return false;
    }
    cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void {
        console.error('Method not implemented.');
    }
    incReserve(param0: number): void {
        console.error('Method not implemented.');
    }
    getFillType(): FillType {
        return this._fillType;
    }
    addRect(...params) {
        const length = params.length;
        let rect: CGRect;
        if (length === 5) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 2) {
            rect = (params[0] as Rect).cgRect;
        }
        CGPathAddRect(this._path, null, rect);
    }
    addOval(...params): void {
        const length = params.length;
        let rect: CGRect;
        if (length === 5) {
            rect = createCGRect(params[0], params[1], params[2], params[3]);
        } else if (length === 2) {
            rect = (params[0] as Rect).cgRect;
        }
        CGPathAddEllipseInRect(this._path, null, rect);
    }
    isInverseFillType(): boolean {
        return false;
    }
    set(path: Path): void {
        this._path = CGPathCreateMutableCopy(path._path);
    }
}

export class Paint implements IPaint {
    _color: Color = new Color('black');
    style: Style = Style.FILL;
    textSize = 16;
    _font: Font;
    strokeWidth = 0;
    strokeMiter = 0;
    strokeCap: Cap = Cap.ROUND;
    strokeJoin: Join = Join.MITER;
    antiAlias = false;
    dither = false;
    alpha = 1;
    currentContext: any;
    shadowLayer?: {
        radius: number;
        dx: number;
        dy: number;
        color: Color;
    };
    shader;

    public setShadowLayer(radius: number, dx: number, dy: number, color: number | Color | string): void {
        this.shadowLayer = {
            radius,
            dx,
            dy,
            color: color instanceof Color ? color : new Color(color as any)
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
        this._color = new Color(a, r, g, b);
    }
    public measureText(...args) {
        // public measureText(text: string): number;
        // public measureText(text: string, start: number, end: number): number;
        // public measureText(text: any, start?: any, end?: any)
        const text = args[0];
        const maximumSize = CGSizeMake(9999, 9999);
        const result = NSString.stringWithUTF8String(text).sizeWithFont(this.getUIFont());
        return result.width;
    }
    public getTextSize(): number {
        return this.textSize;
    }
    public getTextBounds(text: string, index: number, bounds: number, rect: Rect): void {
        const maximumSize = CGSizeMake(9999, 9999);
        const result = NSString.stringWithUTF8String(text).sizeWithFont(this.getUIFont());
        rect.cgRect = CGRectMake(0, 0, result.width, result.height);
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
    constructor() {
        // this.font = Font.default;
    }

    get font() {
        if (!this._font) {
            return Font.default;
        }
        return this._font;
    }

    getUIFont() {
        return this.font.getUIFont(UIFont.systemFontOfSize(UIFont.labelFontSize));
    }
    getUIColor() {
        return (this.color as Color).ios;
    }

    setTextSize(textSize) {
        // this.textSize = textSize;
        if (!this._font) {
            this._font = Font.default.withFontSize(textSize);
        }
    }
    get color(): Color | number | string {
        return this._color;
    }
    set color(color: Color | number | string) {
        if (color instanceof Color) {
            this._color = color;
        } else {
            this._color = new Color(color as any);
        }
    }
    setColor(color: Color | number | string) {
        this.color = color as any;
    }
    getColor(): Color {
        return this._color;
    }

    clear() {
        if (this.shader) {
            this.shader.clear();
            this.shader = null;
        }
    }
    pathEffect: PathEffect;
    public setPathEffect(param0: PathEffect) {
        this.pathEffect = param0;
    }
}

export class Canvas implements ICanvas {
    _cgContext: any; // CGContextRef;
    _paint: Paint = new Paint();
    needsApplyDefaultPaint = true;
    _width: number;
    _height: number;
    _scale = DEFAULT_SCALE;

    release(): any {
        this._cgContext = null;
        if (this._paint) {
            this._paint.clear();
        }
    }
    clear() {
        this.drawColor('transparent');
    }
    get ctx() {
        return this._cgContext;
    }
    setContext(context, width, height): any {
        // console.error('setContext', context, width, height);
        this._cgContext = context;
        this._width = width;
        this._height = height;
    }
    getDensity(): number {
        // console.error('Method not implemented.');
        return this._scale;
    }
    setDensity(density: number): void {
        this._scale = density;
        // TODO: recreate context when possible
    }
    getDrawFilter(): any {
        console.error('Method not implemented.');
    }
    setDrawFilter(filter: any): void {
        console.error('Method not implemented.');
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
        console.error('Method not implemented.');
    }

    getClipBounds(): IRect {
        return new Rect(CGContextGetClipBoundingBox(this.ctx));
    }

    restore(): void {
        CGContextRestoreGState(this.ctx);
    }

    save(): number {
        CGContextSaveGState(this.ctx);
        return 0;
    }
    drawPaint(paint: IPaint): void {
        console.error('Method not implemented.');
    }

    drawARGB(a: number, r: number, g: number, b: number): void {
        this.save();
        const ctx = this.ctx;
        CGContextSetRGBFillColor(ctx, r / 255, g / 255, b / 255, a / 255);
        CGContextFillRect(ctx, CGRectMake(0, 0, this._width, this._height));
        this.restore();
    }

    drawRGB(r: number, g: number, b: number): void {
        this.drawARGB(255, r, g, b);
    }

    drawColor(color: number | Color | string): void {
        const ctx = this.ctx;
        const actualColor = color instanceof Color ? color : new Color(color as any);
        this.save();
        CGContextSetRGBFillColor(ctx, actualColor.r / 255, actualColor.g / 255, actualColor.b / 255, actualColor.a / 255);
        CGContextFillRect(ctx, CGRectMake(0, 0, this._width, this._height));
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
        const dst = args[2] instanceof Rect ? args[2].cgRect : CGRectMake(args[1], args[2], image.size.width, image.size.height);

        CGContextSaveGState(ctx);
        CGContextTranslateCTM(ctx, 0, dst.origin.y +  dst.size.height);
        CGContextScaleCTM(ctx, 1.0, -1.0);
        CGContextDrawImage(ctx,  CGRectMake(dst.origin.x, 0, dst.size.width, dst.size.height), image.CGImage);
        CGContextRestoreGState(ctx);
    }

    drawPoint(x: number, y: number, paint: IPaint): void {
        console.error('Method not implemented.');
    }
    drawPoints(pts: number[], paint: IPaint): void {
        console.error('Method not implemented.');
    }
    @paint
    drawLine(startX: number, startY: number, stopX: number, stopY: number, paint: Paint): void {
        const ctx = this.ctx;
        CGContextBeginPath(ctx);
        CGContextMoveToPoint(ctx, startX, startY);
        CGContextAddLineToPoint(ctx, stopX, stopY);
        this._drawPath(paint, ctx);
    }
    @paint
    drawLines(...args) {
        // drawLines(pts: number[], offset: number, count: number, paint: IPaint): void;
        // drawLines(pts: number[], paint: IPaint): void;
        // drawLines(pts: any, offset: any, count?: any, paint?: any)
        const ctx = this.ctx;
        CGContextBeginPath(ctx);
        // CGContextAddLines(ctx, rect);
        // this._drawPath(paint, ctx);
    }
    @paint
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
        console.error('Method not implemented.');
    }
    @paint
    drawPath(path: Path, paint: Paint): void {
        const ctx = this.ctx;
        CGContextBeginPath(ctx);
        CGContextAddPath(ctx, path._path);
        if (path._fillType === FillType.EVEN_ODD) {
            this._drawEOFPath(paint, ctx);
        } else {
            this._drawPath(paint, ctx);
        }
    }
    clipOutPath(path: IPath): boolean {
        console.error('Method not implemented.');
        return false;
    }
    clipOutRect(...args) {
        // clipOutRect(left: number, top: number, right: number, bottom: number): boolean;
        // clipOutRect(rect: IRect): boolean;
        // clipOutRect(left: any, top?: any, right?: any, bottom?: any)
        console.error('Method not implemented.');
        return false;
    }
    clipPath(...args) {
        // clipPath(path: IPath): boolean;
        // clipPath(path: IPath, op: Op): boolean;
        // clipPath(path: any, op?: any)
        console.error('Method not implemented.');
        return false;
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
                // view.layout(0, 0, layout.toDevicePixels(rect.width()), layout.toDevicePixels(rect.height()));

                // Translate the canvas so the view is drawn at the proper coordinates
                this.save();
                this.translate(rect.left, rect.top);
            }
            this.scale(this._scale, this._scale);
            // uiView.layer.contentsScale = 1;
            // uiView.contentScaleFactor = 1;
            uiView.drawLayerInContext(uiView.layer, this.ctx);
            if (rect) {
                this.restore();
            }
        }
    }
    // getWidth() {
    //     return layout.toDeviceIndependentPixels(this._width);
    // }
    // getHeight() {
    //     return layout.toDeviceIndependentPixels(this._height);
    // }
    getWidth() {
        return this._width;
    }
    getHeight() {
        return this._height;
    }
    constructor(imageOrWidth: ImageSource | UIImage | number, height?: number) {
        if (imageOrWidth instanceof ImageSource) {
            this._cgContext = this._createContextFromImage(imageOrWidth.ios);
        } else if (imageOrWidth instanceof UIImage) {
            this._cgContext = this._createContextFromImage(imageOrWidth);
        } else if (imageOrWidth > 0 && height > 0) {
            this._cgContext = this._createContext(imageOrWidth, height);
        }
        // CGContextFillRect(this._cgContext);
    }

    startApplyPaint(paint: Paint, withFont = false) {
        this.save();
        if (!paint) {
            paint = this._paint;
            if (this.needsApplyDefaultPaint) {
                this.needsApplyDefaultPaint = false;
            } else {
                return paint;
            }
        } else {
            if (paint !== this._paint) {
                this.needsApplyDefaultPaint = true;
            }
        }
        // console.log('applyPaint', paint, paint === this._paint, withFont);

        const ctx = this._cgContext;
        paint.currentContext = ctx;
        CGContextSetAlpha(ctx, paint.alpha);
        CGContextSetShouldAntialias(ctx, paint.antiAlias);
        CGContextSetShouldSmoothFonts(ctx, paint.antiAlias);

        if (paint.shadowLayer) {
            const s = paint.shadowLayer;
            CGContextSetShadowWithColor(ctx, CGSizeMake(s.dx, s.dy), s.radius, s.color.ios.CGColor);
        } else {
            CGContextSetShadow(ctx, CGSizeZero, 0);
        }
        // CGContextSetRGBFillColor(ctx, 0.0, 1.0, 0.0, 1.0);
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
            const color = paint.getColor();
            // if (paint.style === Style.FILL) {
            //     CGContextSetRGBFillColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            // } else if (paint.style === Style.STROKE) {
            //     CGContextSetRGBStrokeColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            // } else {
            CGContextSetRGBFillColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            CGContextSetRGBStrokeColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            // }
            // paint.color.ios.setFill();
        }

        if (withFont && paint.font) {
            // const font = paint.font.getUIFont(UIFont.systemFontOfSize( UIFont.labelFontSize)) as UIFont;
            // console.log('set font', font.fontName, font.familyName, font.pointSize, font.fontDescriptor, font.fontDescriptor.postscriptName);
            // CGContextSelectFont(ctx, font.fontDescriptor.postscriptName, font.pointSize, CGTextEncoding.kCGEncodingMacRoman);
            // CGContextSetCharacterSpacing(ctx, 1.7);
            // const transform = CGAffineTransformMake(1.0, 0.0, 0.0, -1.0, 0.0, 0.0);
            // CGContextSetTextMatrix(ctx, transform);
        }
        return paint;
    }
    finishApplyPaint(paint) {
        paint.currentContext = null;
        const ctx = this._cgContext;
        CGContextSetLineDash(ctx, 0, null, 0);
        this.restore();
    }

    _createContextFromImage(source: UIImage) {
        this._width = source.size.width;
        this._height = source.size.height;
        const rect = CGRectMake(0, 0, this._width, this._height);

        UIGraphicsBeginImageContextWithOptions(source.size, false, source.scale);
        const context = UIGraphicsGetCurrentContext();
        // draw black background to preserve color of transparent pixels
        CGContextSetBlendMode(context, CGBlendMode.kCGBlendModeNormal);
        //   [[UIColor blackColor] setFill];
        //   CGContextFillRect(context, rect);

        // draw original image
        //   CGContextSetBlendMode(context, CGBlendMode.kCGBlendModeNormal);
        CGContextSaveGState(context);
        CGContextTranslateCTM(context, 0, source.size.height);
        CGContextScaleCTM(context, 1.0, -1.0);
        CGContextDrawImage(context, rect, source.CGImage);
        CGContextRestoreGState(context);

        // tint image (loosing alpha) - the luminosity of the original image is preserved
        //   CGContextSetBlendMode(context, mode);
        //   [color setFill];
        //   CGContextFillRect(context, rect);

        // mask by alpha values of original image
        //   CGContextSetBlendMode(context, kCGBlendModeDestinationIn);
        // CGContextDrawImage(context, rect, source.CGImage);
        return context;
    }

    _createContext(w, h) {
        this._width = w;
        this._height = h;
        let context = null;
        let colorSpace;
        const scaleFactor = this._scale;
        const bitmapBytesPerRow = w * 4 * scaleFactor; // 1
        colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB); // 2
        context = CGBitmapContextCreate(
            null, // 4
            w * scaleFactor,
            h * scaleFactor,
            8, // bits per component
            bitmapBytesPerRow,
            colorSpace,
            CGImageAlphaInfo.kCGImageAlphaPremultipliedLast
        );
        CGContextScaleCTM(context, scaleFactor, scaleFactor);
        CGColorSpaceRelease(colorSpace); // 6
        return context; // 7
    }

    @paint
    fillRect(x: number, y: number, w: number, h: number, paint?: Paint) {
        const ctx = this.ctx;
        const color = paint.getColor();
        CGContextFillRect(ctx, createCGRect(x, y, w, h));
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
        if (paint.style === Style.FILL) {
            CGContextFillRect(ctx, rect);
        } else if (paint.style === Style.STROKE) {
            CGContextStrokeRect(ctx, rect);
        } else {
            CGContextFillRect(ctx, rect);
            CGContextStrokeRect(ctx, rect);
        }
    }

    @paint
    drawImage(x: number, y: number, w: number, h: number, image: ImageSource | UIImage) {
        const ctx = this.ctx;
        const theImage: UIImage = image instanceof ImageSource ? image.ios : image;
        CGContextDrawImage(ctx, createCGRect(x, y, w, h), theImage.CGImage);
    }
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
    private _drawEOFPath(paint: Paint, ctx) {
        if (paint.shader) {
            if (paint.shader instanceof RadialGradient) {
                const g = paint.shader;
                CGContextClip(ctx);
                CGContextDrawRadialGradient(ctx, g.gradient, CGPointMake(g.centerX, g.centerY), 0, CGPointMake(g.centerX, g.centerY), g.radius, 0);
            }
        }
        if (paint.style === Style.FILL) {
            CGContextEOFillPath(ctx);
        } else if (paint.style === Style.STROKE) {
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
        } else {
            CGContextEOFillPath(ctx);
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
        }
    }
    private _drawPath(paint: Paint, ctx) {
        if (paint.shader) {
            if (paint.shader instanceof RadialGradient) {
                const g = paint.shader;
                CGContextClip(ctx);
                CGContextDrawRadialGradient(ctx, g.gradient, CGPointMake(g.centerX, g.centerY), 0, CGPointMake(g.centerX, g.centerY), g.radius, 0);
            }
        }
        // if (!!paint.pathEffect) {
        //     if (paint.pathEffect instanceof DashPathEffect) {
        //         const intervals = paint.pathEffect.intervals;
        //         const length = intervals.length;
        //         // const buffer = interop.alloc(length * interop.sizeof(interop.types.float));
        //         // const reference = new interop.Reference(interop.types.float, buffer);
        //         // for (let i = 0; i < length; i++) {
        //         //     reference[i] = intervals[i];
        //         // }

        //         const view = new Float32Array(length);
        //         for (let i = 0; i < length; i++) {
        //             view[i] = intervals[i];
        //         }
        //         // const intervals = paint.pathEffect.intervals;
        //         // const outerPtr = interop.alloc(interop.sizeof(interop.Pointer));
        //         // const outerRef = new interop.Reference(interop.types.id, outerPtr);
        //         // outerRef.value = intervals;

        //         console.log('CGContextSetLineDash2', paint.pathEffect.phase, view, length);
        //         CGContextSetLineDash(ctx, paint.pathEffect.phase, Float32Array.from(paint.pathEffect.intervals) as any, length);
        //     }
        // }
        if (paint.style === Style.FILL) {
            // CGContextFillPath(ctx);
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFill);
        } else if (paint.style === Style.STROKE) {
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
        } else {
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFillStroke);
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
        CGContextAddPath(ctx, path.CGPath);
        this._drawPath(paint, ctx);
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
        const cx = rect.origin.x + rect.size.width * 0.5;
        const cy = rect.origin.y + rect.size.height * 0.5;
        const r = rect.size.width * 0.5;

        const path = CGPathCreateMutable();
        let t = CGAffineTransformMakeTranslation(cx, cy);
        t = CGAffineTransformConcat(CGAffineTransformMakeScale(1.0, rect.size.height / rect.size.width), t);
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
        // UIGraphicsPushContext(ctx);
        // CGContextTranslateCTM(ctx, 0.0, this._height);
        // CGContextScaleCTM(ctx, 1.0, -1.0);
        // const font = paint.font;
        CGContextSetTextMatrix(ctx, CGAffineTransformMake(1.0, 0.0, 0.0, -1.0, 0.0, 0.0));
        if (paint.style === Style.FILL) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFill);
        } else if (paint.style === Style.STROKE) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextStroke);
        } else {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFillStroke);
        }

        const attribs = NSDictionary.dictionaryWithObjectsForKeys([paint.getUIFont(), kCFBooleanTrue], [NSFontAttributeName, kCTForegroundColorFromContextAttributeName]);

        const fontStr = NSAttributedString.alloc().initWithStringAttributes(text, attribs);

        const displayLine = CTLineCreateWithAttributedString(fontStr);
        CGContextSetTextPosition(ctx, x, y);
        CTLineDraw(displayLine, ctx);
        // CFRelease(displayLine);
        // NSString.stringWithUTF8String(text).drawAtPointWithFont(CGPointMake(x, y), paint.getUIFont());
        // UIGraphicsPopContext();
        // const fontSize = ((paint && paint.font) || this._paint.font).fontSize || 20;
        // CGContextShowTextAtPoint(ctx, x, y, text, text.length);
        // UIGraphicsGetCurrentContext();
    }
    @paint
    drawTextOnPath(text: string, path: Path, hOffset: number, vOffset: number, paint: Paint): void {
        const ctx = this.ctx;
        const bPath = UIBezierPath.bezierPathWithCGPath(path._path);
        if (paint.style === Style.FILL) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFill);
        } else if (paint.style === Style.STROKE) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextStroke);
        } else {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFillStroke);
        }
        const attribs = NSDictionary.dictionaryWithObjectsForKeys([paint.getUIFont(), paint.getUIColor()], [NSFontAttributeName, NSForegroundColorAttributeName]);

        const fontStr = NSAttributedString.alloc().initWithStringAttributes(text, attribs);
        (bPath as any).drawAttributedString(fontStr);
    }
    drawTextRun(text: string, start: number, end: number, contextStart: number, contextEnd: number, x: number, y: number, isRtl: boolean, paint: IPaint): void {
        console.error('Method not implemented.');
    }
    drawPosText(...arg) {
        // drawPosText(text: string, pos: number[], paint: IPaint): void;
        // drawPosText(text: string[], index: number, count: number, pos: number[], paint: IPaint): void;
        // drawPosText(text: any, index: any, count: any, pos?: any, paint?: any)
        console.error('Method not implemented.');
    }

    getCGImage() {
        return CGBitmapContextCreateImage(this.ctx);
    }

    getImage() {
        const imageRef = CGBitmapContextCreateImage(this.ctx);
        const result = UIImage.imageWithCGImageScaleOrientation(imageRef, this._scale, UIImageOrientation.Up);
        // CGImageRelease(imageRef);
        return result;
    }
}

export class UICustomCanvasView extends UIView {
    _canvas: Canvas; // CGContextRef;
    public _owner: WeakRef<CanvasView>;

    public static initWithOwner(owner: WeakRef<CanvasView>): UICustomCanvasView {
        const view = UICustomCanvasView.new() as UICustomCanvasView;
        view.contentMode = UIViewContentMode.Redraw;
        view._owner = owner;
        return view;
    }
    // didMoveToWindow() {
    // this.contentScaleFactor = 1;
    // this.layer.contentsScale = 1;
    // }
    // setSize(width, height) {
    //     if (width !== this.bounds.size.width || height !== this.bounds.size.height) {
    //         if (this._cgContext) {
    //             this._cgContext.setWidthHeight(width, height);
    //         }
    //         this.bounds = CGRectMake(0, 0, width, height);
    //         console.log('resizing now!', width, height);
    //     }
    // }
    drawRect(dirtyRect) {
        // only used to trigger drawLayer
    }

    drawLayerInContext(layer: CALayer, context: any) {
        super.drawLayerInContext(layer, context);
        const size = this.bounds.size;
        const owner = this._owner && this._owner.get();
        if (!this._canvas) {
            this._canvas = new Canvas(0, 0);
        }
        this._canvas.setContext(context, size.width, size.height);
        this._canvas.setDensity(owner.density);
        if (owner.shapesCanvas) {
            const canvas = owner.shapesCanvas as Canvas;
            canvas.setDensity(owner.density);
            const viewport = CGRectMake(0, 0, size.width, size.height);
            const image = canvas.getCGImage();
            CGContextDrawImage(context, viewport, image);
        } else if (!owner.cached && owner.shapes) {
            const shapes = owner.shapes;
            if (shapes.shapes.length > 0) {
                shapes.shapes.forEach(s => s.drawMyShapeOnCanvas(this._canvas));
            }
        }

        if (owner) {
            owner.notify({ eventName: 'draw', object: owner, canvas: this._canvas });
        }
    }
}

export class CanvasView extends CanvasBase {
    nativeViewProtected: UICustomCanvasView;
    createNativeView() {
        return UICustomCanvasView.initWithOwner(new WeakRef(this));
    }
    redraw() {
        if (this.nativeViewProtected) {
            const layer = this.nativeViewProtected.layer;
            layer.setNeedsDisplay();
            layer.displayIfNeeded();
        }
    }
}

export class RadialGradient {
    _gradient;
    // centerX: number;
    // centerY: number;
    // radius: number;
    // tileMode: TileMode;
    constructor(public centerX: number, public centerY: number, public radius: number, public colors: any, public stops: any, public tileMode: TileMode) {}
    get gradient() {
        if (!this._gradient) {
            if (Array.isArray(this.colors)) {
                const cgColors = this.colors.map(c => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this._gradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, null);
                CFRetain(this._gradient);
            } else {
                const cgColors = [this.colors, this.stops].map(c => (c instanceof Color ? c : new Color(c)).ios.CGColor);
                this._gradient = CGGradientCreateWithColors(CGColorSpaceCreateDeviceRGB(), cgColors as any, null);
                CFRetain(this._gradient);
            }
        }
        return this._gradient;
    }
    release() {
        if (this._gradient) {
            CFRelease(this._gradient);
            this._gradient = undefined;
        }
    }
}
