import { getExamples } from '../examples';
import { Canvas } from 'nativescript-canvas';
import { Image } from 'tns-core-modules/ui/image/image';
import { Color } from 'tns-core-modules/color/color';
import { Folder, knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { fromFile, ImageSource } from 'tns-core-modules/image-source/image-source';
import { drawOnImage } from '../canvastests';
import { isIOS } from 'tns-core-modules/ui/page/page';

// import * as Worker from 'nativescript-worker-loader!~/worker';
// const worker = new Worker();

function pointerTo(type, value) {
    const outerPtr = interop.alloc(interop.sizeof(interop.Pointer));
    const outerRef = new interop.Reference(type, outerPtr);
    outerRef.value = value;
    return outerPtr;
}

function valueFromPointerNumber(type, value) {
    const ptr = new interop.Pointer(value);
    const ptrToPtr = pointerTo(interop.Pointer, ptr);
    const ref = new interop.Reference(type, ptrToPtr);

    return ref.value;
}

export default {
    name: 'Home',
    template: `
    <Page>
      <ActionBar title="OpenCV Demo">
      </ActionBar>
      <StackLayout>
      <Button text="testImage" @tap="onTap('testImage', $event)"/>
      <Button text="testImageWorker" @tap="onTap('testImageWorker', $event)"/>
      <GridLayout rows="*,*" backgroundColor="red" height="100%">
        <Image ref="imageView" row="0" stretch="aspectFit"/>
        <CanvasView ref="canvasView"row="1"  backgroundColor="blue" @draw="onDraw($event)"/>
      </GridLayout>
      </StackLayout>
    </Page>
    `,
    data() {
        return {
            examples: getExamples()
        };
    },
    mounted() {
        // worker.onmessage = msg => {
        //     const dict = valueFromPointerNumber(NSDictionary, msg.data.value.dictionaryPtr) as NSDictionary<string, any>;
        //     const type = dict.objectForKey('type') as string;
        //     console.log('postMessageToWorker', type);
        //     switch (type) {
        //         case 'image':
        //             this.showImage(dict.objectForKey('data'));
        //             break;
        //         default:
        //             break;
        //     }
        //     (dict as any).release();
        // };
    },
    methods: {
        postMessageToWorker(type, data?) {
            console.log('postMessageToWorker', type, data);

            if (isIOS) {
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
        },
        showImage(image) {
            // console.log('showImage', image);
            const imageView = (this.$refs.imageView as any).nativeView as Image;
            const imageSource = new ImageSource();
            imageSource.setNativeSource(image);
            imageView.imageSource = imageSource;
        },
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
        },
        onDraw(event: { canvas }) {
            drawOnImage(1, event.canvas);
        }
    }
};
