import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import { DrawableShape, HandlePoint } from '../shapes/DrawableShape';
import TextShape from '../shapes/TextShape';

type TransformAction =
    | { kind: 'move'; startX: number; startY: number; origX: number; origY: number; start: boolean }
    | { kind: 'resize'; handle: HandlePoint; origBounds: { x: number; y: number; w: number; h: number }; start: boolean }
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
            const tapPoint =
                action?.kind === 'move' && action.start
                    ? { x: action.startX, y: action.startY }
                    : null;
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
            this._action = {
                start: true,
                kind: 'resize',
                handle,
                origBounds: { x: b.left, y: b.top, w: b.right - b.left, h: b.bottom - b.top }
            };
        }
    }

    private _applyResize(point: TouchPoint): void {
        if (this._action?.kind !== 'resize' || !this._activeShape) return;
        const { handle, origBounds } = this._action;
        const shape = this._activeShape;

        // For rotated shapes, transform the touch point into the shape's local
        // (un-rotated) coordinate space so that the resize calculation is axis-aligned.
        let lp = point;
        if (shape.rotation !== 0) {
            const cx = origBounds.x + origBounds.w / 2;
            const cy = origBounds.y + origBounds.h / 2;
            lp = DrawableShape.rotatePoint(lp.x, lp.y, cx, cy, -shape.rotation);
        }

        let x = origBounds.x;
        let y = origBounds.y;
        let w = origBounds.w;
        let h = origBounds.h;

        const right = origBounds.x + origBounds.w;
        const bottom = origBounds.y + origBounds.h;
        const origAspect = origBounds.w / (origBounds.h || 1);
        const isCorner = handle.type === 'tl' || handle.type === 'tr' || handle.type === 'bl' || handle.type === 'br';

        switch (handle.type) {
            case 'tl': {
                const nx = Math.min(lp.x, right - MIN_SHAPE_SIZE);
                const ny = Math.min(lp.y, bottom - MIN_SHAPE_SIZE);
                x = nx;
                y = ny;
                w = right - nx;
                h = bottom - ny;
                break;
            }
            case 'tm':
                y = Math.min(lp.y, bottom - MIN_SHAPE_SIZE);
                h = bottom - y;
                break;
            case 'tr': {
                const ny = Math.min(lp.y, bottom - MIN_SHAPE_SIZE);
                w = Math.max(MIN_SHAPE_SIZE, lp.x - origBounds.x);
                h = bottom - ny;
                y = ny;
                break;
            }
            case 'ml':
                x = Math.min(lp.x, right - MIN_SHAPE_SIZE);
                w = right - x;
                break;
            case 'mr':
                w = Math.max(MIN_SHAPE_SIZE, lp.x - origBounds.x);
                break;
            case 'bl': {
                const nx = Math.min(lp.x, right - MIN_SHAPE_SIZE);
                w = right - nx;
                h = Math.max(MIN_SHAPE_SIZE, lp.y - origBounds.y);
                x = nx;
                break;
            }
            case 'bm':
                h = Math.max(MIN_SHAPE_SIZE, lp.y - origBounds.y);
                break;
            case 'br':
                w = Math.max(MIN_SHAPE_SIZE, lp.x - origBounds.x);
                h = Math.max(MIN_SHAPE_SIZE, lp.y - origBounds.y);
                break;
        }

        // Corner handles maintain aspect ratio
        if (isCorner && origBounds.h > 0) {
            if (w / h > origAspect) {
                w = h * origAspect;
            } else {
                h = w / origAspect;
            }
            // Re-anchor based on which corner is being dragged
            if (handle.type === 'tl') {
                x = right - w;
                y = bottom - h;
            } else if (handle.type === 'tr') {
                y = bottom - h;
            } else if (handle.type === 'bl') {
                x = right - w;
            }
            // 'br' anchors at top-left, w and h already set correctly
        }

        shape.applyResize(x, y, Math.max(MIN_SHAPE_SIZE, w), Math.max(MIN_SHAPE_SIZE, h));
    }

    private _applyRotation(point: TouchPoint): void {
        if (this._action?.kind !== 'rotate' || !this._activeShape) return;
        const { cx, cy, startAngle, origRotation } = this._action;
        const currentAngle = Math.atan2(point.y - cy, point.x - cx);
        const delta = (currentAngle - startAngle) * (180 / Math.PI);
        this._activeShape.rotation = origRotation + delta;
    }
}
