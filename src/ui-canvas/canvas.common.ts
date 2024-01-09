import { Device } from '@nativescript/core';

import { Rect, RectF } from './canvas';

export const sdkVersion = parseInt(Device.sdkVersion, 10);

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export function createRectF(x: number, y: number, w: number, h: number) {
    return new RectF(x, y, x + w, y + h);
}
