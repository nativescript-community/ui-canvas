import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
import { File, ImageAsset, Length, Screen, Utils } from '@nativescript/core';
import { SVG as SVGBase, xfermodeFromString } from './canvas.common';
import { getSVG } from './index.android';
export { CanvasSVG } from './canvas.common';

let bgdImagePaint: android.graphics.Paint;

export class SVG extends SVGBase {
    _svg: com.caverock.androidsvg.SVG;
    _src: string | File | ImageAsset;
    _cachedImage: android.graphics.Bitmap;
    private renderOptions = new com.caverock.androidsvg.RenderOptions();

    getWidth(availableWidth, availableHeight) {
        if (this.width) {
            return super.getWidth(availableWidth, availableHeight);
        }
        const svg = this._svg;
        if (!svg) {
            return 0;
        }
        const viewRect = svg.getDocumentViewBox();
        if (viewRect) {
            const nativeWidth = viewRect.width();
            const nativeHeight = viewRect.height();
            const width = Math.min(nativeWidth, availableWidth);
            const height = this.height ? this.getHeight(availableWidth, availableHeight) : Math.min(nativeHeight, availableHeight);
            let paintedWidth = width;
            let paintedHeight = height;
            const nativeAspectRatio = nativeWidth / nativeHeight;
            const boundedAspectRatio = width / height;
            if (this._stretch === 'aspectFit') {
                if (nativeAspectRatio >= boundedAspectRatio) {
                    // blank space on top and bottom
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedWidth;
            } else if (this._stretch === 'aspectFill') {
                if (nativeAspectRatio <= boundedAspectRatio) {
                    // blank space on top and bottom
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedWidth;
            }
            return paintedWidth;
        }

        return svg.getDocumentWidth();
    }
    getHeight(availableWidth: number, availableHeight: number) {
        if (this.height) {
            return super.getHeight(availableWidth, availableHeight);
        }
        const svg = this._svg;
        if (!svg) {
            return 0;
        }
        const viewRect = svg.getDocumentViewBox();
        if (viewRect) {
            const nativeWidth = viewRect.width();
            const nativeHeight = viewRect.height();
            const height = Math.min(nativeHeight, availableHeight);
            const width = this.width ? this.getWidth(availableWidth, availableHeight) : Math.min(nativeHeight, availableHeight);
            let paintedWidth = width;
            let paintedHeight = height;
            const nativeAspectRatio = nativeWidth / nativeHeight;
            const boundedAspectRatio = width / height;
            if (this._stretch === 'aspectFit') {
                if (nativeAspectRatio >= boundedAspectRatio) {
                    // blank space on top and bottom
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedHeight;
            } else if (this._stretch === 'aspectFill') {
                if (nativeAspectRatio <= boundedAspectRatio) {
                    // blank space on top and bottom
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedHeight;
            }
            return paintedHeight;
        }

        return svg.getDocumentHeight();
    }
    drawOnCanvas(canvas: Canvas, parent: CanvasView) {
        const svg = this._svg;
        if (svg) {
            // const startTime = new Date().valueOf();
            // const wasCached = !!this._cachedImage;
            const availableWidth = Utils.layout.toDevicePixels(canvas.getWidth());
            const availableHeight = Utils.layout.toDevicePixels(canvas.getHeight());
            let options = this.renderOptions;
            const width = this.getWidth(availableWidth, availableHeight);
            const height = this.getHeight(availableWidth, availableHeight);
            // const box = svg.getDocumentViewBox();
            // const nativeWidth = box ? box.width() : width;
            // const nativeHeight = box ? box.height() : height;

            // const nativeAspectRatio = nativeWidth / nativeHeight;
            // const boundedAspectRatio = width / height;

            const paintedWidth = width;
            const paintedHeight = height;
            // does not seem like we need this. Handled by options?
            // if (nativeAspectRatio >= boundedAspectRatio) {
            //     paintedHeight = paintedWidth / nativeAspectRatio;
            // } else {
            //     paintedWidth = paintedHeight * nativeAspectRatio;
            // }
            const xOrigin = (width - paintedWidth) / 2.0;
            const yOrigin = (height - paintedHeight) / 2.0;
            options = options.preserveAspectRatio(this._preserveAspectRatio);

            if (this.blendingMode || this.cache) {
                let newBitmap: android.graphics.Bitmap = this._cachedImage;
                const scale = Screen.mainScreen.scale;
                if (!this.cache || !this._cachedImage) {
                    newBitmap = android.graphics.Bitmap.createBitmap(width * scale, height * scale, android.graphics.Bitmap.Config.ARGB_8888);
                    const bmcanvas = new android.graphics.Canvas(newBitmap);
                    bmcanvas.setDensity(Math.round(scale * 160));
                    svg.renderToCanvas(bmcanvas, options);
                    if (this.cache) {
                        this._cachedImage = newBitmap;
                    }
                }
                if (this.blendingMode) {
                    if (!bgdImagePaint) {
                        bgdImagePaint = new android.graphics.Paint();
                    }
                    bgdImagePaint.setXfermode(new android.graphics.PorterDuffXfermode(xfermodeFromString(this.blendingMode)));
                }
                canvas.drawBitmap(newBitmap, new android.graphics.Rect(0, 0, width * scale, height * scale), new android.graphics.Rect(xOrigin, yOrigin, width, height), bgdImagePaint as any);
            } else {
                options.viewPort(
                    -xOrigin + Utils.layout.toDeviceIndependentPixels(Length.toDevicePixels(this.left)),
                    -yOrigin + Utils.layout.toDeviceIndependentPixels(Length.toDevicePixels(this.top)),
                    width,
                    height
                );
                svg.renderToCanvas((canvas as any).getNative(), options);
            }
            // console.log('drawSvg', wasCached, Date.now() - startTime, 'ms');
        }
    }
    set src(value: string | File | ImageAsset) {
        this._src = value;
        this._svg = getSVG(value);
        if (this._svg) {
            this._svg.setDocumentWidth('100%');
            this._svg.setDocumentHeight('100%');
        }
    }
    get src(): string | File | ImageAsset {
        return this._src;
    }

    _stretch: 'fill' | 'aspectFill' | 'aspectFit';
    _preserveAspectRatio: com.caverock.androidsvg.PreserveAspectRatio = com.caverock.androidsvg.PreserveAspectRatio.LETTERBOX;
    set stretch(value: 'fill' | 'aspectFill' | 'aspectFit') {
        this._stretch = value;
        switch (value) {
            case 'aspectFill':
                this._preserveAspectRatio = com.caverock.androidsvg.PreserveAspectRatio.FULLSCREEN;
                break;
            case 'fill':
                this._preserveAspectRatio = com.caverock.androidsvg.PreserveAspectRatio.STRETCH;
                break;
            case 'aspectFit':
                this._preserveAspectRatio = com.caverock.androidsvg.PreserveAspectRatio.LETTERBOX;
                break;
        }
    }
    get stretch(): 'fill' | 'aspectFill' | 'aspectFit' {
        return this._stretch;
    }
}
