import { Canvas, Path } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape, Point, ShapeJSON } from './DrawableShape';

export interface PenShapeJSON extends ShapeJSON {
    pts: number[]; // flat array [x1,y1,x2,y2,...]
}

export default class PenShape extends DrawableShape {
    /** Raw input points */
    points: Point[] = [];
    /** Simplified / smoothed points used for rendering */
    renderPoints: Point[] = [];

    get shapeType(): string {
        return 'pen';
    }

    addPoint(p: Point): void {
        this.points.push(p);
        this.renderPoints = this.points; // caller handles simplification
        this._invalidateBounds();
    }

    private _bounds: BoundingBox | null = null;

    private _invalidateBounds(): void {
        this._bounds = null;
    }

    getBounds(): BoundingBox {
        if (this._bounds) return this._bounds;
        const pts = this.renderPoints.length ? this.renderPoints : this.points;
        if (pts.length === 0) {
            this._bounds = { left: this.x, top: this.y, right: this.x, bottom: this.y };
            return this._bounds;
        }
        let minX = pts[0].x;
        let minY = pts[0].y;
        let maxX = pts[0].x;
        let maxY = pts[0].y;
        for (const p of pts) {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        }
        const pad = (this.strokeWidth ?? 2) / 2;
        this._bounds = { left: minX - pad, top: minY - pad, right: maxX + pad, bottom: maxY + pad };
        return this._bounds;
    }

    // hitTest(px: number, py: number): boolean {
    //     const b = this.getBounds();
    //     if (px < b.left || px > b.right || py < b.top || py > b.bottom) return false;
    //     const pts = this.renderPoints.length ? this.renderPoints : this.points;
    //     const threshold = Math.max(this.strokeWidth * 2, 10);
    //     for (let i = 1; i < pts.length; i++) {
    //         const dist = distanceToSegment(px, py, pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
    //         if (dist <= threshold) return true;
    //     }
    //     return false;
    // }

    hitTest(px: number, py: number): boolean {
        const b = this.getBounds();
        console.log('hitTest', b, px, py)
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        const pts = this.renderPoints.length ? this.renderPoints : this.points;
        if (pts.length < 2) return;

        const path = new Path();
        path.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            path.lineTo(pts[i].x, pts[i].y);
        }

        this.applyPaint(false);
        canvas.drawPath(path, this._paint);
    }

    protected toJSONData(): Record<string, any> {
        const pts = this.renderPoints.length ? this.renderPoints : this.points;
        const flat: number[] = [];
        for (const p of pts) {
            flat.push(Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10);
        }
        return { pts: flat };
    }

    protected fromJSONData(data: any): void {
        const flat: number[] = data.pts ?? [];
        this.points = [];
        for (let i = 0; i < flat.length - 1; i += 2) {
            this.points.push({ x: flat[i], y: flat[i + 1] });
        }
        this.renderPoints = this.points;
        this._invalidateBounds();
    }
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - ax, py - ay);
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
