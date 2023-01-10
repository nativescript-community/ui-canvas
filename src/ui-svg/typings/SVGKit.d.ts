/* eslint-disable no-redeclare */
/* eslint-disable no-var */
declare class AppleSucksDOMImplementation extends NSObject {
    static alloc(): AppleSucksDOMImplementation; // inherited from NSObject

    static new(): AppleSucksDOMImplementation; // inherited from NSObject

    createDocumentQualifiedNameDoctype(namespaceURI: string, qualifiedName: string, doctype: DocumentType): Document;

    createDocumentTypePublicIdSystemId(qualifiedName: string, publicId: string, systemId: string): DocumentType;

    hasFeatureVersion(feature: string, version: string): boolean;
}

declare class Attr extends Node {
    static alloc(): Attr; // inherited from NSObject

    static new(): Attr; // inherited from NSObject

    readonly name: string;

    readonly ownerElement: Element;

    readonly specified: boolean;

    readonly value: string;

    constructor(o: { name: string; value: string });

    constructor(o: { namespace: string; qualifiedName: string; value: string });

    initWithNameValue(n: string, v: string): this;

    initWithNamespaceQualifiedNameValue(ns: string, qn: string, v: string): this;
}

declare class BaseClassForAllSVGBasicShapes extends SVGElement implements ConverterSVGToCALayer, SVGStylable, SVGTransformable {
    static alloc(): BaseClassForAllSVGBasicShapes; // inherited from NSObject

    static new(): BaseClassForAllSVGBasicShapes; // inherited from NSObject

    pathForShapeInRelativeCoords: any;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class CALayerWithChildHitTest extends CALayerWithClipRender {
    static alloc(): CALayerWithChildHitTest; // inherited from NSObject

    static layer(): CALayerWithChildHitTest; // inherited from CALayer

    static new(): CALayerWithChildHitTest; // inherited from NSObject
}

declare class CALayerWithClipRender extends CALayer {
    static alloc(): CALayerWithClipRender; // inherited from NSObject

    static layer(): CALayerWithClipRender; // inherited from CALayer

    static maskLayerInContext(layer: CALayer, ctx: any): void;

    static new(): CALayerWithClipRender; // inherited from NSObject
}

declare class CAShapeLayerWithClipRender extends CAShapeLayer {
    static alloc(): CAShapeLayerWithClipRender; // inherited from NSObject

    static layer(): CAShapeLayerWithClipRender; // inherited from CALayer

    static new(): CAShapeLayerWithClipRender; // inherited from NSObject
}

declare class CAShapeLayerWithHitTest extends CAShapeLayerWithClipRender {
    static alloc(): CAShapeLayerWithHitTest; // inherited from NSObject

    static layer(): CAShapeLayerWithHitTest; // inherited from CALayer

    static new(): CAShapeLayerWithHitTest; // inherited from NSObject
}

declare class CDATASection extends Text {
    static alloc(): CDATASection; // inherited from NSObject

    static new(): CDATASection; // inherited from NSObject
}

declare function CGColorWithSVGColor(color: SVGColor): interop.Unmanaged<any>;

declare function CGPathCreateByOffsettingPath(aPath: any, x: number, y: number): interop.Unmanaged<any>;

declare function CGPathCreateByTranslatingPath(aPath: any, x: number, y: number): interop.Unmanaged<any>;

declare function CGRectFromSVGRect(rect: SVGRect): CGRect;

declare function CGSizeFromSVGRect(rect: SVGRect): CGSize;

declare const enum CSSPrimitiveType {
    S_UNKNOWN = 0,

    S_NUMBER = 1,

    S_PERCENTAGE = 2,

    S_EMS = 3,

    S_EXS = 4,

    S_PX = 5,

    S_CM = 6,

    S_MM = 7,

    S_IN = 8,

    S_PT = 9,

    S_PC = 10,

    S_DEG = 11,

    S_RAD = 12,

    S_GRAD = 13,

    S_MS = 14,

    S_S = 15,

    S_HZ = 16,

    S_KHZ = 17,

    S_DIMENSION = 18,

    S_STRING = 19,

    S_URI = 20,

    S_IDENT = 21,

    S_ATTR = 22,

    S_COUNTER = 23,

    S_RECT = 24,

    S_RGBCOLOR = 25,
}

declare class CSSPrimitiveValue extends CSSValue {
    static alloc(): CSSPrimitiveValue; // inherited from NSObject

    static new(): CSSPrimitiveValue; // inherited from NSObject

    pixelsPerInch: number;

    primitiveType: CSSPrimitiveType;

    getCounterValue(): void;

    getFloatValue(unitType: CSSPrimitiveType): number;

    getRGBColorValue(): void;

    getRectValue(): void;

    getStringValue(): string;

    setFloatValueFloatValue(unitType: CSSPrimitiveType, floatValue: number): void;

    setStringValueStringValue(stringType: CSSPrimitiveType, stringValue: string): void;
}

declare class CSSRule extends NSObject {
    static alloc(): CSSRule; // inherited from NSObject

    static new(): CSSRule; // inherited from NSObject

    cssText: string;

    parentRule: CSSRule;

    parentStyleSheet: CSSStyleSheet;

    type: number;
}

declare class CSSRuleList extends NSObject {
    static alloc(): CSSRuleList; // inherited from NSObject

    static new(): CSSRuleList; // inherited from NSObject

    internalArray: NSMutableArray<any>;

    readonly length: number;

    item(index: number): CSSRule;
}

declare const enum CSSRuleType {
    UNKNOWN_RULE = 0,

    STYLE_RULE = 1,

    CHARSET_RULE = 2,

    IMPORT_RULE = 3,

    MEDIA_RULE = 4,

    FONT_FACE_RULE = 5,

    PAGE_RULE = 6,
}

declare class CSSStyleDeclaration extends NSObject {
    static alloc(): CSSStyleDeclaration; // inherited from NSObject

    static new(): CSSStyleDeclaration; // inherited from NSObject

    cssText: string;

    length: number;

    parentRule: CSSRule;

    getPropertyCSSValue(propertyName: string): CSSValue;

    getPropertyPriority(propertyName: string): string;

    getPropertyValue(propertyName: string): string;

    item(index: number): string;

    removeProperty(propertyName: string): string;

    setPropertyValuePriority(propertyName: string, value: string, priority: string): void;
}

declare class CSSStyleRule extends CSSRule {
    static alloc(): CSSStyleRule; // inherited from NSObject

    static new(): CSSStyleRule; // inherited from NSObject

    selectorText: string;

    style: CSSStyleDeclaration;

    constructor(o: { selectorText: string; styleText: string });

    initWithSelectorTextStyleText(selector: string, styleText: string): this;
}

declare class CSSStyleSheet extends NSObject {
    static alloc(): CSSStyleSheet; // inherited from NSObject

    static new(): CSSStyleSheet; // inherited from NSObject

    cssRules: CSSRuleList;

    ownerRule: CSSRule;

    constructor(o: { string: string });

    deleteRule(index: number): void;

    initWithString(styleSheetBody: string): this;

    insertRuleIndex(rule: string, index: number): number;
}

declare const enum CSSUnitType {
    S_INHERIT = 0,

    S_PRIMITIVE_VALUE = 1,

    S_VALUE_LIST = 2,

    S_CUSTOM = 3,
}

declare class CSSValue extends NSObject {
    static alloc(): CSSValue; // inherited from NSObject

    static new(): CSSValue; // inherited from NSObject

    cssText: string;

    cssValueType: CSSUnitType;

    constructor(o: { unitType: CSSUnitType });

    initWithUnitType(t: CSSUnitType): this;
}

declare class CSSValueList extends CSSValue {
    static alloc(): CSSValueList; // inherited from NSObject

    static new(): CSSValueList; // inherited from NSObject

    readonly length: number;

    item(index: number): CSSValue;
}

declare class CharacterData extends Node {
    static alloc(): CharacterData; // inherited from NSObject

    static new(): CharacterData; // inherited from NSObject

    readonly data: string;

    readonly length: number;

    appendData(arg: string): void;

    deleteDataCount(offset: number, count: number): void;

    insertDataArg(offset: number, arg: string): void;

    replaceDataCountArg(offset: number, count: number, arg: string): void;

    substringDataCount(offset: number, count: number): string;
}

declare class Comment extends CharacterData {
    static alloc(): Comment; // inherited from NSObject

    static new(): Comment; // inherited from NSObject

    constructor(o: { value: string });

    initWithValue(v: string): this;
}

interface ConverterSVGToCALayer extends NSObjectProtocol {
    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;
}
declare var ConverterSVGToCALayer: {
    prototype: ConverterSVGToCALayer;
};

declare class DOMHelperUtilities extends NSObject {
    static alloc(): DOMHelperUtilities; // inherited from NSObject

    static new(): DOMHelperUtilities; // inherited from NSObject

    static privateGetElementByIdChildrenOfElement(idValue: string, parent: Node): Element;

    static privateGetElementsByNameInNamespaceChildrenOfElementAddToList(name: string, namespaceURI: string, parent: Node, accumulator: NodeList): void;
}

declare const enum DOMNodeType {
    ELEMENT_NODE = 1,

    ATTRIBUTE_NODE = 2,

    TEXT_NODE = 3,

    CDATA_SECTION_NODE = 4,

    ENTITY_REFERENCE_NODE = 5,

    ENTITY_NODE = 6,

    PROCESSING_INSTRUCTION_NODE = 7,

    COMMENT_NODE = 8,

    DOCUMENT_NODE = 9,

    DOCUMENT_TYPE_NODE = 10,

    DOCUMENT_FRAGMENT_NODE = 11,

    NOTATION_NODE = 12,
}

declare class Document extends Node {
    static alloc(): Document; // inherited from NSObject

    static new(): Document; // inherited from NSObject

    readonly doctype: DocumentType;

    documentElement: Element;

    readonly implementation: AppleSucksDOMImplementation;

    createAttribute(data: string): Attr;

    createAttributeNSQualifiedName(namespaceURI: string, qualifiedName: string): Attr;

    createCDATASection(data: string): CDATASection;

    createComment(data: string): Comment;

    createDocumentFragment(): DocumentFragment;

    createElement(tagName: string): Element;

    createElementNSQualifiedName(namespaceURI: string, qualifiedName: string): Element;

    createEntityReference(data: string): EntityReference;

    createProcessingInstructionData(target: string, data: string): ProcessingInstruction;

    createTextNode(data: string): Text;

    getElementById(elementId: string): Element;

    getElementsByTagName(data: string): NodeList;

    getElementsByTagNameNSLocalName(namespaceURI: string, localName: string): NodeList;

    importNodeDeep(importedNode: Node, deep: boolean): Node;
}

interface DocumentCSS extends DocumentStyle {
    getOverrideStylePseudoElt(element: Element, pseudoElt: string): CSSStyleDeclaration;
}
declare var DocumentCSS: {
    prototype: DocumentCSS;
};

declare class DocumentFragment extends Node {
    static alloc(): DocumentFragment; // inherited from NSObject

    static new(): DocumentFragment; // inherited from NSObject
}

interface DocumentStyle extends NSObjectProtocol {
    styleSheets: StyleSheetList;
}
declare var DocumentStyle: {
    prototype: DocumentStyle;
};

declare class DocumentType extends Node {
    static alloc(): DocumentType; // inherited from NSObject

    static new(): DocumentType; // inherited from NSObject

    readonly entities: NamedNodeMap;

    readonly internalSubset: string;

    readonly name: string;

    readonly notations: NamedNodeMap;

    readonly publicId: string;

    readonly systemId: string;
}

declare class Element extends Node {
    static alloc(): Element; // inherited from NSObject

    static new(): Element; // inherited from NSObject

    readonly tagName: string;

    constructor(o: { localName: string; attributes: NSMutableDictionary<any, any> });

    constructor(o: { qualifiedName: string; inNameSpaceURI: string; attributes: NSMutableDictionary<any, any> });

    getAttribute(name: string): string;

    getAttributeNSLocalName(namespaceURI: string, localName: string): string;

    getAttributeNode(name: string): Attr;

    getAttributeNodeNSLocalName(namespaceURI: string, localName: string): Attr;

    getElementsByTagName(name: string): NodeList;

    getElementsByTagNameNSLocalName(namespaceURI: string, localName: string): NodeList;

    hasAttribute(name: string): boolean;

    hasAttributeNSLocalName(namespaceURI: string, localName: string): boolean;

    initWithLocalNameAttributes(n: string, attributes: NSMutableDictionary<any, any>): this;

    initWithQualifiedNameInNameSpaceURIAttributes(n: string, nsURI: string, attributes: NSMutableDictionary<any, any>): this;

    removeAttribute(name: string): void;

    removeAttributeNSLocalName(namespaceURI: string, localName: string): void;

    removeAttributeNode(oldAttr: Attr): Attr;

    setAttributeNSQualifiedNameValue(namespaceURI: string, qualifiedName: string, value: string): void;

    setAttributeNode(newAttr: Attr): Attr;

    setAttributeNodeNS(newAttr: Attr): Attr;

    setAttributeValue(name: string, value: string): void;
}

declare class EntityReference extends Node {
    static alloc(): EntityReference; // inherited from NSObject

    static new(): EntityReference; // inherited from NSObject
}

declare class MediaList extends NSObject {
    static alloc(): MediaList; // inherited from NSObject

    static new(): MediaList; // inherited from NSObject

    length: number;

    mediaText: string;

    appendMedium(newMedium: string): void;

    deleteMedium(oldMedium: string): void;

    item(index: number): string;
}

declare function NSStringFromSVGRect(rect: SVGRect): string;

declare class NamedNodeMap extends NSObject implements NSCopying {
    static alloc(): NamedNodeMap; // inherited from NSObject

    static new(): NamedNodeMap; // inherited from NSObject

    readonly length: number;

    allNodesUnsortedDOM1(): NSArray<any>;

    allNodesUnsortedDOM2(): NSDictionary<any, any>;

    copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

    getNamedItem(name: string): Node;

    getNamedItemNSLocalName(namespaceURI: string, localName: string): Node;

    item(index: number): Node;

    removeNamedItem(name: string): Node;

    removeNamedItemNSLocalName(namespaceURI: string, localName: string): Node;

    setNamedItem(arg: Node): Node;

    setNamedItemNS(arg: Node): Node;

    setNamedItemNSInNodeNamespace(arg: Node, nodesNamespace: string): Node;
}

declare class Node extends NSObject {
    static alloc(): Node; // inherited from NSObject

    static new(): Node; // inherited from NSObject

    attributes: NamedNodeMap;

    childNodes: NodeList;

    readonly firstChild: Node;

    hasAttributes: boolean;

    hasChildNodes: boolean;

    readonly lastChild: Node;

    localName: string;

    namespaceURI: string;

    readonly nextSibling: Node;

    nodeName: string;

    nodeType: DOMNodeType;

    nodeValue: string;

    ownerDocument: Document;

    parentNode: Node;

    prefix: string;

    readonly previousSibling: Node;

    readonly textContent: string;

    constructor(o: { type: DOMNodeType; name: string });

    constructor(o: { type: DOMNodeType; name: string; inNamespace: string });

    constructor(o: { type: DOMNodeType; name: string; value: string });

    constructor(o: { type: DOMNodeType; name: string; value: string; inNamespace: string });

    appendChild(newChild: Node): Node;

    appendXMLToStringAvailableNamespacesActiveNamespaces(
        outputString: NSMutableString,
        prefixesByKNOWNNamespace: NSDictionary<any, any>,
        prefixesByACTIVENamespace: NSMutableDictionary<any, any>
    ): void;

    cloneNode(deep: boolean): Node;

    initTypeName(nt: DOMNodeType, n: string): this;

    initTypeNameInNamespace(nt: DOMNodeType, n: string, nsURI: string): this;

    initTypeNameValue(nt: DOMNodeType, n: string, v: string): this;

    initTypeNameValueInNamespace(nt: DOMNodeType, n: string, v: string, nsURI: string): this;

    insertBeforeRefChild(newChild: Node, refChild: Node): Node;

    isSupportedFeatureVersion(feature: string, version: string): boolean;

    normalize(): void;

    removeChild(oldChild: Node): Node;

    replaceChildOldChild(newChild: Node, oldChild: Node): Node;
}

declare class NodeList extends NSObject implements NSFastEnumeration {
    static alloc(): NodeList; // inherited from NSObject

    static new(): NodeList; // inherited from NSObject

    internalArray: NSMutableArray<any>;

    readonly length: number;
    [Symbol.iterator](): Iterator<any>;

    item(index: number): Node;
}

declare class ProcessingInstruction extends Node {
    static alloc(): ProcessingInstruction; // inherited from NSObject

    static new(): ProcessingInstruction; // inherited from NSObject

    readonly data: string;

    readonly target: string;

    constructor(o: { processingInstruction: string; value: string });

    initProcessingInstructionValue(target: string, data: string): this;
}

declare class SVGAngle extends NSObject {
    static alloc(): SVGAngle; // inherited from NSObject

    static new(): SVGAngle; // inherited from NSObject

    readonly unitType: SVGKAngleType;

    value: number;

    valueAsString: string;

    valueInSpecifiedUnits: number;

    convertToSpecifiedUnits(unitType: SVGKAngleType): void;

    newValueSpecifiedUnitsValueInSpecifiedUnits(unitType: SVGKAngleType, valueInSpecifiedUnits: number): void;
}

declare class SVGAnimatedPreserveAspectRatio extends NSObject {
    static alloc(): SVGAnimatedPreserveAspectRatio; // inherited from NSObject

    static new(): SVGAnimatedPreserveAspectRatio; // inherited from NSObject

    readonly animVal: SVGPreserveAspectRatio;

    baseVal: SVGPreserveAspectRatio;
}

declare class SVGCircleElement extends SVGEllipseElement {
    static alloc(): SVGCircleElement; // inherited from NSObject

    static new(): SVGCircleElement; // inherited from NSObject

    readonly r: number;
}

declare class SVGClipPathElement extends SVGElement implements SVGStylable, SVGTransformable {
    static alloc(): SVGClipPathElement; // inherited from NSObject

    static new(): SVGClipPathElement; // inherited from NSObject

    readonly clipPathUnits: SVG_UNIT_TYPE;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayerToMaskLayer(layer: CALayer, maskThis: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

interface SVGColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
declare var SVGColor: interop.StructType<SVGColor>;

declare function SVGColorFromString(string: string | interop.Pointer | interop.Reference<any>): SVGColor;

declare function SVGColorMake(r: number, g: number, b: number, a: number): SVGColor;

interface SVGCurve {
    type: SVGCurveType;
    c1: CGPoint;
    c2: CGPoint;
    p: CGPoint;
}
declare var SVGCurve: interop.StructType<SVGCurve>;

declare const enum SVGCurveType {
    Point = 0,

    Cubic = 1,

    Quadratic = 2,
}

declare class SVGDefsElement extends SVGElement {
    static alloc(): SVGDefsElement; // inherited from NSObject

    static new(): SVGDefsElement; // inherited from NSObject
}

declare class SVGDescriptionElement extends SVGElement {
    static alloc(): SVGDescriptionElement; // inherited from NSObject

    static new(): SVGDescriptionElement; // inherited from NSObject
}

declare class SVGDocument extends Document {
    static alloc(): SVGDocument; // inherited from NSObject

    static new(): SVGDocument; // inherited from NSObject

    URL: string;

    domain: string;

    referrer: string;

    rootElement: SVGSVGElement;

    title: string;

    allPrefixesByNamespace(): NSMutableDictionary<any, any>;

    allPrefixesByNamespaceNormalized(): NSMutableDictionary<any, any>;
}

declare class SVGElement extends Element implements SVGStylable {
    static alloc(): SVGElement; // inherited from NSObject

    static new(): SVGElement; // inherited from NSObject

    static shouldStoreContent(): boolean;

    identifier: string;

    rootOfCurrentDocumentFragment: SVGSVGElement;

    viewportElement: SVGElement;

    xmlbase: string;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    cascadedValueForStylableProperty(stylableProperty: string): string;

    cascadedValueForStylablePropertyInherit(stylableProperty: string, inherit: boolean): string;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getAttributeAsSVGLength(attributeName: string): SVGLength;

    getPresentationAttribute(name: string): CSSValue;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    loadDefaults(): void;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    postProcessAttributesAddingErrorsTo(parseResult: SVGKParseResult): void;

    reCalculateAndSetViewportElementReferenceUsingFirstSVGAncestor(firstAncestor: SVGElement): void;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGElementInstance extends NSObject {
    static alloc(): SVGElementInstance; // inherited from NSObject

    static new(): SVGElementInstance; // inherited from NSObject

    childNodes: SVGElementInstanceList;

    correspondingElement: SVGElement;

    correspondingUseElement: SVGUseElement;

    readonly firstChild: SVGElementInstance;

    readonly lastChild: SVGElementInstance;

    readonly nextSibling: SVGElementInstance;

    parentNode: SVGElementInstance;

    readonly previousSibling: SVGElementInstance;
}

declare class SVGElementInstanceList extends SVGElement {
    static alloc(): SVGElementInstanceList; // inherited from NSObject

    static new(): SVGElementInstanceList; // inherited from NSObject

    internalArray: NSMutableArray<any>;

    readonly length: number;

    item(index: number): SVGElementInstance;
}

declare class SVGEllipseElement extends BaseClassForAllSVGBasicShapes {
    static alloc(): SVGEllipseElement; // inherited from NSObject

    static new(): SVGEllipseElement; // inherited from NSObject

    readonly cx: number;

    readonly cy: number;

    readonly rx: number;

    readonly ry: number;
}

interface SVGFitToViewBox extends NSObjectProtocol {
    preserveAspectRatio: SVGAnimatedPreserveAspectRatio;

    viewBox: SVGRect;
}
declare var SVGFitToViewBox: {
    prototype: SVGFitToViewBox;
};

declare class SVGGElement extends SVGElement implements ConverterSVGToCALayer, SVGStylable, SVGTransformable {
    static alloc(): SVGGElement; // inherited from NSObject

    static new(): SVGGElement; // inherited from NSObject

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGGradientElement extends SVGElement implements SVGTransformable {
    static alloc(): SVGGradientElement; // inherited from NSObject

    static new(): SVGGradientElement; // inherited from NSObject

    readonly colors: NSArray<any>;

    readonly gradientUnits: SVG_UNIT_TYPE;

    readonly locations: NSArray<any>;

    readonly spreadMethod: SVGSpreadMethod;

    readonly stops: NSArray<any>;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    addStop(gradientStop: SVGGradientStop): void;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getAttributeInheritedIfNil(attrName: string): string;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    newGradientLayerForObjectRectViewportRectTransform(objectRect: CGRect, viewportRect: SVGRect, transform: CGAffineTransform): SVGGradientLayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    synthesizeProperties(): void;
}

declare class SVGGradientLayer extends CAGradientLayer {
    static alloc(): SVGGradientLayer; // inherited from NSObject

    static layer(): SVGGradientLayer; // inherited from CALayer

    static new(): SVGGradientLayer; // inherited from NSObject

    absoluteTransform: CGAffineTransform;

    gradientElement: SVGGradientElement;

    objectRect: CGRect;

    viewportRect: SVGRect;
}

declare class SVGGradientStop extends SVGElement {
    static alloc(): SVGGradientStop; // inherited from NSObject

    static new(): SVGGradientStop; // inherited from NSObject

    readonly offset: number;

    readonly stopColor: SVGColor;

    readonly stopOpacity: number;
}

declare class SVGGroupElement extends SVGElement implements ConverterSVGToCALayer {
    static alloc(): SVGGroupElement; // inherited from NSObject

    static new(): SVGGroupElement; // inherited from NSObject

    readonly opacity: number;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGHelperUtilities extends NSObject {
    static alloc(): SVGHelperUtilities; // inherited from NSObject

    static configureCALayerUsingElement(layer: CALayer, nonStylableElement: SVGElement): void;

    static getGradientLayerWithIdForElementWithRectTransform(gradId: string, svgElement: SVGElement, r: CGRect, transform: CGAffineTransform): SVGGradientLayer;

    static new(): SVGHelperUtilities; // inherited from NSObject

    static newCALayerForPathBasedSVGElementWithPath(svgElement: SVGElement, path: any): CALayer;

    static parseFillForElement(svgElement: SVGElement): any;

    static parsePreserveAspectRatioFor(element: Element): void;

    static parseStrokeForElement(svgElement: SVGElement): any;

    static transformAbsoluteIncludingViewportForTransformableOrViewportEstablishingElement(transformableOrSVGSVGElement: SVGElement): CGAffineTransform;

    static transformRelativeIncludingViewportForTransformableOrViewportEstablishingElement(transformableOrSVGSVGElement: SVGElement): CGAffineTransform;
}

declare class SVGImageElement extends SVGElement implements ConverterSVGToCALayer, SVGFitToViewBox, SVGStylable, SVGTransformable {
    static alloc(): SVGImageElement; // inherited from NSObject

    static new(): SVGImageElement; // inherited from NSObject

    readonly height: number;

    readonly href: string;

    readonly width: number;

    readonly x: number;

    readonly y: number;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    preserveAspectRatio: SVGAnimatedPreserveAspectRatio; // inherited from SVGFitToViewBox

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    viewBox: SVGRect; // inherited from SVGFitToViewBox

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare const enum SVGKAngleType {
    G_ANGLETYPE_UNKNOWN = 0,

    G_ANGLETYPE_UNSPECIFIED = 1,

    G_ANGLETYPE_DEG = 2,

    G_ANGLETYPE_RAD = 3,

    G_ANGLETYPE_GRAD = 4,
}

declare class SVGKExporterNSData extends NSObject {
    static alloc(): SVGKExporterNSData; // inherited from NSObject

    static exportAsNSData(image: SVGKImage): NSData;

    static exportAsNSDataAntiAliasedCurveFlatnessFactorInterpolationQualityFlipYaxis(
        image: SVGKImage,
        shouldAntialias: boolean,
        multiplyFlatness: number,
        interpolationQuality: CGInterpolationQuality,
        flipYaxis: boolean
    ): NSData;

    static exportAsNSDataFlipYaxis(image: SVGKImage, flipYaxis: boolean): NSData;

    static new(): SVGKExporterNSData; // inherited from NSObject
}

declare class SVGKExporterUIImage extends NSObject {
    static alloc(): SVGKExporterUIImage; // inherited from NSObject

    static exportAsUIImage(image: SVGKImage): UIImage;

    static exportAsUIImageAntiAliasedCurveFlatnessFactorInterpolationQuality(
        image: SVGKImage,
        shouldAntialias: boolean,
        multiplyFlatness: number,
        interpolationQuality: CGInterpolationQuality
    ): UIImage;

    static new(): SVGKExporterUIImage; // inherited from NSObject
}

declare class SVGKFastImageView extends SVGKImageView {
    static alloc(): SVGKFastImageView; // inherited from NSObject

    static appearance(): SVGKFastImageView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): SVGKFastImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): SVGKFastImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKFastImageView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): SVGKFastImageView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKFastImageView; // inherited from UIAppearance

    static new(): SVGKFastImageView; // inherited from NSObject

    disableAutoRedrawAtHighestResolution: boolean;

    tileRatio: CGSize;
}

declare function SVGKGetBrokenImageRepresentation(): UIImage;

declare function SVGKGetBrokenImageString(): string;

declare function SVGKGetDefaultContentString(): string;

declare class SVGKImage extends NSObject {
    static alloc(): SVGKImage; // inherited from NSObject

    static animatedImageNamedDuration(name: string, duration: number): UIImage;

    static animatedImageWithImagesDuration(images: NSArray<any> | any[], duration: number): UIImage;

    static animatedResizableImageNamedCapInsetsDuration(name: string, capInsets: UIEdgeInsets, duration: number): UIImage;

    static clearCache(): void;

    static imageAsynchronouslyNamedOnCompletion(name: string, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKParser;

    static imageNamed(name: string): SVGKImage;

    static imageNamedInBundle(name: string, bundle: NSBundle): SVGKImage;

    static imageNamedInBundleWithCacheKey(name: string, bundle: NSBundle, key: string): SVGKImage;

    static imageNamedWithCacheKey(name: string, key: string): SVGKImage;

    static imageParserWithContentsOfFileAsynchronouslyOnCompletion(aPath: string, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKParser;

    static imageParserWithDataAsynchronouslyOnCompletion(newNSData: NSData, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKParser;

    static imageWithContentsOfFile(path: string): SVGKImage;

    static imageWithContentsOfFileAsynchronouslyOnCompletion(aPath: string, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKImage;

    static imageWithContentsOfURL(url: NSURL): SVGKImage;

    static imageWithData(newNSData: NSData): SVGKImage;

    static imageWithDataAsynchronouslyOnCompletion(newNSData: NSData, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKImage;

    static imageWithSource(newSource: SVGKSource): SVGKImage;

    static imageWithSourceOnCompletion(source: SVGKSource, blockCompleted: (p1: SVGKImage, p2: SVGKParseResult) => void): SVGKParser;

    static new(): SVGKImage; // inherited from NSObject

    readonly CALayerTree: CALayer;

    readonly DOMDocument: SVGDocument;

    readonly DOMTree: SVGSVGElement;

    readonly UIImage: UIImage;

    readonly nameUsedToInstantiate: string;

    readonly parseErrorsAndWarnings: SVGKParseResult;

    scale: number;

    size: CGSize;

    readonly source: SVGKSource;

    constructor(o: { contentsOfFile: string });

    constructor(o: { data: NSData });

    constructor(o: { parsedSVG: SVGKParseResult; fromSource: SVGKSource });

    constructor(o: { source: SVGKSource });

    dictionaryOfLayers(): NSDictionary<any, any>;

    drawAsPatternInRect(rect: CGRect): void;

    drawAtPoint(point: CGPoint): void;

    drawAtPointBlendModeAlpha(point: CGPoint, blendMode: CGBlendMode, alpha: number): void;

    drawInRect(rect: CGRect): void;

    drawInRectBlendModeAlpha(rect: CGRect, blendMode: CGBlendMode, alpha: number): void;

    hasSize(): boolean;

    initWithContentsOfFile(path: string): this;

    initWithData(data: NSData): this;

    initWithParsedSVGFromSource(parseResult: SVGKParseResult, parseSource: SVGKSource): this;

    initWithSource(source: SVGKSource): this;

    layerWithIdentifier(identifier: string): CALayer;

    layerWithIdentifierLayer(identifier: string, layer: CALayer): CALayer;

    newCALayerTree(): CALayer;

    newCGContextAutosizedToFit(): any;

    newCopyPositionedAbsoluteLayerWithIdentifier(identifier: string): CALayer;

    newCopyPositionedAbsoluteOfLayer(originalLayer: CALayer): CALayer;

    newCopyPositionedAbsoluteOfLayerWithSubLayers(originalLayer: CALayer, recursive: boolean): CALayer;

    renderInContext(ctx: any): void;

    renderToContextAntiAliasedCurveFlatnessFactorInterpolationQualityFlipYaxis(
        context: any,
        shouldAntialias: boolean,
        multiplyFlatness: number,
        interpolationQuality: CGInterpolationQuality,
        flipYaxis: boolean
    ): void;

    scaleToFitInside(maxSize: CGSize): void;
}

declare class SVGKImageView extends UIView {
    static alloc(): SVGKImageView; // inherited from NSObject

    static appearance(): SVGKImageView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): SVGKImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): SVGKImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKImageView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): SVGKImageView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKImageView; // inherited from UIAppearance

    static new(): SVGKImageView; // inherited from NSObject

    image: SVGKImage;

    showBorder: boolean;

    readonly timeIntervalForLastReRenderOfSVGFromMemory: number;

    constructor(o: { SVGKImage: SVGKImage });

    initWithSVGKImage(im: SVGKImage): this;
}

declare class SVGKLayer extends CALayer {
    static alloc(): SVGKLayer; // inherited from NSObject

    static layer(): SVGKLayer; // inherited from CALayer

    static new(): SVGKLayer; // inherited from NSObject

    SVGImage: SVGKImage;

    endRenderTime: Date;

    showBorder: boolean;

    startRenderTime: Date;
}

declare class SVGKLayeredImageView extends SVGKImageView {
    static alloc(): SVGKLayeredImageView; // inherited from NSObject

    static appearance(): SVGKLayeredImageView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): SVGKLayeredImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): SVGKLayeredImageView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKLayeredImageView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): SVGKLayeredImageView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SVGKLayeredImageView; // inherited from UIAppearance

    static new(): SVGKLayeredImageView; // inherited from NSObject
}

declare class SVGKParseResult extends NSObject {
    static alloc(): SVGKParseResult; // inherited from NSObject

    static new(): SVGKParseResult; // inherited from NSObject

    errorsFatal: NSMutableArray<any>;

    errorsRecoverable: NSMutableArray<any>;

    libXMLFailed: boolean;

    namespacesEncountered: NSMutableDictionary<any, any>;

    parseProgressFractionApproximate: number;

    parsedDocument: SVGDocument;

    rootOfSVGTree: SVGSVGElement;

    warnings: NSMutableArray<any>;

    addParseErrorFatal(fatalError: NSError): void;

    addParseErrorRecoverable(recoverableError: NSError): void;

    addParseWarning(warning: NSError): void;

    addSAXError(saxError: NSError): void;

    addSourceError(fatalError: NSError): void;
}

declare class SVGKParser extends NSObject {
    static NSDictionaryFromCSSAttributes(styleAttribute: Attr): NSDictionary<any, any>;

    static alloc(): SVGKParser; // inherited from NSObject

    static cancelParser(parserToCancel: SVGKParser): void;

    static new(): SVGKParser; // inherited from NSObject

    static newParserWithDefaultSVGKParserExtensions(source: SVGKSource): SVGKParser;

    static parseSourceUsingDefaultSVGKParser(source: SVGKSource): SVGKParseResult;

    readonly currentParseRun: SVGKParseResult;

    readonly externalStylesheets: NSMutableArray<any>;

    parserExtensions: NSMutableArray<any>;

    parserKnownNamespaces: NSMutableDictionary<any, any>;

    readonly source: SVGKSource;

    constructor(o: { source: SVGKSource });

    addDefaultSVGParserExtensions(): void;

    addParserExtension(extension: NSObject): void;

    initWithSource(doc: SVGKSource): this;

    parseSynchronously(): SVGKParseResult;
}

declare class SVGKParserDOM extends NSObject implements SVGKParserExtension {
    static alloc(): SVGKParserDOM; // inherited from NSObject

    static new(): SVGKParserDOM; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}

declare class SVGKParserDefsAndUse extends NSObject implements SVGKParserExtension {
    static alloc(): SVGKParserDefsAndUse; // inherited from NSObject

    static new(): SVGKParserDefsAndUse; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}

interface SVGKParserExtension extends NSObjectProtocol {
    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}
declare var SVGKParserExtension: {
    prototype: SVGKParserExtension;
};

declare class SVGKParserGradient extends SVGKParserSVG {
    static alloc(): SVGKParserGradient; // inherited from NSObject

    static new(): SVGKParserGradient; // inherited from NSObject
}

declare class SVGKParserPatternsAndGradients extends NSObject implements SVGKParserExtension {
    static alloc(): SVGKParserPatternsAndGradients; // inherited from NSObject

    static new(): SVGKParserPatternsAndGradients; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}

declare class SVGKParserSVG extends NSObject implements SVGKParserExtension {
    static alloc(): SVGKParserSVG; // inherited from NSObject

    static new(): SVGKParserSVG; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}

declare class SVGKParserStyles extends NSObject implements SVGKParserExtension {
    static alloc(): SVGKParserStyles; // inherited from NSObject

    static new(): SVGKParserStyles; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    handleEndElementDocumentParseResult(newNode: Node, document: SVGKSource, parseResult: SVGKParseResult): void;

    handleStartElementDocumentNamePrefixNamespaceURIAttributesParseResultParentNode(
        name: string,
        document: SVGKSource,
        prefix: string,
        XMLNSURI: string,
        attributes: NSMutableDictionary<any, any>,
        parseResult: SVGKParseResult,
        parentNode: Node
    ): Node;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    supportedNamespaces(): NSArray<any>;

    supportedTags(): NSArray<any>;
}

declare class SVGKPattern extends NSObject {
    static alloc(): SVGKPattern; // inherited from NSObject

    static new(): SVGKPattern; // inherited from NSObject

    static patternWithColor(color: UIColor): SVGKPattern;

    static patternWithImage(image: UIImage): SVGKPattern;

    color: UIColor;

    CGColor(): any;
}

declare class SVGKPointsAndPathsParser extends NSObject {
    static alloc(): SVGKPointsAndPathsParser; // inherited from NSObject

    static new(): SVGKPointsAndPathsParser; // inherited from NSObject

    static readCloseCommandPathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readCurvetoArgumentPathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readCurvetoArgumentSequencePathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readCurvetoCommandPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readEllipticalArcArgumentsPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readHorizontalLinetoArgumentSequencePathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readHorizontalLinetoCommandPathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readLinetoArgumentSequencePathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readLinetoCommandPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readMovetoArgumentSequencePathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readMovetoDrawtoCommandGroupsPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readMovetoDrawtoPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readMovetoPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readQuadraticCurvetoArgumentPathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readQuadraticCurvetoArgumentSequencePathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readQuadraticCurvetoCommandPathRelativeToIsRelative(scanner: NSScanner, path: any, origin: CGPoint, isRelative: boolean): SVGCurve;

    static readSmoothCurvetoArgumentPathRelativeToWithPrevCurve(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve): SVGCurve;

    static readSmoothCurvetoArgumentSequencePathRelativeToWithPrevCurveIsRelative(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve, isRelative: boolean): SVGCurve;

    static readSmoothCurvetoCommandPathRelativeToWithPrevCurveIsRelative(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve, isRelative: boolean): SVGCurve;

    static readSmoothQuadraticCurvetoArgumentPathRelativeToWithPrevCurve(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve): SVGCurve;

    static readSmoothQuadraticCurvetoArgumentSequencePathRelativeToWithPrevCurve(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve): SVGCurve;

    static readSmoothQuadraticCurvetoCommandPathRelativeToWithPrevCurve(scanner: NSScanner, path: any, origin: CGPoint, prevCurve: SVGCurve): SVGCurve;

    static readVerticalLinetoArgumentSequencePathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static readVerticalLinetoCommandPathRelativeTo(scanner: NSScanner, path: any, origin: CGPoint): SVGCurve;

    static startingCurve(): SVGCurve;
}

declare class SVGKSource extends NSObject implements NSCopying {
    static alloc(): SVGKSource; // inherited from NSObject

    static new(): SVGKSource; // inherited from NSObject

    approximateLengthInBytesOr0: number;

    keyForAppleDictionaries: string;

    stream: NSInputStream;

    svgLanguageVersion: string;

    constructor(o: { forCopying: void });

    constructor(o: { inputSteam: NSInputStream });

    copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

    initForCopying(): this;

    initWithInputSteam(stream: NSInputStream): this;

    sourceFromRelativePath(path: string): SVGKSource;
}

declare class SVGKSourceLocalFile extends SVGKSource {
    static alloc(): SVGKSourceLocalFile; // inherited from NSObject

    static internalSourceAnywhereInBundleUsingName(name: string): SVGKSourceLocalFile;

    static new(): SVGKSourceLocalFile; // inherited from NSObject

    static sourceFromFilename(p: string): SVGKSourceLocalFile;

    filePath: string;

    readonly wasRelative: boolean;
}

declare class SVGKSourceNSData extends SVGKSource {
    static alloc(): SVGKSourceNSData; // inherited from NSObject

    static new(): SVGKSourceNSData; // inherited from NSObject

    static sourceFromDataURLForRelativeLinks(data: NSData, url: NSURL): SVGKSource;

    effectiveURL: NSURL;

    rawData: NSData;
}

declare class SVGKSourceString extends SVGKSource {
    static alloc(): SVGKSourceString; // inherited from NSObject

    static new(): SVGKSourceString; // inherited from NSObject

    static sourceFromContentsOfString(rawString: string): SVGKSource;

    rawString: string;
}

declare class SVGKSourceURL extends SVGKSource {
    static alloc(): SVGKSourceURL; // inherited from NSObject

    static new(): SVGKSourceURL; // inherited from NSObject

    static sourceFromURL(u: NSURL): SVGKSource;

    URL: NSURL;
}

declare const enum SVGKTransformType {
    G_TRANSFORM_UNKNOWN = 0,

    G_TRANSFORM_MATRIX = 1,

    G_TRANSFORM_TRANSLATE = 2,

    G_TRANSFORM_SCALE = 3,

    G_TRANSFORM_ROTATE = 4,

    G_TRANSFORM_SKEWX = 5,

    G_TRANSFORM_SKEWY = 6,
}

declare class SVGKit extends NSObject {
    static alloc(): SVGKit; // inherited from NSObject

    static enableLogging(): void;

    static new(): SVGKit; // inherited from NSObject
}

declare var SVGKitFramework_VersionNumber: number;

declare var SVGKitFramework_VersionString: interop.Reference<number>;

declare class SVGLength extends NSObject {
    static alloc(): SVGLength; // inherited from NSObject

    static new(): SVGLength; // inherited from NSObject

    static svgLengthFromNSString(s: string): SVGLength;

    static svgLengthZero(): SVGLength;

    readonly unitType: SVG_LENGTH_TYPE;

    value: number;

    valueAsString: string;

    valueInSpecifiedUnits: number;

    convertToSpecifiedUnits(unitType: SVG_LENGTH_TYPE): void;

    newValueSpecifiedUnitsValueInSpecifiedUnits(unitType: SVG_LENGTH_TYPE, valueInSpecifiedUnits: number): void;

    numberValue(): number;

    pixelsValue(): number;

    pixelsValueWithDimension(dimension: number): number;

    pixelsValueWithGradientDimension(dimension: number): number;
}

declare const enum SVGLengthAdjust {
    Unknown = 0,

    Spacing = 1,

    SpacingAndGlyphs = 2,
}

declare class SVGLineElement extends BaseClassForAllSVGBasicShapes {
    static alloc(): SVGLineElement; // inherited from NSObject

    static new(): SVGLineElement; // inherited from NSObject

    readonly x1: number;

    readonly x2: number;

    readonly y1: number;

    readonly y2: number;
}

declare class SVGLinearGradientElement extends SVGGradientElement {
    static alloc(): SVGLinearGradientElement; // inherited from NSObject

    static new(): SVGLinearGradientElement; // inherited from NSObject

    readonly x1: SVGLength;

    readonly x2: SVGLength;

    readonly y1: SVGLength;

    readonly y2: SVGLength;
}

declare class SVGMatrix extends NSObject {
    static alloc(): SVGMatrix; // inherited from NSObject

    static new(): SVGMatrix; // inherited from NSObject

    a: number;

    b: number;

    c: number;

    d: number;

    e: number;

    f: number;

    flipX(): SVGMatrix;

    flipY(): SVGMatrix;

    inverse(): SVGMatrix;

    multiply(secondMatrix: SVGMatrix): SVGMatrix;

    rotate(angle: number): SVGMatrix;

    rotateFromVectorY(x: number, y: number): SVGMatrix;

    scale(scaleFactor: number): SVGMatrix;

    scaleNonUniformScaleFactorY(scaleFactorX: number, scaleFactorY: number): SVGMatrix;

    skewX(angle: number): SVGMatrix;

    skewY(angle: number): SVGMatrix;

    translateY(x: number, y: number): SVGMatrix;
}

interface SVGNumber {
    value: number;
}
declare var SVGNumber: interop.StructType<SVGNumber>;

declare class SVGPathElement extends BaseClassForAllSVGBasicShapes {
    static alloc(): SVGPathElement; // inherited from NSObject

    static new(): SVGPathElement; // inherited from NSObject
}

declare function SVGPercentageFromString(string: string | interop.Pointer | interop.Reference<any>): number;

declare class SVGPoint extends NSObject {
    static alloc(): SVGPoint; // inherited from NSObject

    static new(): SVGPoint; // inherited from NSObject

    readonly x: number;

    readonly y: number;

    matrixTransform(matrix: SVGMatrix): SVGPoint;
}

declare class SVGPolygonElement extends BaseClassForAllSVGBasicShapes {
    static alloc(): SVGPolygonElement; // inherited from NSObject

    static new(): SVGPolygonElement; // inherited from NSObject
}

declare class SVGPolylineElement extends BaseClassForAllSVGBasicShapes {
    static alloc(): SVGPolylineElement; // inherited from NSObject

    static new(): SVGPolylineElement; // inherited from NSObject
}

declare class SVGPreserveAspectRatio extends NSObject {
    static alloc(): SVGPreserveAspectRatio; // inherited from NSObject

    static new(): SVGPreserveAspectRatio; // inherited from NSObject

    align: SVG_PRESERVEASPECTRATIO;

    meetOrSlice: SVG_MEETORSLICE;
}

declare class SVGRadialGradientElement extends SVGGradientElement {
    static alloc(): SVGRadialGradientElement; // inherited from NSObject

    static new(): SVGRadialGradientElement; // inherited from NSObject

    readonly cx: SVGLength;

    readonly cy: SVGLength;

    readonly fr: SVGLength;

    readonly fx: SVGLength;

    readonly fy: SVGLength;

    readonly r: SVGLength;
}

interface SVGRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
declare var SVGRect: interop.StructType<SVGRect>;

declare class SVGRectElement extends BaseClassForAllSVGBasicShapes implements SVGStylable, SVGTransformable {
    static alloc(): SVGRectElement; // inherited from NSObject

    static new(): SVGRectElement; // inherited from NSObject

    readonly height: SVGLength;

    readonly rx: SVGLength;

    readonly ry: SVGLength;

    readonly width: SVGLength;

    readonly x: SVGLength;

    readonly y: SVGLength;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

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

declare function SVGRectIsInitialized(rect: SVGRect): boolean;

declare function SVGRectMake(x: number, y: number, width: number, height: number): SVGRect;

declare function SVGRectUninitialized(): SVGRect;

declare class SVGSVGElement extends SVGElement implements ConverterSVGToCALayer, DocumentCSS, SVGFitToViewBox {
    static alloc(): SVGSVGElement; // inherited from NSObject

    static new(): SVGSVGElement; // inherited from NSObject

    readonly aspectRatioFromViewBox: number;

    readonly aspectRatioFromWidthPerHeight: number;

    contentScriptType: string;

    contentStyleType: string;

    currentScale: number;

    currentTranslate: SVGPoint;

    currentView: SVGViewSpec;

    height: SVGLength;

    pixelUnitToMillimeterX: number;

    pixelUnitToMillimeterY: number;

    readonly requestedViewport: SVGRect;

    screenPixelToMillimeterX: number;

    screenPixelToMillimeterY: number;

    source: SVGKSource;

    useCurrentView: boolean;

    viewport: SVGRect;

    width: SVGLength;

    x: SVGLength;

    y: SVGLength;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    preserveAspectRatio: SVGAnimatedPreserveAspectRatio; // inherited from SVGFitToViewBox

    styleSheets: StyleSheetList; // inherited from DocumentStyle

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    viewBox: SVGRect; // inherited from SVGFitToViewBox

    readonly; // inherited from NSObjectProtocol

    animationsPaused(): boolean;

    checkEnclosureRect(element: SVGElement, rect: SVGRect): boolean;

    checkIntersectionRect(element: SVGElement, rect: SVGRect): boolean;

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    createSVGAngle(): SVGAngle;

    createSVGLength(): SVGLength;

    createSVGMatrix(): SVGMatrix;

    createSVGNumber(): SVGNumber;

    createSVGPoint(): SVGPoint;

    createSVGRect(): SVGRect;

    createSVGTransform(): SVGTransform;

    createSVGTransformFromMatrix(matrix: SVGMatrix): SVGTransform;

    deselectAll(): void;

    findFirstElementOfClass(classParameter: typeof NSObject): SVGElement;

    forceRedraw(): void;

    getCurrentTime(): number;

    getElementById(elementId: string): Element;

    getEnclosureListReferenceElement(rect: SVGRect, referenceElement: SVGElement): NodeList;

    getIntersectionListReferenceElement(rect: SVGRect, referenceElement: SVGElement): NodeList;

    getOverrideStylePseudoElt(element: Element, pseudoElt: string): CSSStyleDeclaration;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    pauseAnimations(): void;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;

    setCurrentTime(seconds: number): void;

    suspendRedraw(maxWaitMilliseconds: number): number;

    unpauseAnimations(): void;

    unsuspendRedraw(suspendHandleID: number): void;

    unsuspendRedrawAll(): void;
}

declare const enum SVGSpreadMethod {
    Unkown = 0,

    Pad = 1,

    Reflect = 2,

    Repeat = 3,
}

interface SVGStylable extends NSObjectProtocol {
    className: string;

    style: CSSStyleDeclaration;

    getPresentationAttribute(name: string): CSSValue;
}
declare var SVGStylable: {
    prototype: SVGStylable;
};

interface SVGStyleCatcher extends NSObjectProtocol {
    styleCatchLayerForClass(styledLayer: CALayer, colorIndex: string): void;

    styleCatchOverrideFill(fillClassName: string): UIColor;
}
declare var SVGStyleCatcher: {
    prototype: SVGStyleCatcher;
};

declare class SVGStyleElement extends SVGElement {
    static alloc(): SVGStyleElement; // inherited from NSObject

    static new(): SVGStyleElement; // inherited from NSObject
}

declare class SVGSwitchElement extends SVGElement implements ConverterSVGToCALayer {
    static alloc(): SVGSwitchElement; // inherited from NSObject

    static new(): SVGSwitchElement; // inherited from NSObject

    readonly visibleChildNodes: NodeList;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGTextContentElement extends SVGElement implements SVGStylable {
    static alloc(): SVGTextContentElement; // inherited from NSObject

    static new(): SVGTextContentElement; // inherited from NSObject

    readonly textLength: SVGLength;

    className: string; // inherited from SVGStylable

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    style: CSSStyleDeclaration; // inherited from SVGStylable

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    getPresentationAttribute(name: string): CSSValue;

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

declare class SVGTextElement extends SVGTextPositioningElement implements ConverterSVGToCALayer, SVGTransformable {
    static alloc(): SVGTextElement; // inherited from NSObject

    static new(): SVGTextElement; // inherited from NSObject

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGTextLayer extends CATextLayer {
    static alloc(): SVGTextLayer; // inherited from NSObject

    static layer(): SVGTextLayer; // inherited from CALayer

    static new(): SVGTextLayer; // inherited from NSObject
}

declare class SVGTextPositioningElement extends SVGTextContentElement {
    static alloc(): SVGTextPositioningElement; // inherited from NSObject

    static new(): SVGTextPositioningElement; // inherited from NSObject

    dx: SVGLength;

    dy: SVGLength;

    rotate: SVGLength;

    x: SVGLength;

    y: SVGLength;
}

declare class SVGTitleElement extends SVGElement {
    static alloc(): SVGTitleElement; // inherited from NSObject

    static new(): SVGTitleElement; // inherited from NSObject
}

declare class SVGTransform extends NSObject {
    static alloc(): SVGTransform; // inherited from NSObject

    static new(): SVGTransform; // inherited from NSObject

    readonly angle: number;

    matrix: SVGMatrix;

    type: SVGKTransformType;

    setMatrix(matrix: SVGMatrix): void;

    setRotateCxCy(angle: number, cx: number, cy: number): void;

    setScaleSy(sx: number, sy: number): void;

    setSkewX(angle: number): void;

    setSkewY(angle: number): void;

    setTranslateTy(tx: number, ty: number): void;
}

interface SVGTransformable extends NSObjectProtocol {
    transform: CGAffineTransform;
}
declare var SVGTransformable: {
    prototype: SVGTransformable;
};

declare class SVGUseElement extends SVGElement implements ConverterSVGToCALayer, SVGTransformable {
    static alloc(): SVGUseElement; // inherited from NSObject

    static new(): SVGUseElement; // inherited from NSObject

    animatedInstanceRoot: SVGElementInstance;

    height: SVGLength;

    instanceRoot: SVGElementInstance;

    width: SVGLength;

    x: SVGLength;

    y: SVGLength;

    readonly debugDescription: string; // inherited from NSObjectProtocol

    readonly description: string; // inherited from NSObjectProtocol

    readonly hash: number; // inherited from NSObjectProtocol

    readonly isProxy: boolean; // inherited from NSObjectProtocol

    readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

    transform: CGAffineTransform; // inherited from SVGTransformable

    readonly; // inherited from NSObjectProtocol

    class(): typeof NSObject;

    conformsToProtocol(aProtocol: any /* Protocol */): boolean;

    isEqual(object: any): boolean;

    isKindOfClass(aClass: typeof NSObject): boolean;

    isMemberOfClass(aClass: typeof NSObject): boolean;

    layoutLayer(layer: CALayer): void;

    newLayer(): CALayer;

    performSelector(aSelector: string): any;

    performSelectorWithObject(aSelector: string, object: any): any;

    performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

    respondsToSelector(aSelector: string): boolean;

    retainCount(): number;

    self(): this;
}

declare class SVGViewSpec extends NSObject {
    static alloc(): SVGViewSpec; // inherited from NSObject

    static new(): SVGViewSpec; // inherited from NSObject

    readonly preserveAspectRatioString: string;

    readonly transformString: string;

    readonly viewBoxString: string;

    readonly viewTarget: SVGElement;

    readonly viewTargetString: string;
}

declare const enum SVG_LENGTH_TYPE {
    TYPE_UNKNOWN = 0,

    TYPE_NUMBER = 1,

    TYPE_PERCENTAGE = 2,

    TYPE_EMS = 3,

    TYPE_EXS = 4,

    TYPE_PX = 5,

    TYPE_CM = 6,

    TYPE_MM = 7,

    TYPE_IN = 8,

    TYPE_PT = 9,

    TYPE_PC = 10,
}

declare const enum SVG_MEETORSLICE {
    UNKNOWN = 0,

    MEET = 1,

    SLICE = 2,
}

declare const enum SVG_PRESERVEASPECTRATIO {
    UNKNOWN = 0,

    NONE = 1,

    XMINYMIN = 2,

    XMIDYMIN = 3,

    XMAXYMIN = 4,

    XMINYMID = 5,

    XMIDYMID = 6,

    XMAXYMID = 7,

    XMINYMAX = 8,

    XMIDYMAX = 9,

    XMAXYMAX = 10,
}

declare const enum SVG_UNIT_TYPE {
    UNKNOWN = 0,

    USERSPACEONUSE = 1,

    OBJECTBOUNDINGBOX = 2,
}

declare class StyleSheet extends NSObject {
    static alloc(): StyleSheet; // inherited from NSObject

    static new(): StyleSheet; // inherited from NSObject

    disabled: boolean;

    href: string;

    media: MediaList;

    ownerNode: Node;

    parentStyleSheet: StyleSheet;

    title: string;

    type: string;
}

declare class StyleSheetList extends NSObject {
    static alloc(): StyleSheetList; // inherited from NSObject

    static new(): StyleSheetList; // inherited from NSObject

    internalArray: NSMutableArray<any>;

    readonly length: number;

    item(index: number): StyleSheet;
}

declare class Text extends CharacterData {
    static alloc(): Text; // inherited from NSObject

    static new(): Text; // inherited from NSObject

    constructor(o: { value: string });

    initWithValue(v: string): this;

    splitText(offset: number): Text;
}

declare class TinySVGTextAreaElement extends SVGTextElement {
    static alloc(): TinySVGTextAreaElement; // inherited from NSObject

    static new(): TinySVGTextAreaElement; // inherited from NSObject

    readonly height: SVGLength;

    readonly width: SVGLength;
}

declare function createPathFromPointsInString(str: string | interop.Pointer | interop.Reference<any>, close: number): interop.Unmanaged<any>;
