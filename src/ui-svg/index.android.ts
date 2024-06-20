import { File, Font, ImageAsset, ImageSource, Utils, knownFolders, path } from '@nativescript/core';
import { SVGView as SVGViewBase, srcProperty } from './index.common';

export function getSVG(src: string | ImageAsset | File) {
    if (!src) {
        return null;
    }
    let imagePath: string;
    if (src instanceof File) {
        return com.caverock.androidsvg.SVG.getFromInputStream(new java.io.FileInputStream(new java.io.File(src.path)));
    } else if (src instanceof ImageAsset) {
        imagePath = src.android;
    } else {
        imagePath = src;
    }
    if (Utils.isFileOrResourcePath(imagePath)) {
        const context = Utils.android.getApplicationContext();
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

// declare module '@nativescript-community/ui-canvas' {
//     interface Canvas {
//         _native: android.graphics.Canvas;
//     }
// }

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
        this.renderOptions.viewPort(0, 0, canvas.getWidth(), canvas.getHeight());
        // if (this._blendingMode !== undefined) {
        //     const picture = svg.renderToPicture(this.renderOptions);
        // }
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
        // if (getSDK() >= 28) {
        //     view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        // } else {
        //     view.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
        // }
        return view;
    }
    async handleSrc(src) {
        if (src instanceof Promise) {
            try {
                this.handleSrc(await src);
            } catch (error) {
                this.handleSrc(null);
            }
            return;
        } else if (typeof src === 'function') {
            let newSrc = src();
            if (newSrc instanceof Promise) {
                try {
                    await newSrc;
                } catch (error) {
                    newSrc = null;
                }
            }
            this.handleSrc(newSrc);
            return;
        }
        this.nativeViewProtected.setSvg(getSVG(src));
    }

    [srcProperty.setNative](value) {
        this.handleSrc(value);
        // this.nativeViewProtected.image = getSVGKImage(value);
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
