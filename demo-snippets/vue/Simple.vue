<template>
    <Page>
        <ActionBar title="Simple Demo" />
        <StackLayout>
            <CanvasView width="100" height="100" @draw="onDraw"></CanvasView>
            <Label fontSize="16" width="100" height="100" backgroundColor="yellow">test</Label>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { Frame } from '@nativescript/core/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Canvas, Paint, Style, createRect } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core';
import { Screen } from '@nativescript/core/platform';
import { Path } from '@nativescript-community/ui-canvas';
import { Direction } from '@nativescript-community/ui-canvas';

@Component
export default class Simple extends Vue {
    onBack() {
        Frame.topmost().goBack();
    }
    onDraw(event: { canvas: Canvas }) {
        const canvas = event.canvas;

        // const deviceScale = screen.mainScreen.scale;
        // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
        // canvas.setDensity(Math.round(scale * 160));
        // canvas.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
        console.log('onDraw canvas:', canvas.getWidth(), canvas.getHeight());

        const bgPaint = new Paint();
        bgPaint.setAntiAlias(true);
        bgPaint.setTextSize(16);
        bgPaint.setColor('yellow');
        bgPaint.strokeWidth = 10;

        // rect
        canvas.drawRect(createRect(0, 0, 100, 100), bgPaint);
        bgPaint.setStyle(Style.STROKE);
        bgPaint.setColor(new Color(255, 0, 255, 0));
        canvas.drawRect(createRect(10, 10, 80, 80), bgPaint);
        bgPaint.setStyle(Style.STROKE);
        bgPaint.strokeWidth = 1;
        bgPaint.setColor(new Color(255, 255, 255, 0));
        canvas.drawRect(createRect(0, 0, 50, 50), bgPaint);
        bgPaint.setStyle(Style.FILL);
        bgPaint.setColor(new Color(255, 0, 0, 0));
        canvas.drawText('test', 0, 20, bgPaint);


        const path = new Path();
        const rect = createRect(10, 10, 40, 60);
        console.log('rect', rect)
        path.addRoundRect(rect.left, rect.top, rect.right, rect.bottom, [5, 5, 5, 5, 5,5, 0,0], Direction.CW)
        canvas.drawPath(path, bgPaint);   
    }
}
</script>
