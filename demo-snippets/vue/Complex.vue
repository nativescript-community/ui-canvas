<template>
    <Page>
        <ActionBar title="Complex Demo" />

        <StackLayout>
            <Button text="testImage" @tap="onTap('testImage', $event)" />
            <Button text="testImageWorker" @tap="onTap('testImageWorker', $event)" />
            <GridLayout rows="*,*" backgroundColor="red" height="100%">
                <Image ref="imageView" row="0" stretch="aspectFit" />
                <CanvasView ref="canvasView" row="1" backgroundColor="gray" @draw="onDraw($event)" />
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as perms from '@nativescript-community/perms';
import { Canvas } from '@nativescript-community/ui-canvas';
import { Application, Frame, Image, ImageSource } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { drawOnImage } from '../canvastests';

const worker = new Worker('../worker');

@Component
export default class ComplexExample extends Vue {
    onBack() {
        Frame.topmost().goBack();
    }
    postMessageToWorker(type, data?) {
        if (__IOS__) {
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
            worker.postMessage(message);
        }
    }
    saveToAlbum(imageSource: ImageSource) {
        return perms
            .request('storage')
            .then(() => perms.request('photo'))
            .then(() => {
                console.log('saveToAlbum', imageSource.width, imageSource.height);
                if (__IOS__) {
                    // var res = false;
                    // if (!imageSource) {
                    //     return res;
                    // }
                    // var result = true;
                    // class CompletionTarget extends NSObject {
                    //     onDone(image: UIImage, error:NSError, pointer:interop.Pointer) {
                    //         console.log('onDone', image, error);
                    //     }
                    // }
                    const CompletionTarget = NSObject['extend'](
                        {
                            // ...NSObject.prototype,
                            onDone(image: UIImage, error: NSError, pointer: interop.Pointer) {
                                console.log('onDone', image, error);
                            }
                        },
                        {
                            exposedMethods: {
                                onDone: { returns: interop.types.void, params: [UIImage, NSError, interop.Pointer] }
                            }
                        }
                    ) as typeof NSObject;
                    // var CompletionTarget = NSObject.extend({
                    //     "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:": function(
                    //         image, error, context) {
                    //         if (error) {
                    //             result = false;
                    //         }
                    //     }
                    // }, {
                    //     exposedMethods: {
                    //         "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:": {
                    //             returns: interop.types.void,
                    //             params: [UIImage, NSError, interop.Pointer]
                    //         }
                    //     }
                    // });
                    const completionTarget = CompletionTarget.new();
                    UIImageWriteToSavedPhotosAlbum(imageSource.ios, completionTarget, 'onDone', null);
                    // UIImageWriteToSavedPhotosAlbum(imageSource.ios, completionTarget,
                    //     "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:",
                    //     null);
                    // if (callBack) callBack();
                    // return result;
                } else {
                    const context = Application.android.context;
                    android.provider.MediaStore.Images.Media.insertImage(context.getContentResolver(), imageSource.android, 'test_' + Date.now() + '.png', Date.now() + '');
                }
            });
    }
    showAndSaveImage(image) {
        // console.log('showImage', image);
        const imageView = (this.$refs.imageView as any).nativeView as Image;
        const imageSource = new ImageSource();
        imageSource.setNativeSource(image);
        imageView.imageSource = imageSource;
        this.saveToAlbum(imageSource);
    }
    onTap(command: string, event) {
        switch (command) {
            case 'testImage': {
                this.showAndSaveImage(drawOnImage(1));
                break;
            }
            case 'testImageWorker': {
                this.postMessageToWorker('drawOnImage');
                break;
            }
        }
    }
    onDraw(event: { canvas: Canvas }) {
        // const deviceScale = screen.mainScreen.scale;
        const canvas = event.canvas;
        // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
        drawOnImage(0.5, canvas);
    }
}
</script>
