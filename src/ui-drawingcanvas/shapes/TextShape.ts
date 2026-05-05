import { Color } from '@nativescript/core';
import { Canvas, Paint, Style } from '@nativescript-community/ui-canvas';
import { BoundingBox, DrawableShape } from './DrawableShape';

export interface TextShapeJSON {
    txt?: string;
    fs?: number;
    ff?: string;
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
}

export default class TextShape extends DrawableShape {
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

    hitTest(px: number, py: number): boolean {
        const b = this.getBounds();
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
    }

    draw(canvas: Canvas): void {
        if (!this.text) return;
        const b = this.getBounds();
        const paint = this._paint;
        paint.setAntiAlias(true);
        paint.setStyle(Style.FILL);
        paint.setColor(this.strokeColor ?? new Color('#000000'));
        paint.setAlpha(Math.round(this.opacity * 255));
        paint.setTextSize(this.fontSize);
        if (this.fontFamily) paint.setFontFamily(this.fontFamily);
        if (this.bold) paint.setFontWeight('bold');
        if (this.italic) paint.setFontStyle('italic');

        // Baseline y: top of bounds + ascent offset
        const fm = paint.getFontMetrics();
        const ascent = fm ? -fm.ascent : this.fontSize;
        const baselineY = b.top + ascent;

        // Draw text at the left edge (width clipping is left to the canvas)
        canvas.drawText(this.text, b.left, baselineY, paint);
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

    /** Measure the preferred width/height for the current text + font */
    measureSize(canvas: Canvas): { width: number; height: number } {
        if (!this.text) return { width: 60, height: this.fontSize * 1.4 };
        const paint = new Paint();
        paint.setTextSize(this.fontSize);
        if (this.fontFamily) paint.setFontFamily(this.fontFamily);
        if (this.bold) paint.setFontWeight('bold');
        if (this.italic) paint.setFontStyle('italic');
        const w = paint.measureText(this.text);
        const fm = paint.getFontMetrics();
        const h = fm ? fm.descent - fm.ascent : this.fontSize * 1.4;
        return { width: w, height: h };
    }
}
