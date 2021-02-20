package com.akylas.canvas;

import android.os.Build;
import android.graphics.Typeface;
import android.graphics.Paint;
import android.text.TextPaint;
import android.text.Layout;
import java.lang.CharSequence;

public class StaticLayout {

    public static android.text.StaticLayout createStaticLayout(CharSequence source, TextPaint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad) {

        if (Build.VERSION.SDK_INT >= 24) {
            android.text.StaticLayout.Builder builder = android.text.StaticLayout.Builder
                    .obtain(source, 0, source.length(), paint, width)
                    .setBreakStrategy(android.text.Layout.BREAK_STRATEGY_SIMPLE).setAlignment(align)
                    .setLineSpacing(spacingadd, spacingmult).setIncludePad(includepad);
            if (Build.VERSION.SDK_INT >= 26) {
                builder = builder.setJustificationMode(android.text.Layout.JUSTIFICATION_MODE_NONE);
            }
            return builder.build();
        } else {
            return new android.text.StaticLayout(source, paint, width, align, spacingmult, spacingadd, includepad);
        }
    }

    public static android.text.StaticLayout createStaticLayout(CharSequence source, Paint paint, int width,
            Layout.Alignment align, float spacingmult, float spacingadd, boolean includepad) {
        return createStaticLayout(source, new TextPaint(paint), width, align, spacingmult, spacingadd, includepad);
    }
}
