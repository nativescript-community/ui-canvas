import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import { DrawableShape, HandlePoint } from '../shapes/DrawableShape';
import TextShape from '../shapes/TextShape';

type TransformAction =
    | { kind: 'move'; startX: number; startY: number; origX: number; origY: number; start: boolean }
    | {
          kind: 'resize';
          handle: HandlePoint;
          origBounds: { x: number; y: number; w: number; h: number };
          /** World-space position of the fixed (opposite) anchor, captured at gesture start */
          anchorWorld: { x: number; y: number };
          start: boolean;
      }
    | { kind: 'rotate'; cx: number; cy: number; startAngle: number; origRotation: number; start: boolean }
    | null;

/** Handle hit-test radius in dp */
const HANDLE_RADIUS = 14;
/** Minimum dimension when resizing a shape in dp */
const MIN_SHAPE_SIZE = 2;

export default class SelectMode extends DrawingMode {
    readonly name = 'select';

    private _action: TransformAction = null;
    private _activeShape: DrawableShape | null = null;

    get selectedShape(): DrawableShape | null {
        return this._activeShape;
    }

    /** Programmatically set the selected shape (used by DrawingCanvas.selectShape) */
    setSelectedShape(shape: DrawableShape | null): void {
        this._activeShape = shape;
        this._action = null;
    }

    onTouchStart(point: TouchPoint): void {
        const shapes = this.canvas.layers;

        // If we already have a selected shape, check its handles first
        if (this._activeShape) {
            const handle = this._hitTestHandle(this._activeShape, point);
            if (handle) {
                this.canvas.pushUndoSnapshot();
                this._startTransform(handle, point);
                return;
            }
            // Check if we tapped on the shape body for move
            if (this._activeShape.hitTest(point.x, point.y)) {
                this.canvas.pushUndoSnapshot();
                this._action = {
                    start: true,
                    kind: 'move',
                    startX: point.x,
                    startY: point.y,
                    origX: this._activeShape.x,
                    origY: this._activeShape.y
                };
                return;
            }
            // Deselect – end any ongoing text edit
            if (this._activeShape instanceof TextShape) {
                this.canvas.endTextEdit();
                if (this._activeShape.text?.length === 0) {
                    //delete empty text shape on selection
                    this.canvas.removeLayer(this._activeShape);
                }
            }
            this._activeShape = null;
            this.canvas.notify({ eventName: 'selectionChange', object: this.canvas, shape: null });
        }

        // Hit-test from topmost shape
        for (let i = shapes.length - 1; i >= 0; i--) {
            const s = shapes.getItem(i);
            if (!s.visible || s.locked) continue;
            if (s.hitTest(point.x, point.y, this.canvas._currentDisplayScale)) {
                this._activeShape = s;
                this.canvas.notify({ eventName: 'selectionChange', object: this.canvas, shape: s });
                // Start move immediately
                this._action = {
                    start: true,
                    kind: 'move',
                    startX: point.x,
                    startY: point.y,
                    origX: s.x,
                    origY: s.y
                };
                this.canvas.redraw();
                return;
            }
        }
        this.canvas.redraw();
    }

    onTouchMove(point: TouchPoint): void {
        if (!this._action || !this._activeShape) return;
        if (this._action.kind === 'move') {
            if (this._action.start) {
                this.canvas.pushUndoSnapshot();
                this._action.start = false;
            }
            const dx = point.x - this._action.startX;
            const dy = point.y - this._action.startY;
            this._activeShape.applyTranslate(this._action.origX + dx, this._action.origY + dy);
            // Keep the TextField positioned over the shape while it moves
            if (this._activeShape instanceof TextShape) {
                this.canvas.updateTextEditLayout();
            }
            this.canvas.redraw();
        } else if (this._action.kind === 'resize') {
            if (this._action.start) {
                this.canvas.pushUndoSnapshot();
                this._action.start = false;
            }
            this._applyResize(point);
            // Keep the TextField positioned over the shape while it resizes
            if (this._activeShape instanceof TextShape) {
                this.canvas.updateTextEditLayout();
            }
            this.canvas.redraw();
        } else if (this._action.kind === 'rotate') {
            if (this._action.start) {
                this.canvas.pushUndoSnapshot();
                this._action.start = false;
            }
            this._applyRotation(point);
            this.canvas.redraw();
        }
    }

    onTouchEnd(_point: TouchPoint): void {
        const action = this._action;
        this._action = null;
        // Re-position the TextField if we just moved/resized a TextShape
        if (this._activeShape instanceof TextShape) {
            // If this was a simple tap (no drag occurred, start is still true), pass the
            // tap position so the cursor is placed where the user tapped.
            const tapPoint = action?.kind === 'move' && action.start ? { x: action.startX, y: action.startY } : null;
            this.canvas.beginTextEdit(this._activeShape, tapPoint);
        }
    }

    onTouchCancel(_point: TouchPoint): void {
        this._action = null;
    }

    /** Called when the SelectMode is switched away from. Commits any pending text edit and clears the selection. */
    deactivate(): void {
        if (this._activeShape instanceof TextShape) {
            this.canvas.endTextEdit();
        }
        this._activeShape = null;
        this._action = null;
    }

    drawOverlay(canvas: Canvas): void {
        if (this._activeShape) {
            // Delegate to DrawingCanvas so the overlay can be customised at the canvas level
            this.canvas.drawShapeSelectionOverlay(canvas, this._activeShape);
        }
    }

    private _hitTestHandle(shape: DrawableShape, point: TouchPoint): HandlePoint | null {
        const handles = shape.getHandles(this.canvas._currentDisplayScale);
        for (const h of handles) {
            if (Math.hypot(point.x - h.x, point.y - h.y) <= HANDLE_RADIUS) {
                return h;
            }
        }
        return null;
    }

    private _startTransform(handle: HandlePoint, point: TouchPoint): void {
        const shape = this._activeShape;
        const b = shape.getBounds();
        const cx = (b.left + b.right) / 2;
        const cy = (b.top + b.bottom) / 2;

        if (handle.type === 'rotate') {
            this._action = {
                start: true,
                kind: 'rotate',
                cx,
                cy,
                startAngle: Math.atan2(point.y - cy, point.x - cx),
                origRotation: shape.rotation
            };
        } else {
            const x0 = b.left, y0 = b.top, w0 = b.right - b.left, h0 = b.bottom - b.top;
            const right = x0 + w0, bottom = y0 + h0;

            // The fixed anchor is the handle OPPOSITE to the one being dragged.
            // Its canvas-space position (before rotation):
            let alx: number, aly: number;
            switch (handle.type) {
                case 'ml': alx = right;      aly = y0 + h0 / 2; break; // right-mid
                case 'mr': alx = x0;         aly = y0 + h0 / 2; break; // left-mid
                case 'tm': alx = x0 + w0 / 2; aly = bottom;     break; // bottom-mid
                case 'bm': alx = x0 + w0 / 2; aly = y0;         break; // top-mid
                case 'tl': alx = right;      aly = bottom;       break; // bottom-right
                case 'tr': alx = x0;         aly = bottom;       break; // bottom-left
                case 'bl': alx = right;      aly = y0;           break; // top-right
                default:   alx = x0;         aly = y0;           break; // br → top-left
            }

            // Compute the world-space position of the fixed anchor once.
            // (rotation is applied around the AABB centre in onDraw)
            const anchorWorld =
                shape.rotation !== 0
                    ? DrawableShape.rotatePoint(alx, aly, cx, cy, shape.rotation)
                    : { x: alx, y: aly };

            this._action = {
                start: true,
                kind: 'resize',
                handle,
                origBounds: { x: x0, y: y0, w: w0, h: h0 },
                anchorWorld
            };
        }
    }

    private _applyResize(point: TouchPoint): void {
        if (this._action?.kind !== 'resize' || !this._activeShape) return;
        const { handle, origBounds, anchorWorld } = this._action;
        const shape = this._activeShape;

        const rotationDeg = shape.rotation; // degrees, constant throughout this resize gesture
        const { x: x0, y: y0, w: w0, h: h0 } = origBounds;
        const right = x0 + w0, bottom = y0 + h0;
        const cx0 = x0 + w0 / 2, cy0 = y0 + h0 / 2;

        // Un-rotate the touch point to the shape's local (unrotated) space so the
        // resize math is axis-aligned — we always use the ORIGINAL centre as pivot.
        const lp = rotationDeg !== 0 ? DrawableShape.rotatePoint(point.x, point.y, cx0, cy0, -rotationDeg) : point;

        const origAspect = w0 / (h0 || 1);
        const isCorner = handle.type === 'tl' || handle.type === 'tr' || handle.type === 'bl' || handle.type === 'br';

        // Compute new dimensions from the un-rotated touch position.
        let wn: number, hn: number;
        switch (handle.type) {
            case 'tl': wn = right - lp.x; hn = bottom - lp.y; break;
            case 'tm': wn = w0;            hn = bottom - lp.y; break;
            case 'tr': wn = lp.x - x0;    hn = bottom - lp.y; break;
            case 'ml': wn = right - lp.x; hn = h0;            break;
            case 'mr': wn = lp.x - x0;    hn = h0;            break;
            case 'bl': wn = right - lp.x; hn = lp.y - y0;    break;
            case 'bm': wn = w0;            hn = lp.y - y0;    break;
            default:   wn = lp.x - x0;    hn = lp.y - y0;    break; // 'br'
        }

        wn = Math.max(MIN_SHAPE_SIZE, wn);
        hn = Math.max(MIN_SHAPE_SIZE, hn);

        // Corner handles maintain aspect ratio.
        if (isCorner && h0 > 0) {
            if (wn / hn > origAspect) {
                wn = hn * origAspect;
            } else {
                hn = wn / origAspect;
            }
            wn = Math.max(MIN_SHAPE_SIZE, wn);
            hn = Math.max(MIN_SHAPE_SIZE, hn);
        }

        // -----------------------------------------------------------------------
        // Anchor-preserving position correction
        //
        // After changing (w, h) the AABB centre shifts, which also shifts the
        // world-space rotation pivot → the "fixed" opposite side would drift.
        //
        // Fix: compute the new AABB centre in world space such that the fixed
        // anchor (captured at gesture start) stays exactly at anchorWorld.
        //
        //   anchor_world = c_new + R(θ) · anchor_relative_new
        //   ⟹ c_new = anchor_world − R(θ) · anchor_relative_new
        //
        // anchor_relative_new is the anchor's offset from the new centre in local space:
        // it is always ±wn/2 or ±hn/2 depending on which edge the anchor is on.
        // -----------------------------------------------------------------------
        let arx: number, ary: number; // anchor relative to new centre (local space)
        switch (handle.type) {
            case 'ml': arx =  wn / 2; ary =  0;       break; // anchor = right-mid
            case 'mr': arx = -wn / 2; ary =  0;       break; // anchor = left-mid
            case 'tm': arx =  0;      ary =  hn / 2;  break; // anchor = bottom-mid
            case 'bm': arx =  0;      ary = -hn / 2;  break; // anchor = top-mid
            case 'tl': arx =  wn / 2; ary =  hn / 2;  break; // anchor = bottom-right
            case 'tr': arx = -wn / 2; ary =  hn / 2;  break; // anchor = bottom-left
            case 'bl': arx =  wn / 2; ary = -hn / 2;  break; // anchor = top-right
            default:   arx = -wn / 2; ary = -hn / 2;  break; // br → anchor = top-left
        }

        const rad = (rotationDeg * Math.PI) / 180;
        const cosTheta = Math.cos(rad);
        const sinTheta = Math.sin(rad);

        // c_new (world) = anchor_world - R(θ) * anchor_rel
        const cNewX = anchorWorld.x - (cosTheta * arx - sinTheta * ary);
        const cNewY = anchorWorld.y - (sinTheta * arx + cosTheta * ary);

        // top-left in canvas space
        const xn = cNewX - wn / 2;
        const yn = cNewY - hn / 2;

        shape.applyResize(xn, yn, wn, hn);
    }

    private _applyRotation(point: TouchPoint): void {
        if (this._action?.kind !== 'rotate' || !this._activeShape) return;
        const { cx, cy, origRotation, startAngle } = this._action;
        const currentAngle = Math.atan2(point.y - cy, point.x - cx);
        const delta = (currentAngle - startAngle) * (180 / Math.PI);
        this._activeShape.rotation = origRotation + delta;
    }
    onSnapShotRestored() {
        this.setSelectedShape(null);
    }
    onLayerRemoved(shape: DrawableShape, index: number) {
        console.log('onLayerRemoved', shape.id, this._activeShape?.id);
        if (shape.id === this._activeShape?.id) {
            this.setSelectedShape(null);
        }
    }
}
