import { ImageSource } from '@nativescript/core';
import { Canvas, Paint } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape } from './DrawableShape';

export default class ImageShape extends DrawableShape {
    /** The image source to render */
    imageSource: ImageSource | null = null;
    /** Original src URI for JSON serialization (base64 or path) */
    imageSrc: string | null = null;

    get shapeType(): string {
        return 'image';
    }

    getBounds(): BoundingBox {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height
        };
    }

    hitTest(px: number, py: number): boolean {
        const b = this.getBounds();
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        if (!this.imageSource) return;
        const p = new Paint();
        p.setAntiAlias(true);
        p.setAlpha(Math.round(this.opacity * 255));
        p.setFilterBitmap(true);
        const native = this.imageSource.android ?? this.imageSource.ios;
        canvas.drawBitmap(native, this.x, this.y, p);
    }

    protected toJSONData(): Record<string, any> {
        const data: Record<string, any> = {};
        if (this.imageSrc) data.src = this.imageSrc;
        return data;
    }

    protected fromJSONData(data: any): void {
        this.imageSrc = data.src ?? null;
        if (this.imageSrc) {
            ImageSource.fromBase64(this.imageSrc)
                .then((src) => {
                    this.imageSource = src;
                    this.notifyPropertyChange('imageSource', src, null);
                })
                .catch(() => {});
        }
    }
}
