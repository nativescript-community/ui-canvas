package com.akylas.canvas;

import android.content.Context;
import android.view.View;


public class CanvasView extends View {

    public CanvasView (Context context) {
       super(context);
   }
    public void __sizeChangedImpl(int w, int h, int oldw, int oldh) {

    }
    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        __sizeChangedImpl( w, h, oldw, oldh);
    }
}