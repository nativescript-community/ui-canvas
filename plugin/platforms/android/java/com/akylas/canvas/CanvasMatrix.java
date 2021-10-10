package com.akylas.canvas;

import androidx.annotation.NonNull;
import androidx.annotation.Size;

public class CanvasMatrix extends android.graphics.Matrix {
    public void mapPointsBuffer (java.nio.FloatBuffer pts) {
        float[] ptsArray = new float[pts.capacity()];
        pts.get(ptsArray);
        mapPoints(ptsArray);
        pts.rewind();
        pts.put(ptsArray);
        pts.rewind();
    }
    public void mapPointsBuffer (java.nio.FloatBuffer dst, java.nio.FloatBuffer src) {
        float[] dstArray = new float[dst.capacity()];
        dst.get(dstArray);
        float[] srcArray = new float[src.capacity()];
        src.get(srcArray);
        mapPoints(dstArray, srcArray);
        dst.rewind();
        dst.put(dstArray);
        dst.rewind();
        src.rewind();
        src.put(srcArray);
        src.rewind();
    }
    public void mapPointsBuffer (java.nio.FloatBuffer dst, int dstIndex, java.nio.FloatBuffer src, int srcIndex, int pointCount) {
        float[] dstArray = new float[dst.capacity()];
        dst.get(dstArray);
        float[] srcArray = new float[src.capacity()];
        src.get(srcArray);
        mapPoints(dstArray, dstIndex, srcArray, srcIndex, pointCount);
        dst.rewind();
        dst.put(dstArray);
        dst.rewind();
        src.rewind();
        src.put(srcArray);
        src.rewind();
    }
    public void setValues (java.nio.FloatBuffer points) {
        float[] pointsArray = new float[points.capacity()];
        points.get(pointsArray);
        setValues(pointsArray);
        points.rewind();
    }
}