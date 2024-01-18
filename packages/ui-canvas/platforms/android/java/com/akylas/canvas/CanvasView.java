package com.akylas.canvas;

import android.content.Context;
import android.view.View;
import android.graphics.Canvas;

public class CanvasView extends org.nativescript.widgets.GridLayout {
    public SizeChangedListener sizeChangedListener = null;
    public DrawListener drawListener = null;

    public CanvasView(Context context) {
        super(context);
        setWillNotDraw(false);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (sizeChangedListener != null) {
            sizeChangedListener.onSizeChanged(w, h, oldw, oldh);
        }
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        super.dispatchDraw(canvas);
        if (drawListener != null) {
            drawListener.onDraw(canvas);
        }
    }

    private static float FONT_SIZE_FACTOR = -1;
    public static float getFontSizeFactor(Context context) {
        if (FONT_SIZE_FACTOR == -1) {
            FONT_SIZE_FACTOR = android.util.TypedValue.applyDimension(
            android.util.TypedValue.COMPLEX_UNIT_SP, 1, context.getResources().getDisplayMetrics());
        }
        return FONT_SIZE_FACTOR;
    }
}