import { Color } from '@nativescript/core';
import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import RectShape from '../shapes/RectShape';

export default class RectangleMode extends DrawingMode {
    readonly name = 'rectangle';

    private _shape: RectShape | null = null;
    private _startX: number = 0;
    private _startY: number = 0;

    onTouchStart(point: TouchPoint): void {
        this._startX = point.x;
        this._startY = point.y;
        const shape = new RectShape();
        shape.strokeColor = this.canvas.strokeColor ?? new Color('#000000');
        shape.fillColor = this.canvas.fillColor ?? null;
        shape.strokeWidth = this.canvas.strokeWidth;
        shape.opacity = this.canvas.shapeOpacity;
        shape.x = point.x;
        shape.y = point.y;
        shape.width = 0;
        shape.height = 0;
        this._shape = shape;
    }

    onTouchMove(point: TouchPoint): void {
        if (!this._shape) return;
        const x = Math.min(point.x, this._startX);
        const y = Math.min(point.y, this._startY);
        const w = Math.abs(point.x - this._startX);
        const h = Math.abs(point.y - this._startY);
        this._shape.x = x;
        this._shape.y = y;
        this._shape.width = w;
        this._shape.height = h;
        this.canvas.redraw();
    }

    onTouchEnd(_point: TouchPoint): void {
        if (!this._shape || (this._shape.width < 2 && this._shape.height < 2)) {
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
        if (!this._shape || (this._shape.width === 0 && this._shape.height === 0)) return;
        this._shape.draw(canvas);
    }
}
