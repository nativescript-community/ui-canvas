<template>
    <Page>
        <ActionBar title="Image Demo" />

        <StackLayout>
            <CanvasView width="100%" height="100%" @draw="onDraw" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { createRect } from '@nativescript-community/ui-canvas';
import { Frame, ImageSource, knownFolders, path } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';

const iconLocalFile: ImageSource = ImageSource.fromFileSync(path.join(knownFolders.currentApp().path, 'assets/images/test.jpg'));

@Component
export default class Image extends Vue {
    onBack() {
        Frame.topmost().goBack();
    }
    onDraw(event: { canvas }) {
        try {
            const canvas = event.canvas;

            // const deviceScale = screen.mainScreen.scale;
            // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
            console.log('onDraw canvas:', canvas.getWidth(), canvas.getHeight());

            canvas.drawBitmap(iconLocalFile, null, createRect(0, 50, 200, 300), null);
        } catch (error) {
            console.error(error, error.stack);
        }
    }
}
</script>
