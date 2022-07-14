<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"></NavigationButton>
        </ActionBar>
        <StackLayout>
            <CanvasView width="100%" height="100%" @draw="onDraw" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { Frame } from '@nativescript/core/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { createRect, Paint, Style } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core/color';
import { Folder, knownFolders, path } from '@nativescript/core/file-system';
import { ImageSource } from '@nativescript/core/image-source';
import { Screen } from '@nativescript/core/platform';

const iconLocalFile: ImageSource = ImageSource.fromFileSync(path.join(knownFolders.currentApp().path, 'images/test.jpg'));

@Component
export default class Image extends Vue {
    static title: 'Image Example';
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
            console.error(error, error.stack)
        }
    }
}
</script>
