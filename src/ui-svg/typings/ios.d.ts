/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable no-redeclare */
/* eslint-disable no-var */
declare function AddSVGArcToPath(thePath: any, xRadius: number, yRadius: number, xAxisRotationDegrees: number, largeArcFlag: boolean, sweepFlag: boolean, endPointX: number, endPointY: number): void;

declare function ArrayForSVGAttribute(svgAttributes: NSDictionary<any, any>, key: string): NSArray<any>;

declare function AttributesFromSVGCompactAttributes(compactedAttributes: string): NSDictionary<any, any>;

declare function BitmapContextCreate(pixelsWide: number, pixelsHigh: number): any;

declare function CGAffineTransformToSVGTransform(aTransform: CGAffineTransform): string;

declare function CGPathApplyCallbackFunction(aVisitor: interop.Pointer | interop.Reference<any>, element: interop.Pointer | interop.Reference<CGPathElement>): void;

declare const enum CSSPseudoClassFlags {
    kPseudoClassNone = 0,

    kPseudoClassActive = 1,

    kPseudoClassFocused = 2,

    kPseudoClassHovering = 4,
}

declare function CalculateForward(startPoint: CGPoint, endPoint: CGPoint): CGPoint;

declare function CalculateNormal(startPoint: CGPoint, endPoint: CGPoint): CGPoint;

declare function CalculateVectorAngle(vector1: CGPoint, vector2: CGPoint): number;

declare function CreatePDFContext(mediaRect: CGRect, theData: NSData): interop.Unmanaged<any>;

declare function CreatePathFromSVGPathString(dAttribute: string, transformToApply: CGAffineTransform): any;

declare function DefaultSVGDrawingAttributes(): NSDictionary<any, any>;

declare function ExtractURLContents(aString: string): string;

interface FillColorProtocol extends NSObjectProtocol {
    copyFillColor(): UIColor;
}
declare var FillColorProtocol: {
    prototype: FillColorProtocol;
};

declare class GHAttributedObject extends NSObject implements GHAttributedObjectProtocol {
    static alloc(): GHAttributedObject; // inherited from NSObject

    static new(): GHAttributedObject; // inherited from NSObject

    readonly attributes: NSDictionary<any, any>; // inherited from GHAttributedObjectProtocol

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly entityName: string; // inherited from GHAttributedObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    constructor(o: { attributes: NSDictionary<any, any> });

    constructor(o: { dictionary: NSDictionary<any, any> });

    calculatedHash(): number;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    initWithAttributes(theAttributes: NSDictionary<any, any>): this;

    initWithDictionary(theAttributes: NSDictionary<any, any>): this;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

interface GHAttributedObjectProtocol extends NSObjectProtocol {
    attributes: NSDictionary<any, any>;

    entityName: string;
}
declare var GHAttributedObjectProtocol: {
    prototype: GHAttributedObjectProtocol;
};

declare class GHButton extends GHControl {
    static alloc(): GHButton; // inherited from NSObject

    static appearance(): GHButton; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): GHButton; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): GHButton; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHButton; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): GHButton; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHButton; // inherited from UIAppearance

    static makeSureLoaded(): void;

    static new(): GHButton; // inherited from NSObject

    artworkPath: string;

    artworkView: UIView;

    pressedArtworkPath: string;

    selectedArtworkPath: string;

    title: string;
}

declare class GHCSSStyle extends NSObject {
    static alloc(): GHCSSStyle; // inherited from NSObject

    static attributeNamedClassesEntityNamePseudoClassForStyles(
        attributeName: string,
        listOfClasses: NSArray<string> | string[],
        entityName: string,
        pseudoClassFlags: CSSPseudoClassFlags,
        cssStyles: NSDictionary<string, GHCSSStyle>
    ): string;

    static new(): GHCSSStyle; // inherited from NSObject

    static stylesForString(css: string): NSDictionary<string, GHCSSStyle>;

    readonly attributes: NSDictionary<string, string>;

    readonly cssClass: string;

    readonly pseudoClassFlags: CSSPseudoClassFlags;

    readonly subClasses: NSDictionary<string, GHCSSStyle>;
}

declare class GHCircle extends GHEllipse {
    static alloc(): GHCircle; // inherited from NSObject

    static new(): GHCircle; // inherited from NSObject
}

declare class GHClipGroup extends GHShapeGroup {
    static alloc(): GHClipGroup; // inherited from NSObject

    static clipObjectForAttributesWithSVGContext(attributes: NSDictionary<any, any>, svgContext: SVGContext): GHClipGroup;

    static new(): GHClipGroup; // inherited from NSObject
}

declare class GHControl extends UIControl {
    static alloc(): GHControl; // inherited from NSObject

    static appearance(): GHControl; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): GHControl; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): GHControl; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHControl; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): GHControl; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHControl; // inherited from UIAppearance

    static new(): GHControl; // inherited from NSObject

    artInsetFraction: number;

    drawsBackground: boolean;

    drawsChrome: boolean;

    faceGradient: any;

    faceGradientPressed: any;

    faceGradientSelected: any;

    ringColor: UIColor;

    scheme: number;

    schemeNumber: number;

    showShadow: boolean;

    textColor: UIColor;

    textColorDisabled: UIColor;

    textColorPressed: UIColor;

    textColorSelected: UIColor;

    textFontSize: number;

    textShadowColor: UIColor;

    useBoldText: boolean;

    useRadialGradient: boolean;

    setupForScheme(aScheme: number): void;
}

declare class GHControlFactory extends NSObject {
    static alloc(): GHControlFactory; // inherited from NSObject

    static buttonTint(): UIColor;

    static defaultScheme(): number;

    static findInterfaceBuilderArtwork(artworkSubPath: string): NSURL;

    static isValidColorScheme(scheme: number): boolean;

    static locateArtworkForBundleAtSubpath(mayBeNil: NSBundle, theArtworkPath: string): NSURL;

    static locateArtworkForObjectAtSubpath(anObject: NSObjectProtocol, theArtworkPath: string): NSURL;

    static new(): GHControlFactory; // inherited from NSObject

    static newButtonBackgroundGradientForScheme(scheme: number): any;

    static newButtonBackgroundGradientPressedForScheme(scheme: number): any;

    static newButtonBackgroundGradientSelectedForScheme(scheme: number): any;

    static newButtonForScheme(scheme: number): GHButton;

    static newColorWithBrightnessDelta(originalColor: UIColor, brightnessDelta: number): UIColor;

    static newLightBackgroundColorForScheme(scheme: number): UIColor;

    static newPressedColorForColorForScheme(originalColor: UIColor, scheme: number): UIColor;

    static newRingColorForScheme(scheme: number): UIColor;

    static newRoundRectPathForRectWithRadius(aRect: CGRect, radius: number): any;

    static newTextColorForScheme(scheme: number): UIColor;

    static newTextColorPressedForScheme(scheme: number): UIColor;

    static newTextShadowColorForScheme(scheme: number): UIColor;

    static preferRadialGradientForScheme(scheme: number): boolean;

    static pressedTextColor(): UIColor;

    static setDefaultButtonTint(buttonTint: UIColor): void;

    static setDefaultPressedTextColor(defaultPressedTextColor: UIColor): void;

    static setDefaultScheme(defaultScheme: number): void;

    static setDefaultTextColor(defaultTextColor: UIColor): void;

    static textColor(): UIColor;
}

declare class GHDefinitionGroup extends GHShapeGroup {
    static alloc(): GHDefinitionGroup; // inherited from NSObject

    static new(): GHDefinitionGroup; // inherited from NSObject
}

declare class GHEllipse extends GHShape {
    static alloc(): GHEllipse; // inherited from NSObject

    static new(): GHEllipse; // inherited from NSObject
}

declare class GHFill extends SVGAttributedObject {
    static alloc(): GHFill; // inherited from NSObject

    static new(): GHFill; // inherited from NSObject
}

declare class GHGlyph extends GHAttributedObject implements GHPathDescription {
    static alloc(): GHGlyph; // inherited from NSObject

    static new(): GHGlyph; // inherited from NSObject

    static positionGlyphsAlongCGPath(listOfGlyphs: NSArray<any> | any[], aPath: any): void;

    static rectForGlyphs(listOfGlyphs: NSArray<any> | any[]): CGRect;

    readonly boundingBox: CGRect;

    readonly font: UIFont;

    readonly glyph: number;

    readonly notRendering: boolean;

    readonly offset: CGPoint;

    readonly renderPoint: CGPoint;

    readonly rotationAngleInRadians: number;

    readonly runRect: CGRect;

    readonly textAttributes: NSDictionary<any, any>;

    readonly transform: CGAffineTransform;

    readonly width: number;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly fillDescription: string; // inherited from GHPathDescription

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly strokeDescription: string; // inherited from GHPathDescription

    readonly strokeWidth: number; // inherited from GHPathDescription

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    constructor(o: {
        dictionary: NSDictionary<any, any>;
        textAttributes: NSDictionary<any, any>;
        font: UIFont;
        glyph: number;
        transform: CGAffineTransform;
        offset: CGPoint;
        runBox: CGRect;
        andWidth: number;
    });

    addPathToContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    initWithDictionaryTextAttributesFontGlyphTransformOffsetRunBoxAndWidth(
        theAttributes: NSDictionary<any, any>,
        textAttributes: NSDictionary<any, any>,
        aFont: UIFont,
        aGlyph: number,
        aTransform: CGAffineTransform,
        offset: CGPoint,
        runRect: CGRect,
        theWidth: number
    ): this;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    isPointInBoundingBox(aPoint: CGPoint): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

interface GHGlyphMaker extends NSObjectProtocol {
    addGlyphsToArrayWithSVGContext(glyphList: NSMutableArray<any>, svgContext: SVGContext): void;

    addGlyphsToContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    newPath(): any;

    renderIntoContextWithSVGContext(quartzContext: any, theContext: SVGContext): void;
}
declare var GHGlyphMaker: {
    prototype: GHGlyphMaker;
};

declare class GHGradient extends GHFill {
    static alloc(): GHGradient; // inherited from NSObject

    static new(): GHGradient; // inherited from NSObject

    fillPathToContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;
}

declare class GHImage extends GHRenderableObject {
    static alloc(): GHImage; // inherited from NSObject

    static new(): GHImage; // inherited from NSObject

    static newImageWithDictionary(theAttributes: NSDictionary<any, any>): GHImage;
}

declare class GHImageCache extends NSObject {
    static aSyncRetrieveCachedImageFromURLIntoCallback(aURL: NSURL, retrievalCallback: (p1: UIImage, p2: NSURL) => void): void;

    static alloc(): GHImageCache; // inherited from NSObject

    static cacheImageForName(anImage: UIImage, aName: string): void;

    static extractFaceImageFromPickedImageWithCallback(anImage: UIImage, callback: (p1: NSError, p2: NSArray<any>, p3: NSArray<any>) => void): void;

    static invalidateImageWithName(aName: string): void;

    static new(): GHImageCache; // inherited from NSObject

    static retrieveCachedImageFromURLIntoCallback(aURL: NSURL, retrievalCallback: (p1: UIImage, p2: NSURL) => void): void;

    static saveImageDataWithNameWithCallback(imageData: NSData, preferredName: string, callback: (p1: UIImage, p2: NSURL) => void): void;

    static setCachedImageForURL(anImage: UIImage, aFileURL: NSURL): void;

    static uncacheImageForName(uniqueName: string): UIImage;

    static uniqueFilenameWithExtension(extension: string): string;
}

declare class GHLine extends GHShape {
    static alloc(): GHLine; // inherited from NSObject

    static new(): GHLine; // inherited from NSObject
}

declare class GHLinearGradient extends GHGradient {
    static alloc(): GHLinearGradient; // inherited from NSObject

    static new(): GHLinearGradient; // inherited from NSObject
}

declare class GHMask extends GHClipGroup {
    static alloc(): GHMask; // inherited from NSObject

    static clipObjectForAttributesWithSVGContext(attributes: NSDictionary<any, any>, svgContext: SVGContext): GHMask; // inherited from GHClipGroup

    static new(): GHMask; // inherited from NSObject
}

declare class GHPath extends GHShape {
    static alloc(): GHPath; // inherited from NSObject

    static new(): GHPath; // inherited from NSObject

    readonly renderingPath: string;
}

interface GHPathDescription extends NSObjectProtocol {
    fillDescription: string;

    strokeDescription: string;

    strokeWidth: number;
}
declare var GHPathDescription: {
    prototype: GHPathDescription;
};

declare class GHPathUtilities extends NSObject {
    static alloc(): GHPathUtilities; // inherited from NSObject

    static calculateCubicSplineStepFromFromStartPointToEndPointWithControlPoint1WithControlPoint2(startPoint: CGPoint, endPoint: CGPoint, controlPoint1: CGPoint, controlPoint2: CGPoint): number;

    static calculateQuadraticSplineStepFromStartPointToEndPointWithControlPoint(startPoint: CGPoint, endPoint: CGPoint, controlPoint: CGPoint): number;

    static cubicSplineLengthFromStartPointToEndPointWithControlPoint1WithControlPoint2AndStep(
        startPoint: CGPoint,
        endPoint: CGPoint,
        controlPoint1: CGPoint,
        controlPoint2: CGPoint,
        step: number
    ): number;

    static findPointAndVectorAtDistanceIntoPathIntoCallback(length: number, aPath: any, callback: (p1: CGPoint, p2: CGPoint) => void): void;

    static new(): GHPathUtilities; // inherited from NSObject

    static quadraticBezierLengthFromStartPointToEndPointWithControlPointAndStep(startPoint: CGPoint, endPoint: CGPoint, controlPoint: CGPoint, step: number): number;

    static totalLengthOfCGPath(aPath: any): number;
}

declare class GHPolygon extends GHPath {
    static alloc(): GHPolygon; // inherited from NSObject

    static new(): GHPolygon; // inherited from NSObject
}

declare class GHPolyline extends GHPath {
    static alloc(): GHPolyline; // inherited from NSObject

    static new(): GHPolyline; // inherited from NSObject
}

declare class GHRadialGradient extends GHGradient {
    static alloc(): GHRadialGradient; // inherited from NSObject

    static new(): GHRadialGradient; // inherited from NSObject
}

declare class GHRectangle extends GHShape {
    static alloc(): GHRectangle; // inherited from NSObject

    static new(): GHRectangle; // inherited from NSObject
}

interface GHRenderable extends NSObjectProtocol {
    attributes: NSDictionary<any, any>;

    hidden: boolean;

    transform: CGAffineTransform;

    addToClipForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    addToClipPathForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    findRenderableObjectWithSVGContext(testPoint: CGPoint, svgContext: SVGContext): GHRenderable;

    getBoundingBoxWithSVGContext(svgContext: SVGContext): CGRect;

    getClippingTypeWithSVGContext(svgContext: SVGContext): number;

    renderIntoContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;
}
declare var GHRenderable: {
    prototype: GHRenderable;
};

declare class GHRenderableObject extends SVGAttributedObject implements GHRenderable {
    static alloc(): GHRenderableObject; // inherited from NSObject

    static boundingBoxForRenderableObjectWithSVGContextGivenParentObjectsBounds(anObject: GHRenderable, svgContext: SVGContext, parentBounds: CGRect): CGRect;

    static new(): GHRenderableObject; // inherited from NSObject

    static setupContextWithAttributesWithSVGContext(quartzContext: any, attributes: NSDictionary<any, any>, svgContext: SVGContext): void;

    readonly defaultFillColor: string;

    fillColor: UIColor;

    transform: CGAffineTransform;

    readonly attributes: NSDictionary<any, any>; // inherited from GHRenderable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly hidden: boolean; // inherited from GHRenderable

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    addNamedObjects(namedObjectsMap: NSMutableDictionary<any, any>): void;

    addToClipForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    addToClipPathForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    findRenderableObjectWithSVGContext(testPoint: CGPoint, svgContext: SVGContext): GHRenderable;

    getBoundingBoxWithSVGContext(svgContext: SVGContext): CGRect;

    getClippingTypeWithSVGContext(svgContext: SVGContext): number;

    hitTest(testPoint: CGPoint): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    renderIntoContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    valueForStyleAttributeWithSVGContext(attributeName: string, svgContext: SVGContext): string;
}

declare class GHRenderableObjectPlaceholder extends GHRenderableObject {
    static alloc(): GHRenderableObjectPlaceholder; // inherited from NSObject

    static new(): GHRenderableObjectPlaceholder; // inherited from NSObject

    concreteObjectForSVGContextExcludingPrevious(svgContext: SVGContext, setToAvoidLoops: NSMutableSet<any>): GHRenderableObject;
}

declare class GHSegmentedControl extends GHControl {
    static alloc(): GHSegmentedControl; // inherited from NSObject

    static appearance(): GHSegmentedControl; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): GHSegmentedControl; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): GHSegmentedControl; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHSegmentedControl; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): GHSegmentedControl; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): GHSegmentedControl; // inherited from UIAppearance

    static makeSureLoaded(): void;

    static new(): GHSegmentedControl; // inherited from NSObject

    apportionsSegmentWidthsByContent: boolean;

    momentary: boolean;

    readonly numberOfSegments: number;

    selectedSegmentIndex: number;

    constructor(o: { items: NSArray<any> | any[] });

    accessibilityLabelForSegmentedIndex(segment: number): string;

    initWithItems(items: NSArray<any> | any[]): this;

    insertSegmentWithRendererAccessibilityLabelAtIndexAnimated(renderer: SVGRenderer, accessibilityLabel: string, segment: number, animated: boolean): void;

    insertSegmentWithRendererAtIndexAnimated(renderer: SVGRenderer, segment: number, animated: boolean): void;

    insertSegmentWithTitleAtIndexAnimated(title: string, segment: number, animated: boolean): void;

    isEnabledForSegmentAtIndex(segment: number): boolean;

    removeAllSegments(): void;

    removeSegmentAtIndexAnimated(segment: number, animated: boolean): void;

    rendererForSegmentedIndex(segment: number): SVGRenderer;

    setAccessibilityLabelForSegmentIndex(accessibilityLabel: string, segment: number): void;

    setEnabledForSegmentAtIndex(enabled: boolean, segment: number): void;

    setRendererForSegmentedIndex(renderer: SVGRenderer, segment: number): void;

    setTitleForSegmentAtIndex(title: string, segment: number): void;

    setWidthForSegmentAtIndex(width: number, segment: number): void;

    titleForSegmentAtIndex(segment: number): string;

    widthForSegmentAtIndex(segment: number): number;
}

declare class GHShape extends GHRenderableObject {
    static alloc(): GHShape; // inherited from NSObject

    static new(): GHShape; // inherited from NSObject

    readonly isClosed: boolean;

    readonly isFillable: boolean;

    readonly quartzPath: any;
}

declare class GHShapeGroup extends SVGAttributedObject implements GHRenderable {
    static alloc(): GHShapeGroup; // inherited from NSObject

    static new(): GHShapeGroup; // inherited from NSObject

    childDefinitions: NSArray<any>;

    readonly children: NSArray<any>;

    readonly attributes: NSDictionary<any, any>; // inherited from GHRenderable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly hidden: boolean; // inherited from GHRenderable

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly transform: CGAffineTransform; // inherited from GHRenderable

    readonly; // inherited from NSObjectProtocol

    addNamedObjects(namedObjectsMap: NSMutableDictionary<any, any>): void;

    addToClipForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    addToClipPathForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    findRenderableObjectWithSVGContext(testPoint: CGPoint, svgContext: SVGContext): GHRenderable;

    getBoundingBoxWithSVGContext(svgContext: SVGContext): CGRect;

    getClippingTypeWithSVGContext(svgContext: SVGContext): number;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    renderIntoContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class GHSolidColor extends GHFill {
    static alloc(): GHSolidColor; // inherited from NSObject

    static new(): GHSolidColor; // inherited from NSObject

    asColorWithSVGContext(svgContext: SVGContext): UIColor;
}

declare class GHStyle extends SVGAttributedObject {
    static alloc(): GHStyle; // inherited from NSObject

    static new(): GHStyle; // inherited from NSObject

    readonly classes: NSDictionary<string, GHCSSStyle>;

    readonly styleType: StyleElementType;
}

declare class GHSwitchGroup extends GHShapeGroup {
    static alloc(): GHSwitchGroup; // inherited from NSObject

    static new(): GHSwitchGroup; // inherited from NSObject
}

declare class GHText extends GHRenderableObject implements GHPathDescription {
    static alloc(): GHText; // inherited from NSObject

    static new(): GHText; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly fillDescription: string; // inherited from GHPathDescription

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly strokeDescription: string; // inherited from GHPathDescription

    readonly strokeWidth: number; // inherited from GHPathDescription

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    addGlyphsToArrayWithSVGContext(glyphList: NSMutableArray<any>, svgContext: SVGContext): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class GHTextArea extends GHText {
    static alloc(): GHTextArea; // inherited from NSObject

    static new(): GHTextArea; // inherited from NSObject

    readonly text: NSAttributedString;
}

declare class GHTextLine extends GHAttributedObject implements GHGlyphMaker, GHPathDescription {
    static alloc(): GHTextLine; // inherited from NSObject

    static new(): GHTextLine; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly fillDescription: string; // inherited from GHPathDescription

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly strokeDescription: string; // inherited from GHPathDescription

    readonly strokeWidth: number; // inherited from GHPathDescription

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    constructor(o: { attributes: NSDictionary<any, any>; andTextLine: any });

    addGlyphsToArrayWithSVGContext(glyphList: NSMutableArray<any>, svgContext: SVGContext): void;

    addGlyphsToContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getBoundingBoxWithSVGContext(svgContext: SVGContext): CGRect;

    initWithAttributesAndTextLine(theAttributes: NSDictionary<any, any>, lineRef: any): this;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    newPath(): any;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    renderIntoContextWithSVGContext(quartzContext: any, theContext: SVGContext): void;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare function GetNextCoordinate(
    buffer: string | interop.Pointer | interop.Reference<any>,
    indexPtr: interop.Pointer | interop.Reference<number>,
    bufferLength: number,
    failed: interop.Pointer | interop.Reference<boolean>
): number;

declare class GzipInputStream extends NSInputStream {
    static alloc(): GzipInputStream; // inherited from NSObject

    static inputStreamWithData(data: NSData): GzipInputStream; // inherited from NSInputStream

    static inputStreamWithFileAtPath(path: string): GzipInputStream; // inherited from NSInputStream

    static inputStreamWithURL(url: NSURL): GzipInputStream; // inherited from NSInputStream

    static new(): GzipInputStream; // inherited from NSObject

    readData(bufferSize: number): NSData;

    readLine(): string;
}

declare var IDZGunzipErrorDomain: string;

declare function IsStringURL(aString: string): boolean;

declare function MakeSureSVGghLinks(): void;

declare function MorphColorString(oldSVGColorString: string, newSVGColorString: string, fractionThere: number): string;

declare class PathValidationResult extends NSObject {
    static alloc(): PathValidationResult; // inherited from NSObject

    static new(): PathValidationResult; // inherited from NSObject

    readonly errorCode: SVGPathValidationError;

    readonly errorInLastOperation: boolean;

    readonly operatorAtError: number;

    readonly rangeOfError: NSRange;

    readonly unexpectedCharacters: string;
}

declare const enum PrintingResults {
    kSuccessfulPrintingResult = 0,

    kCouldntCreatePrintingDataResult = 1,

    kCouldntInterfaceWithPrinterResult = 2,

    kPrintingErrorResult = 3,
}

declare function SVGArcFromSensibleParameters(xRadius: number, yRadius: number, xAxisRotationDegrees: number, startAngle: number, endAngle: number): string;

declare class SVGAttributedObject extends GHAttributedObject {
    static alloc(): SVGAttributedObject; // inherited from NSObject

    static new(): SVGAttributedObject; // inherited from NSObject

    environmentOKWithISOCode(isoLanguage: string): boolean;

    environmentOKWithSVGContext(svgContext: SVGContext): boolean;

    hidden(): boolean;
}

interface SVGContext {
    absoluteURL(absolutePath: string): NSURL;

    attributeNamedClassesEntityName(attributeName: string, listOfClasses: NSArray<string> | string[], entityName: string): string;

    colorForSVGColorString(svgColorString: string): UIColor;

    currentColor(): UIColor;

    explicitLineScaling(): number;

    hasCSSAttributes(): boolean;

    isoLanguage(): string;

    objectAtURL(aLocation: string): any;

    objectNamed(objectName: string): any;

    opacity(): number;

    relativeURL(subPath: string): NSURL;

    setCurrentColor(startingCurrentColor: UIColor): void;

    setOpacity(opacity: number): void;
}
declare var SVGContext: {
    prototype: SVGContext;
};

declare class SVGDocumentView extends UIView {
    static alloc(): SVGDocumentView; // inherited from NSObject

    static appearance(): SVGDocumentView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): SVGDocumentView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): SVGDocumentView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGDocumentView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): SVGDocumentView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGDocumentView; // inherited from UIAppearance

    static makeSureLoaded(): void;

    static new(): SVGDocumentView; // inherited from NSObject

    artworkPath: string;

    beTransparent: boolean;

    defaultColor: UIColor;

    renderer: SVGRenderer;

    findRenderableObject(testPoint: CGPoint): GHRenderable;
}

declare class SVGGradientUtilities extends NSObject {
    static alloc(): SVGGradientUtilities; // inherited from NSObject

    static colorSpace(): any;

    static extractFractionFromCoordinateStringGivenDefault(svgFractionOrPercentage: string, defaultValue: number): number;

    static new(): SVGGradientUtilities; // inherited from NSObject
}

declare function SVGMergeStyleAttributes(
    parentAttributes: NSDictionary<any, any>,
    attributesToMergeIn: NSDictionary<any, any>,
    filter: (p1: string, p2: any, p3: any) => boolean
): NSDictionary<any, any>;

declare function SVGMorphStyleAttributes(oldAttributes: NSDictionary<any, any>, newAttributes: NSDictionary<any, any>, fractionThere: number): NSDictionary<any, any>;

declare class SVGParser extends NSObject {
    static alloc(): SVGParser; // inherited from NSObject

    static new(): SVGParser; // inherited from NSObject

    readonly parserError: NSError;

    readonly root: NSDictionary<any, any>;

    readonly svgURL: NSURL;

    constructor(o: { contentsOfURL: NSURL });

    constructor(o: { dataAssetNamed: string; withBundle: NSBundle });

    constructor(o: { inputStream: NSInputStream });

    constructor(o: { resourceName: string; inBundle: NSBundle });

    constructor(o: { string: string });

    absoluteURL(aPath: string): NSURL;

    initWithContentsOfURL(url: NSURL): this;

    initWithDataAssetNamedWithBundle(assetName: string, bundle: NSBundle): this;

    initWithInputStream(inputStream: NSInputStream): this;

    initWithResourceNameInBundle(resourceName: string, bundle: NSBundle): this;

    initWithString(utf8String: string): this;

    relativeURL(subPath: string): NSURL;
}

declare class SVGPathGenerator extends NSObject {
    static alloc(): SVGPathGenerator; // inherited from NSObject

    static findFailure(anSVGPath: string): PathValidationResult;

    static invalidPathCharacters(): NSCharacterSet;

    static maxBoundingBoxForSVGPath(anSVGPath: string): CGRect;

    static new(): SVGPathGenerator; // inherited from NSObject

    static newCGPathFromSVGPathWhileApplyingTransform(anSVGPath: string, aTransform: CGAffineTransform): any;

    static parametersNeededForOperator(svgOperator: number): number;

    static svgPathFromCGPath(aPath: any): string;
}

declare const enum SVGPathValidationError {
    kPathParsingErrorNone = 0,

    kPathParsingErrorMissingNumber = 1,

    kPathParsingErrorExpectedBoolean = 2,

    kPathParsingErrorExpectedDegrees = 3,

    kPathParsingErrorUnknownOperand = 4,

    kPathParsingErrorMissingStart = 5,

    kPathParsingErrorMissingVirtualControlPoint = 6,
}

declare class SVGPrinter extends NSObject {
    static alloc(): SVGPrinter; // inherited from NSObject

    static new(): SVGPrinter; // inherited from NSObject

    static printRendererWithJobNameFromAnchorViewWithCallback(renderer: SVGRenderer, jobName: string, anchorView: UIView, callback: (p1: NSError, p2: PrintingResults) => void): void;

    static printRendererWithJobNameWithCallback(renderer: SVGRenderer, jobName: string, callback: (p1: NSError, p2: PrintingResults) => void): void;
}

declare class SVGRenderer extends SVGParser implements GHRenderable, SVGContext {
    static alloc(): SVGRenderer; // inherited from NSObject

    static new(): SVGRenderer; // inherited from NSObject

    static rendererQueue(): NSOperationQueue;

    cssPseudoClass: CSSPseudoClassFlags;

    readonly viewRect: CGRect;

    readonly attributes: NSDictionary<any, any>; // inherited from GHRenderable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly hidden: boolean; // inherited from GHRenderable

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly transform: CGAffineTransform; // inherited from GHRenderable

    readonly; // inherited from NSObjectProtocol

    absoluteURL(absolutePath: string): NSURL;

    addToClipForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    addToClipPathForContextWithSVGContextObjectBoundingBox(quartzContext: any, svgContext: SVGContext, objectBox: CGRect): void;

    asImageWithSizeAndScale(maximumSize: CGSize, scale: number): UIImage;

    attributeNamedClassesEntityName(attributeName: string, listOfClasses: NSArray<string> | string[], entityName: string): string;

    class(): typeof NSObject;

    colorForSVGColorString(svgColorString: string): UIColor;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    currentColor(): UIColor;

    explicitLineScaling(): number;

    findRenderableObject(testPoint: CGPoint): GHRenderable;

    findRenderableObjectWithSVGContext(testPoint: CGPoint, svgContext: SVGContext): GHRenderable;

    getBoundingBoxWithSVGContext(svgContext: SVGContext): CGRect;

    getClippingTypeWithSVGContext(svgContext: SVGContext): number;

    hasCSSAttributes(): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    isoLanguage(): string;

    objectAtURL(aLocation: string): any;

    objectNamed(objectName: string): any;

    opacity(): number;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    relativeURL(subPath: string): NSURL;

    renderIntoContext(quartzContext: any): void;

    renderIntoContextWithSVGContext(quartzContext: any, svgContext: SVGContext): void;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    setCurrentColor(startingCurrentColor: UIColor): void;

    setOpacity(opacity: number): void;
}

declare class SVGRendererLayer extends CALayer {
    static alloc(): SVGRendererLayer; // inherited from NSObject

    static layer(): SVGRendererLayer; // inherited from CALayer

    static new(): SVGRendererLayer; // inherited from NSObject

    beTransparent: boolean;

    defaultColor: UIColor;

    renderer: SVGRenderer;

    findRenderableObject(testPoint: CGPoint): GHRenderable;
}

declare function SVGStringToRect(serializedRect: string): CGRect;

declare function SVGStringToRectSlow(serializedRect: string): CGRect;

declare class SVGTabBarItem extends UITabBarItem {
    static alloc(): SVGTabBarItem; // inherited from NSObject

    static appearance(): SVGTabBarItem; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): SVGTabBarItem; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): SVGTabBarItem; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGTabBarItem; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): SVGTabBarItem; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGTabBarItem; // inherited from UIAppearance

    static makeSureLoaded(): void;

    static new(): SVGTabBarItem; // inherited from NSObject

    artworkPath: string;

    baseColor: UIColor;

    selectedArtworkPath: string;

    selectedColor: UIColor;
}

declare class SVGTextUtilities extends NSObject {
    static alloc(): SVGTextUtilities; // inherited from NSObject

    static attributedStringFromStringNonFontSVGStyleAttributesBaseFontBaseFontDescriptorIncludeParagraphStyle(
        text: string,
        nonFontSVGStyleAttributes: NSDictionary<any, any>,
        baseFont: UIFont,
        baseFontDescriptor: UIFontDescriptor,
        includeParagraphStyle: boolean
    ): NSAttributedString;

    static attributedStringFromStringSVGStyleAttributesBaseFontBaseFontDescriptorIncludeParagraphStyle(
        text: string,
        styleAttributes: NSDictionary<any, any>,
        baseFont: UIFont,
        baseFontDescriptor: UIFontDescriptor,
        includeParagraphStyle: boolean
    ): NSAttributedString;

    static cleanXMLText(sourceText: string): string;

    static coreTextAttributesFromSVGStyleAttributes(svgStyle: NSDictionary<any, any>): NSDictionary<any, any>;

    static coreTextAttributesFromSVGStyleAttributesBaseDescriptor(svgStyle: NSDictionary<any, any>, baseDescriptor: UIFontDescriptor): NSDictionary<any, any>;

    static fontAttributesFromSVGAttributes(SVGattributes: NSDictionary<any, any>): NSDictionary<any, any>;

    static new(): SVGTextUtilities; // inherited from NSObject

    static newFontDescriptorFromAttributesBaseDescriptor(attributes: NSDictionary<any, any>, baseDescriptor: UIFontDescriptor): UIFontDescriptor;

    static newFontRefFromFontDescriptor(fontDescriptor: UIFontDescriptor): UIFont;
}

declare class SVGToQuartz extends NSObject {
    static LogQuartzContextState(quartzContext: any): void;

    static alloc(): SVGToQuartz; // inherited from NSObject

    static aspectRatioDrawRectFromStringGivenBoundsNaturalSize(preserveAspectRatioString: string, viewRect: CGRect, naturalSize: CGSize): CGRect;

    static attributeHasDisplaySetToNone(attributes: NSDictionary<any, any>): boolean;

    static dictionaryForStyleAttributeString(styleString: string): NSDictionary<any, any>;

    static imageAtXLinkPathOrAtRelativeFilePathWithSVGContextIntoCallback(
        xLinkPath: string,
        relativeFilePath: string,
        svgContext: SVGContext,
        retrievalCallback: (p1: UIImage, p2: NSURL) => void
    ): void;

    static new(): SVGToQuartz; // inherited from NSObject

    static setupBlendModeForQuartzContextWithBlendModeString(quartzContext: any, blendModeString: string): void;

    static setupColorForQuartzContextWithColorStringWithSVGContext(quartzContext: any, colorString: string, svgContext: SVGContext): void;

    static setupLineDashForQuartzContextWithSVGDashArrayAndPhase(quartzContext: any, strokeDashString: string, phaseString: string): void;

    static setupLineEndForQuartzContextWithSVGLineEndString(quartzContext: any, lineCapString: string): void;

    static setupLineWidthForQuartzContextWithSVGStrokeStringWithVectorEffectWithSVGContext(quartzContext: any, strokeString: string, vectorEffect: string, svgContext: SVGContext): void;

    static setupMiterForQuartzContextWithSVGMiterString(quartzContext: any, miterString: string): void;

    static setupMiterLimitForQuartzContextWithSVGMiterLimitString(quartzContext: any, miterLimitString: string): void;

    static setupOpacityForQuartzContextWithSVGOpacity(quartzContext: any, opacityString: string): void;

    static setupOpacityForQuartzContextWithSVGOpacityWithSVGContext(quartzContext: any, opacityString: string, svgContext: SVGContext): void;

    static styleAttributeStringForDictionary(styleDictionary: NSDictionary<any, any>): string;

    static valueForStyleAttributeFromDefinition(attributeName: string, elementAttributes: NSDictionary<any, any>): string;

    static valueForStyleAttributeFromDefinitionForEnityNameWithSVGContext(attributeName: string, elementAttributes: NSDictionary<any, any>, entityTypeName: string, svgContext: SVGContext): string;
}

declare function SVGTransformMorph(oldtransform: string, newTransform: string, fractionThere: number): string;

declare function SVGTransformToCGAffineTransform(transformAttribute: string): CGAffineTransform;

declare function SVGTransformToCGAffineTransformSlow(transformAttribute: string): CGAffineTransform;

interface SVGghLoader {
    loadRenderForSVGIdentifierInBundle(identifier: string, bundle: NSBundle): SVGRenderer;
}
declare var SVGghLoader: {
    prototype: SVGghLoader;
};

declare class SVGghLoaderManager extends NSObject {
    static alloc(): SVGghLoaderManager; // inherited from NSObject

    static loader(): SVGghLoader;

    static new(): SVGghLoaderManager; // inherited from NSObject

    static setLoader(loader: SVGghLoader): void;

    static setLoaderToType(type: SVGghLoaderType): void;
}

declare const enum SVGghLoaderType {
    Default = 0,

    Path = 1,

    DataXCAsset = 2,
}

declare var SVGghVersionNumber: number;

declare var SVGghVersionString: interop.Reference<number>;

declare class SVGtoPDFConverter extends NSObject {
    static alloc(): SVGtoPDFConverter; // inherited from NSObject

    static createPDFFromRendererIntoCallback(aRenderer: SVGRenderer, callback: (p1: NSData) => void): void;

    static new(): SVGtoPDFConverter; // inherited from NSObject
}

declare function StandardPathAttributes(): NSSet<any>;

declare const enum StyleElementType {
    kStyleTypeUnsupported = 0,

    kStyleTypeCSS = 1,
}

declare function UIColorFromSVGColorString(stringToConvert: string): UIColor;

declare function UIColorFromSVGColorStringFunction(stringToConvert: string): UIColor;

declare function UnquotedSVGString(possiblyQuotedString: string): string;

declare var kAttributesElementName: string;

declare var kBlackInHex: string;

declare const kColorSchemeClear: number;

declare const kColorSchemeEmpty: number;

declare const kColorSchemeFlatAndBoxy: number;

declare const kColorSchemeHomeTheatre: number;

declare const kColorSchemeKeyboard: number;

declare const kColorSchemeMachine: number;

declare const kColorSchemeNone: number;

declare const kColorSchemeTVOS: number;

declare const kColorSchemeiOS: number;

declare const kColorSchemeiOSVersionAppropriate: number;

declare var kColoringRenderingIntent: CGColorRenderingIntent;

declare var kColoringRenderingIntentVar: CGColorRenderingIntent;

declare var kContentsElementName: string;

declare var kDegreesToRadiansConstant: number;

declare var kElementData: string;

declare var kElementName: string;

declare var kElementText: string;

declare const kEvenOddPathClippingType: number;

declare var kFacesAddedKey: string;

declare var kFacesAddedToCacheNotificationName: string;

declare var kFacesURLsAddedKey: string;

declare const kFontGlyphClippingType: number;

declare var kImageAddedKey: string;

declare var kImageAddedToCacheNotificationName: string;

declare const kImageClipplingType: number;

declare var kImageURLAddedKey: string;

declare const kLastColorScheme: number;

declare var kLengthIntoParentsContents: string;

declare const kMixedClippingType: number;

declare const kNoClippingType: number;

declare const kPathClippingType: number;

declare var kRingThickness: number;

declare var kRoundButtonRadius: number;

declare var kShadowInset: number;

declare var kWhiteInHex: string;
