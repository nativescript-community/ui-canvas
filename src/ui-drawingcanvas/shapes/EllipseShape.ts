import { Canvas, Style } from '@nativescript-community/ui-canvas';
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

    hitTest(px: number, py: number): boolean {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const rx = this.width / 2;
        const ry = this.height / 2;
        if (rx === 0 || ry === 0) return false;
        const dx = (px - cx) / rx;
        const dy = (py - cy) / ry;
        return dx * dx + dy * dy <= 1;
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
