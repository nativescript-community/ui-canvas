import { ImageSource } from '@nativescript/core';
import { Canvas } from '@nativescript-community/ui-canvas';
import { DrawingMode, TouchPoint } from './DrawingMode';
import ImageShape from '../shapes/ImageShape';

export default class ImageMode extends DrawingMode {
    readonly name = 'image';

    /** Set the image source before activating this mode, or override onTouchEnd to prompt the user */
    imageSource: ImageSource | null = null;
    imageSrc: string | null = null;

    /** Default size for placed image in dp */
    defaultWidth: number = 200;
    defaultHeight: number = 200;

    onTouchEnd(point: TouchPoint): void {
        if (!this.imageSource) return;

        const shape = new ImageShape();
        shape.imageSource = this.imageSource;
        shape.imageSrc = this.imageSrc;
        shape.x = point.x - this.defaultWidth / 2;
        shape.y = point.y - this.defaultHeight / 2;
        shape.width = this.defaultWidth;
        shape.height = this.defaultHeight;
        shape.opacity = this.canvas.shapeOpacity;

        this.canvas.commitShape(shape);
    }
}
