import { Canvas, CanvasView, Paint, PorterDuffXfermode } from '@nativescript-community/ui-canvas';
import { File, ImageAsset, Utils, knownFolders, path } from '@nativescript/core';
import { SVGView as SVGViewBase, srcProperty, stretchProperty } from './index.common';

function getUIImageScaleType(scaleType: string) {
    switch (scaleType) {
        case 'aspectFill':
            return UIViewContentMode.ScaleAspectFill;
        case 'aspectFit':
            return UIViewContentMode.ScaleAspectFit;
        case 'fill':
            return UIViewContentMode.ScaleToFill;
        case 'none':
            return UIViewContentMode.TopLeft;
        default:
            break;
    }
    return null;
}

export function getSVGKImage(src: string | ImageAsset | File) {
    if (!src) {
        return null;
    }
    let imagePath: string;
    if (src instanceof File) {
        return SVGKImage.alloc().initWithData(NSData.alloc().initWithContentsOfFile(src.path));
    } else if (src instanceof ImageAsset) {
        imagePath = src.ios;
    } else {
        imagePath = src;
    }
    if (Utils.isFileOrResourcePath(imagePath)) {
        if (imagePath.indexOf(Utils.RESOURCE_PREFIX) === 0) {
            const resName = imagePath.slice(Utils.RESOURCE_PREFIX.length);
            return SVGKImage.imageNamed(resName);
        } else if (imagePath.indexOf('~/') === 0) {
            const strPath = path.join(knownFolders.currentApp().path, imagePath.replace('~/', ''));
            return SVGKImage.imageWithContentsOfFile(strPath);
        } else if (imagePath.indexOf('/') === 0) {
            return SVGKImage.imageWithContentsOfFile(imagePath);
        }
    }

    return SVGKImage.imageWithSource(SVGKSourceString.sourceFromContentsOfString(imagePath));
}
declare module '@nativescript-community/ui-canvas' {
    interface Canvas {
        ctx: any; // CGContextRef
    }
}

export class SVGView extends SVGViewBase {
    // nativeViewProtected: SVGDocumentView;
    nativeViewProtected: SVGKFastImageView;
    createNativeView() {
        // const view = SVGDocumentView.alloc().init();
        const view = SVGKFastImageView.alloc().initWithFrame(CGRectZero);
        // view.beTransparent = true;
        view.backgroundColor = UIColor.clearColor;
        view.opaque = false;
        return view;
        // return SVGKLayeredImageView.alloc().initWithSVGKImage(SVGKImage.new());
    }
    aspectRatio: number;
    _imageSourceAffectsLayout = false;
    _setNativeClipToBounds() {
        // Always set clipsToBounds for images
        this.nativeViewProtected.clipsToBounds = true;
    }
    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        const svgImage = this.nativeViewProtected.image;
        if (!svgImage) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            return;
        }
        const width = Utils.layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = Utils.layout.getMeasureSpecMode(widthMeasureSpec);
        const height = Utils.layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = Utils.layout.getMeasureSpecMode(heightMeasureSpec);

        // const imageRect = svgImage.viewRect;
        const imageSize = svgImage.size;

        const finiteWidth: boolean = widthMode === Utils.layout.EXACTLY;
        const finiteHeight: boolean = heightMode === Utils.layout.EXACTLY;
        this._imageSourceAffectsLayout = !finiteWidth || !finiteHeight;
        if (imageSize || this.aspectRatio > 0) {
            const nativeWidth = imageSize ? Utils.layout.toDevicePixels(imageSize.width) : 0;
            const nativeHeight = imageSize ? Utils.layout.toDevicePixels(imageSize.height) : 0;
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
        this.nativeViewProtected.image = getSVGKImage(src);
        // this.nativeViewProtected.renderer = getRenderer(value);
        if (this._imageSourceAffectsLayout) {
            this._imageSourceAffectsLayout = false;
            this.requestLayout();
        }
    }

    [srcProperty.setNative](value) {
        this.handleSrc(value);
    }
    [stretchProperty.setNative](value: 'none' | 'aspectFill' | 'aspectFit' | 'fill') {
        this.nativeViewProtected.contentMode = getUIImageScaleType(value);
        // switch (value) {
        //     case 'aspectFit':
        //         this.nativeViewProtected.layer.contentsGravity = kCAGravityResizeAspect;
        //         break;
        //     case 'aspectFill':
        //         this.nativeViewProtected.layer.contentsGravity = kCAGravityResizeAspectFill;
        //         break;
        //     case 'fill':
        //         this.nativeViewProtected.layer.contentsGravity = kCAGravityResize;
        //         break;
        //     case 'none':
        //     default:
        //         this.nativeViewProtected.layer.contentsGravity = kCAGravityResize;
        //         break;
        // }
    }
}
