package com.akylas.canvas

import android.graphics.Matrix

open class Matrix: android.graphics.Matrix {

    constructor() : super()
    constructor(src: Matrix) : super(src)

}