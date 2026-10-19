#import "CanvasNative.h"

static inline void ApplyPaint(CGContextRef ctx, UIColor *color, CGFloat alpha, CGFloat strokeWidth, int cap, int join, BOOL antiAlias) {
    CGContextSaveGState(ctx);
    CGContextSetAlpha(ctx, alpha);
    CGContextSetShouldAntialias(ctx, antiAlias);
    CGContextSetShouldSmoothFonts(ctx, antiAlias);
    if (strokeWidth != 0) {
        CGContextSetLineWidth(ctx, strokeWidth);
    }
    if (cap != 0) {
        CGContextSetLineCap(ctx, (CGLineCap)cap);
    }
    if (join != 0) {
        CGContextSetLineJoin(ctx, (CGLineJoin)join);
    }
    if (color) {
        CGColorRef cgColor = color.CGColor;
        CGContextSetStrokeColorWithColor(ctx, cgColor);
        CGContextSetFillColorWithColor(ctx, cgColor);
    }
}

static inline CGPathDrawingMode DrawingMode(int style) {
    switch (style) {
        case 1:
            return kCGPathStroke;
        case 2:
            return kCGPathFillStroke;
        default:
            return kCGPathFill;
    }
}

@implementation CanvasNative

+ (void)drawRect:(CGContextRef)ctx left:(CGFloat)left top:(CGFloat)top right:(CGFloat)right bottom:(CGFloat)bottom color:(UIColor *)color alpha:(CGFloat)alpha style:(int)style strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias {
    ApplyPaint(ctx, color, alpha, strokeWidth, cap, join, antiAlias);
    CGContextBeginPath(ctx);
    CGContextAddRect(ctx, CGRectMake(left, top, right - left, bottom - top));
    CGContextDrawPath(ctx, DrawingMode(style));
    CGContextRestoreGState(ctx);
}

+ (void)drawLine:(CGContextRef)ctx startX:(CGFloat)startX startY:(CGFloat)startY stopX:(CGFloat)stopX stopY:(CGFloat)stopY color:(UIColor *)color alpha:(CGFloat)alpha strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias {
    ApplyPaint(ctx, color, alpha, strokeWidth, cap, join, antiAlias);
    CGContextBeginPath(ctx);
    CGContextMoveToPoint(ctx, startX, startY);
    CGContextAddLineToPoint(ctx, stopX, stopY);
    CGContextDrawPath(ctx, kCGPathStroke);
    CGContextRestoreGState(ctx);
}

+ (void)drawCircle:(CGContextRef)ctx cx:(CGFloat)cx cy:(CGFloat)cy radius:(CGFloat)radius color:(UIColor *)color alpha:(CGFloat)alpha style:(int)style strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias {
    ApplyPaint(ctx, color, alpha, strokeWidth, cap, join, antiAlias);
    CGContextBeginPath(ctx);
    CGContextAddEllipseInRect(ctx, CGRectMake(cx - radius, cy - radius, radius * 2, radius * 2));
    CGContextDrawPath(ctx, DrawingMode(style));
    CGContextRestoreGState(ctx);
}

@end
