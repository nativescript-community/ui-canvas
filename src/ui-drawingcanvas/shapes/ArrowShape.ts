import { Color } from '@nativescript/core';
import { Canvas, Paint, Path, Style } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape, Point } from './DrawableShape';

export default class ArrowShape extends DrawableShape {
    /** Start point */
    x1: number = 0;
    y1: number = 0;
    /** End point */
    x2: number = 0;
    y2: number = 100;

    /** Arrowhead size in dp */
    arrowSize: number = 45;
    /** Whether to draw arrowhead at start */
    arrowStart: boolean = false;
    /** Whether to draw arrowhead at end */
    arrowEnd: boolean = true;

    get shapeType(): string {
        return 'arrow';
    }

    getBounds(): BoundingBox {
        const pad = Math.max(this.strokeWidth, this.arrowSize) + 2;
        return {
            left: Math.min(this.x1, this.x2) - pad,
            top: Math.min(this.y1, this.y2) - pad,
            right: Math.max(this.x1, this.x2) + pad,
            bottom: Math.max(this.y1, this.y2) + pad
        };
    }

    // hitTest(px: number, py: number): boolean {
    //     const b = this.getBounds();
    //     if (px < b.left || px > b.right || py < b.top || py > b.bottom) return false;
    //     const dx = this.x2 - this.x1;
    //     const dy = this.y2 - this.y1;
    //     const lenSq = dx * dx + dy * dy;
    //     if (lenSq === 0) return Math.hypot(px - this.x1, py - this.y1) <= 10;
    //     let t = ((px - this.x1) * dx + (py - this.y1) * dy) / lenSq;
    //     t = Math.max(0, Math.min(1, t));
    //     const dist = Math.hypot(px - (this.x1 + t * dx), py - (this.y1 + t * dy));
    //     return dist <= Math.max(this.strokeWidth * 2, 10);
    // }
    hitTest(px: number, py: number): boolean {
        const b = this.getBounds();
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        this.applyPaint(false);
        canvas.drawLine(this.x1, this.y1, this.x2, this.y2, this._paint);

        if (this.arrowEnd) {
            this._drawArrowhead(canvas, this.x1, this.y1, this.x2, this.y2);
        }
        if (this.arrowStart) {
            this._drawArrowhead(canvas, this.x2, this.y2, this.x1, this.y1);
        }
    }

    private _drawArrowhead(canvas: Canvas, fromX: number, fromY: number, toX: number, toY: number): void {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const size = this.arrowSize;
        const spread = Math.PI / 6; // 30 degrees

        const path = new Path();
        path.moveTo(toX, toY);
        path.lineTo(toX - size * Math.cos(angle - spread), toY - size * Math.sin(angle - spread));
        path.lineTo(toX - size * Math.cos(angle + spread), toY - size * Math.sin(angle + spread));
        path.close();

        const fillPaint = new Paint();
        fillPaint.setAntiAlias(true);
        fillPaint.setStyle(Style.FILL);
        fillPaint.setColor(this.strokeColor ?? new Color('#000000'));
        fillPaint.setAlpha(Math.round(this.opacity * 255));
        canvas.drawPath(path, fillPaint);
    }

    protected toJSONData(): Record<string, any> {
        const data: Record<string, any> = { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
        if (this.arrowSize !== 16) data.as = this.arrowSize;
        if (this.arrowStart) data.aS = true;
        if (!this.arrowEnd) data.aE = false;
        return data;
    }

    protected fromJSONData(data: any): void {
        this.x1 = data.x1 ?? 0;
        this.y1 = data.y1 ?? 0;
        this.x2 = data.x2 ?? 0;
        this.y2 = data.y2 ?? 100;
        this.arrowSize = data.as ?? 16;
        this.arrowStart = data.aS ?? false;
        this.arrowEnd = data.aE ?? true;
    }
}
