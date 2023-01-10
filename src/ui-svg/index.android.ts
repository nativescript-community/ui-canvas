import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
import { File, Font, ImageAsset, ImageSource, Length, Screen, Utils, knownFolders, path } from '@nativescript/core';
import { SVG as SVGBase, SVGView as SVGViewBase, srcProperty, xfermodeFromString } from './index.common';
export { CanvasSVG } from './index.common';

let SDK_INT = -1;
function getSDK() {
    if (SDK_INT === -1) {
        SDK_INT = android.os.Build.VERSION.SDK_INT;
    }
    return SDK_INT;
}
function getSVG(src: string | ImageAsset | File) {
    let imagePath: string;
    if (src instanceof File) {
        return com.caverock.androidsvg.SVG.getFromInputStream(new java.io.FileInputStream(new java.io.File(src.path)));
    } else if (src instanceof ImageAsset) {
        imagePath = src.android;
    } else {
        imagePath = src;
    }
    if (Utils.isFileOrResourcePath(imagePath)) {
        const context = Utils.ad.getApplicationContext();
        const res = context.getResources();
        if (!res) {
            return null;
        }

        if (imagePath.indexOf(Utils.RESOURCE_PREFIX) === 0) {
            const resName = imagePath.substr(Utils.RESOURCE_PREFIX.length);
            const identifier = res.getIdentifier(resName, 'drawable', Utils.ad.getApplication().getPackageName());
            return com.caverock.androidsvg.SVG.getFromResource(res, identifier);
        } else if (imagePath.indexOf('~/') === 0) {
            const strPath = path.join(knownFolders.currentApp().path, imagePath.replace('~/', ''));
            const javaFile = new java.io.File(strPath);
            const stream = new java.io.FileInputStream(javaFile);
            return com.caverock.androidsvg.SVG.getFromInputStream(stream);
        } else if (imagePath.indexOf('/') === 0) {
            const javaFile = new java.io.File(imagePath);
            const stream = new java.io.FileInputStream(javaFile);
            return com.caverock.androidsvg.SVG.getFromInputStream(stream);
        }
    }
    return com.caverock.androidsvg.SVG.getFromString(imagePath);
}

declare module '@nativescript-community/ui-canvas' {
    interface Canvas {
        _native: android.graphics.Canvas;
    }
}

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

        return 0;
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

        return 0;
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
            const box = svg.getDocumentViewBox();
            const nativeWidth = box ? box.width() : width;
            const nativeHeight = box ? box.height() : height;

            const nativeAspectRatio = nativeWidth / nativeHeight;
            const boundedAspectRatio = width / height;

            let paintedWidth = width;
            let paintedHeight = height;
            if (nativeAspectRatio >= boundedAspectRatio) {
                paintedHeight = paintedWidth / nativeAspectRatio;
            } else {
                paintedWidth = paintedHeight * nativeAspectRatio;
            }
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
                svg.renderToCanvas(canvas._native, options);
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

// export class SVGView extends SVGViewBase {
//     nativeViewProtected: com.caverock.androidsvg.SVGImageView;
//     createNativeView() {
//         return new com.caverock.androidsvg.SVGImageView(this._context);
//     }

//     [srcProperty.setNative](value) {
//         this.nativeViewProtected.setSVG(getSVG(value));
//     }
//     [stretchProperty.setNative](value: 'none' | 'aspectFill' | 'aspectFit' | 'fill') {
//         switch (value) {
//             case 'aspectFit':
//                 this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
//                 break;
//             case 'aspectFill':
//                 this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
//                 break;
//             case 'fill':
//                 this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
//                 break;
//             case 'none':
//             default:
//                 this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
//                 break;
//         }
//     }
// }

// @NativeClass
// class MySVG extends com.caverock.androidsvg.SVG {
//     renderToCanvas(canvas: android.graphics.Canvas, renderOptions: com.caverock.androidsvg.RenderOptions) {
//         if (renderOptions == null) {
//             renderOptions = new com.caverock.androidsvg.RenderOptions();
//         }

//         if (!renderOptions.hasViewPort()) {
//             renderOptions.viewPort(0, 0, canvas.getWidth(), canvas.getHeight());
//         }

//         const renderer = new (com as any).caverock.androidsvg.SVGAndroidRenderer(canvas, this.getRenderDPI(), null);

//         renderer.renderDocument(this, renderOptions);
//     }
// }

@NativeClass
class SVGExternalFileResolver extends com.caverock.androidsvg.SVGExternalFileResolver {
    resolveFont(fontFamily: string, fontWeight: number, fontStyle: string) {
        if (fontFamily) {
            fontFamily = fontFamily.replace(/\\\//, '/');
        }
        return new Font(fontFamily, undefined, fontStyle.toLowerCase() as any, (fontWeight + '') as any).getAndroidTypeface();
    }

    resolveImage(filename) {
        let bitmap = null;
        if (Utils.isDataURI(filename)) {
            const base64Data = filename.split(',')[1];
            if (base64Data !== undefined) {
                bitmap = ImageSource.fromBase64(base64Data);
            }
        } else if (Utils.isFileOrResourcePath(filename)) {
            if (filename.indexOf(Utils.RESOURCE_PREFIX) !== 0) {
                if (filename.indexOf('~/') === 0) {
                    filename = path.join(knownFolders.currentApp().path, filename.replace('~/', ''));
                }
            }
            bitmap = ImageSource.fromFileOrResourceSync(filename);
        }
        return bitmap;
    }
}

com.caverock.androidsvg.SVG.registerExternalFileResolver(new SVGExternalFileResolver());

@NativeClass
class MySVGView extends android.view.View {
    private _svg: com.caverock.androidsvg.SVG;
    private renderOptions = new com.caverock.androidsvg.RenderOptions();

    constructor(context) {
        super(context);
    }
    onDraw(canvas: android.graphics.Canvas) {
        const svg = this._svg;
        if (!svg) {
            return;
        }
        if (this._blendingMode !== undefined) {
            const picture = svg.renderToPicture(this.renderOptions);
        }
        svg.renderToCanvas(canvas, this.renderOptions);
    }
    _blendingMode: android.graphics.PorterDuff.Mode;
    setSvg(svg: com.caverock.androidsvg.SVG) {
        this._svg = svg;
        if (svg) {
            svg.setDocumentWidth('100%');
            svg.setDocumentHeight('100%');
        }
        this.invalidate();
    }
    setRatio(ratio: com.caverock.androidsvg.PreserveAspectRatio) {
        this.renderOptions.preserveAspectRatio(ratio);
    }
    aspectRatio: number;
    // _imageSourceAffectsLayout = false;
    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        const svg = this._svg;
        if (!svg) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            return;
        }
        // We don't call super because we measure native view with specific size.
        const width = Utils.layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = Utils.layout.getMeasureSpecMode(widthMeasureSpec);
        const height = Utils.layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = Utils.layout.getMeasureSpecMode(heightMeasureSpec);

        const image = svg.getDocumentViewBox();
        // const image = this.nativeViewProtected.image;

        // const measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        // const measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);

        const finiteWidth: boolean = widthMode === Utils.layout.EXACTLY;
        const finiteHeight: boolean = heightMode === Utils.layout.EXACTLY;
        // this._imageSourceAffectsLayout = !finiteWidth || !finiteHeight;
        if (image || this.aspectRatio > 0) {
            const nativeWidth = image ? Utils.layout.toDevicePixels(image.width()) : 0;
            const nativeHeight = image ? Utils.layout.toDevicePixels(image.height()) : 0;
            const imgRatio = nativeWidth / nativeHeight;
            const ratio = this.aspectRatio || imgRatio;
            if (finiteWidth || finiteHeight) {
                if (!finiteWidth) {
                    widthMeasureSpec = Utils.layout.makeMeasureSpec(height * ratio, Utils.layout.EXACTLY);
                }
                if (!finiteHeight) {
                    heightMeasureSpec = Utils.layout.makeMeasureSpec(width / ratio, Utils.layout.EXACTLY);
                }
            } else {
                const viewRatio = width / (height || 1000000000000);
                if (imgRatio > viewRatio) {
                    const w = Math.min(nativeWidth, width);
                    widthMeasureSpec = Utils.layout.makeMeasureSpec(w, Utils.layout.EXACTLY);
                    heightMeasureSpec = Utils.layout.makeMeasureSpec(w / ratio, Utils.layout.EXACTLY);
                } else {
                    const h = Math.min(nativeHeight, height);
                    heightMeasureSpec = Utils.layout.makeMeasureSpec(h, Utils.layout.EXACTLY);
                    widthMeasureSpec = Utils.layout.makeMeasureSpec(h * ratio, Utils.layout.EXACTLY);
                }
            }
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}

export class SVGView extends SVGViewBase {
    nativeViewProtected: MySVGView;
    createNativeView() {
        const view = new MySVGView(this._context);
        if (getSDK() >= 28) {
            view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        } else {
            view.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
        }
        return view;
    }

    [srcProperty.setNative](value) {
        // this.nativeViewProtected.image = getSVGKImage(value);
        this.nativeViewProtected.setSvg(getSVG(value));
        // if (this._imageSourceAffectsLayout) {
        //     this._imageSourceAffectsLayout = false;
        //     this.requestLayout();
        // }
    }
    // [stretchProperty.setNative](value: 'none' | 'aspectFill' | 'aspectFit' | 'fill') {
    //     // this.nativeViewProtected.contentMode = getUIImageScaleType(value);
    //     switch (value) {
    //         case 'aspectFill':
    //             this.nativeViewProtected.setRatio(com.caverock.androidsvg.PreserveAspectRatio.FULLSCREEN);
    //             // this.renderOptions.preserveAspectRatio(com.caverock.androidsvg.PreserveAspectRatio.FULLSCREEN);
    //             break;
    //         case 'fill':
    //             this.nativeViewProtected.setRatio(com.caverock.androidsvg.PreserveAspectRatio.STRETCH);
    //             // this.renderOptions.preserveAspectRatio(com.caverock.androidsvg.PreserveAspectRatio.STRETCH);
    //             break;
    //         case 'aspectFit':
    //             this.nativeViewProtected.setRatio(com.caverock.androidsvg.PreserveAspectRatio.LETTERBOX);
    //             // this.renderOptions.preserveAspectRatio(com.caverock.androidsvg.PreserveAspectRatio.LETTERBOX);
    //             break;
    //     }
    // }
}
