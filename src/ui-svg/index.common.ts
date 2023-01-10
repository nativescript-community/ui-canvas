import { init } from '@nativescript-community/text';
import { Canvas, CanvasView, PorterDuffMode } from '@nativescript-community/ui-canvas';
import Shape, { lengthProperty, percentLengthProperty } from '@nativescript-community/ui-canvas/shapes/shape';
import { CSSType, CoreTypes, ImageAsset, Property, View, zeroLength } from '@nativescript/core';

// init text to ensure font overrides are called
init();

export function xfermodeFromString(str) {
    switch (str) {
        case 'overlay':
            return PorterDuffMode.OVERLAY;
        case 'lighten':
            return PorterDuffMode.LIGHTEN;
        case 'screen':
            return PorterDuffMode.SCREEN;
        case 'multiply':
            return PorterDuffMode.MULTIPLY;
        case 'dst_atop':
            return PorterDuffMode.DST_ATOP;
        case 'dst_over':
            return PorterDuffMode.DST_OVER;
        case 'dst_out':
            return PorterDuffMode.DST_OUT;
        case 'dst_in':
            return PorterDuffMode.DST_IN;
        case 'clear':
            return PorterDuffMode.CLEAR;
        case 'src_atop':
            return PorterDuffMode.SRC_ATOP;
        case 'src_over':
            return PorterDuffMode.SRC_OVER;
        case 'src_in':
            return PorterDuffMode.SRC_IN;
        case 'src_out':
            return PorterDuffMode.SRC_OUT;
        default:
            return null;
    }
}

export abstract class SVG extends Shape {
    _parent: WeakRef<any>;
    @percentLengthProperty width: CoreTypes.PercentLengthType;
    @percentLengthProperty height: CoreTypes.PercentLengthType;
    @lengthProperty left: CoreTypes.LengthType = zeroLength;
    @lengthProperty top: CoreTypes.LengthType = zeroLength;
    blendingMode: PorterDuffMode;
    cache: boolean = true;
    drawOnCanvas(canvas: Canvas, parent: CanvasView) {}
    _cachedImage: any;
    clearCache() {
        this._cachedImage = null;
    }
}

declare module '@nativescript/core/ui/core/view' {
    interface ViewCommon {
        _addChildFromBuilder(name: string, value: any);
    }
}
export type Stretch = 'none' | 'fill' | 'aspectFill' | 'aspectFit';
export const srcProperty = new Property<SVGView, string | ImageAsset | File>({ name: 'src' });
export const stretchProperty = new Property<SVGView, Stretch>({ name: 'stretch' });
// export const blendingModeProperty = new Property<SVGView, string>({ name: 'blendingMode' });

@CSSType('SVGView')
export class SVGView extends View {}
srcProperty.register(SVGView);
stretchProperty.register(SVGView);
// blendingModeProperty.register(SVGView);

@CSSType('CanvasSVG')
export class CanvasSVG extends CanvasView {
    // constructor() {
    //     super();
    // }
    //@ts-ignore
    // set color(value) {
    //     this.style.color = value;
    // }
    // get padding(): string | Length {
    //     return this.style.padding;
    // }
    // set padding(value: string | Length) {
    //     this.style.padding = value;
    // }
    // get paddingTop(): Length {
    //     return this.style.paddingTop;
    // }
    // set paddingTop(value: Length) {
    //     this.style.paddingTop = value;
    // }
    // get paddingRight(): Length {
    //     return this.style.paddingRight;
    // }
    // set paddingRight(value: Length) {
    //     this.style.paddingRight = value;
    // }
    // get paddingBottom(): Length {
    //     return this.style.paddingBottom;
    // }
    // set paddingBottom(value: Length) {
    //     this.style.paddingBottom = value;
    // }
    // get paddingLeft(): Length {
    //     return this.style.paddingLeft;
    // }
    // set paddingLeft(value: Length) {
    //     this.style.paddingLeft = value;
    // }
}
