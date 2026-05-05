import { Color, Observable } from '@nativescript/core';
import { Canvas, Paint, Style } from '@nativescript-community/ui-canvas';

export type Point = { x: number; y: number };

export interface BoundingBox {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface HandlePoint {
    x: number;
    y: number;
    type: 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br' | 'rotate';
}

export interface ShapeJSON {
    type: string;
    id: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    r?: number;
    sx?: number;
    sy?: number;
    sc?: string;
    fc?: string;
    sw?: number;
    op?: number;
    lk?: boolean;
    vi?: boolean;
    [key: string]: any;
}

let _idCounter = 0;
function generateId(): string {
    return `shape_${Date.now()}_${_idCounter++}`;
}

export abstract class DrawableShape extends Observable {
    readonly id: string;

    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    rotation: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;

    strokeColor: Color | null = null;
    fillColor: Color | null = null;
    strokeWidth: number = 2;
    opacity: number = 1;

    locked: boolean = false;
    visible: boolean = true;

    protected _paint: Paint;

    constructor() {
        super();
        this.id = generateId();
        this._paint = new Paint();
        this._paint.setAntiAlias(true);
    }

    get paint(): Paint {
        return this._paint;
    }

    /** Draw the shape on the given canvas */
    abstract draw(canvas: Canvas): void;

    /** Return the untransformed bounding box (in local coordinates offset by x,y) */
    abstract getBounds(): BoundingBox;

    /** Hit-test a point (in canvas coordinates) against the shape */
    abstract hitTest(px: number, py: number, scale?: number): boolean;

    /** The shape type identifier for JSON serialization */
    abstract get shapeType(): string;

    /** Shape-specific extra JSON data */
    protected toJSONData(): Record<string, any> {
        return {};
    }

    /** Restore shape-specific data from JSON */
    protected fromJSONData(_data: Record<string, any>): void {}

    toJSON(): ShapeJSON {
        const obj: ShapeJSON = { type: this.shapeType, id: this.id };
        if (this.x !== 0) obj.x = this.x;
        if (this.y !== 0) obj.y = this.y;
        if (this.width !== 0) obj.w = this.width;
        if (this.height !== 0) obj.h = this.height;
        if (this.rotation !== 0) obj.r = this.rotation;
        if (this.scaleX !== 1) obj.sx = this.scaleX;
        if (this.scaleY !== 1) obj.sy = this.scaleY;
        if (this.strokeColor) obj.sc = this.strokeColor.hex;
        if (this.fillColor) obj.fc = this.fillColor.hex;
        if (this.strokeWidth !== 2) obj.sw = this.strokeWidth;
        if (this.opacity !== 1) obj.op = this.opacity;
        if (this.locked) obj.lk = true;
        if (!this.visible) obj.vi = false;
        Object.assign(obj, this.toJSONData());
        return obj;
    }

    fromJSON(data: ShapeJSON): void {
        this.x = data.x ?? 0;
        this.y = data.y ?? 0;
        this.width = data.w ?? 0;
        this.height = data.h ?? 0;
        this.rotation = data.r ?? 0;
        this.scaleX = data.sx ?? 1;
        this.scaleY = data.sy ?? 1;
        this.strokeColor = data.sc ? new Color(data.sc) : null;
        this.fillColor = data.fc ? new Color(data.fc) : null;
        this.strokeWidth = data.sw ?? 2;
        this.opacity = data.op ?? 1;
        this.locked = data.lk ?? false;
        this.visible = data.vi ?? true;
        this.fromJSONData(data);
    }

    /**
     * Apply a resize operation given the new bounding box position and size.
     * The default implementation sets `x`, `y`, `width`, `height` directly.
     * Subclasses (e.g. PenShape) may override to use `scaleX`/`scaleY` instead.
     */
    applyResize(x: number, y: number, w: number, h: number): void {
        this.x = x;
        this.y = y;
        this.width = Math.max(2, w);
        this.height = Math.max(2, h);
    }
    applyTranslate(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /** Rotate a point around a center by angleDegrees, returning the new world position */
    static rotatePoint(px: number, py: number, cx: number, cy: number, angleDegrees: number): { x: number; y: number } {
        if (angleDegrees === 0) return { x: px, y: py };
        const rad = (angleDegrees * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const dx = px - cx;
        const dy = py - cy;
        return {
            x: cx + dx * cos - dy * sin,
            y: cy + dx * sin + dy * cos
        };
    }

    /** Get the 8 resize handles + 1 rotation handle in canvas (world) coordinates, accounting for rotation */
    getHandles(displayScale: number): HandlePoint[] {
        const b = this.getTransformedBounds(displayScale);
        const cx = (b.left + b.right) / 2;
        const cy = (b.top + b.bottom) / 2;
        const invScale = displayScale >= 0.01 ? 1 / displayScale : 1;
        const ROTATE_OFFSET = 30 * invScale;

        const rawHandles: { x: number; y: number; type: HandlePoint['type'] }[] = [
            { x: cx, y: b.top - ROTATE_OFFSET, type: 'rotate' },
            { x: b.left, y: b.top, type: 'tl' },
            { x: cx, y: b.top, type: 'tm' },
            { x: b.right, y: b.top, type: 'tr' },
            { x: b.left, y: cy, type: 'ml' },
            { x: b.right, y: cy, type: 'mr' },
            { x: b.left, y: b.bottom, type: 'bl' },
            { x: cx, y: b.bottom, type: 'bm' },
            { x: b.right, y: b.bottom, type: 'br' }
        ];

        if (this.rotation === 0) return rawHandles;

        return rawHandles.map((h) => {
            const rotated = DrawableShape.rotatePoint(h.x, h.y, cx, cy, this.rotation);
            return { x: rotated.x, y: rotated.y, type: h.type };
        });
    }

    /** Get bounding box in canvas space (accounting for position, scale and rotation is simplified as AABB) */
    getTransformedBounds(displayScale: number): BoundingBox {
        const b = this.getBounds();
        return {
            left: b.left,
            top: b.top,
            right: b.right,
            bottom: b.bottom
        };
    }

    /**
     * Draw selection overlay: bounding box + handles, rotated with the shape.
     * @param canvas - the canvas to draw on (already inside the shape's canvas transform)
     * @param handleSize - handle square size in dp at 1× zoom
     * @param displayScale - the effective display scale (canvasScale × matrix scale). Sizes are divided
     *   by this value so that handles appear constant-size on screen regardless of zoom.
     */
    drawSelectionOverlay(canvas: Canvas, handleSize: number = 10, displayScale: number = 1): void {
        const bounds = this.getTransformedBounds(displayScale);
        const cx = (bounds.left + bounds.right) / 2;
        const cy = (bounds.top + bounds.bottom) / 2;

        // All sizes are divided by displayScale so they appear constant on screen.
        // Clamp to a sensible minimum to avoid extreme values near zero.
        const invScale = displayScale >= 0.01 ? 1 / displayScale : 1;

        const linePaint = new Paint();
        linePaint.setAntiAlias(true);
        linePaint.setStyle(Style.STROKE);
        linePaint.setColor(new Color('#1976D2'));
        linePaint.setStrokeWidth(1.5 * invScale);

        const handleFillPaint = new Paint();
        handleFillPaint.setAntiAlias(true);
        handleFillPaint.setStyle(Style.FILL);
        handleFillPaint.setColor(new Color('#FFFFFF'));

        const handleStrokePaint = new Paint();
        handleStrokePaint.setAntiAlias(true);
        handleStrokePaint.setStyle(Style.STROKE);
        handleStrokePaint.setColor(new Color('#1976D2'));
        handleStrokePaint.setStrokeWidth(1.5 * invScale);

        // Apply rotation so that the bounding box and handles rotate with the shape
        canvas.save();
        if (this.rotation !== 0) {
            canvas.rotate(this.rotation, cx, cy);
        }

        // Draw bounding box in local (unrotated) space
        canvas.drawRect(bounds.left, bounds.top, bounds.right, bounds.bottom, linePaint);

        const r = (handleSize / 2) * invScale;
        const ROTATE_OFFSET = 30 * invScale;
        const localHandles: { lx: number; ly: number; type: HandlePoint['type'] }[] = [
            { lx: bounds.right, ly: bounds.bottom, type: 'br' },
            { lx: cx, ly: bounds.top - ROTATE_OFFSET, type: 'rotate' },
            { lx: bounds.left, ly: bounds.top, type: 'tl' },
            { lx: cx, ly: bounds.top, type: 'tm' },
            { lx: bounds.right, ly: bounds.top, type: 'tr' },
            { lx: bounds.left, ly: cy, type: 'ml' },
            { lx: bounds.right, ly: cy, type: 'mr' },
            { lx: bounds.left, ly: bounds.bottom, type: 'bl' },
            { lx: cx, ly: bounds.bottom, type: 'bm' }
        ];

        for (const h of localHandles) {
            if (h.type === 'rotate') {
                canvas.drawLine(cx, bounds.top, h.lx, h.ly, linePaint);
                canvas.drawCircle(h.lx, h.ly, r, handleFillPaint);
                canvas.drawCircle(h.lx, h.ly, r, handleStrokePaint);
            } else {
                canvas.drawRect(h.lx - r, h.ly - r, h.lx + r, h.ly + r, handleFillPaint);
                canvas.drawRect(h.lx - r, h.ly - r, h.lx + r, h.ly + r, handleStrokePaint);
            }
        }

        canvas.restore();
    }

    protected applyPaint(forFill: boolean): void {
        const p = this._paint;
        p.setAntiAlias(true);
        p.setStrokeWidth(this.strokeWidth);
        if (forFill && this.fillColor) {
            p.setStyle(Style.FILL);
            p.setColor(this.fillColor);
        } else {
            p.setStyle(Style.STROKE);
            p.setColor(this.strokeColor ?? new Color('#000000'));
        }
        p.setAlpha(Math.round(this.opacity * 255));
    }

    notifyPropertyChange(propertyName: string, value: any, oldValue?: any): void {
        super.notifyPropertyChange(propertyName, value, oldValue);
    }
}
