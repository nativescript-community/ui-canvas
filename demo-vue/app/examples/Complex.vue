<template>
    <Page>
        <ActionBar :title="title">
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onBack"></NavigationButton>
        </ActionBar>
        <StackLayout>
            <Button text="testImage" @tap="onTap('testImage', $event)" />
            <Button text="testImageWorker" @tap="onTap('testImageWorker', $event)" />
            <GridLayout rows="*,*" backgroundColor="red" height="100%">
                <Image ref="imageView" row="0" stretch="aspectFit" />
                <CanvasView ref="canvasView" row="1" backgroundColor="blue" @draw="onDraw($event)" />
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue, { NativeScriptVue } from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { drawOnImage } from '../canvastests';
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { Image } from 'tns-core-modules/ui/image/image';

@Component({})
export default class ComplexExample extends Vue {
    static title: 'Text fields sample';
    onBack() {
        frameModule.topmost().goBack();
    }
    postMessageToWorker(type, data?) {
        if (frameModule.isIOS) {
            // the clone makes the UI slow! No solution right now
            const nativeDict = NSMutableDictionary.dictionaryWithObjectForKey(type, 'type');
            if (data) {
                nativeDict.setValueForKey(data, 'data');
            }
            const message = {
                value: { dictionaryPtr: interop.handleof(nativeDict).toNumber() }
            };
            // increase reference count to account for `dictionaryPtr`
            (nativeDict as any).retain();
            // worker.postMessage(message);
        }
    }
    showImage(image) {
        // console.log('showImage', image);
        const imageView = (this.$refs.imageView as any).nativeView as Image;
        const imageSource = new ImageSource();
        imageSource.setNativeSource(image);
        imageView.imageSource = imageSource;
    }
    onTap(command: string, event) {
        switch (command) {
            case 'testImage': {
                this.showImage(drawOnImage(2));
                break;
            }
            case 'testImageWorker': {
                this.postMessageToWorker('drawOnImage');
                break;
            }
        }
    }
    onDraw(event: { canvas }) {
        drawOnImage(1, event.canvas);
    }
}
</script>
