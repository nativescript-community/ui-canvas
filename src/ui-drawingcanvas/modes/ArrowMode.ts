import { Color } from '@nativescript/core';
import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import ArrowShape from '../shapes/ArrowShape';

export default class ArrowMode extends DrawingMode {
    readonly name = 'arrow';

    private _shape: ArrowShape | null = null;

    onTouchStart(point: TouchPoint): void {
        const shape = new ArrowShape();
        shape.strokeColor = this.canvas.strokeColor ?? new Color('#000000');
        shape.strokeWidth = this.canvas.strokeWidth;
        shape.opacity = this.canvas.shapeOpacity;
        shape.x1 = point.x;
        shape.y1 = point.y;
        shape.x2 = point.x;
        shape.y2 = point.y;
        this._shape = shape;
    }

    onTouchMove(point: TouchPoint): void {
        if (!this._shape) return;
        this._shape.x2 = point.x;
        this._shape.y2 = point.y;
        this.canvas.redraw();
    }

    onTouchEnd(_point: TouchPoint): void {
        if (!this._shape) return;
        const dist = Math.hypot(this._shape.x2 - this._shape.x1, this._shape.y2 - this._shape.y1);
        if (dist < 5) {
            this._shape = null;
            return;
        }
        this.canvas.commitShape(this._shape);
        this._shape = null;
    }

    onTouchCancel(_point: TouchPoint): void {
        this._shape = null;
        this.canvas.redraw();
    }

    drawOverlay(canvas: Canvas): void {
        if (!this._shape) return;
        this._shape.draw(canvas);
    }
}
