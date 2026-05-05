import type { Point } from '../shapes/DrawableShape';

/**
 * Douglas-Peucker path simplification algorithm.
 * Reduces the number of points in a path while preserving its overall shape.
 *
 * @param points  Input array of points
 * @param epsilon Maximum allowed distance from the simplified line (in the same units as points)
 * @returns       Simplified array of points
 */
export function douglasPeucker(points: Point[], epsilon: number): Point[] {
    if (points.length <= 2) return points.slice();

    let maxDist = 0;
    let maxIndex = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = perpendicularDistance(points[i], points[0], points[end]);
        if (d > maxDist) {
            maxDist = d;
            maxIndex = i;
        }
    }

    if (maxDist > epsilon) {
        const left = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
        const right = douglasPeucker(points.slice(maxIndex), epsilon);
        // Merge – avoid duplicating the pivot point
        return left.slice(0, -1).concat(right);
    } else {
        return [points[0], points[end]];
    }
}

function perpendicularDistance(pt: Point, lineStart: Point, lineEnd: Point): number {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lineLenSq = dx * dx + dy * dy;
    if (lineLenSq === 0) return Math.hypot(pt.x - lineStart.x, pt.y - lineStart.y);
    const t = ((pt.x - lineStart.x) * dx + (pt.y - lineStart.y) * dy) / lineLenSq;
    return Math.hypot(pt.x - (lineStart.x + t * dx), pt.y - (lineStart.y + t * dy));
}
