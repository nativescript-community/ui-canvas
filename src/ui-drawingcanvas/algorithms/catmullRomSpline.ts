import type { Point } from '../shapes/DrawableShape';

/**
 * Catmull-Rom spline interpolation.
 * Takes a set of control points and returns a smooth curve passing through all of them.
 *
 * @param points   Input control points
 * @param segments Number of interpolation segments between each pair of control points
 * @param alpha    Parameterisation: 0 = uniform, 0.5 = centripetal (recommended), 1 = chordal
 * @returns        Interpolated points
 */
export function catmullRomSpline(points: Point[], segments: number = 10, alpha: number = 0.5): Point[] {
    if (points.length < 2) return points.slice();
    if (points.length === 2) return points.slice();

    // Extend endpoints so spline passes through first and last points
    const pts = [reflect(points[1], points[0]), ...points, reflect(points[points.length - 2], points[points.length - 1])];

    const result: Point[] = [];

    for (let i = 1; i < pts.length - 2; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2];

        for (let s = 0; s <= segments; s++) {
            const t = s / segments;
            result.push(catmullRomPoint(p0, p1, p2, p3, t, alpha));
        }
    }

    return result;
}

function reflect(pivot: Point, point: Point): Point {
    return { x: 2 * point.x - pivot.x, y: 2 * point.y - pivot.y };
}

function catmullRomPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number, alpha: number): Point {
    const t0 = 0;
    const t1 = t0 + Math.pow(distance(p0, p1), alpha);
    const t2 = t1 + Math.pow(distance(p1, p2), alpha);
    const t3 = t2 + Math.pow(distance(p2, p3), alpha);

    const tParam = lerp(t1, t2, t);

    const a1 = scale(p0, (t1 - tParam) / (t1 - t0 + 1e-10));
    const b1 = scale(p1, (tParam - t0) / (t1 - t0 + 1e-10));
    const A1 = add(a1, b1);

    const a2 = scale(p1, (t2 - tParam) / (t2 - t1 + 1e-10));
    const b2 = scale(p2, (tParam - t1) / (t2 - t1 + 1e-10));
    const A2 = add(a2, b2);

    const a3 = scale(p2, (t3 - tParam) / (t3 - t2 + 1e-10));
    const b3 = scale(p3, (tParam - t2) / (t3 - t2 + 1e-10));
    const A3 = add(a3, b3);

    const B1 = add(scale(A1, (t2 - tParam) / (t2 - t0 + 1e-10)), scale(A2, (tParam - t0) / (t2 - t0 + 1e-10)));
    const B2 = add(scale(A2, (t3 - tParam) / (t3 - t1 + 1e-10)), scale(A3, (tParam - t1) / (t3 - t1 + 1e-10)));

    return add(scale(B1, (t2 - tParam) / (t2 - t1 + 1e-10)), scale(B2, (tParam - t1) / (t2 - t1 + 1e-10)));
}

function distance(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function scale(p: Point, s: number): Point {
    return { x: p.x * s, y: p.y * s };
}

function add(a: Point, b: Point): Point {
    return { x: a.x + b.x, y: a.y + b.y };
}
