<template>
    <Page>
        <ActionBar title="Animation Demo" />
        <GridLayout rows="*,auto">
            <CanvasView ref="canvas" row="0" backgroundColor="transparent" @draw="onDraw" />
            <Button text="animate" row="1" @tap="startAnimation" />
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { Canvas, Cap, createRectF, Paint, Style } from '@nativescript-community/ui-canvas';
import { Frame } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';

import TWEEN from '@nativescript-community/tween';

@Component
export default class Animation extends Vue {
    currentArcAngle = 0;
    onBack() {
        Frame.topmost().goBack();
    }
    onDraw(event: { canvas: Canvas }) {
        const canvas = event.canvas;

        // const deviceScale = screen.mainScreen.scale;
        // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const width = Math.min(w, h) - 40;

        const bgPaint = new Paint();
        bgPaint.setAntiAlias(true);
        bgPaint.setColor('yellow');
        bgPaint.strokeWidth = 10;

        bgPaint.color = 'yellow';
        bgPaint.setStyle(Style.STROKE);
        bgPaint.setStrokeCap(Cap.ROUND);
        canvas.drawArc(createRectF(20, 20, width, width), 90, this.currentArcAngle, false, bgPaint);
    }
    startAnimation() {
        const canvas = (this.$refs.canvas as any).nativeView;
        new TWEEN.Tween({ value: 0 })
            .to({ value: 360 }, 5000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                this.currentArcAngle = obj.value;
                canvas.redraw();
            })
            .start(0);
    }
}
</script>
