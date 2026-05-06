import { Canvas } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape } from './DrawableShape';

export default class EllipseShape extends DrawableShape {
    get shapeType(): string {
        return 'ellipse';
    }

    getBounds(): BoundingBox {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height
        };
    }

    draw(canvas: Canvas): void {
        const b = this.getBounds();
        if (this.fillColor) {
            this.applyPaint(true);
            canvas.drawOval(b.left, b.top, b.right, b.bottom, this._paint);
        }
        if (this.strokeColor) {
            this.applyPaint(false);
            canvas.drawOval(b.left, b.top, b.right, b.bottom, this._paint);
        }
    }
}
