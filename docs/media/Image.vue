<template>
    <Page>
        <ActionBar title="Image Demo" />

        <StackLayout>
            <CanvasView ref="canvas" width="100%" height="100%" @draw="onDraw" @touch="onTouch" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { BitmapShader, CanvasView, createRect, Matrix, Paint, Style, TileMode } from '@nativescript-community/ui-canvas';
import { Frame, TouchGestureEventData, ImageSource, knownFolders, path } from '@nativescript/core';
import Vue, {NativeScriptVue} from 'nativescript-vue';
import { Component } from 'vue-property-decorator';

const iconLocalFile: ImageSource = ImageSource.fromFileSync(path.join(knownFolders.currentApp().path, 'assets/images/test.jpg'));
const shaderPaint = new Paint()
shaderPaint.style= Style.FILL

const cirlcePaint = new Paint()
cirlcePaint.strokeWidth = 4;
cirlcePaint.style= Style.STROKE
cirlcePaint.color= 'red'
@Component
export default class Image extends Vue {
    onBack() {
        Frame.topmost().goBack();
    }
    touchX = 0
    touchY = 0
    onTouch(event: TouchGestureEventData) {
        this.touchX = event.getX();
        this.touchY = event.getY();
        (this.$refs['canvas'] as NativeScriptVue<CanvasView>).nativeView.invalidate()
    }
    onDraw(event: { canvas }) {
        try {
            const canvas = event.canvas;


            canvas.drawBitmap(iconLocalFile, null, createRect(0, 0,  canvas.getWidth(), canvas.getHeight()), null);

            // const deviceScale = screen.mainScreen.scale;
            // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
            const ratioX = canvas.getWidth() / iconLocalFile.width
            const ratioY = canvas.getHeight() / iconLocalFile.height
            const matrix = new Matrix()
            matrix.postScale(ratioX, ratioY, 0,0)
            matrix.postScale(
                2,
                2,
                this.touchX,this.touchY
            )
            const shader = new BitmapShader(iconLocalFile, TileMode.CLAMP, TileMode.CLAMP);
            shader.setLocalMatrix(matrix)
            shaderPaint.setShader(shader)
            canvas.drawCircle(this.touchX, this.touchY, 60, shaderPaint)
            canvas.drawCircle(this.touchX, this.touchY, 60, cirlcePaint)
        } catch (error) {
            console.error(error, error.stack);
        }
    }
}
</script>
