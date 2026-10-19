#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreGraphics/CoreGraphics.h>

/**
 * Whole draw calls in one crossing from JS: the paint setup (alpha, antialiasing, line width, cap, join, colors),
 * the path and the draw, between a save and a restore of the graphics state.
 * Same CoreGraphics calls as Canvas.startApplyPaint + Canvas._drawPath for a paint without shader,
 * path effect, shadow, blend mode or dash, which JS keeps drawing itself.
 * style: 0 fill, 1 stroke, 2 fill and stroke.
 */
@interface CanvasNative : NSObject

+ (void)drawRect:(CGContextRef)ctx left:(CGFloat)left top:(CGFloat)top right:(CGFloat)right bottom:(CGFloat)bottom color:(UIColor *)color alpha:(CGFloat)alpha style:(int)style strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias;
+ (void)drawLine:(CGContextRef)ctx startX:(CGFloat)startX startY:(CGFloat)startY stopX:(CGFloat)stopX stopY:(CGFloat)stopY color:(UIColor *)color alpha:(CGFloat)alpha strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias;
+ (void)drawCircle:(CGContextRef)ctx cx:(CGFloat)cx cy:(CGFloat)cy radius:(CGFloat)radius color:(UIColor *)color alpha:(CGFloat)alpha style:(int)style strokeWidth:(CGFloat)strokeWidth cap:(int)cap join:(int)join antiAlias:(BOOL)antiAlias;

@end
