<template>
    <Page>
        <ActionBar title="Font Switch" />
        <StackLayout>
            <Label textWrap="true" margin="10">
                Each row draws the same words. The top row reuses one Paint and switches its font family between draws, the second row uses one Paint per family. Both rows must look identical and every
                underline must match the width of its word.
            </Label>
            <CanvasView height="220" @draw="onDraw" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Canvas, Paint } from '@nativescript-community/ui-canvas';
import { Font, isAndroid } from '@nativescript/core';

const FAMILIES = ['OpenSans-Regular', 'OpenSans-Bold', 'monospace'];
const WORDS = ['Regular', 'Bold', 'mono'];

function drawWord(canvas: Canvas, paint: Paint, text: string, x: number, y: number) {
    canvas.drawText(text, x, y, paint);
    const width = paint.measureText(text);
    canvas.drawLine(x, y + 4, x + width, y + 4, paint);
    return x + width + 10;
}

@Component
export default class FontSwitch extends Vue {
    onDraw({ canvas }: { canvas: Canvas }) {
        // one Paint, family switched between draws
        const shared = new Paint();
        shared.setTextSize(20);
        let x = 10;
        FAMILIES.forEach((family, index) => {
            shared.setFontFamily(family);
            x = drawWord(canvas, shared, WORDS[index], x, 40);
        });

        // reference: one Paint per family
        x = 10;
        FAMILIES.forEach((family, index) => {
            const paint = new Paint();
            paint.setTextSize(20);
            paint.setFontFamily(family);
            x = drawWord(canvas, paint, WORDS[index], x, 80);
        });

        // a copied Paint keeps its font family when changing the weight
        const source = new Paint();
        source.setTextSize(20);
        source.setFontFamily('monospace');
        const copy = new Paint(source);
        copy.setFontWeight('bold');
        drawWord(canvas, copy, `copy: ${copy.getFontFamily()} (monospace)`, 10, 130);

        // a native typeface set on one Paint must not leak into another Paint using the default font
        const withNative = new Paint();
        withNative.setTextSize(20);
        withNative.setTypeface(isAndroid ? android.graphics.Typeface.MONOSPACE : UIFont.fromNameSize('Courier', 20));
        drawWord(canvas, withNative, 'native typeface (mono)', 10, 170);
        const other = new Paint();
        other.setTypeface(Font.default);
        other.setTextSize(20);
        drawWord(canvas, other, 'default font (not mono)', 10, 210);
    }
}
</script>
