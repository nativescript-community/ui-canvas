import { createNativeAttributedString, createSpannable } from '@nativescript-community/text';
import { CanvasLabel as CanvasLabelBase, Group as GroupBase, Span as SpanBase } from './canvaslabel.common';

export class Span extends SpanBase {
    createNative(parentCanvas: CanvasLabelBase, parent?: Group, maxFontSize?: number) {
        this.mNative = createSpannable(this, parentCanvas, parent, maxFontSize);
    }
}
export class Group extends GroupBase {
    createNative(parentCanvas: CanvasLabelBase, parentGroup?: Group, maxFontSize?: number) {
        // const ssb = NSMutableAttributedString.new();

        // if (maxFontSize === undefined) {
        //     // top group let s get max font Size
        //     maxFontSize = this.getMaxFontSize();
        // }
        // this.mSpans &&
        //     this.mSpans.forEach((s) => {
        //         // s._startIndexInGroup = ssb.length;
        //         // s._endIndexInGroup = s.text ? s.text.length : 0;
        //         const native = s.getOrCreateNative(parentCanvas, this, maxFontSize);
        //         if (native) {
        //             ssb.appendAttributedString(native);
        //         }
        //     });
        this.mNative = createNativeAttributedString(this as any, this, parentCanvas, false);
        // this.mNative = ssb;
    }
    onChildChange(span: Span) {
        this.mNative = null;
        this.mStaticlayout = null;
        super.onChildChange(span);
        // console.log('Group onChildChange', span.text, !!this._native, span._startIndexInGroup, span._endIndexInGroup, span.getOrCreateNative(this));
        // if (this._native) {
        //     (this._native as NSMutableAttributedString).replaceCharactersInRangeWithAttributedString({location:span._startIndexInGroup, length:span._endIndexInGroup}, span.getOrCreateNative(this) );
        // }
        // span._endIndexInGroup = span.text ? span.text.length : 0;
    }
}

export class CanvasLabel extends CanvasLabelBase {}
