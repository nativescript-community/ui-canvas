<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"></NavigationButton>
        </ActionBar>
        <StackLayout>
            <CanvasView width="100" height="100" @draw="onDraw"></CanvasView>
            <Label fontSize="16" width="100" height="100" backgroundColor="yellow">test</Label>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from '@nativescript/core/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Canvas, createRect, Paint, Style } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core/color/color';
import { Screen } from '@nativescript/core/platform';

@Component
export default class Simple extends Vue {
    static title: 'Simple Example';
    onBack() {
        frameModule.topmost().goBack();
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
    }
}
</script>
