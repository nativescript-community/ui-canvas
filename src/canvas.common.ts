import { Rect } from './canvas';

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}
