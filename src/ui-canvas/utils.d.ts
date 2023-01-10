import { Color } from '@nativescript/core';
import { DashPathEffect } from '.';
export declare function parseCap(value: string | number): globalAndroid.graphics.Paint.Cap;
export declare function parseType(value: string | number): globalAndroid.graphics.Paint.Style;
export declare function parseJoin(value: string | number): globalAndroid.graphics.Paint.Join;
export declare function parseShadow(value: string): {
    radius: import("@nativescript/core").CoreTypes.LengthType;
    dx: number;
    dy: number;
    color: Color;
};
export declare function parseDashEffect(value: string): DashPathEffect;
