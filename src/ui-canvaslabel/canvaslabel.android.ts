import { Paint } from '@nativescript-community/ui-canvas';
import { Color, getTransformedText, profile } from '@nativescript/core';
import { FontWeight, FontWeightType } from '@nativescript/core/ui/styling/font';
import { CanvasLabel as CanvasLabelBase, Group as GroupBase, SpanBase, paintFontCache } from './canvaslabel.common';
import { createNativeAttributedString, createSpannable, typefaceCache } from '@nativescript-community/text';

export class Span extends SpanBase {
    _ssb: android.text.SpannableStringBuilder;

    createNative(parentCanvas: CanvasLabelBase, parent?: Group, maxFontSize?: number) {
        this.mNative = this._ssb = createSpannable(this, parentCanvas, parent, maxFontSize);
    }
    // createStaticLayout(text, w, h, align, parent: CanvasLabel) {
    //     this.mStaticlayout = super.createStaticLayout(text, w, h, align, parent);
    //     return this.mStaticlayout;
    // }
}

// const NSPan = com.nativescript.canvaslabel.Span;
export class Group extends GroupBase {
    _ssb: android.text.SpannableStringBuilder;

    createNative(parentCanvas: CanvasLabelBase, parent?: Group, maxFontSize?: number) {
        if (!this.mSpans) {
            this.mNative = null;
            return;
        }
        this.mNative = this._ssb = createNativeAttributedString(this as any, this, parentCanvas, false, 1, 1);
        // let ssb = this._ssb;
        // if (!ssb) {
        //     this._ssb = ssb = NSPan.createSpannableStringBuilder();
        // } else {
        //     ssb.clear();
        //     ssb.clearSpans();
        // }
        // if (maxFontSize === undefined) {
        //     // top group let s get max font Size
        //     maxFontSize = this.getMaxFontSize();
        // }
        // this.mSpans &&
        //     this.mSpans.forEach((s) => {
        //         const native = (s as Span).getOrCreateNative(parentCanvas, this, maxFontSize);
        //         if (native) {
        //             ssb.append(native);
        //         }
        //     });
        // this.mNative = ssb;
    }
    onChildChange(span: Span) {
        this.mNative = null;
        this.mStaticlayout = null;
        super.onChildChange(span);
    }
}

export class CanvasLabel extends CanvasLabelBase {}
