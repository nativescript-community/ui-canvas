package com.akylas.canvas;

import android.os.Build;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.text.Layout;
import android.text.SpannableString;
import android.text.SpannableStringBuilder;
import android.text.TextPaint;
import android.text.TextUtils;
import java.lang.CharSequence;

public class StaticLayout {

    public static android.text.StaticLayout.Builder createStaticLayoutBuilder(CharSequence source, TextPaint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth) {
        android.text.StaticLayout.Builder builder = android.text.StaticLayout.Builder
                .obtain(source, 0, source.length(), paint, width)
                .setBreakStrategy(android.text.Layout.BREAK_STRATEGY_SIMPLE)
                .setAlignment(align)
                .setLineSpacing(spacingadd, spacingmult)
                .setIncludePad(includepad)
                .setEllipsizedWidth(ellipsizedWidth)
                .setEllipsize(ellipsize);
        if (Build.VERSION.SDK_INT >= 26) {
            builder = builder.setJustificationMode(android.text.Layout.JUSTIFICATION_MODE_NONE);
        }
        return builder;
    }

    public static android.text.StaticLayout createStaticLayout(CharSequence source, TextPaint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth, int height) {
        android.text.StaticLayout staticLayout = null;
        if (Build.VERSION.SDK_INT >= 23) {
            staticLayout = createStaticLayoutBuilder(source, paint, width, align, spacingmult, spacingadd, includepad, ellipsize, ellipsizedWidth).build();
        } else {
            staticLayout = new android.text.StaticLayout(source, 0, source.length(), paint, width, align, spacingmult, spacingadd, includepad, ellipsize, ellipsizedWidth);
        }
        return createEllipsizeStaticLayout(staticLayout, includepad, ellipsize, ellipsizedWidth, height);
    }
    public static android.text.StaticLayout createStaticLayout(CharSequence source, TextPaint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth) {
        return createStaticLayout(source, paint, width, align, spacingmult, spacingadd, includepad,ellipsize, ellipsizedWidth, -1);
    }
    
    public static android.text.StaticLayout createStaticLayout(CharSequence source, Paint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth, int height) {
        return createStaticLayout(source, new TextPaint(paint), width, align, spacingmult, spacingadd, includepad,ellipsize, ellipsizedWidth, height);
    }
    public static android.text.StaticLayout createStaticLayout(CharSequence source, Paint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth) {
        return createStaticLayout(source, paint, width, align, spacingmult, spacingadd, includepad,ellipsize, ellipsizedWidth, -1);
    }

    public static android.text.StaticLayout createEllipsizeStaticLayout(android.text.StaticLayout staticLayout, boolean includepad, TextUtils.TruncateAt ellipsize, int ellipsizedWidth, int maxHeight) {
        if (maxHeight != -1 && ellipsize != null) {
            
            // Calculate the number of lines that fit within the available height
            int lineCount = staticLayout.getLineCount();
            int maxLines = lineCount;

            int i = 0;
            float lineHeight = staticLayout.getLineBottom(i) - staticLayout.getLineTop(i);
            float totalHeight = lineHeight * lineCount;
            if (maxLines > 1) {
                while (totalHeight > maxHeight && maxLines > 0) {
                    maxLines--;
                    i++;
                    lineHeight = staticLayout.getLineBottom(i) - staticLayout.getLineTop(i);
                    totalHeight = lineHeight * maxLines;
                }
            }
            // Check if truncation is needed
            if (maxLines < lineCount) {
                if (Build.VERSION.SDK_INT >= 23 && ellipsize == TextUtils.TruncateAt.END) {
                    android.text.StaticLayout.Builder builder = createStaticLayoutBuilder(staticLayout.getText(), 
                        staticLayout.getPaint(), 
                        staticLayout.getWidth(), 
                        staticLayout.getAlignment(), 
                        staticLayout.getSpacingMultiplier(), 
                        staticLayout.getSpacingAdd(), 
                        includepad,
                        ellipsize,
                        ellipsizedWidth);
                    builder.setMaxLines(maxLines);
                    return builder.build();
                } else {
                    int truncationIndex = staticLayout.getLineEnd(maxLines - 1);

                    // Truncate the text by replacing the characters after the truncation index with ellipsis
                    SpannableStringBuilder truncatedText = null;
                    if (ellipsize == TextUtils.TruncateAt.END || ellipsize == TextUtils.TruncateAt.MARQUEE) {
                        truncatedText = new SpannableStringBuilder(staticLayout.getText().subSequence(0, truncationIndex));
                        truncatedText.append("…");

                    } else if (ellipsize == TextUtils.TruncateAt.START) {
                        truncatedText = new SpannableStringBuilder("…");
                        truncatedText.append(staticLayout.getText().subSequence(0, truncationIndex));

                    } else {
                        int split = truncationIndex/2;
                        truncatedText = new SpannableStringBuilder(staticLayout.getText().subSequence(0, split));
                        truncatedText.append("…");
                        truncatedText.append(staticLayout.getText().subSequence(split, truncationIndex));
                    }

                    // Re-create the StaticLayout with the truncated text
                    return createStaticLayout(new SpannableString(truncatedText), staticLayout.getPaint(), 
                        staticLayout.getWidth(), 
                        staticLayout.getAlignment(), 
                        staticLayout.getSpacingMultiplier(), 
                        staticLayout.getSpacingAdd(), 
                        includepad,
                        ellipsize,
                        ellipsizedWidth);

                }
            }
        }
        return staticLayout;
    }
}
