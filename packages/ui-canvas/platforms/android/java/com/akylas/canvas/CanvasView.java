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

    public static float getFontSizeFactor(Context context, float textSize) {
        return android.util.TypedValue.applyDimension(
            android.util.TypedValue.COMPLEX_UNIT_SP, textSize, context.getResources().getDisplayMetrics());
    }
}