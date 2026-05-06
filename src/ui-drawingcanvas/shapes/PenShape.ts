import { Canvas, Path } from '@nativescript-community/ui-canvas';
import BaseCustomShape from '@nativescript-community/ui-drawingcanvas/shapes/BaseCustomShape';
import { BoundingBox, Point, ShapeJSON } from './DrawableShape';

export interface PenShapeJSON extends ShapeJSON {
    p: string; // encoded drawStringWithAttributesWithAlignment
}

/** Google polyline-style encoding */
export function encodeSigned(value: number): string {
    // ZigZag encode
    let v = value < 0 ? ~(value << 1) : value << 1;

    let output = '';
    while (v >= 0x20) {
        output += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
        v >>= 5;
    }
    output += String.fromCharCode(v + 63);

    return output;
}

export default class PenShape extends BaseCustomShape {
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

    /** Raw bounding box of the stored points (no translation / scaling applied). */
    protected _getRawBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
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

    _draw(canvas: Canvas): void {
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
        if (pts.length === 0) return { p: '' };

        const scale = 10; // 0.1 precision
        let result = '';

        let prevX = 0;
        let prevY = 0;

        for (let i = 0; i < pts.length; i++) {
            const x = Math.round(pts[i].x * scale);
            const y = Math.round(pts[i].y * scale);

            const dx = i === 0 ? x : x - prevX;
            const dy = i === 0 ? y : y - prevY;

            result += encodeSigned(dx) + encodeSigned(dy);

            prevX = x;
            prevY = y;
        }
        return { p: result };
    }

    protected fromJSONData(data: any): void {
        const str: string = data.p ?? '';
        const scale = 10;

        this.points = [];

        let index = 0;
        let x = 0;
        let y = 0;

        while (index < str.length) {
            x += decodeSigned();
            y += decodeSigned();
            this.points.push({ x: x / scale, y: y / scale });
        }

        this.renderPoints = this.points;
        this._invalidateBounds();

        function decodeSigned(): number {
            let result = 0;
            let shift = 0;
            let b: number;

            do {
                b = str.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            return result & 1 ? ~(result >> 1) : result >> 1;
        }
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
