<template>
    <Page>
        <ActionBar :title="title">
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"/>
        </ActionBar>
        <GridLayout rows="*,auto">
            <CanvasView ref="canvas" row="0" backgroundColor="transparent" @draw="onDraw"/>
            <Button text="animate" row="1" @tap="startAnimation"/>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Canvas, Cap, createRect, Paint, Style } from 'nativescript-canvas';
import { Color } from 'tns-core-modules/color/color';

import * as Anim from '../animation';

@Component
export default class Animation extends Vue {
    static title: 'Animation Example';
    currentArcAngle = 0
    onBack() {
        frameModule.topmost().goBack();
    }
    onDraw(event: { canvas: Canvas }) {
        const canvas = event.canvas;
        const w = canvas.getWidth()
        const h = canvas.getHeight()
        const width = Math.min(w, h) - 40

        const bgPaint = new Paint();
        bgPaint.setAntiAlias(true);
        bgPaint.setColor('yellow');
        bgPaint.strokeWidth = 10;

        bgPaint.color = 'yellow';
        bgPaint.setStyle(Style.STROKE);
        bgPaint.setStrokeCap(Cap.ROUND);
        canvas.drawArc(createRect(20, 20, width, width), 90, this.currentArcAngle, false, bgPaint);

    }
    startAnimation() {
        const canvas = (this.$refs.canvas as any).nativeView;
        console.log('startAnimation', canvas);
        new Anim.Animation({ value: 0 })
            .to({ value: 360 }, 5000)
            .easing(Anim.Easing.Quadratic.Out)
            .onUpdate(obj => {
                this.currentArcAngle = obj.value;
                canvas.redraw();
            })
            .start();

    }
}
</script>
