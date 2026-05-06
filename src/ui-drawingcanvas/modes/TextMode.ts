import { Canvas } from '@nativescript-community/ui-canvas';
import TextShape from '../shapes/TextShape';
import { DrawingMode, TouchPoint } from './DrawingMode';

/**
 * Text mode: tap anywhere to create a new TextShape at the touch position,
 * then immediately switch to 'select' mode and open the TextField editor.
 */
export default class TextMode extends DrawingMode {
    readonly name = 'text';

    onTouchStart(point: TouchPoint): void {
        const dc = this.canvas;
        const shape = new TextShape();

        // Default font size scaled down by canvas scale so the shape matches
        // the apparent size the user sees
        const effectiveScale = dc.canvasScale || 1;
        shape.strokeColor = dc.strokeColor;
        shape.opacity = dc.shapeOpacity;
        shape.fontSize = 16 / effectiveScale;

        // Place at touch position with an initial width
        const initialWidth = 120 / effectiveScale;
        const initialHeight = shape.fontSize * 1.5;
        shape.x = point.x;
        shape.y = point.y;
        shape.width = initialWidth;
        shape.height = initialHeight;

        // Commit shape and immediately select + begin editing
        dc.commitShape(shape);
        dc.setMode('select');
        dc.selectShape(shape);
        dc.beginTextEdit(shape);
    }

    drawOverlay(_canvas: Canvas): void {}
}
