/*
 Erica Sadun, http://ericasadun.com
 iPhone Developer's Cookbook, 6.x Edition
 BSD License, Use at your own risk
 */

#import "UIBezierPath+Text.h"
#import "Utility.h"

@implementation UIBezierPath (TextUtilities)
+ (UIBezierPath*) fromString: (NSString *) string withFont:(UIFont *) font {
  return BezierPathFromString(string, font);
}
- (void) drawAttributedString: (NSAttributedString *) string
{
    if (!string) return;
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    if (self.elements.count < 2) return;
    
    // Keep a running tab of how far the glyphs have traveled to
    // be able to calculate the percent along the point path
    float glyphDistance = 0.0f;
    float lineLength = self.pathLength;

    for (int loc = 0; loc < string.length; loc++)
    {
        // Retrieve item
        NSRange range = NSMakeRange(loc, 1);
        NSAttributedString *item = [string attributedSubstringFromRange:range];
        // NSDictionary* attributes = [string attribute:NSFontAttributeName atIndex:loc range: NULL];
         UIFont *font = [string attribute:NSFontAttributeName atIndex:loc effectiveRange: NULL];
        
        // Start halfway through each glyph
        CGRect bounding = [item boundingRectWithSize:CGSizeMake(CGFLOAT_MAX, CGFLOAT_MAX) options:0 context:nil];
        glyphDistance += bounding.size.width / 2;

        // Find point
        CGPoint slope;
        CGFloat percentConsumed = glyphDistance / lineLength;
        CGPoint targetPoint = [self pointAtPercent:percentConsumed withSlope:&slope];
        
        // Accommodate the forward progress
        glyphDistance += bounding.size.width / 2;         
        if (percentConsumed >= 1.0f) break;

        // Calculate the rotation
        float angle = atan(slope.y / slope.x); //  + M_PI;
        if (slope.x < 0) angle += M_PI; // going left, update the angle
        // Draw the glyph
        PushDraw(^{
            CGContextTranslateCTM(context, targetPoint.x, targetPoint.y);
            CGContextRotateCTM(context, angle);
            CGContextTranslateCTM(context, -bounding.size.width / 2, -(font != nil ? font.ascender : item.size.height / 2));
            [item drawAtPoint:CGPointZero];
        });
    }
}
//- (void) drawString: (NSString *) string
//{
//  if (!string) return;
//  CGContextRef context = UIGraphicsGetCurrentContext();
//  if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
//  if (self.elements.count < 2) return;
//  
//  // Keep a running tab of how far the glyphs have traveled to
//  // be able to calculate the percent along the point path
//  float glyphDistance = 0.0f;
//  float lineLength = self.pathLength;
//  
//  for (int loc = 0; loc < string.length; loc++)
//  {
//    // Retrieve item
//    NSRange range = NSMakeRange(loc, 1);
//    NSString *item = [string substringWithRange:range];
//    
//    // Start halfway through each glyph
//    CGRect bounding = [item boundingRectWithSize:CGSizeMake(CGFLOAT_MAX, CGFLOAT_MAX) options:0 context:nil];
//    glyphDistance += bounding.size.width / 2;
//    
//    // Find point
//    CGPoint slope;
//    CGFloat percentConsumed = glyphDistance / lineLength;
//    CGPoint targetPoint = [self pointAtPercent:percentConsumed withSlope:&slope];
//    
//    // Accommodate the forward progress
//    glyphDistance += bounding.size.width / 2;
//    if (percentConsumed >= 1.0f) break;
//    
//    // Calculate the rotation
//    float angle = atan(slope.y / slope.x); //  + M_PI;
//    if (slope.x < 0) angle += M_PI; // going left, update the angle
//    
//    // Draw the glyph
//    PushDraw(^{
//      CGContextTranslateCTM(context, targetPoint.x, targetPoint.y);
//      CGContextRotateCTM(context, angle);
//      CGContextTranslateCTM(context, -bounding.size.width / 2, -item.size.height / 2);
//      [item drawAtPoint:CGPointZero];
//    });
//  }
//}
@end
