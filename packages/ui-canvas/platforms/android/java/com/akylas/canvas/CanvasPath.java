package com.akylas.canvas;

import androidx.annotation.NonNull;
import androidx.annotation.Size;

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
    public void addLinesBuffer(@NonNull java.nio.FloatBuffer points) {
        addLinesBuffer(points, 0, points.capacity(), false);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset) {
        addLines(points, offset, points.length - offset, false);
    }
    public void addLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset) {
        addLinesBuffer(points, offset, points.capacity() - offset, false);
    }

    public void addLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length) {
        addLines(points, offset, length, false);
    }
    public void addLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length) {
        addLinesBuffer(points, offset, length, false);
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
    public void addLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length, boolean close) {
        final int l = offset + length;

        moveTo(points.get(offset), points.get(offset + 1));
        for (int i = offset + 2; i < l; i += 2) {
            lineTo(points.get(i), points.get(i + 1));
        }
        if (close) {
            close();
        }
        points.rewind();
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points) {
        setLines(points, 0, points.length, false);
    }

    public void setLinesBuffer(@NonNull java.nio.FloatBuffer points) {
        setLinesBuffer(points, 0, points.capacity(), false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset) {
        setLines(points, offset, points.length - offset, false);
    }
    public void setLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset) {
        setLinesBuffer(points, offset, points.capacity() - offset, false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length) {
        setLines(points, offset, length, false);
    }

    public void setLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length) {
        setLinesBuffer(points, offset, length, false);
    }

    public void setLines(@Size(multiple = 2, min = 4) @NonNull float[] points, int offset, int length, boolean close) {
        reset();
        addLines(points, offset, length, close);
    }
    public void setLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length, boolean close) {
        reset();
        addLinesBuffer(points, offset, length, close);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
        addCubicLines(points, 0, points.length, false);
    }

    public void addCubicLinesBuffer(@NonNull java.nio.FloatBuffer points) {
        addCubicLinesBuffer(points, 0, points.capacity(), false);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset) {
        addCubicLines(points, offset, points.length - offset, false);
    }

    public void addCubicLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset) {
        addCubicLinesBuffer(points, offset, points.capacity() - offset, false);
    }

    public void addCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length) {
        addCubicLines(points, offset, length, false);
    }
    public void addCubicLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length) {
        addCubicLinesBuffer(points, offset, length, false);
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
    public void addCubicLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length,
            boolean close) {
        final int l = length;
        moveTo(points.get(offset), points.get(offset + 1));
        for (int i = offset + 2; i < l; i += 6) {
            cubicTo(points.get(i), points.get(i + 1), points.get(i + 2), points.get(i + 3), points.get(i + 4), points.get(i + 5));
        }
        if (close) {
            close();
        }
        points.rewind();
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points) {
        setCubicLines(points, 0, points.length, false);
    }
    public void setCubicLinesBuffer(@NonNull java.nio.FloatBuffer points) {
        setCubicLinesBuffer(points, 0, points.capacity(), false);
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length) {
        setCubicLines(points, offset, length, false);
    }
    public void setCubicLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length) {
        setCubicLinesBuffer(points, offset, length, false);
    }

    public void setCubicLines(@Size(multiple = 2, min = 8) @NonNull float[] points, int offset, int length,
            boolean close) {
        reset();
        addCubicLines(points, offset, length, close);
    }
    public void setCubicLinesBuffer(@NonNull java.nio.FloatBuffer points, int offset, int length,
            boolean close) {
        reset();
        addCubicLinesBuffer(points, offset, length, close);
    }
}