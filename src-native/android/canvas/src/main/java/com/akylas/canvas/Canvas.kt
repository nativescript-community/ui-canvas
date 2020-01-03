package com.akylas.canvas

import android.graphics.Bitmap

open class Canvas : android.graphics.Canvas {
    constructor() : super()
    constructor(bitmap: Bitmap) : super(bitmap)

}