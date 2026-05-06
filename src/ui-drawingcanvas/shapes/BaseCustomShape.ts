import { Canvas } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape } from './DrawableShape';

export default abstract class BaseCustomShape extends DrawableShape {
    protected static readonly BOUNDS_AFFECTING_PROPS = new Set(['x', 'y', 'scaleX', 'scaleY', 'strokeWidth']);

    protected _bounds: BoundingBox | null = null;

    protected get boundsAffectingProps() {
        return BaseCustomShape.BOUNDS_AFFECTING_PROPS;
    }

    protected _invalidateBounds(): void {
        this._bounds = null;
    }

    /** Raw bounding box of the stored points (no translation / scaling applied). */
    protected abstract _getRawBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null;
    protected abstract _draw(canvas: Canvas);

    getBounds(): BoundingBox {
        if (this._bounds) return this._bounds;
        const raw = this._getRawBounds();
        if (!raw) {
            this._bounds = { left: this.x, top: this.y, right: this.x, bottom: this.y };
            return this._bounds;
        }
        const { maxX, maxY, minX, minY } = raw;
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
        this._draw(canvas);
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
        const { maxX, maxY, minX, minY } = raw;
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

    notifyPropertyChange(propertyName: string, value: any, oldValue?: any): void {
        super.notifyPropertyChange(propertyName, value, oldValue);
        if (this.boundsAffectingProps.has(propertyName)) {
            this._invalidateBounds();
        }
    }
}
