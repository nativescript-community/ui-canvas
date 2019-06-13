<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"></NavigationButton>
        </ActionBar>
        <StackLayout>
            <CanvasView width="100%" height="100%" @draw="onDraw"/>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { createRect, Paint, Style } from 'nativescript-canvas';
import { Color } from 'tns-core-modules/color/color';
import { Folder, knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { fromFile, ImageSource } from 'tns-core-modules/image-source/image-source';

const iconLocalFile: ImageSource = fromFile(path.join( knownFolders.currentApp().path, 'images/test.jpg'));

@Component
export default class Image extends Vue {
    static title: 'Image Example';
    onBack() {
        frameModule.topmost().goBack();
    }
    onDraw(event: { canvas }) {
        const canvas = event.canvas;
        console.log('onDraw canvas:', canvas.getWidth(), canvas.getHeight());

        canvas.drawBitmap(iconLocalFile, null, createRect(0, 50, 200, 300), null);
    }
}
</script>
