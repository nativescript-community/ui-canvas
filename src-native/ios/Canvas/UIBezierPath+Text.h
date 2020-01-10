/*
 Erica Sadun, http://ericasadun.com
 iPhone Developer's Cookbook, 6.x Edition
 BSD License, Use at your own risk
 */

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>

#import "UIBezierPath+Elements.h"
@interface UIBezierPath (TextUtilities)
+ (UIBezierPath*) fromString: (NSString *) string withFont:(UIFont *) font;
- (void) drawAttributedString: (NSAttributedString *) string;
@end
