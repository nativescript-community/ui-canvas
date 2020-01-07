package com.akylas.canvas;

import android.content.Context;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.Size;

import android.util.Log;

public class CanvasPath extends android.graphics.Path {

    public CanvasPath () {
       super();
   }
    public CanvasPath (android.graphics.Path path) {
       super(path);
   }

   public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points) {
       addLines(points, points.length, false);
   }
   public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int length) {
       addLines(points, length, false);
   }
   public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int length, boolean close) {
       final int l = length / 2;

       Log.d("CanvasPath", "addLines " + l + " " + points[0] + " " + points[1]);
       moveTo(points[0], points[1]);
       for (int i = 1; i < l; i++) {
           lineTo(points[2 * i], points[2 * i + 1]);
       }
       if (close) {
           close();
       }
   }
   public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points) {
       setLines(points, points.length, false);
   }
   public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int length) {
       setLines(points, length, false);
   }
   public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int length, boolean close) {
       reset();
       addLines(points, length, close);
   }

   public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
       addCubicLines(points, points.length, false);
   }

   public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int length) {
       addCubicLines(points, length, false);
   }

   public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int length, boolean close) {
       final int l = (length - 2) / 6;
       moveTo(points[0], points[1]);
       Log.d("CanvasPath", "addCubicLines " + length + " " + points[0] + " " + points[1]);
       for (int i = 0; i < l; i++) {
           cubicTo(points[2 + 6 * i], points[2 + 6 * i + 1], points[2 + 6 * i + 2], points[2 + 6 * i + 3], points[2 + 6 * i + 4], points[2 + 6 * i + 5]);
       }
       if (close) {
           close();
       }
   }
   public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
       setCubicLines(points, points.length, false);
   }
   public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int length) {
       setCubicLines(points, length, false);
   }
   public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int length, boolean close) {
       reset();
       addCubicLines(points, length, close);
   }
    
}