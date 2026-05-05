import { Canvas } from '@nativescript-community/ui-canvas';
import { type DrawingCanvas } from '../DrawingCanvas';
import { DrawableShape } from '../shapes';

export interface TouchPoint {
    x: number;
    y: number;
}

/**
 * Abstract base class for all drawing modes.
 * Each mode handles touch events and optionally draws an in-progress overlay.
 */
export abstract class DrawingMode {
    protected canvas: DrawingCanvas;

    abstract readonly name: string;

    constructor(canvas: DrawingCanvas) {
        this.canvas = canvas;
    }

    /** Called when a touch begins */
    onTouchStart(_point: TouchPoint, _event?: any): void {}

    /** Called as the touch moves */
    onTouchMove(_point: TouchPoint, _event?: any): void {}

    /** Called when the touch ends */
    onTouchEnd(_point: TouchPoint, _event?: any): void {}

    /** Called when the touch is cancelled */
    onTouchCancel(_point: TouchPoint, _event?: any): void {}

    /**
     * Draw any in-progress overlay for this mode.
     * Called during the DrawingCanvas onDraw pass after all layers.
     */
    drawOverlay(_canvas: Canvas): void {}

    /** Called when this mode becomes active */
    activate(): void {}

    /** Called when this mode becomes inactive */
    deactivate(): void {}

    onSnapShotRestored() {}

    onLayerRemoved(shape: DrawableShape, index: number) {}
}
