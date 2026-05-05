import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';

/**
 * Move mode: pan the canvas view (if the DrawingCanvas supports a transform/offset).
 * By default this mode simply does nothing visually special but prevents shapes from
 * being drawn. If you want to pan, listen to the `pan` event or extend this class.
 */
export default class MoveMode extends DrawingMode {
    readonly name = 'move';

    private _startX: number = 0;
    private _startY: number = 0;

    onTouchStart(point: TouchPoint): void {
        this._startX = point.x;
        this._startY = point.y;
    }

    onTouchMove(point: TouchPoint): void {
        const dx = point.x - this._startX;
        const dy = point.y - this._startY;
        this.canvas.notify({ eventName: 'pan', object: this.canvas, dx, dy });
    }

    onTouchEnd(_point: TouchPoint): void {}
}
