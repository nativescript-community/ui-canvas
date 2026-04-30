
#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, TileMode) {
    TileModeRepeat = 0,
    TileModeMirror = 1,
    TileModeClamp = 2
};

@interface UIDrawingShader : NSObject
+ (void)applyBitmapShader:(CGContextRef)ctx
                    image:(UIImage *)image
                 tileMode:(TileMode)tileMode
               localMatrix:(CGAffineTransform)localMatrix;
@end;
