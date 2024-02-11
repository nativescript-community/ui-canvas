import { cssProperty, init } from '@nativescript-community/text';
import { Canvas, CanvasView, LayoutAlignment, Paint, RectF, StaticLayout } from '@nativescript-community/ui-canvas';
import Shape, { colorProperty, numberProperty, percentLengthProperty, stringProperty } from '@nativescript-community/ui-canvas/shapes/shape';
import {
    CSSType,
    ChangedData,
    Color,
    CoreTypes,
    Device,
    EventData,
    colorProperty as NColorProperty,
    Span as NSPan,
    Observable,
    ObservableArray,
    PercentLength,
    Screen,
    Utils,
    View,
    profile
} from '@nativescript/core';
import { FontStyleType, FontWeightType } from '@nativescript/core/ui/styling/font';
import { Span } from './canvaslabel';

const toDpi = Utils.layout.toDeviceIndependentPixels;
export const paintCache: { [k: string]: Paint } = {};
export const paintFontCache = {};

// init text to ensure font overrides are called
init();

function getCapitalizedString(str: string): string {
    const words = str.split(' ');
    const newWords = [];
    for (let i = 0, length = words.length; i < length; i++) {
        const word = words[i].toLowerCase();
        newWords.push(word.substr(0, 1).toUpperCase() + word.substring(1));
    }

    return newWords.join(' ');
}

export function getTransformedText(text: string, textTransform: CoreTypes.TextTransformType): string {
    switch (textTransform) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'capitalize':
            return getCapitalizedString(text);
        case 'none':
        default:
            return text;
    }
}
export type VerticalTextAlignment = 'initial' | 'top' | 'middle' | 'bottom' | 'center';

// const debugPaint = new Paint();
// debugPaint.style = Style.STROKE;
// debugPaint.color = 'red';
let FONT_SIZE_FACTOR;
let SCREEN_DENSITY;
export abstract class SpanBase extends Shape {
    static get isSpan() {
        return true;
    }
    mParent: WeakRef<any>;
    static linkTapEvent = 'linkTap';
    @numberProperty fontSize: number;
    @stringProperty fontFamily: string;
    @stringProperty fontStyle: FontStyleType;
    @stringProperty fontWeight: FontWeightType;
    @stringProperty textAlignment: CoreTypes.TextAlignmentType & 'middle';
    @stringProperty textDecoration: CoreTypes.TextDecorationType;
    @stringProperty textTransform: CoreTypes.TextTransformType;
    @stringProperty lineBreak: string | number;

    @percentLengthProperty width: CoreTypes.PercentLengthType;
    @percentLengthProperty height: CoreTypes.PercentLengthType;

    @percentLengthProperty paddingLeft: CoreTypes.PercentLengthType;
    @percentLengthProperty paddingRight: CoreTypes.PercentLengthType;
    @percentLengthProperty paddingTop: CoreTypes.PercentLengthType;
    @percentLengthProperty paddingBottom: CoreTypes.PercentLengthType;

    @stringProperty verticalTextAlignment: VerticalTextAlignment;
    @colorProperty backgroundColor: Color;
    @numberProperty borderRadius: number;
    @numberProperty letterSpacing: number;
    @numberProperty lineHeight: number;
    @stringProperty text: any;

    mFontSize: number;
    mFontFamily: string;
    mFontWeight: FontWeightType;
    mVerticalTextAlignment: any;
    mTappable = false;

    addEventListener(arg: string, callback: (data: EventData) => void, thisArg?: any) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === SpanBase.linkTapEvent) {
            this._setTappable(true);
        }
    }

    removeEventListener(arg: string, callback?: any, thisArg?: any) {
        super.removeEventListener(arg, callback, thisArg);
        if (arg === SpanBase.linkTapEvent) {
            this._setTappable(this.hasListeners(SpanBase.linkTapEvent));
        }
    }
    private _setTappable(value: boolean): void {
        if (this.mTappable !== value) {
            this.mTappable = value;
            this.notifyPropertyChange('tappable', value, !value);
        }
    }

    get style() {
        return this;
    }
    set _fontFamily(value) {
        this.mFontFamily = value;
    }
    get _fontFamily() {
        const parent = this.mParent && this.mParent.get();
        if (this.mFontFamily) {
            return this.mFontFamily;
        }
        if (parent) {
            return parent._fontFamily || (parent.style && parent.style.fontFamily);
        }
    }

    set _fontSize(value) {
        this.mFontSize = value;
    }
    get _fontSize() {
        const parent = this.mParent && this.mParent.get();
        if (this.mFontSize) {
            return this.mFontSize;
        }
        if (parent) {
            return parent._fontSize || (parent.style && parent.style.fontSize);
        }
    }
    set _fontWeight(value: FontWeightType) {
        this.mFontWeight = value;
    }
    get _fontWeight(): FontWeightType {
        const parent = this.mParent && this.mParent.get();
        if (this.mFontWeight) {
            return this.mFontWeight;
        }
        if (parent) {
            return parent._fontWeight || (parent.style && parent.style.fontWeight);
        }
        return null;
    }
    set _verticalTextAlignment(value: any) {
        this.mVerticalTextAlignment = value;
    }
    get _verticalTextAlignment(): any {
        const parent = this.mParent && this.mParent.get();
        if (this.mVerticalTextAlignment) {
            return this.mVerticalTextAlignment;
        }
        if (parent) {
            return parent._verticalTextAlignment || (parent.style && parent.style.verticalTextAlignment);
        }
        return null;
    }

    constructor() {
        super();
        this.handleAlignment = true;
        this['handlesFont'] = true;
        this['handlesPaint'] = true;
        // this.paint.setAntiAlias(true);
    }
    resetLayout() {
        this.mStaticlayout = null;
    }
    reset() {
        this.mStaticlayout = null;
        this.mNative = null;
    }
    notifyPropertyChange(propertyName, value, oldValue) {
        if (!this.mParent) return;
        if (propertyName === '.' || (value !== oldValue && propertyName !== 'visibility' && propertyName.indexOf('padding') === -1)) {
            this.reset();
        }
        super.notifyPropertyChange(propertyName, value, oldValue);
    }

    mStaticlayout: StaticLayout;
    mNative: any; // NSMutableAttributedString | android.text.Spannable

    abstract createNative(parentCanvas: CanvasLabel, parent?: Group, maxFontSize?: number);

    // @profile
    getOrCreateNative(parentCanvas: CanvasLabel, parent?: Group, maxFontSize?: number) {
        if (!this.mNative) {
            this.createNative(parentCanvas, parent, maxFontSize);
        }
        return this.mNative;
    }
    getText(canvasLabel: CanvasLabel) {
        return this.text;
    }
    redraw() {
        const parent = this.mParent && this.mParent.get();
        if (parent) {
            parent.redraw();
        }
    }
    createStaticLayout(text, w, h, align, parent: CanvasLabel) {
        const fontweight = this.fontWeight;
        const fontstyle = this.fontStyle || parent.style.fontStyle || parent.fontStyle;
        const fontFamily = this.fontFamily;
        const color = this.color || parent.style.color;
        const lineBreak = this.lineBreak || parent['lineBreak'];
        const xfermode = this.xfermode;
        const fontSize = this.fontSize;
        const letterSpacing = this.letterSpacing;
        const fontKey = fontFamily + fontweight + fontstyle;
        const cacheKey = fontKey + fontSize;
        let cachedPaint = paintCache[cacheKey];
        if (!cachedPaint) {
            const paint = new Paint(this.paint);
            paint.setFontFamily(fontFamily);
            paint.setFontWeight(fontweight);
            paint.setFontStyle(fontstyle);
            if (__ANDROID__ && !FONT_SIZE_FACTOR) {
                SCREEN_DENSITY = Screen.mainScreen.scale;
                FONT_SIZE_FACTOR = com.akylas.canvas.CanvasView.getFontSizeFactor(Utils.android.getApplicationContext(), 1);
            }
            paint.textSize = fontSize;
            cachedPaint = paintCache[cacheKey] = paint;
            paintFontCache[fontKey] = paint;
        }
        if (xfermode) {
            cachedPaint.setXfermode(xfermode);
        }
        if (letterSpacing) {
            cachedPaint.setLetterSpacing(letterSpacing);
        }
        if (color) {
            cachedPaint.color = color;
        }
        this.mStaticlayout = new StaticLayout(text, cachedPaint, w, align, 1, 0, true, lineBreak, w, h);
        return this.mStaticlayout;
    }

    static mBackgroundPaint: Paint;

    @profile
    drawOnCanvas(canvas: Canvas, parent: CanvasLabel) {
        let text = this.getText(parent);
        if (!text) {
            return;
        }
        const textTransform = this.textTransform || (parent && parent.textTransform);
        if (textTransform) {
            text = getTransformedText(text, textTransform);
        }
        // const startTime = Date.now();
        const cW = canvas.getWidth();
        const cH = canvas.getHeight();
        let w = cW;
        let h = cH;
        const wPx = Utils.layout.toDevicePixels(w);
        const hPx = Utils.layout.toDevicePixels(h);

        let paddingLeft = toDpi(parent.effectivePaddingLeft + parent.effectiveBorderLeftWidth);
        let paddingRight = toDpi(parent.effectivePaddingRight + parent.effectiveBorderRightWidth);
        if (this.paddingLeft) {
            paddingLeft += toDpi(PercentLength.toDevicePixels(this.paddingLeft, 0, wPx - paddingLeft - paddingRight));
        }
        if (this.paddingRight) {
            paddingRight += toDpi(PercentLength.toDevicePixels(this.paddingRight, 0, wPx - paddingLeft - paddingRight));
        }
        let paddingTop = toDpi(parent.effectivePaddingTop + parent.effectiveBorderTopWidth);
        let paddingBottom = toDpi(parent.effectivePaddingBottom + parent.effectiveBorderBottomWidth);
        if (this.paddingTop) {
            paddingTop += toDpi(PercentLength.toDevicePixels(this.paddingTop, 0, hPx - paddingTop - paddingBottom));
        }
        if (this.paddingBottom) {
            paddingBottom += toDpi(PercentLength.toDevicePixels(this.paddingBottom, 0, hPx - paddingTop - paddingBottom));
        }

        let align: LayoutAlignment = LayoutAlignment.ALIGN_NORMAL;
        switch (this.textAlignment || parent.style.textAlignment) {
            case 'center':
                align = LayoutAlignment.ALIGN_CENTER;
                break;
            case 'right':
                align = LayoutAlignment.ALIGN_OPPOSITE;
                break;
        }

        const verticalalignment = this.verticalAlignment || (parent && parent.verticalTextAlignment);
        let deltaX = 0,
            deltaY = 0;
        if (this.width) {
            w = toDpi(PercentLength.toDevicePixels(this.width, 0, wPx - paddingLeft - paddingRight));
            if (this.horizontalAlignment === 'right') {
                deltaX += cW - w;
            } else if (this.horizontalAlignment === 'center') {
                deltaX += cW / 2 - w / 2;
            } else if (this.width) {
                // deltaX += w / 2;
            }
        }
        if (this.height) {
            h = toDpi(PercentLength.toDevicePixels(this.height, 0, hPx - paddingTop - paddingBottom));
        }
        if (paddingLeft !== 0 && align !== LayoutAlignment.ALIGN_OPPOSITE && this.horizontalAlignment !== 'right') {
            if (!this.width) {
                w -= paddingLeft;
            }
            deltaX += paddingLeft;
        }

        if (paddingRight !== 0) {
            if (!this.width) {
                // dont translate here changing the width is enough
                w -= paddingRight;
            } else if (align === LayoutAlignment.ALIGN_OPPOSITE || this.horizontalAlignment === 'right') {
                deltaX += -paddingRight;
            }
        }
        let staticlayout = this.mStaticlayout;
        if (!staticlayout) {
            staticlayout = this.createStaticLayout(text, Math.max(0, w), h, align, parent);
        }
        let _staticWidth;
        const getStaticWidth = () => {
            if (!_staticWidth) {
                _staticWidth = staticlayout.getWidth();
            }
            return _staticWidth;
        };
        let _staticHeight;
        const getStaticHeight = () => {
            if (!_staticHeight) {
                _staticHeight = staticlayout.getHeight();
            }
            return _staticHeight;
        };
        if (verticalalignment === 'bottom') {
            let height = getStaticHeight();
            if (paddingBottom !== 0) {
                height += paddingBottom;
            }
            if (this.height) {
                height += (h - height) / 2;
            }
            deltaY += cH - height;
            if (this.verticalTextAlignment === 'middle' || this.verticalTextAlignment === 'center') {
                const height = getStaticHeight();
                deltaY += height / 2;
            } else if (this.verticalTextAlignment === 'top') {
                const height = getStaticHeight();
                deltaY += height;
            }
        } else if (verticalalignment === 'middle' || verticalalignment === 'center') {
            const height = getStaticHeight();
            let decale = 0;
            if (paddingTop !== 0) {
                decale += paddingTop;
            }
            if (paddingBottom !== 0) {
                decale -= paddingBottom;
            }
            if (!this.verticalTextAlignment || this.verticalTextAlignment === 'middle' || this.verticalTextAlignment === 'center') {
                // As we draw the staticLayout with max height h, we must clip this
                // is the text is to be ellipsized then getStaticHeight is more than what we will render
                deltaY += Math.max(0, cH / 2 - height / 2 + decale);
            } else if (this.verticalTextAlignment === 'bottom') {
                deltaY += cH / 2 - height + decale;
            } else {
                deltaY += cH / 2 + decale;
            }
        } else {
            if (paddingTop !== 0) {
                deltaY += paddingTop;
            }
            if (this.height) {
                const height = getStaticHeight();
                deltaY += (h - height) / 2;
            }
            if (this.verticalTextAlignment === 'middle' || this.verticalTextAlignment === 'center') {
                const height = getStaticHeight();
                deltaY -= height / 2;
            } else if (this.verticalTextAlignment === 'bottom') {
                const height = getStaticHeight();
                deltaY -= height;
            }
        }
        if (deltaX > 0 || deltaY > 0) {
            canvas.translate(deltaX, deltaY);
        }
        const backgroundcolor = this.backgroundColor;
        if (backgroundcolor) {
            // check if we are a Span inside a Group
            const spanParent = this.mParent && this.mParent.get();
            if (!(spanParent instanceof Group)) {
                if (!SpanBase.mBackgroundPaint) {
                    SpanBase.mBackgroundPaint = new Paint();
                }
                SpanBase.mBackgroundPaint.color = backgroundcolor;
                const borderRadius = this.borderRadius;
                const top = this.height ? -getStaticHeight() / 2 : 0;
                const bottom = top + (this.height ? h : getStaticHeight());
                if (borderRadius > 0) {
                    canvas.drawRoundRect(new RectF(0, top, getStaticWidth(), bottom), borderRadius, borderRadius, SpanBase.mBackgroundPaint);
                } else {
                    canvas.drawRect(0, top, getStaticWidth(), bottom, SpanBase.mBackgroundPaint);
                }
            }
        }
        staticlayout.draw(canvas, h);
    }
    toNativeString() {}
}
//@ts-ignore
SpanBase.prototype.toNativeString = NSPan.prototype.toNativeString;
export abstract class Group extends SpanBase {
    mSpans: ObservableArray<SpanBase>;

    get spans() {
        return this.mSpans;
    }
    getOrCreateSpans() {
        if (!this.mSpans) {
            this.mSpans = new ObservableArray<SpanBase>();
            this.mSpans.addEventListener(ObservableArray.changeEvent, this.onShapesCollectionChanged, this);
        }
        return this.mSpans;
    }
    resetLayout() {
        super.resetLayout();
        this.mSpans && this.mSpans.forEach((s) => s.resetLayout());
    }
    reset() {
        super.reset();
        this.mSpans && this.mSpans.forEach((s) => s.reset());
    }
    getMaxFontSize() {
        let max = this.mFontSize || 0;
        this.mSpans &&
            this.mSpans.forEach((s) => {
                if (s instanceof Group) {
                    max = Math.max(max, s.getMaxFontSize());
                } else if (s.mFontSize) {
                    max = Math.max(max, s.mFontSize);
                }
            });
        return max;
    }
    onShapePropertyChange(event) {
        if (event.oldValue !== event.value || event.propertyName === '.') {
            this.notifyPropertyChange('.', null, null);
        }
    }
    private addPropertyChangeHandler(shape: Shape) {
        // const style = shape.style;
        shape.on(Observable.propertyChangeEvent, this.onShapePropertyChange, this);
    }
    private removePropertyChangeHandler(shape: Shape) {
        shape.off(Observable.propertyChangeEvent, this.onShapePropertyChange, this);
    }
    private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const shape = (eventData.object as any).getItem(eventData.index + i);

                // Then attach handlers - we skip the first nofitication because
                // we raise change for the whole instance.
                shape.mParent = new WeakRef(this as any);
                this.addPropertyChangeHandler(shape);
            }
        }

        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const shape = eventData.removed[p];

                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                shape.mParent = null;
                this.removePropertyChangeHandler(shape);
            }
        }
        // ensure we reset our natives
        this.reset();
        // request a redraw
        this.redraw();
    }
    @profile
    public _addChildFromBuilder(name: string, value: any): void {
        if (value instanceof SpanBase) {
            this.getOrCreateSpans().push(value);
        }
    }
    public _removeView(view: any) {
        if (view instanceof SpanBase && this.mSpans) {
            const index = this.mSpans.indexOf(view);
            if (index !== -1) {
                this.mSpans.splice(index, 1);
            }
            // } else {
            // super._removeView(view);
        }
    }
    onChildChange(span: SpanBase) {
        this.redraw();
    }
    abstract createNative(parentCanvas: CanvasLabel, parent?: Group, maxFontSize?: number);

    @profile
    getText(canvasLabel: CanvasLabel) {
        return this.getOrCreateNative(canvasLabel);
    }
}

declare module '@nativescript/core/ui/core/view' {
    interface ViewCommon {
        _addChildFromBuilder(name: string, value: any);
    }
}

@CSSType('CanvasLabel')
export class CanvasLabel extends CanvasView {
    // fontSize: number;
    mText: string | any;
    // fontStyle: FontStyle;
    // fontWeight: FontWeight;
    // textAlignment: TextAlignment;
    // textDecoration: TextDecoration;
    @cssProperty fontFamily: string;
    @cssProperty fontSize: number;
    @cssProperty fontStyle: FontStyleType;
    @cssProperty fontWeight: FontWeightType;
    @cssProperty letterSpacing: number;
    @cssProperty lineHeight: number;
    @cssProperty textAlignment: CoreTypes.TextAlignmentType & 'middle';
    @cssProperty verticalTextAlignment: CoreTypes.VerticalAlignmentType & 'middle';
    @cssProperty textDecoration: CoreTypes.TextDecorationType;
    //@ts-ignore
    @cssProperty textTransform: CoreTypes.TextTransformType;
    @cssProperty whiteSpace: CoreTypes.WhiteSpaceType;

    private mTextSpan: SpanBase;

    handlePropertyChange() {
        this.shapes?.forEach((s) => s instanceof SpanBase && s.reset());
        this.invalidate();
    }

    onSizeChanged(w, h, oldw, oldh) {
        this.shapes?.forEach((s) => s instanceof SpanBase && s.resetLayout());
        super.onSizeChanged(w, h, oldw, oldh);
    }

    public _addArrayFromBuilder(name: string, value: any[]) {
        if (name === 'spans') {
            value.forEach((v) => {
                this._addChildFromBuilder(null, value);
            });
        } else {
            super._addArrayFromBuilder(name, value);
        }
        // we ignore any other kind of view.
    }

    public _addChildFromBuilder(name: string, value: any): void {
        if (!(value instanceof View)) {
            this.addShape(value);
        } else {
            super._addChildFromBuilder(name, value);
        }
    }
    public removeChild(view: any) {
        if (!(view instanceof View)) {
            this.removeShape(view);
        } else {
            super.removeChild(view);
        }
    }
    public addChild(child: View): void {
        if (!(child instanceof View)) {
            this.addShape(child);
        } else {
            super.addChild(child);
        }
    }
    public insertChild(child: View, atIndex: number): void {
        if (!(child instanceof View)) {
            this.insertShape(child, atIndex);
        } else {
            super.insertChild(child, atIndex);
        }
    }

    [NColorProperty.setNative](value) {
        this.handlePropertyChange();
    }

    // get padding(): string | CoreTypes.LengthType {
    //     return this.style.padding;
    // }
    // set padding(value: string | CoreTypes.LengthType) {
    //     this.style.padding = value;
    // }

    // get paddingTop(): CoreTypes.LengthType {
    //     return this.style.paddingTop;
    // }
    // set paddingTop(value: CoreTypes.LengthType) {
    //     this.style.paddingTop = value;
    // }

    // get paddingRight(): CoreTypes.LengthType {
    //     return this.style.paddingRight;
    // }
    // set paddingRight(value: CoreTypes.LengthType) {
    //     this.style.paddingRight = value;
    // }

    // get paddingBottom(): CoreTypes.LengthType {
    //     return this.style.paddingBottom;
    // }
    // set paddingBottom(value: CoreTypes.LengthType) {
    //     this.style.paddingBottom = value;
    // }

    // get paddingLeft(): CoreTypes.LengthType {
    //     return this.style.paddingLeft;
    // }
    // set paddingLeft(value: CoreTypes.LengthType) {
    //     this.style.paddingLeft = value;
    // }
    get text() {
        return this.mText;
    }
    set text(value) {
        if (value) {
            if (!this.mTextSpan) {
                this.mTextSpan = new Span();
                this.addShape(this.mTextSpan);
            } else {
                this.mTextSpan.visibility = 'visible';
            }
            this.mTextSpan.text = value;
        } else if (this.mTextSpan) {
            this.mTextSpan.visibility = 'hidden';
        }

        this.mText = value;
    }
}
