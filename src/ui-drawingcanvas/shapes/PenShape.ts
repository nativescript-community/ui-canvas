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

    /** Raw bounding box of the stored points (no translation / scaling applied). */
    private _getRawBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
        const pts = this.renderPoints.length ? this.renderPoints : this.points;
        if (pts.length === 0) return null;
        let minX = pts[0].x,
            minY = pts[0].y,
            maxX = pts[0].x,
            maxY = pts[0].y;
        for (const p of pts) {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        }
        return { minX, minY, maxX, maxY };
    }

    getBounds(): BoundingBox {
        if (this._bounds) return this._bounds;
        const raw = this._getRawBounds();
        if (!raw) {
            this._bounds = { left: this.x, top: this.y, right: this.x, bottom: this.y };
            return this._bounds;
        }
        const { minX, minY, maxX, maxY } = raw;
        const rawCx = (minX + maxX) / 2;
        const rawCy = (minY + maxY) / 2;

        // Apply scale around the raw center, then translate by x/y
        const scaledLeft = rawCx + (minX - rawCx) * this.scaleX + this.x;
        const scaledRight = rawCx + (maxX - rawCx) * this.scaleX + this.x;
        const scaledTop = rawCy + (minY - rawCy) * this.scaleY + this.y;
        const scaledBottom = rawCy + (maxY - rawCy) * this.scaleY + this.y;

        const pad = (this.strokeWidth ?? 2) / 2;
        this._bounds = {
            left: scaledLeft - pad,
            top: scaledTop - pad,
            right: scaledRight + pad,
            bottom: scaledBottom + pad
        };
        return this._bounds;
    }

    hitTest(px: number, py: number): boolean {
        const b = this.getBounds();
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        const pts = this.renderPoints.length ? this.renderPoints : this.points;
        if (pts.length < 2) return;

        canvas.save();

        // Apply translation
        if (this.x !== 0 || this.y !== 0) {
            canvas.translate(this.x, this.y);
        }

        // Apply scale around the raw path's center so the path scales in-place
        if (this.scaleX !== 1 || this.scaleY !== 1) {
            const rawForScale = this._getRawBounds();
            if (!rawForScale) {
                canvas.restore();
                return;
            }
            const rawCx = (rawForScale.minX + rawForScale.maxX) / 2;
            const rawCy = (rawForScale.minY + rawForScale.maxY) / 2;
            canvas.translate(rawCx, rawCy);
            canvas.scale(this.scaleX, this.scaleY);
            canvas.translate(-rawCx, -rawCy);
        }

        const path = new Path();
        path.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            path.lineTo(pts[i].x, pts[i].y);
        }

        this.applyPaint(false);
        canvas.drawPath(path, this._paint);

        canvas.restore();
    }

    /**
     * For PenShape, "resize" means adjusting scaleX/scaleY (plus x/y offset) so that
     * the rendered bounds match the requested rectangle.
     * The input coordinates come from getBounds() which includes strokeWidth/2 padding,
     * so we strip that padding before computing scale to avoid a "jump" on first move.
     */
    applyResize(newX: number, newY: number, newW: number, newH: number): void {
        const raw = this._getRawBounds();
        if (!raw) return;
        const { minX, minY, maxX, maxY } = raw;
        const rawW = maxX - minX;
        const rawH = maxY - minY;
        const rawCx = (minX + maxX) / 2;
        const rawCy = (minY + maxY) / 2;

        // Strip the stroke-pad that getBounds() adds on all sides so the
        // first touch move does not cause a "jump" in position/scale.
        const pad = (this.strokeWidth ?? 2) / 2;
        const innerX = newX + pad;
        const innerY = newY + pad;
        const innerW = Math.max(2, newW - 2 * pad);
        const innerH = Math.max(2, newH - 2 * pad);

        // Compute new scale
        const newScaleX = rawW > 0 ? innerW / rawW : 1;
        const newScaleY = rawH > 0 ? innerH / rawH : 1;

        // After canvas.translate(x, y) + scale around rawCx/rawCy, the rendered top-left is:
        //   x + rawCx + (minX - rawCx) * scaleX = x + rawCx - rawW/2 * scaleX
        // We want this to equal innerX:
        //   x = innerX - rawCx + rawW/2 * newScaleX
        this.x = innerX - rawCx + (rawW / 2) * newScaleX;
        this.y = innerY - rawCy + (rawH / 2) * newScaleY;
        this.scaleX = newScaleX;
        this.scaleY = newScaleY;
        this._invalidateBounds();
    }

    applyTranslate(x: number, y: number): void {
        super.applyTranslate(x, y);
        this._invalidateBounds();
    }

    private static readonly _BOUNDS_AFFECTING_PROPS = new Set(['x', 'y', 'scaleX', 'scaleY', 'strokeWidth']);

    notifyPropertyChange(propertyName: string, value: any, oldValue?: any): void {
        super.notifyPropertyChange(propertyName, value, oldValue);
        if (PenShape._BOUNDS_AFFECTING_PROPS.has(propertyName)) {
            this._invalidateBounds();
        }
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
