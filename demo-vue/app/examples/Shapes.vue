<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"></NavigationButton>
            <StackLayout orientation="horizontal">
                <Button text="color" @tap="changeColor" />
                <Button text="size" @tap="animateRectSize" />
                <Button text="arc" @tap="animateArc" />
            </StackLayout>

        </ActionBar>
        <StackLayout>
            <CanvasView ref="canvas" width="100%" height="100%" backgroundColor="#44ff0000">
                <Shapes>
                    <Rectangle shadow="3 3 black" strokeColor="red" :fillColor="shapeColor" strokeWidth="6" :left="shapeLeft" top="10" :width="shapeLeft + '%'" height="50%" />
                    <Arc color="yellow" paintStyle="stroke" strokeCap="round" strokeWidth="10" left="20" top="20" :width="arcWidth" :height="arcWidth" startAngle="0" :sweepAngle="sweepAngle" />
                </Shapes>
            </CanvasView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Canvas, createRect, Paint, Style } from 'nativescript-canvas';
import { Color } from 'tns-core-modules/color/color';
import * as Anim from '../animation';
import { screen } from 'tns-core-modules/platform';

@Component
export default class Simple extends Vue {
    shapeColor = 'blue';
    shapeLeft = 10;
    sweepAngle = 0;
    arcWidth = Math.min(screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs) - 40;
    static title: 'Shapes Example';
    mounted() {
        console.log('screen.mainScreen.widthDIPs', screen.mainScreen.widthDIPs);
        console.log('screen.mainScreen.heightDIPs', screen.mainScreen.heightDIPs);
        console.log('arcWidth', this.arcWidth);
    }
    onBack() {
        frameModule.topmost().goBack();
    }
    changeColor() {
        console.log('changeColor', this.shapeColor);
        this.shapeColor = this.shapeColor === 'blue' ? 'yellow' : 'blue';
        console.log('changeColor2', this.shapeColor);
    }
    animateRectSize() {
        console.log('animateRectSize');
        new Anim.Animation({ value: 10 })
            .to({ value: 40 }, 5000)
            .easing(Anim.Easing.Quadratic.Out)
            .onUpdate(obj => {
                this.shapeLeft = obj.value;
            })
            .start();
    }
    animateArc() {
        const canvas = (this.$refs.canvas as any).nativeView;

        console.log('animateArc');
        new Anim.Animation({ value: 0 })
            .to({ value: 360 }, 5000)
            .onUpdate(obj => {
                this.sweepAngle = obj.value;
            })
            .start();
    }

     onDraw(event: { canvas: Canvas }) {
        const canvas = event.canvas;
        const w = canvas.getWidth()
        const h = canvas.getHeight()
        // console.log('onDraw', w, h);

    }
}
</script>
