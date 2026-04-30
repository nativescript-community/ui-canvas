
#import "Drawing-Shader.h"
#import "Utility.h"

static void DrawBitmapPattern(void *info, CGContextRef ctx)
{
    CGImageRef img = (CGImageRef)info;

    CGContextDrawImage(
        ctx,
        CGRectMake(0, 0,
                   CGImageGetWidth(img),
                   CGImageGetHeight(img)),
        img
    );
}

@implementation UIDrawingShader

+ (void)applyBitmapShader:(CGContextRef)ctx
                    image:(UIImage *)image
                 tileMode:(TileMode)tileMode
               localMatrix:(CGAffineTransform)localMatrix
{
    if (!image) return;

    CGImageRef cgImage = image.CGImage;
    if (!cgImage) return;

    CGContextSaveGState(ctx);

    CGFloat w = CGImageGetWidth(cgImage);
    CGFloat h = CGImageGetHeight(cgImage);

    CGPatternCallbacks callbacks = {0, DrawBitmapPattern, NULL};

    CGAffineTransform patternMatrix = localMatrix;

    CGPatternTiling tiling =
        (tileMode == TileModeClamp)
        ? kCGPatternTilingNoDistortion
        : kCGPatternTilingConstantSpacing;

    CGPatternRef pattern = CGPatternCreate(
        cgImage,
        CGRectMake(0, 0, w, h),
        patternMatrix,
        w,
        h,
        tiling,
        true,
        &callbacks
    );

    CGColorSpaceRef cs = CGColorSpaceCreatePattern(NULL);
    CGContextSetFillColorSpace(ctx, cs);

    CGFloat alpha = 1.0;
    CGContextSetFillPattern(ctx, pattern, &alpha);

    // CGContextFillPath(ctx);
    CGRect bounds = CGContextGetClipBoundingBox(ctx);
    CGContextFillRect(ctx, bounds);

    CGPatternRelease(pattern);
    CGColorSpaceRelease(cs);

    CGContextRestoreGState(ctx);
}
@end
