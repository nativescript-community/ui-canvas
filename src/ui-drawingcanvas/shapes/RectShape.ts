import { Canvas } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape } from './DrawableShape';

export default class RectShape extends DrawableShape {
    cornerRadius: number = 0;

    get shapeType(): string {
        return 'rect';
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
        const b = this.getBounds();
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        const b = this.getBounds();
        if (this.fillColor) {
            this.applyPaint(true);
            if (this.cornerRadius > 0) {
                canvas.drawRoundRect(b.left, b.top, b.right, b.bottom, this.cornerRadius, this.cornerRadius, this._paint);
            } else {
                canvas.drawRect(b.left, b.top, b.right, b.bottom, this._paint);
            }
        }
        if (this.strokeColor) {
            this.applyPaint(false);
            if (this.cornerRadius > 0) {
                canvas.drawRoundRect(b.left, b.top, b.right, b.bottom, this.cornerRadius, this.cornerRadius, this._paint);
            } else {
                canvas.drawRect(b.left, b.top, b.right, b.bottom, this._paint);
            }
        }
    }

    protected toJSONData(): Record<string, any> {
        const data: Record<string, any> = {};
        if (this.cornerRadius !== 0) data.cr = this.cornerRadius;
        return data;
    }

    protected fromJSONData(data: any): void {
        this.cornerRadius = data.cr ?? 0;
    }
}
