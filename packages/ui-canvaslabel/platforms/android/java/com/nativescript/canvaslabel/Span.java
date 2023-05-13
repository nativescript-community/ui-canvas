package com.nativescript.canvaslabel;

import android.graphics.Color;
import android.text.SpannableStringBuilder;
import java.lang.CharSequence;
import android.text.TextUtils;
// import com.nativescript.text.CustomTypefaceSpan;
// import com.nativescript.text.Font;

public class Span {
    public static SpannableStringBuilder createSpannableStringBuilder(CharSequence text) {
        return new SpannableStringBuilder(text);
    }

    public static SpannableStringBuilder createSpannableStringBuilder() {
        return new SpannableStringBuilder();
    }

    // static boolean isBold(String fontWeight) {
    //     return fontWeight != null && (fontWeight.equals("bold") || fontWeight.equals("700") || fontWeight.equals("800")
    //             || fontWeight.equals("900"));
    // }

    // public static void createSpannable(CharSequence text, float fontSize, String fontFamily, String fontWeight,
    //         String fontStyle, Color color, String textDecoration, Color backgroundcolor, String verticalTextAlignment,
    //         float letterSpacing, float lineHeight, float maxFontSize) {
    //                 if (TextUtils.indexOf(text, "\n") != -1) {
    //                     TextUtils.replace(text,  new String[] {"\n"},
    //                     new CharSequence[] {java.lang.System.getProperty("line.separator")});
    //                 }
    //             int length = text.length();
            
    //             SpannableStringBuilder ssb = createSpannableStringBuilder();
    //             boolean bold = isBold(fontWeight);
    //             boolean italic = fontStyle != null && fontStyle.equals("italic");
    //             // if (getSDK() < 28) {
    //             if (bold && italic) {
    //                 ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             } else if (bold) {
    //                 ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             } else if (italic) {
    //                 ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
    //             // }
    //             if (fontFamily != null || (fontWeight != "normal" && !bold)) {
    //                 // const fontCacheKey = fontFamily + fontweight + fontstyle;
            
    //                 // let typeface = typefaceCache[fontCacheKey];
    //                 // console.log();
    //                 // if (!typeface) {
    //                 //     let paint: Paint = fontPaintCache[fontCacheKey];
    //                 //     if (!paint) {
    //                 //         paint = span.paint;
    //                 //         paint.setFontFamily(fontFamily);
    //                 //         paint.setFontWeight(fontweight);
    //                 //         paint.setFontStyle(fontstyle);
    //                 //         fontPaintCache[fontCacheKey] = paint;
    //                 //     }
    //                 //     typeface = typefaceCache[fontCacheKey] = paint.getFont().getAndroidTypeface();
    //                 // }
    //                 CustomTypefaceSpan typefaceSpan = new CustomTypefaceSpan(fontFamily, span.paint.getFont().getAndroidTypeface());
    //                 ssb.setSpan(typefaceSpan, 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
    //             if (verticalTextAlignment && verticalTextAlignment !== "initial") {
    //                 ssb.setSpan(new com.nativescript.text.BaselineAdjustedSpan(fontSize as any, verticalTextAlignment, realMaxFontSize as any), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
    //             if (fontSize) {
    //                 ssb.setSpan(new android.text.style.AbsoluteSizeSpan(fontSize), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
            
    //             if (letterSpacing) {
    //                 ssb.setSpan(new android.text.style.ScaleXSpan((letterSpacing + 1) / 10), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
            
    //             if (lineHeight !== undefined) {
    //                 ssb.setSpan(new com.nativescript.text.HeightSpan(lineHeight), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
            
    //             if (color) {
    //                 const ncolor = color instanceof Color ? color : new Color(color);
    //                 ssb.setSpan(new android.text.style.ForegroundColorSpan(ncolor.android), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
    //             if (backgroundcolor) {
    //                 const color = backgroundcolor instanceof Color ? backgroundcolor : new Color(backgroundcolor as any);
    //                 ssb.setSpan(new android.text.style.BackgroundColorSpan(color.android), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //             }
            
    //             if (textDecorations) {
    //                 const underline = textDecorations.indexOf("underline") !== -1;
    //                 if (underline) {
    //                     ssb.setSpan(new android.text.style.UnderlineSpan(), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //                 }
            
    //                 const strikethrough = textDecorations.indexOf("line-through") !== -1;
    //                 if (strikethrough) {
    //                     ssb.setSpan(new android.text.style.StrikethroughSpan(), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    //                 }
    //             }
    // }
}