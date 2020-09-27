package com.akylas.canvas;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.Size;

import android.util.Log;

public class CanvasPath extends android.graphics.Path {

    public CanvasPath() {
        super();
    }

    public CanvasPath(android.graphics.Path path) {
        super(path);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points) {
        addLines(points, 0, points.length, false);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset) {
        addLines(points, offset, points.length - offset, false);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length) {
        addLines(points, offset, length, false);
    }

    public void addPath(CanvasPath path) {
        super.addPath(path);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length, boolean close) {
        final int l = offset + length;

        moveTo(points[offset], points[offset + 1]);
        for (int i = offset + 2; i < l; i += 2) {
            lineTo(points[i], points[i + 1]);
        }
        if (close) {
            close();
        }
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points) {
        setLines(points, 0, points.length, false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset) {
        setLines(points, offset, points.length - offset, false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length) {
        setLines(points, offset, length, false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length, boolean close) {
        reset();
        addLines(points, offset, length, close);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
        addCubicLines(points, 0, points.length, false);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset) {
        addCubicLines(points, offset, points.length - offset, false);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length) {
        addCubicLines(points, offset, length, false);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length,
            boolean close) {
        final int l = length;
        moveTo(points[offset], points[offset + 1]);
        for (int i = offset + 2; i < l; i += 6) {
            cubicTo(points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]);
        }
        if (close) {
            close();
        }
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
        setCubicLines(points, 0, points.length, false);
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length) {
        setCubicLines(points, offset, length, false);
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length,
            boolean close) {
        reset();
        addCubicLines(points, offset, length, close);
    }
}