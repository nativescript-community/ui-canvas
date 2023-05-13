import { Color, getTransformedText } from '@nativescript/core';
import { Font } from '@nativescript/core/ui/styling/font';
import { computeBaseLineOffset, createNativeAttributedString, createSpannable } from '@nativescript-community/text';
import { CanvasLabel as CanvasLabelBase, Group as GroupBase, Span as SpanBase } from './canvaslabel.common';

// export function createSpannable(span: Span, parentCanvas: CanvasLabelBase, parent?: Group, maxFontSize?): NSMutableAttributedString {
//     let text = span.text;
//     if (!text || span.visibility !== 'visible') {
//         return null;
//     }
//     const attrDict = {} as { key: string; value: any };
//     const fontFamily = span.fontFamily;
//     const fontSize = span.fontSize;
//     const realMaxFontSize = Math.max(maxFontSize, parentCanvas.fontSize || 0);
//     const fontweight = span.fontWeight;
//     const fontstyle = span.fontStyle;
//     const textcolor = span.color;
//     const backgroundcolor = span.backgroundColor || (parent && parent.backgroundColor);
//     const textDecorations = span.textDecoration || (parent && parent.textDecoration);
//     const letterSpacing = span.letterSpacing || (parent && parent.letterSpacing);
//     const lineHeight = span.lineHeight || (parent && parent.lineHeight);
//     const textAlignment = span.textAlignment || (parent && parent.textAlignment);
//     const verticaltextalignment = span.verticalTextAlignment;
//     let iosFont: UIFont;
//     if (fontweight || fontstyle || fontFamily || fontSize) {
//         const font = new Font(
//             fontFamily || (parent && parent.fontFamily) || (parentCanvas && parentCanvas.fontFamily),
//             fontSize || (parent && parent.fontSize) || (parentCanvas && parentCanvas.fontSize),
//             fontstyle || (parent && parent.fontStyle) || ((parentCanvas && parentCanvas.fontStyle) as any),
//             fontweight || (parent && parent.fontWeight) || ((parentCanvas && parentCanvas.fontWeight) as any)
//         );
//         iosFont = font.getUIFont(UIFont.systemFontOfSize(fontSize));
//         attrDict[NSFontAttributeName] = iosFont;
//     }
//     if (verticaltextalignment && verticaltextalignment !== 'initial' && iosFont) {
//         const ascent = CTFontGetAscent(iosFont);
//         const descent = CTFontGetDescent(iosFont);
//         attrDict[NSBaselineOffsetAttributeName] = -computeBaseLineOffset(verticaltextalignment, -ascent, descent, -iosFont.descender, -iosFont.ascender, fontSize, realMaxFontSize);
//     }
//     // if (span.mTappable) {
//     //     attrDict[NSLinkAttributeName] = text;
//     // }
//     if (textcolor) {
//         const color = textcolor instanceof Color ? textcolor : new Color(textcolor as any);
//         attrDict[NSForegroundColorAttributeName] = color.ios;
//     }

//     if (backgroundcolor) {
//         const color = backgroundcolor instanceof Color ? backgroundcolor : new Color(backgroundcolor as any);
//         attrDict[NSBackgroundColorAttributeName] = color.ios;
//     }
//     if (letterSpacing) {
//         attrDict[NSKernAttributeName] = letterSpacing * iosFont.pointSize;
//     }

//     let paragraphStyle;
//     if (lineHeight !== undefined) {
//         paragraphStyle = NSMutableParagraphStyle.alloc().init();
//         switch (textAlignment) {
//             case 'middle':
//             case 'center':
//                 paragraphStyle.alignment = NSTextAlignment.Center;
//                 break;
//             case 'right':
//                 paragraphStyle.alignment = NSTextAlignment.Right;
//                 break;
//             default:
//                 paragraphStyle.alignment = NSTextAlignment.Left;
//                 break;
//         }
//         paragraphStyle.minimumLineHeight = lineHeight;
//         paragraphStyle.maximumLineHeight = lineHeight;
//     }
//     if (paragraphStyle) {
//         attrDict[NSParagraphStyleAttributeName] = paragraphStyle;
//     }

//     if (textDecorations) {
//         const underline = textDecorations.indexOf('underline') !== -1;
//         if (underline) {
//             attrDict[NSUnderlineStyleAttributeName] = underline;
//         }

//         const strikethrough = textDecorations.indexOf('line-through') !== -1;
//         if (strikethrough) {
//             attrDict[NSStrikethroughStyleAttributeName] = strikethrough;
//         }
//     }

//     if (!(text instanceof NSAttributedString)) {
//         if (!(typeof text === 'string')) {
//             text = text.toString();
//         }
//         if (text.indexOf('\n') !== -1) {
//             text = text.replace(/\\n/g, '\u{2029}');
//         }
//         const textTransform = span.textTransform || (parent && parent.textTransform);
//         if (textTransform) {
//             text = getTransformedText(text, textTransform);
//         }
//         return NSMutableAttributedString.alloc().initWithStringAttributes(text, attrDict as any);
//     } else {
//         const result = NSMutableAttributedString.alloc().initWithAttributedString(text);
//         result.setAttributesRange(attrDict as any, { location: 0, length: text.length });
//         return result;
//     }
// }

export class Span extends SpanBase {
    createNative(parentCanvas: CanvasLabelBase, parent?: Group, maxFontSize?: number) {
        this.mNative = createSpannable(this, parentCanvas, parent, maxFontSize);
    }
}
export class Group extends GroupBase {
    createNative(parentCanvas: CanvasLabelBase, parentGroup?: Group, maxFontSize?: number) {
        // const ssb = NSMutableAttributedString.new();

        // if (maxFontSize === undefined) {
        //     // top group let s get max font Size
        //     maxFontSize = this.getMaxFontSize();
        // }
        // this.mSpans &&
        //     this.mSpans.forEach((s) => {
        //         // s._startIndexInGroup = ssb.length;
        //         // s._endIndexInGroup = s.text ? s.text.length : 0;
        //         const native = s.getOrCreateNative(parentCanvas, this, maxFontSize);
        //         if (native) {
        //             ssb.appendAttributedString(native);
        //         }
        //     });
        this.mNative = createNativeAttributedString(this as any, this, parentCanvas, false);
        // this.mNative = ssb;
    }
    onChildChange(span: Span) {
        this.mNative = null;
        this.mStaticlayout = null;
        super.onChildChange(span);
        // console.log('Group onChildChange', span.text, !!this._native, span._startIndexInGroup, span._endIndexInGroup, span.getOrCreateNative(this));
        // if (this._native) {
        //     (this._native as NSMutableAttributedString).replaceCharactersInRangeWithAttributedString({location:span._startIndexInGroup, length:span._endIndexInGroup}, span.getOrCreateNative(this) );
        // }
        // span._endIndexInGroup = span.text ? span.text.length : 0;
    }
}

export class CanvasLabel extends CanvasLabelBase {}
