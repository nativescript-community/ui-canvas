import { Canvas, CanvasView, Paint, PorterDuffXfermode } from '@nativescript-community/ui-canvas';
import { File, ImageAsset, Screen, Utils, knownFolders, path } from '@nativescript/core';

import { SVG as SVGBase, xfermodeFromString } from './canvas.common';
import { getSVGKImage } from './index.ios';
export { CanvasSVG } from './canvas.common';

let bgdImagePaint: Paint;
function getRenderer(src: string | ImageAsset | File) {
    if (!src) {
        return null;
    }
    let imagePath: string;
    if (src instanceof File) {
        return SVGRenderer.alloc().initWithInputStream(NSInputStream.alloc().initWithFileAtPath(src.path));
    } else if (src instanceof ImageAsset) {
        imagePath = src.ios;
    } else {
        imagePath = src;
    }
    if (Utils.isFileOrResourcePath(imagePath)) {
        if (imagePath.indexOf(Utils.RESOURCE_PREFIX) === 0) {
            const resName = imagePath.substr(Utils.RESOURCE_PREFIX.length);
            return SVGRenderer.alloc().initWithResourceNameInBundle(resName, NSBundle.mainBundle);
        } else if (imagePath.indexOf('~/') === 0) {
            const strPath = path.join(knownFolders.currentApp().path, imagePath.replace('~/', ''));
            return SVGRenderer.alloc().initWithContentsOfURL(NSURL.fileURLWithPath(strPath));
        } else if (imagePath.indexOf('/') === 0) {
            return SVGRenderer.alloc().initWithContentsOfURL(NSURL.fileURLWithPath(imagePath));

            // return com.caverock.androidsvg.SVG.getFromInputStream(stream);
        }
    }
    return SVGRenderer.alloc().initWithString(imagePath);
}

export class SVG extends SVGBase {
    // _renderer: SVGRenderer;
    _svgkimage: SVGKImage;
    _src: string | File | ImageAsset;
    _cachedImage: UIImage;

    makeScales(availableWidth, availableHeight) {
        const width = this.getWidth(availableWidth, availableHeight);
        const height = this.getHeight(availableWidth, availableHeight);
        const svgSize = this._svgkimage.size;
        // const svgSize = this._renderer.viewRect && this._renderer.viewRect.size;

        const nativeWidth = svgSize ? svgSize.width : width;
        const nativeHeight = svgSize ? svgSize.height : height;

        const nativeAspectRatio = nativeWidth / nativeHeight;
        const boundedAspectRatio = width / height;

        let paintedWidth = width;
        let paintedHeight = height;

        const myGravity = this._stretch;
        if (myGravity === 'aspectFit') {
            if (nativeAspectRatio >= boundedAspectRatio) {
                paintedHeight = paintedWidth / nativeAspectRatio;
            } else {
                paintedWidth = paintedHeight * nativeAspectRatio;
            }
            const xOrigin = (width - paintedWidth) / 2.0;
            const yOrigin = (height - paintedHeight) / 2.0;
            return { px: xOrigin, py: yOrigin, sx: paintedWidth / nativeWidth, sy: paintedHeight / nativeHeight };
        } else if (myGravity === 'aspectFill') {
            if (nativeAspectRatio <= boundedAspectRatio) {
                paintedHeight = paintedWidth / nativeAspectRatio;
            } else {
                paintedWidth = paintedHeight * nativeAspectRatio;
            }
            const xOrigin = (width - paintedWidth) / 2.0;
            const yOrigin = (height - paintedHeight) / 2.0;
            return { px: xOrigin, py: yOrigin, sx: paintedWidth / nativeWidth, sy: paintedHeight / nativeHeight };
        } else {
            // flipped
            return { px: 0, py: 0, sx: width / nativeWidth, sy: height / nativeHeight };
        }
    }

    getWidth(availableWidth, availableHeight) {
        if (this.width) {
            return super.getWidth(availableWidth, availableHeight);
        }
        const svgSize = this._svgkimage.size;
        // const svgSize = this._renderer.viewRect && this._renderer.viewRect.size;
        if (svgSize) {
            const nativeWidth = svgSize.width;
            const nativeHeight = svgSize.height;
            const width = Math.min(nativeWidth, availableWidth);
            const height = this.height ? this.getHeight(availableWidth, availableHeight) : Math.min(nativeHeight, availableHeight);
            let paintedWidth = width;
            let paintedHeight = height;
            const nativeAspectRatio = nativeWidth / nativeHeight;
            const boundedAspectRatio = width / height;
            if (this._stretch === 'aspectFit') {
                if (nativeAspectRatio >= boundedAspectRatio) {
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedWidth;
            } else if (this._stretch === 'aspectFill') {
                if (nativeAspectRatio <= boundedAspectRatio) {
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedWidth;
            }
            return paintedWidth;
        }

        return 0;
    }
    getHeight(availableWidth: number, availableHeight: number) {
        if (this.height) {
            return super.getHeight(availableWidth, availableHeight);
        }
        const svgSize = this._svgkimage.size;
        // const svgSize = this._renderer.viewRect && this._renderer.viewRect.size;
        if (svgSize) {
            const nativeWidth = svgSize.width;
            const nativeHeight = svgSize.height;
            const height = Math.min(nativeHeight, availableHeight);
            const width = this.width ? this.getWidth(availableWidth, availableHeight) : Math.min(nativeHeight, availableHeight);
            let paintedWidth = width;
            let paintedHeight = height;
            const nativeAspectRatio = nativeWidth / nativeHeight;
            const boundedAspectRatio = width / height;
            if (this._stretch === 'aspectFit') {
                if (nativeAspectRatio >= boundedAspectRatio) {
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedHeight;
            } else if (this._stretch === 'aspectFill') {
                if (nativeAspectRatio <= boundedAspectRatio) {
                    paintedHeight = paintedWidth / nativeAspectRatio;
                } else {
                    paintedWidth = paintedHeight * nativeAspectRatio;
                }
                return paintedHeight;
            }
            return paintedHeight;
        }

        return 0;
    }
    drawOnCanvas(canvas: Canvas, parent: CanvasView) {
        if (this._svgkimage) {
            // const startTime = new Date().valueOf();
            // const wasCached = !!this._cachedImage;
            const availableWidth = Utils.layout.toDevicePixels(canvas.getWidth());
            const availableHeight = Utils.layout.toDevicePixels(canvas.getHeight());

            const scales = this.makeScales(availableWidth, availableHeight);
            canvas.save();
            if (this.blendingMode || this.cache) {
                let newImage: UIImage = this._cachedImage;
                if (!this.cache || !this._cachedImage) {
                    const svgSize = this._svgkimage.size;
                    // const svgSize = this._renderer.viewRect && this._renderer.viewRect.size;
                    UIGraphicsBeginImageContextWithOptions(svgSize, false, Screen.mainScreen.scale);
                    const _context = UIGraphicsGetCurrentContext();
                    this._svgkimage.renderInContext(_context);

                    newImage = UIGraphicsGetImageFromCurrentImageContext();
                    UIGraphicsEndImageContext();
                    if (this.cache) {
                        this._cachedImage = newImage;
                    }
                }

                // const coreImage = CIImage.alloc().initWithCGImage(_newImage.CGImage);

                // const filter = CIFilter.filterWithName('CIMultiplyBlendMode');
                // filter.setValueForKey(coreImage, 'inputImage');

                // const output = filter.outputImage;
                // const context = CIContext.context();
                // const CGImage = context.createCGImageFromRect(output, output.extent);

                if (this.blendingMode) {
                    if (!bgdImagePaint) {
                        bgdImagePaint = new Paint();
                    }
                    bgdImagePaint.setXfermode(new PorterDuffXfermode(xfermodeFromString(this.blendingMode)));
                }
                canvas.translate(scales.px, scales.py);
                canvas.scale(scales.sx, scales.sy, 0, 0);
                canvas.drawBitmap(newImage, 0, 0, bgdImagePaint);
            } else {
                canvas.translate(scales.px, scales.py);
                canvas.scale(scales.sx, scales.sy, 0, 0);
                this._svgkimage.renderInContext(canvas.ctx);
            }
            // console.log('drawSvg', wasCached, Date.now() - startTime, 'ms');
            canvas.restore();
        }
    }
    set src(value: string | File | ImageAsset) {
        this._src = value;
        this._svgkimage = getSVGKImage(value);
        // this._renderer = getRenderer(value);
    }
    get src(): string | File | ImageAsset {
        return this._src;
    }

    _stretch: 'fill' | 'aspectFill' | 'aspectFit';
    set stretch(value: 'fill' | 'aspectFill' | 'aspectFit') {
        this._stretch = value;
    }
    get stretch(): 'fill' | 'aspectFill' | 'aspectFit' {
        return this._stretch;
    }
}
