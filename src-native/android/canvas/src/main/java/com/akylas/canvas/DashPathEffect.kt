package com.akylas.canvas

open class DashPathEffect: android.graphics.DashPathEffect {
    constructor(intervals: FloatArray, phase: Float): super(intervals, phase)
}