import { Font } from 'tns-core-modules/ui/styling/font';
import { Color, View } from 'tns-core-modules/ui/core/view';
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { ios } from 'tns-core-modules/utils/utils';

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

export class Paint {
    color: Color = new Color('black');
    style: Style = Style.FILL;
    textSize;
    _font: Font;
    strokeWidth;
    strokeCap: Cap = Cap.ROUND;
    strokeJoin: Join = Join.BEVEL;
    constructor() {
        // this.font = Font.default;
    }

    get font() {
        if (!this._font) {
            return Font.default;
        }
        return this._font;
    }

    setTextSize(textSize) {
        // this.textSize = textSize;
        if (!this._font) {
            this._font = Font.default.withFontSize(textSize);
        }
    }

    setColor(color: Color | number) {
        if (color instanceof Color) {
            this.color = color;
        } else {
            this.color = new Color(color);
        }
    }
}

class UICanvasView extends UIView {
    _cgContext: any; // CGContextRef;
    _canvas: any; // CGContextRef;
    didMoveToWindow() {
        this.contentScaleFactor = 1;
        this.layer.contentsScale = 1;
    }
    setSize(width, height) {
        if (width !== this.bounds.size.width || height !== this.bounds.size.height) {
            if (this._cgContext) {
                this._cgContext.setWidthHeight(width, height);
            }
            this.bounds = CGRectMake(0, 0, width, height);
            console.log('resizing now!', width, height);
        }
    }
    drawRect(dirtyRect) {
        if (this._canvas) {
            const viewport = CGRectMake(0, 0, this.bounds.size.width, this.bounds.size.height);
            const ctx = UIGraphicsGetCurrentContext();
            CGContextClearRect(ctx, viewport);
            const image = this._canvas.getCGImage();
            CGContextDrawImage(ctx, viewport, image);
            CGImageRelease(image);
        }
    }
}

export class CanvasView extends View {
    _canvas: Canvas;
    constructor() {
        super();
        this._canvas = new Canvas(0, 0);
    }
}

export class Canvas {
    _cgContext: any; // CGContextRef;
    _paint: Paint = new Paint();
    needsApplyDefaultPaint = true;
    _width: number;
    _height: number;
    _scale = UIScreen.mainScreen.scale;

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

    applyPaint(paint: Paint, withFont = false) {
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
        console.log('applyPaint', paint, paint === this._paint, withFont);

        const ctx = this._cgContext;
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
        if (paint.color) {
            const color = paint.color;
            if (paint.style === Style.FILL) {
                CGContextSetRGBFillColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            } else if (paint.style === Style.STROKE) {
                CGContextSetRGBStrokeColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            } else {
                CGContextSetRGBFillColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
                CGContextSetRGBStrokeColor(ctx, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
            }
            // paint.color.ios.setFill();
        }

        if (withFont && paint.font) {
            // const font = paint.font.getUIFont(UIFont.systemFontOfSize(ios.getter(UIFont, UIFont.labelFontSize))) as UIFont;
            // console.log('set font', font.fontName, font.familyName, font.pointSize, font.fontDescriptor, font.fontDescriptor.postscriptName);
            // CGContextSelectFont(ctx, font.fontDescriptor.postscriptName, font.pointSize, CGTextEncoding.kCGEncodingMacRoman);
            // CGContextSetCharacterSpacing(ctx, 1.7);
            // const transform = CGAffineTransformMake(1.0, 0.0, 0.0, -1.0, 0.0, 0.0);
            // CGContextSetTextMatrix(ctx, transform);
        }
        return paint;
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
        CGContextTranslateCTM(context, 0, source.size.height);
        CGContextScaleCTM(context, 1.0, -1.0);
        CGContextDrawImage(context, rect, source.CGImage);

        // tint image (loosing alpha) - the luminosity of the original image is preserved
        //   CGContextSetBlendMode(context, mode);
        //   [color setFill];
        //   CGContextFillRect(context, rect);

        // mask by alpha values of original image
        //   CGContextSetBlendMode(context, kCGBlendModeDestinationIn);
        CGContextDrawImage(context, rect, source.CGImage);
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

    fillRect(x: number, y: number, w: number, h: number, paint?: Paint) {
        const ctx = this._cgContext;
        paint = this.applyPaint(paint);
        const color = paint.color;
        console.log('fillRect', x, y, w, h, color.r, color.g, color.b, color.a / 255);
        CGContextFillRect(ctx, CGRectMake(x, y, w, h));
    }
    drawRect(l: number, t: number, r: number, b: number, paint?: Paint) {
        const ctx = this._cgContext;
        paint = this.applyPaint(paint);
        console.log('drawRect', l, t, r, b);
        const y = t - (b - t);
        if (paint.style === Style.FILL) {
            CGContextFillRect(ctx, CGRectMake(l, y, r - l, b - t));
        } else if (paint.style === Style.STROKE) {
            CGContextStrokeRect(ctx, CGRectMake(l, y, r - l, b - t));
        } else {
            CGContextFillRect(ctx, CGRectMake(l, y, r - l, b - t));
            CGContextStrokeRect(ctx, CGRectMake(l, y, r - l, b - t));
        }
    }
    drawImage(x: number, y: number, w: number, h: number, image: ImageSource | UIImage) {
        const ctx = this._cgContext;
        const theImage: UIImage = image instanceof ImageSource ? image.ios : image;
        CGContextDrawImage(ctx, CGRectMake(x, y, w, h), theImage.CGImage);
    }
    clipRect(x: number, y: number, w: number, h: number) {
        const ctx = this._cgContext;
        CGContextClipToRect(ctx, CGRectMake(x, y, w, h));
    }
    drawRoundedRect(x: number, y: number, w: number, h: number, radius: number, paint?: Paint) {
        const ctx = this._cgContext;
        this.applyPaint(paint);
        const path = UIBezierPath.bezierPathWithRoundedRectCornerRadius(CGRectMake(x, y, w, h), radius);
        CGContextAddPath(ctx, path.CGPath);
        if (paint.style === Style.FILL) {
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathFill);
            CGContextFillRect(ctx, CGRectMake(x, y, w, h));
        } else {
            CGContextDrawPath(ctx, CGPathDrawingMode.kCGPathStroke);
            CGContextStrokeRect(ctx, CGRectMake(x, y, w, h));
        }
    }
    drawArc(x, y, radius, startAngle, sweepAngle, paint?: Paint) {
        const ctx = this._cgContext;
        this.applyPaint(paint, false);
        const arcLengthRad = (sweepAngle * Math.PI) / 180; // Whatever, the full span of the arc in radians
        const arcCenterRad = ((startAngle + sweepAngle / 2) * Math.PI) / 180; // the angle of the center of the arc, in radians

        const arcP1hyp = (1 / cos(arcLengthRad / 2)) * radius;
        const arcP1x = x + cosf(arcCenterRad) * arcP1hyp;
        const arcP1y = y + sinf(arcCenterRad) * arcP1hyp;
        const arcP2tx = x + cosf(arcCenterRad + arcLengthRad / 2) * radius;
        const arcP2ty = y + sinf(arcCenterRad + arcLengthRad / 2) * radius;
        const arcP2x = (arcP1x - arcP2tx) * -1 + arcP2tx;
        const arcP2y = (arcP1y - arcP2ty) * -1 + arcP2ty;
        CGContextAddArcToPoint(ctx, arcP1x, arcP1y, arcP2x, arcP2y, radius);
    }
    drawText(text: string, x: number, y: number, paint?: Paint) {
        const ctx = this._cgContext;
        paint = this.applyPaint(paint, true);
        console.log('drawText', text, x, y, paint);

        UIGraphicsPushContext(ctx);
        CGContextSaveGState(ctx);
        CGContextTranslateCTM(ctx, 0.0, this._height);
        CGContextScaleCTM(ctx, 1.0, -1.0);
        const font = paint.font;
        CGContextSetTextMatrix(ctx, CGAffineTransformMake(1.0, 0.0, 0.0, -1.0, 0.0, 0.0));
        CGContextSetShouldSmoothFonts(ctx, true);
        if (paint.style === Style.FILL) {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFill);
        } else {
            CGContextSetTextDrawingMode(ctx, CGTextDrawingMode.kCGTextFillStroke);
        }
        NSString.stringWithUTF8String(text).drawAtPointWithFont(CGPointMake(x, y), font.getUIFont(UIFont.systemFontOfSize(ios.getter(UIFont, UIFont.labelFontSize))) as UIFont);
        CGContextRestoreGState(ctx);
        UIGraphicsPopContext();
        // const fontSize = ((paint && paint.font) || this._paint.font).fontSize || 20;
        // CGContextShowTextAtPoint(ctx, x, y, text, text.length);
        // UIGraphicsGetCurrentContext();
    }

    getCGImage() {
        return CGBitmapContextCreateImage(this._cgContext);
    }
    getImage() {
        const imageRef = CGBitmapContextCreateImage(this._cgContext);
        const result = UIImage.imageWithCGImageScaleOrientation(imageRef, this._scale, UIImageOrientation.Up);
        CGImageRelease(imageRef);
        console.log('getImage', result, result && result.size.width);
        return result;
    }
}
