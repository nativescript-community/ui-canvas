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

       moveTo(points[0], points[1]);
       for (int i = 2; i < l; i+=2) {
           lineTo(points[i], points[i + 1]);
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
       for (int i = 2; i < l; i+=6) {
           cubicTo(points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
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