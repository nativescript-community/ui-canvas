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
    abstract hitTest(px: number, py: number): boolean;

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

    /** Get the 8 resize handles + 1 rotation handle in canvas coordinates */
    getHandles(): HandlePoint[] {
        const { left, top, right, bottom } = this.getTransformedBounds();
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        return [
            { x: left, y: top, type: 'tl' },
            { x: cx, y: top, type: 'tm' },
            { x: right, y: top, type: 'tr' },
            { x: left, y: cy, type: 'ml' },
            { x: right, y: cy, type: 'mr' },
            { x: left, y: bottom, type: 'bl' },
            { x: cx, y: bottom, type: 'bm' },
            { x: right, y: bottom, type: 'br' },
            { x: cx, y: top - 30, type: 'rotate' }
        ];
    }

    /** Get bounding box in canvas space (accounting for position, scale and rotation is simplified as AABB) */
    getTransformedBounds(): BoundingBox {
        const b = this.getBounds();
        return {
            left: b.left,
            top: b.top,
            right: b.right,
            bottom: b.bottom
        };
    }

    /** Draw selection overlay: bounding box + handles */
    drawSelectionOverlay(canvas: Canvas, handleSize: number = 10): void {
        const bounds = this.getTransformedBounds();
        const handles = this.getHandles();

        const linePaint = new Paint();
        linePaint.setAntiAlias(true);
        linePaint.setStyle(Style.STROKE);
        linePaint.setColor(new Color('#1976D2'));
        linePaint.setStrokeWidth(1.5);
        // dashed line
        canvas.save();
        canvas.drawRect(bounds.left, bounds.top, bounds.right, bounds.bottom, linePaint);
        canvas.restore();

        const handleFillPaint = new Paint();
        handleFillPaint.setAntiAlias(true);
        handleFillPaint.setStyle(Style.FILL);
        handleFillPaint.setColor(new Color('#FFFFFF'));

        const handleStrokePaint = new Paint();
        handleStrokePaint.setAntiAlias(true);
        handleStrokePaint.setStyle(Style.STROKE);
        handleStrokePaint.setColor(new Color('#1976D2'));
        handleStrokePaint.setStrokeWidth(1.5);

        const r = handleSize / 2;
        for (const h of handles) {
            if (h.type === 'rotate') {
                // Draw circular handle for rotation
                canvas.drawCircle(h.x, h.y, r, handleFillPaint);
                canvas.drawCircle(h.x, h.y, r, handleStrokePaint);
                // Draw line from center top to rotate handle
                const cx = (bounds.left + bounds.right) / 2;
                canvas.drawLine(cx, bounds.top, h.x, h.y, linePaint);
            } else {
                canvas.drawRect(h.x - r, h.y - r, h.x + r, h.y + r, handleFillPaint);
                canvas.drawRect(h.x - r, h.y - r, h.x + r, h.y + r, handleStrokePaint);
            }
        }
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
