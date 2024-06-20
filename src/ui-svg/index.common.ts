import { Canvas, CanvasView, PorterDuffMode } from '@nativescript-community/ui-canvas';
import Shape, { lengthProperty, percentLengthProperty } from '@nativescript-community/ui-canvas/shapes/shape';
import { CSSType, CoreTypes, ImageAsset, Property, View } from '@nativescript/core';

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
export class SVGView extends View {
    src: string;
}
srcProperty.register(SVGView);
stretchProperty.register(SVGView);
// blendingModeProperty.register(SVGView);
