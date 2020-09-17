import { drawOnImage } from './canvastests';

import 'globals';

const context: Worker = self as any;

function isOnUiThread() {
    if (global.isIOS) {
        return NSOperationQueue.currentQueue === NSOperationQueue.mainQueue;
    } else {
        return android.os.Looper.myLooper() === android.os.Looper.getMainLooper();
    }
}

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

context.onmessage = function(msg) {
    if (global.isIOS) {
        const dict = valueFromPointerNumber(NSDictionary, msg.data.value.dictionaryPtr) as any as NSDictionary<any, any>;
        const type = dict.objectForKey('type') as string;
        console.log('onmessage', type);

        // const data = dict.objectForKey('type');
        // console.log('worker onmessage');
        // decrease reference count
        // data.release();
        (dict as any).release();
        switch (type) {
            case 'drawOnImage':
                sendMessageBack('image', drawOnImage());
        }
        // sendMessageBack(data);
    }
};

function sendMessageBack(type, data?) {
    if (global.isIOS) {
        const nativeDict = NSMutableDictionary.dictionaryWithObjectForKey(type, 'type');
        if (data) {
            nativeDict.setValueForKey(data, 'data');
        }
        const message = {
            value: { dictionaryPtr: interop.handleof(nativeDict).toNumber() }
        };
        // increase reference count to account for `dictionaryPtr`
        (nativeDict as any).retain();
        context.postMessage(message);
    }
}
