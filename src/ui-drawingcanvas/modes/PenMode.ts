import { Color } from '@nativescript/core';
import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import PenShape from '../shapes/PenShape';
import { douglasPeucker } from '../algorithms/douglasPeucker';
import { catmullRomSpline } from '../algorithms/catmullRomSpline';
import { type DrawingCanvas } from '../DrawingCanvas';
import type { SimplificationOptions } from '../DrawingCanvas';

export default class PenMode extends DrawingMode {
    readonly name = 'pen';

    private _currentShape: PenShape | null = null;
    private _minDistance: number = 2;

    onTouchStart(point: TouchPoint): void {
        const shape = new PenShape();
        shape.strokeColor = this.canvas.strokeColor ?? new Color('#000000');
        shape.strokeWidth = this.canvas.strokeWidth;
        shape.opacity = this.canvas.shapeOpacity;
        shape.addPoint({ x: point.x, y: point.y });
        this._currentShape = shape;
        this.canvas.redraw();
    }

    onTouchMove(point: TouchPoint): void {
        if (!this._currentShape) return;
        const pts = this._currentShape.points;
        if (pts.length > 0) {
            const last = pts[pts.length - 1];
            const dist = Math.hypot(point.x - last.x, point.y - last.y);
            if (dist < this._minDistance) return;
        }
        this._currentShape.addPoint({ x: point.x, y: point.y });
        this.canvas.redraw();
    }

    onTouchEnd(_point: TouchPoint): void {
        if (!this._currentShape) return;
        const shape = this._currentShape;
        this._currentShape = null;

        if (shape.points.length < 2) {
            return;
        }

        const opts = this.canvas.simplificationOptions;
        if (opts?.enabled !== false) {
            const epsilon = opts?.epsilon ?? 2;
            let pts = douglasPeucker(shape.points, epsilon);
            if (opts?.smoothing !== false && pts.length >= 3) {
                pts = catmullRomSpline(pts, opts?.splineSegments ?? 8, opts?.splineAlpha ?? 0.5);
            }
            shape.renderPoints = pts;
        }

        this.canvas.commitShape(shape);
    }

    onTouchCancel(_point: TouchPoint): void {
        this._currentShape = null;
        this.canvas.redraw();
    }

    drawOverlay(canvas: Canvas): void {
        if (!this._currentShape || this._currentShape.points.length < 2) return;
        this._currentShape.draw(canvas);
    }
}
