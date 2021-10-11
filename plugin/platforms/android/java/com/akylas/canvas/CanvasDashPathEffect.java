package com.akylas.canvas;

public class CanvasDashPathEffect extends android.graphics.DashPathEffect {
    public CanvasDashPathEffect(float[] intervals, float phase) {
        super(intervals, phase);
    }

    // public CanvasDashPathEffect(java.nio.FloatBuffer intervals, float phase) {
    //     float[] intervalsArray = new float[intervals.capacity()];
    //     intervals.get(intervalsArray);
    //     super(intervalsArray, phase);
    //     intervals.rewind();
    // }

}