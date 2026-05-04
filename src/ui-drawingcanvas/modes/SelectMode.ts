import { Color } from '@nativescript/core';
import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import { DrawableShape, HandlePoint } from '../shapes/DrawableShape';

type TransformAction =
    | { kind: 'move'; startX: number; startY: number; origX: number; origY: number }
    | { kind: 'resize'; handle: HandlePoint; origBounds: { x: number; y: number; w: number; h: number } }
    | { kind: 'rotate'; cx: number; cy: number; startAngle: number; origRotation: number }
    | null;

/** Handle hit-test radius in dp */
const HANDLE_RADIUS = 14;

export default class SelectMode extends DrawingMode {
    readonly name = 'select';

    private _action: TransformAction = null;
    private _activeShape: DrawableShape | null = null;

    get selectedShape(): DrawableShape | null {
        return this._activeShape;
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
                    kind: 'move',
                    startX: point.x,
                    startY: point.y,
                    origX: this._activeShape.x,
                    origY: this._activeShape.y
                };
                return;
            }
            // Deselect
            this._activeShape = null;
            this.canvas.notify({ eventName: 'selectionChange', object: this.canvas, shape: null });
        }

        // Hit-test from topmost shape
        for (let i = shapes.length - 1; i >= 0; i--) {
            const s = shapes[i];
            if (!s.visible || s.locked) continue;
            if (s.hitTest(point.x, point.y)) {
                this._activeShape = s;
                this.canvas.notify({ eventName: 'selectionChange', object: this.canvas, shape: s });
                // Start move immediately
                this.canvas.pushUndoSnapshot();
                this._action = {
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
            const dx = point.x - this._action.startX;
            const dy = point.y - this._action.startY;
            this._activeShape.x = this._action.origX + dx;
            this._activeShape.y = this._action.origY + dy;
            this.canvas.redraw();
        } else if (this._action.kind === 'resize') {
            this._applyResize(point);
            this.canvas.redraw();
        } else if (this._action.kind === 'rotate') {
            this._applyRotation(point);
            this.canvas.redraw();
        }
    }

    onTouchEnd(_point: TouchPoint): void {
        this._action = null;
    }

    onTouchCancel(_point: TouchPoint): void {
        this._action = null;
    }

    drawOverlay(canvas: Canvas): void {
        if (this._activeShape) {
            this._activeShape.drawSelectionOverlay(canvas);
        }
    }

    private _hitTestHandle(shape: DrawableShape, point: TouchPoint): HandlePoint | null {
        const handles = shape.getHandles();
        for (const h of handles) {
            if (Math.hypot(point.x - h.x, point.y - h.y) <= HANDLE_RADIUS) {
                return h;
            }
        }
        return null;
    }

    private _startTransform(handle: HandlePoint, point: TouchPoint): void {
        const shape = this._activeShape!;
        const b = shape.getBounds();

        if (handle.type === 'rotate') {
            const cx = b.left + (b.right - b.left) / 2;
            const cy = b.top + (b.bottom - b.top) / 2;
            this._action = {
                kind: 'rotate',
                cx,
                cy,
                startAngle: Math.atan2(point.y - cy, point.x - cx),
                origRotation: shape.rotation
            };
        } else {
            this._action = {
                kind: 'resize',
                handle,
                origBounds: { x: shape.x, y: shape.y, w: shape.width, h: shape.height }
            };
        }
    }

    private _applyResize(point: TouchPoint): void {
        if (this._action?.kind !== 'resize' || !this._activeShape) return;
        const { handle, origBounds } = this._action;
        const shape = this._activeShape;

        let x = origBounds.x;
        let y = origBounds.y;
        let w = origBounds.w;
        let h = origBounds.h;

        const right = origBounds.x + origBounds.w;
        const bottom = origBounds.y + origBounds.h;

        switch (handle.type) {
            case 'tl':
                x = Math.min(point.x, right - 2);
                y = Math.min(point.y, bottom - 2);
                w = right - x;
                h = bottom - y;
                break;
            case 'tm':
                y = Math.min(point.y, bottom - 2);
                h = bottom - y;
                break;
            case 'tr':
                y = Math.min(point.y, bottom - 2);
                w = Math.max(2, point.x - origBounds.x);
                h = bottom - y;
                break;
            case 'ml':
                x = Math.min(point.x, right - 2);
                w = right - x;
                break;
            case 'mr':
                w = Math.max(2, point.x - origBounds.x);
                break;
            case 'bl':
                x = Math.min(point.x, right - 2);
                w = right - x;
                h = Math.max(2, point.y - origBounds.y);
                break;
            case 'bm':
                h = Math.max(2, point.y - origBounds.y);
                break;
            case 'br':
                w = Math.max(2, point.x - origBounds.x);
                h = Math.max(2, point.y - origBounds.y);
                break;
        }

        shape.x = x;
        shape.y = y;
        shape.width = w;
        shape.height = h;
    }

    private _applyRotation(point: TouchPoint): void {
        if (this._action?.kind !== 'rotate' || !this._activeShape) return;
        const { cx, cy, startAngle, origRotation } = this._action;
        const currentAngle = Math.atan2(point.y - cy, point.x - cx);
        const delta = (currentAngle - startAngle) * (180 / Math.PI);
        this._activeShape.rotation = origRotation + delta;
    }
}
