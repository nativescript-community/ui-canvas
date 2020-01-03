package com.akylas.canvas

import android.graphics.Bitmap
import android.R.attr.bitmap
import android.content.Context
import android.graphics.Paint
import android.util.Log
import android.view.View


open class CanvasView(context: Context?) : View(context) {
//    public var bitmap: Bitmap? = null
//    public var paint: Paint = Paint()

    public open fun __sizeChangedImpl(w: Int, h: Int, oldw: Int, oldh: Int) {

    }

    protected override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
//        bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        this.__sizeChangedImpl( w, h, oldw, oldh)
    }
}