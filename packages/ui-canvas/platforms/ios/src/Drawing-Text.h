/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>

#import "Drawing-Text.h"

// Sizing
NSArray *WidthArrayForStringWithFont(NSString *string, UIFont *font);

// Drawing
void DrawStringAtPos(NSString *string, CGFloat x, CGFloat y, UIFont *font, UIColor *color);
void DrawAttributedStringAtPos(NSAttributedString *string, CGFloat x, CGFloat y, UIFont *font, UIColor *color);
void DrawStringAtPosWithAttrs(NSString *string, CGFloat x, CGFloat y, NSDictionary* attributes);
void DrawAttributedStringAtPosWithAttrs(NSAttributedString *string, CGFloat x, CGFloat y, NSDictionary* attributes);
void DrawAttributedStringInRectWithAttrs(NSAttributedString *string, CGRect rect, NSDictionary* attributes);
void DrawStringInRect(NSString *string, CGRect rect, UIFont *font, NSTextAlignment alignment, UIColor *color);
void DrawAttributedStringInRect(NSAttributedString *string, CGRect rect, UIFont *font, NSTextAlignment alignment, UIColor *color);
void DrawWrappedStringInRect(NSString *string, CGRect rect, NSString *fontFace, NSTextAlignment alignment, UIColor *color);
void DrawUnwrappedStringInRect(NSString *string, CGRect rect, NSString *fontFace, NSTextAlignment alignment, UIColor *color);
void DrawStringCenteredInRect(NSString *string, UIFont *font, CGRect rect);

UIFont *FontForWrappedString(NSString *string, NSString *fontFace, CGRect rect, CGFloat tolerance);


@interface UIDrawingText  : NSObject

+ (void) drawString: (NSString *)string x:(CGFloat)x y:(CGFloat)y font:(UIFont*)font color:(UIColor*)color;
+ (void) drawAttributedString: (NSAttributedString *)string x:(CGFloat)x y:(CGFloat)y font:(UIFont*)font color:(UIColor*)color;
+ (void) drawAttributedStringInRect: (NSAttributedString *)string x:(CGFloat)x y:(CGFloat)y width:(CGFloat)width height:(CGFloat)height font:(UIFont*)font alignment:(NSTextAlignment)alignment  color:(UIColor*)color;
+ (void) drawString: (NSString *)string x:(CGFloat)x y:(CGFloat)y withAttributes:(NSDictionary*)attributes;
+ (void) drawAttributedString: (NSAttributedString *)string x:(CGFloat)x y:(CGFloat)y withAttributes:(NSDictionary*)attributes;
+ (void) drawAttributedString: (NSAttributedString *)string x:(CGFloat)x y:(CGFloat)y width:(CGFloat)width height:(CGFloat)height withAttributes:(NSDictionary*)attributes;
+ (CGRect)getTextBounds:(NSString*)text from:(NSUInteger)from to:(NSUInteger)to attributes:(NSDictionary*)attributes;
+ (CGFloat)measureText:(NSString*)text from:(NSUInteger)from to:(NSUInteger)to attributes:(NSDictionary*)attributes;
@end
