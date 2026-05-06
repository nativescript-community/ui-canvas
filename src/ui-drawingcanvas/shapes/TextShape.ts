import { Canvas, LayoutAlignment, StaticLayout, Style } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core';
import { BoundingBox, DrawableShape } from './DrawableShape';

export interface TextShapeJSON {
    txt?: string;
    fs?: number;
    ff?: string;
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
}

/** Default line-height multiplier used when font metrics are unavailable */
const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.4;

export default class TextShape extends DrawableShape {
    static PADDING = 12;
    /** The displayed text */
    text: string = '';
    /** Font size in dp */
    fontSize: number = 16;
    /** Font family */
    fontFamily: string = '';
    /** Bold */
    bold: boolean = false;
    /** Italic */
    italic: boolean = false;
    /** Text alignment */
    textAlign: 'left' | 'center' | 'right' = 'left';

    insideHorizontalPadding = 0;
    insideVerticalPadding = __IOS__ ? -0.5 : 0;

    get shapeType(): string {
        return 'text';
    }

    getBounds(): BoundingBox {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height
        };
    }
    getTransformedBounds(displayScale: number = 1): BoundingBox {
        const b = this.getBounds();
        const delta = TextShape.PADDING / displayScale;
        return {
            left: b.left - delta,
            top: b.top - delta,
            right: b.right + delta,
            bottom: b.bottom + delta
        };
    }

    getPaint() {
        const paint = this._paint;
        if (__IOS__) {
            // fix for UITextView vs NSAttributedString != kernel
            paint.letterSpacing = 0.035;
        }
        paint.setStyle(Style.FILL);
        paint.setColor(this.strokeColor ?? new Color('#000000'));
        if (this.opacity !== 1) {
            paint.setAlpha(Math.round(this.opacity * 255));
        }
        paint.setTextSize(this.fontSize);
        if (this.fontFamily) {
            paint.setFontFamily(this.fontFamily);
        }
        if (this.bold) {
            paint.setFontWeight('bold');
        }
        if (this.italic) {
            paint.setFontStyle('italic');
        }
        return paint;
    }

    draw(canvas: Canvas, displayScale?: number): void {
        console.log('draw text', this.text);
        if (!this.text) return;
        this.applyPaint(false);
        const b = this.getBounds();

        const staticlayout = this.getStaticLayout(b);
        // Draw text at the left edge (width clipping is left to the canvas)
        canvas.save();
        const hPadding = this.insideHorizontalPadding / displayScale;
        const vPadding = this.insideVerticalPadding / displayScale;
        // canvas.clipRect(b.left, b.top, b.right, b.bottom);
        canvas.translate(b.left + hPadding, b.top + vPadding);

        staticlayout.draw(canvas);
        canvas.restore();
    }

    getStaticLayout(b: BoundingBox) {
        const paint = this.getPaint();
        return new StaticLayout(this.text, paint, b.right - b.left - 2 * this.insideHorizontalPadding, LayoutAlignment.ALIGN_NORMAL);
    }

    protected toJSONData(): Record<string, any> {
        const data: Record<string, any> = {};
        if (this.text) data.txt = this.text;
        if (this.fontSize !== 16) data.fs = this.fontSize;
        if (this.fontFamily) data.ff = this.fontFamily;
        if (this.bold) data.bold = true;
        if (this.italic) data.italic = true;
        if (this.textAlign !== 'left') data.align = this.textAlign;
        return data;
    }

    protected fromJSONData(data: any): void {
        this.text = data.txt ?? '';
        this.fontSize = data.fs ?? 16;
        this.fontFamily = data.ff ?? '';
        this.bold = data.bold ?? false;
        this.italic = data.italic ?? false;
        this.textAlign = data.align ?? 'left';
    }

    public resizeIfNeeded() {
        const b = this.getBounds();
        const staticlayout = this.getStaticLayout(b);
        const height = staticlayout.getHeight();
        if (height > b.bottom - b.top) {
            this.applyResize(b.left, b.top, b.right - b.left, height);
            return true;
        }
    }
}
