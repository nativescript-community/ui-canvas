import { Color, Length } from '@nativescript/core';
import { Cap, DashPathEffect, Join, Style } from '.';

export function parseCap(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'square':
                return Cap.SQUARE;
            case 'butt':
                return Cap.BUTT;
            case 'round':
            default:
                return Cap.ROUND;
        }
    } else {
        return value;
    }
}
export function parseType(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'fill':
                return Style.FILL;
            case 'stroke':
                return Style.STROKE;
            case 'fill_and_stroke':
            default:
                return Style.FILL_AND_STROKE;
        }
    } else {
        return value;
    }
}
export function parseJoin(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'bevel':
                return Join.BEVEL;
            case 'round':
                return Join.ROUND;
            default:
            case 'miter':
                return Join.MITER;
        }
    } else {
        return value;
    }
}

export function parseShadow(value: string) {
    if (value === 'none') {
        return null;
    }
    const args = value.split(' ');
    const hasRadius = args.length === 4;
    return {
        radius: hasRadius ? Length.parse(args[2]) : 3,
        dx: Length.toDevicePixels(Length.parse(args[0])),
        dy: Length.toDevicePixels(Length.parse(args[1])),
        color: new Color(args[hasRadius ? 3 : 2])
    };
}

export function parseDashEffect(value: string) {
    const array = value.split(' ').map(parseFloat);
    const result = new DashPathEffect(array.slice(0, -1), array[array.length - 1]);
    return result;
}
