
declare module com {
	export module caverock {
		export module androidsvg {
			export class BuildConfig extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.BuildConfig>;
				public static DEBUG: boolean;
				public static APPLICATION_ID: string;
				public static BUILD_TYPE: string;
				public static FLAVOR: string;
				public static VERSION_CODE: number;
				public static VERSION_NAME: string;
				public constructor();
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class CSSParseException extends java.lang.Exception {
				public static class: java.lang.Class<com.caverock.androidsvg.CSSParseException>;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class CSSParser extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.CSSParser>;
				public static parseClassAttribute(param0: string): java.util.List<string>;
			}
			export module CSSParser {
				export class Attrib extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Attrib>;
					public name: string;
					public value: string;
				}
				export class AttribOp {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.AttribOp>;
					public static EXISTS: com.caverock.androidsvg.CSSParser.AttribOp;
					public static EQUALS: com.caverock.androidsvg.CSSParser.AttribOp;
					public static INCLUDES: com.caverock.androidsvg.CSSParser.AttribOp;
					public static DASHMATCH: com.caverock.androidsvg.CSSParser.AttribOp;
					public static valueOf(param0: string): com.caverock.androidsvg.CSSParser.AttribOp;
					public static values(): native.Array<com.caverock.androidsvg.CSSParser.AttribOp>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class CSSTextScanner extends com.caverock.androidsvg.SVGParser.TextScanner {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.CSSTextScanner>;
				}
				export module CSSTextScanner {
					export class AnPlusB extends java.lang.Object {
						public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.CSSTextScanner.AnPlusB>;
						public a: number;
						public b: number;
					}
				}
				export class Combinator {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Combinator>;
					public static DESCENDANT: com.caverock.androidsvg.CSSParser.Combinator;
					public static CHILD: com.caverock.androidsvg.CSSParser.Combinator;
					public static FOLLOWS: com.caverock.androidsvg.CSSParser.Combinator;
					public static valueOf(param0: string): com.caverock.androidsvg.CSSParser.Combinator;
					public static values(): native.Array<com.caverock.androidsvg.CSSParser.Combinator>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class MediaType {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.MediaType>;
					public static all: com.caverock.androidsvg.CSSParser.MediaType;
					public static aural: com.caverock.androidsvg.CSSParser.MediaType;
					public static braille: com.caverock.androidsvg.CSSParser.MediaType;
					public static embossed: com.caverock.androidsvg.CSSParser.MediaType;
					public static handheld: com.caverock.androidsvg.CSSParser.MediaType;
					public static print: com.caverock.androidsvg.CSSParser.MediaType;
					public static projection: com.caverock.androidsvg.CSSParser.MediaType;
					public static screen: com.caverock.androidsvg.CSSParser.MediaType;
					public static speech: com.caverock.androidsvg.CSSParser.MediaType;
					public static tty: com.caverock.androidsvg.CSSParser.MediaType;
					public static tv: com.caverock.androidsvg.CSSParser.MediaType;
					public static values(): native.Array<com.caverock.androidsvg.CSSParser.MediaType>;
					public static valueOf(param0: string): com.caverock.androidsvg.CSSParser.MediaType;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class PseudoClass extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClass>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.CSSParser$PseudoClass interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
					});
					public constructor();
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassAnPlusB extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassAnPlusB>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassEmpty extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassEmpty>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassIdents {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassIdents>;
					public static target: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static root: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static nth_child: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static nth_last_child: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static nth_of_type: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static nth_last_of_type: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static first_child: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static last_child: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static first_of_type: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static last_of_type: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static only_child: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static only_of_type: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static empty: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static not: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static lang: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static link: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static visited: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static hover: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static active: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static focus: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static enabled: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static disabled: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static checked: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static indeterminate: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static UNSUPPORTED: com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static valueOf(param0: string): com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static values(): native.Array<com.caverock.androidsvg.CSSParser.PseudoClassIdents>;
					public static fromString(param0: string): com.caverock.androidsvg.CSSParser.PseudoClassIdents;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class PseudoClassNot extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassNot>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassNotSupported extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassNotSupported>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassOnlyChild extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassOnlyChild>;
					public toString(): string;
					public constructor(param0: boolean, param1: string);
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassRoot extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassRoot>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class PseudoClassTarget extends java.lang.Object implements com.caverock.androidsvg.CSSParser.PseudoClass {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.PseudoClassTarget>;
					public toString(): string;
					public matches(param0: com.caverock.androidsvg.CSSParser.RuleMatchContext, param1: com.caverock.androidsvg.SVG.SvgElementBase): boolean;
				}
				export class Rule extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Rule>;
					public toString(): string;
				}
				export class RuleMatchContext extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.RuleMatchContext>;
					public toString(): string;
				}
				export class Ruleset extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Ruleset>;
					public toString(): string;
				}
				export class Selector extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Selector>;
					public toString(): string;
				}
				export class SimpleSelector extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.SimpleSelector>;
					public toString(): string;
				}
				export class Source {
					public static class: java.lang.Class<com.caverock.androidsvg.CSSParser.Source>;
					public static Document: com.caverock.androidsvg.CSSParser.Source;
					public static RenderOptions: com.caverock.androidsvg.CSSParser.Source;
					public static valueOf(param0: string): com.caverock.androidsvg.CSSParser.Source;
					public static values(): native.Array<com.caverock.androidsvg.CSSParser.Source>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class CanvasLegacy extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.CanvasLegacy>;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class IntegerParser extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.IntegerParser>;
				public value(): number;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class LibConfig extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.LibConfig>;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class NumberParser extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.NumberParser>;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class PreserveAspectRatio extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.PreserveAspectRatio>;
				public static UNSCALED: com.caverock.androidsvg.PreserveAspectRatio;
				public static STRETCH: com.caverock.androidsvg.PreserveAspectRatio;
				public static LETTERBOX: com.caverock.androidsvg.PreserveAspectRatio;
				public static START: com.caverock.androidsvg.PreserveAspectRatio;
				public static END: com.caverock.androidsvg.PreserveAspectRatio;
				public static TOP: com.caverock.androidsvg.PreserveAspectRatio;
				public static BOTTOM: com.caverock.androidsvg.PreserveAspectRatio;
				public static FULLSCREEN: com.caverock.androidsvg.PreserveAspectRatio;
				public static FULLSCREEN_START: com.caverock.androidsvg.PreserveAspectRatio;
				public equals(param0: any): boolean;
				public static of(param0: string): com.caverock.androidsvg.PreserveAspectRatio;
				public getScale(): com.caverock.androidsvg.PreserveAspectRatio.Scale;
				public toString(): string;
				public getAlignment(): com.caverock.androidsvg.PreserveAspectRatio.Alignment;
			}
			export module PreserveAspectRatio {
				export class Alignment {
					public static class: java.lang.Class<com.caverock.androidsvg.PreserveAspectRatio.Alignment>;
					public static none: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMinYMin: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMidYMin: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMaxYMin: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMinYMid: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMidYMid: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMaxYMid: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMinYMax: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMidYMax: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static xMaxYMax: com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static valueOf(param0: string): com.caverock.androidsvg.PreserveAspectRatio.Alignment;
					public static values(): native.Array<com.caverock.androidsvg.PreserveAspectRatio.Alignment>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class Scale {
					public static class: java.lang.Class<com.caverock.androidsvg.PreserveAspectRatio.Scale>;
					public static meet: com.caverock.androidsvg.PreserveAspectRatio.Scale;
					public static slice: com.caverock.androidsvg.PreserveAspectRatio.Scale;
					public static valueOf(param0: string): com.caverock.androidsvg.PreserveAspectRatio.Scale;
					public static values(): native.Array<com.caverock.androidsvg.PreserveAspectRatio.Scale>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class RenderOptions extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.RenderOptions>;
				public view(param0: string): com.caverock.androidsvg.RenderOptions;
				public preserveAspectRatio(param0: com.caverock.androidsvg.PreserveAspectRatio): com.caverock.androidsvg.RenderOptions;
				public viewPort(param0: number, param1: number, param2: number, param3: number): com.caverock.androidsvg.RenderOptions;
				public hasCss(): boolean;
				public hasViewPort(): boolean;
				public static create(): com.caverock.androidsvg.RenderOptions;
				public target(param0: string): com.caverock.androidsvg.RenderOptions;
				public constructor();
				public viewBox(param0: number, param1: number, param2: number, param3: number): com.caverock.androidsvg.RenderOptions;
				public hasView(): boolean;
				public hasViewBox(): boolean;
				public hasTarget(): boolean;
				public constructor(param0: com.caverock.androidsvg.RenderOptions);
				public hasPreserveAspectRatio(): boolean;
				public css(param0: string): com.caverock.androidsvg.RenderOptions;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVG extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.SVG>;
				public setDocumentHeight(param0: number): void;
				public setRenderDPI(param0: number): void;
				public renderViewToPicture(param0: string, param1: number, param2: number): globalAndroid.graphics.Picture;
				public renderToPicture(): globalAndroid.graphics.Picture;
				public getDocumentTitle(): string;
				public setDocumentWidth(param0: string): void;
				public setDocumentPreserveAspectRatio(param0: com.caverock.androidsvg.PreserveAspectRatio): void;
				public renderToPicture(param0: number, param1: number): globalAndroid.graphics.Picture;
				public static getFromResource(param0: globalAndroid.content.res.Resources, param1: number): com.caverock.androidsvg.SVG;
				public getDocumentPreserveAspectRatio(): com.caverock.androidsvg.PreserveAspectRatio;
				public static getFromString(param0: string): com.caverock.androidsvg.SVG;
				public getDocumentAspectRatio(): number;
				public renderViewToCanvas(param0: string, param1: globalAndroid.graphics.Canvas): void;
				public getDocumentDescription(): string;
				public getDocumentWidth(): number;
				public renderViewToCanvas(param0: string, param1: globalAndroid.graphics.Canvas, param2: globalAndroid.graphics.RectF): void;
				public renderToPicture(param0: number, param1: number, param2: com.caverock.androidsvg.RenderOptions): globalAndroid.graphics.Picture;
				public renderToCanvas(param0: globalAndroid.graphics.Canvas, param1: com.caverock.androidsvg.RenderOptions): void;
				public static getFromInputStream(param0: java.io.InputStream): com.caverock.androidsvg.SVG;
				public static isInternalEntitiesEnabled(): boolean;
				public getDocumentHeight(): number;
				public setDocumentViewBox(param0: number, param1: number, param2: number, param3: number): void;
				public getRenderDPI(): number;
				public static deregisterExternalFileResolver(): void;
				public renderToCanvas(param0: globalAndroid.graphics.Canvas): void;
				public static registerExternalFileResolver(param0: com.caverock.androidsvg.SVGExternalFileResolver): void;
				public setDocumentWidth(param0: number): void;
				public static getFromResource(param0: globalAndroid.content.Context, param1: number): com.caverock.androidsvg.SVG;
				public static getFromAsset(param0: globalAndroid.content.res.AssetManager, param1: string): com.caverock.androidsvg.SVG;
				public getDocumentViewBox(): globalAndroid.graphics.RectF;
				public getDocumentSVGVersion(): string;
				public renderToCanvas(param0: globalAndroid.graphics.Canvas, param1: globalAndroid.graphics.RectF): void;
				public static setInternalEntitiesEnabled(param0: boolean): void;
				public renderToPicture(param0: com.caverock.androidsvg.RenderOptions): globalAndroid.graphics.Picture;
				public static getVersion(): string;
				public setDocumentHeight(param0: string): void;
				public getViewList(): java.util.Set<string>;
			}
			export module SVG {
				export class Box extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Box>;
					public toString(): string;
				}
				export class CSSClipRect extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.CSSClipRect>;
				}
				export class Circle extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Circle>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class ClipPath extends com.caverock.androidsvg.SVG.Group implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.ClipPath>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class Colour extends com.caverock.androidsvg.SVG.SvgPaint {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Colour>;
					public toString(): string;
				}
				export class CurrentColor extends com.caverock.androidsvg.SVG.SvgPaint {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.CurrentColor>;
				}
				export class Defs extends com.caverock.androidsvg.SVG.Group implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Defs>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class Ellipse extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Ellipse>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export abstract class GradientElement extends com.caverock.androidsvg.SVG.SvgElementBase implements com.caverock.androidsvg.SVG.SvgContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.GradientElement>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export class GradientSpread {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.GradientSpread>;
					public static pad: com.caverock.androidsvg.SVG.GradientSpread;
					public static reflect: com.caverock.androidsvg.SVG.GradientSpread;
					public static repeat: com.caverock.androidsvg.SVG.GradientSpread;
					public static valueOf(param0: string): com.caverock.androidsvg.SVG.GradientSpread;
					public static values(): native.Array<com.caverock.androidsvg.SVG.GradientSpread>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export abstract class GraphicsElement extends com.caverock.androidsvg.SVG.SvgConditionalElement implements com.caverock.androidsvg.SVG.HasTransform {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.GraphicsElement>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Group extends com.caverock.androidsvg.SVG.SvgConditionalContainer implements com.caverock.androidsvg.SVG.HasTransform {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Group>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class HasTransform extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.HasTransform>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$HasTransform interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setTransform(param0: globalAndroid.graphics.Matrix): void;
					});
					public constructor();
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
				}
				export class Image extends com.caverock.androidsvg.SVG.SvgPreserveAspectRatioContainer implements com.caverock.androidsvg.SVG.HasTransform {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Image>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class Length extends java.lang.Object implements java.lang.Cloneable {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Length>;
					public toString(): string;
				}
				export class Line extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Line>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Marker extends com.caverock.androidsvg.SVG.SvgViewBoxContainer implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Marker>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Mask extends com.caverock.androidsvg.SVG.SvgConditionalContainer implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Mask>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class NotDirectlyRendered extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.NotDirectlyRendered>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$NotDirectlyRendered interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
					});
					public constructor();
				}
				export class PaintReference extends com.caverock.androidsvg.SVG.SvgPaint {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.PaintReference>;
					public toString(): string;
				}
				export class Path extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Path>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class PathDefinition extends java.lang.Object implements com.caverock.androidsvg.SVG.PathInterface {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.PathDefinition>;
					public moveTo(param0: number, param1: number): void;
					public close(): void;
					public cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public arcTo(param0: number, param1: number, param2: number, param3: boolean, param4: boolean, param5: number, param6: number): void;
					public lineTo(param0: number, param1: number): void;
					public quadTo(param0: number, param1: number, param2: number, param3: number): void;
				}
				export class PathInterface extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.PathInterface>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$PathInterface interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						moveTo(param0: number, param1: number): void;
						lineTo(param0: number, param1: number): void;
						cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
						quadTo(param0: number, param1: number, param2: number, param3: number): void;
						arcTo(param0: number, param1: number, param2: number, param3: boolean, param4: boolean, param5: number, param6: number): void;
						close(): void;
					});
					public constructor();
					public moveTo(param0: number, param1: number): void;
					public close(): void;
					public cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public arcTo(param0: number, param1: number, param2: number, param3: boolean, param4: boolean, param5: number, param6: number): void;
					public lineTo(param0: number, param1: number): void;
					public quadTo(param0: number, param1: number, param2: number, param3: number): void;
				}
				export class Pattern extends com.caverock.androidsvg.SVG.SvgViewBoxContainer implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Pattern>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class PolyLine extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.PolyLine>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Polygon extends com.caverock.androidsvg.SVG.PolyLine {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Polygon>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Rect extends com.caverock.androidsvg.SVG.GraphicsElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Rect>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class SolidColor extends com.caverock.androidsvg.SVG.SvgElementBase implements com.caverock.androidsvg.SVG.SvgContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SolidColor>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export class Stop extends com.caverock.androidsvg.SVG.SvgElementBase implements com.caverock.androidsvg.SVG.SvgContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Stop>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export class Style extends java.lang.Object implements java.lang.Cloneable {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style>;
					public clone(): any;
				}
				export module Style {
					export class FillRule {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.FillRule>;
						public static NonZero: com.caverock.androidsvg.SVG.Style.FillRule;
						public static EvenOdd: com.caverock.androidsvg.SVG.Style.FillRule;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.FillRule>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.FillRule;
					}
					export class FontStyle {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.FontStyle>;
						public static Normal: com.caverock.androidsvg.SVG.Style.FontStyle;
						public static Italic: com.caverock.androidsvg.SVG.Style.FontStyle;
						public static Oblique: com.caverock.androidsvg.SVG.Style.FontStyle;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.FontStyle>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.FontStyle;
					}
					export class LineCap {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.LineCap>;
						public static Butt: com.caverock.androidsvg.SVG.Style.LineCap;
						public static Round: com.caverock.androidsvg.SVG.Style.LineCap;
						public static Square: com.caverock.androidsvg.SVG.Style.LineCap;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.LineCap>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.LineCap;
					}
					export class LineJoin {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.LineJoin>;
						public static Miter: com.caverock.androidsvg.SVG.Style.LineJoin;
						public static Round: com.caverock.androidsvg.SVG.Style.LineJoin;
						public static Bevel: com.caverock.androidsvg.SVG.Style.LineJoin;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.LineJoin>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.LineJoin;
					}
					export class RenderQuality {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.RenderQuality>;
						public static auto: com.caverock.androidsvg.SVG.Style.RenderQuality;
						public static optimizeQuality: com.caverock.androidsvg.SVG.Style.RenderQuality;
						public static optimizeSpeed: com.caverock.androidsvg.SVG.Style.RenderQuality;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.RenderQuality>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.RenderQuality;
					}
					export class TextAnchor {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.TextAnchor>;
						public static Start: com.caverock.androidsvg.SVG.Style.TextAnchor;
						public static Middle: com.caverock.androidsvg.SVG.Style.TextAnchor;
						public static End: com.caverock.androidsvg.SVG.Style.TextAnchor;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.TextAnchor>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.TextAnchor;
					}
					export class TextDecoration {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.TextDecoration>;
						public static None: com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static Underline: com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static Overline: com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static LineThrough: com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static Blink: com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.TextDecoration;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.TextDecoration>;
					}
					export class TextDirection {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.TextDirection>;
						public static LTR: com.caverock.androidsvg.SVG.Style.TextDirection;
						public static RTL: com.caverock.androidsvg.SVG.Style.TextDirection;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.TextDirection>;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.TextDirection;
					}
					export class VectorEffect {
						public static class: java.lang.Class<com.caverock.androidsvg.SVG.Style.VectorEffect>;
						public static None: com.caverock.androidsvg.SVG.Style.VectorEffect;
						public static NonScalingStroke: com.caverock.androidsvg.SVG.Style.VectorEffect;
						public static valueOf(param0: string): com.caverock.androidsvg.SVG.Style.VectorEffect;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.caverock.androidsvg.SVG.Style.VectorEffect>;
					}
				}
				export class Svg extends com.caverock.androidsvg.SVG.SvgViewBoxContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Svg>;
					public version: string;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class SvgConditional extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgConditional>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$SvgConditional interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setRequiredFeatures(param0: java.util.Set<string>): void;
						getRequiredFeatures(): java.util.Set<string>;
						setRequiredExtensions(param0: string): void;
						getRequiredExtensions(): string;
						setSystemLanguage(param0: java.util.Set<string>): void;
						getSystemLanguage(): java.util.Set<string>;
						setRequiredFormats(param0: java.util.Set<string>): void;
						getRequiredFormats(): java.util.Set<string>;
						setRequiredFonts(param0: java.util.Set<string>): void;
						getRequiredFonts(): java.util.Set<string>;
					});
					public constructor();
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export abstract class SvgConditionalContainer extends com.caverock.androidsvg.SVG.SvgElement implements com.caverock.androidsvg.SVG.SvgContainer, com.caverock.androidsvg.SVG.SvgConditional {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgConditionalContainer>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export abstract class SvgConditionalElement extends com.caverock.androidsvg.SVG.SvgElement implements com.caverock.androidsvg.SVG.SvgConditional {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgConditionalElement>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class SvgContainer extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgContainer>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$SvgContainer interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
						addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					});
					public constructor();
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export abstract class SvgElement extends com.caverock.androidsvg.SVG.SvgElementBase {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgElement>;
				}
				export abstract class SvgElementBase extends com.caverock.androidsvg.SVG.SvgObject {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgElementBase>;
					public toString(): string;
				}
				export class SvgLinearGradient extends com.caverock.androidsvg.SVG.GradientElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgLinearGradient>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export class SvgObject extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgObject>;
				}
				export abstract class SvgPaint extends java.lang.Object implements java.lang.Cloneable {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgPaint>;
				}
				export abstract class SvgPreserveAspectRatioContainer extends com.caverock.androidsvg.SVG.SvgConditionalContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgPreserveAspectRatioContainer>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class SvgRadialGradient extends com.caverock.androidsvg.SVG.GradientElement {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgRadialGradient>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
				}
				export abstract class SvgViewBoxContainer extends com.caverock.androidsvg.SVG.SvgPreserveAspectRatioContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.SvgViewBoxContainer>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class Switch extends com.caverock.androidsvg.SVG.Group {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Switch>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class Symbol extends com.caverock.androidsvg.SVG.SvgViewBoxContainer implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Symbol>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class TRef extends com.caverock.androidsvg.SVG.TextContainer implements com.caverock.androidsvg.SVG.TextChild {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TRef>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
					public setRequiredExtensions(param0: string): void;
				}
				export class TSpan extends com.caverock.androidsvg.SVG.TextPositionedContainer implements com.caverock.androidsvg.SVG.TextChild {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TSpan>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
					public setRequiredExtensions(param0: string): void;
				}
				export class Text extends com.caverock.androidsvg.SVG.TextPositionedContainer implements com.caverock.androidsvg.SVG.TextRoot, com.caverock.androidsvg.SVG.HasTransform {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Text>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class TextChild extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextChild>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$TextChild interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
						getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
					});
					public constructor();
					public setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
					public getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
				}
				export abstract class TextContainer extends com.caverock.androidsvg.SVG.SvgConditionalContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextContainer>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class TextPath extends com.caverock.androidsvg.SVG.TextContainer implements com.caverock.androidsvg.SVG.TextChild {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextPath>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
					public setRequiredExtensions(param0: string): void;
				}
				export abstract class TextPositionedContainer extends com.caverock.androidsvg.SVG.TextContainer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextPositionedContainer>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
				export class TextRoot extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextRoot>;
					/**
					 * Constructs a new instance of the com.caverock.androidsvg.SVG$TextRoot interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
					});
					public constructor();
				}
				export class TextSequence extends com.caverock.androidsvg.SVG.SvgObject implements com.caverock.androidsvg.SVG.TextChild {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.TextSequence>;
					public setTextRoot(param0: com.caverock.androidsvg.SVG.TextRoot): void;
					public toString(): string;
					public getTextRoot(): com.caverock.androidsvg.SVG.TextRoot;
				}
				export class Unit {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Unit>;
					public static px: com.caverock.androidsvg.SVG.Unit;
					public static em: com.caverock.androidsvg.SVG.Unit;
					public static ex: com.caverock.androidsvg.SVG.Unit;
					public static in: com.caverock.androidsvg.SVG.Unit;
					public static cm: com.caverock.androidsvg.SVG.Unit;
					public static mm: com.caverock.androidsvg.SVG.Unit;
					public static pt: com.caverock.androidsvg.SVG.Unit;
					public static pc: com.caverock.androidsvg.SVG.Unit;
					public static percent: com.caverock.androidsvg.SVG.Unit;
					public static values(): native.Array<com.caverock.androidsvg.SVG.Unit>;
					public static valueOf(param0: string): com.caverock.androidsvg.SVG.Unit;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class Use extends com.caverock.androidsvg.SVG.Group {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.Use>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public setTransform(param0: globalAndroid.graphics.Matrix): void;
					public setRequiredExtensions(param0: string): void;
				}
				export class View extends com.caverock.androidsvg.SVG.SvgViewBoxContainer implements com.caverock.androidsvg.SVG.NotDirectlyRendered {
					public static class: java.lang.Class<com.caverock.androidsvg.SVG.View>;
					public setRequiredFormats(param0: java.util.Set<string>): void;
					public getChildren(): java.util.List<com.caverock.androidsvg.SVG.SvgObject>;
					public getRequiredFonts(): java.util.Set<string>;
					public getRequiredFeatures(): java.util.Set<string>;
					public setSystemLanguage(param0: java.util.Set<string>): void;
					public getRequiredExtensions(): string;
					public getSystemLanguage(): java.util.Set<string>;
					public setRequiredFonts(param0: java.util.Set<string>): void;
					public setRequiredExtensions(param0: string): void;
					public addChild(param0: com.caverock.androidsvg.SVG.SvgObject): void;
					public setRequiredFeatures(param0: java.util.Set<string>): void;
					public getRequiredFormats(): java.util.Set<string>;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVGAndroidRenderer extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer>;
				public static LUMINANCE_TO_ALPHA_RED: number;
				public static LUMINANCE_TO_ALPHA_GREEN: number;
				public static LUMINANCE_TO_ALPHA_BLUE: number;
			}
			export module SVGAndroidRenderer {
				export class MarkerPositionCalculator extends java.lang.Object implements com.caverock.androidsvg.SVG.PathInterface {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.MarkerPositionCalculator>;
					public moveTo(param0: number, param1: number): void;
					public close(): void;
					public cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public arcTo(param0: number, param1: number, param2: number, param3: boolean, param4: boolean, param5: number, param6: number): void;
					public lineTo(param0: number, param1: number): void;
					public quadTo(param0: number, param1: number, param2: number, param3: number): void;
				}
				export class MarkerVector extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.MarkerVector>;
					public toString(): string;
				}
				export class PathConverter extends java.lang.Object implements com.caverock.androidsvg.SVG.PathInterface {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.PathConverter>;
					public moveTo(param0: number, param1: number): void;
					public close(): void;
					public cubicTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public arcTo(param0: number, param1: number, param2: number, param3: boolean, param4: boolean, param5: number, param6: number): void;
					public lineTo(param0: number, param1: number): void;
					public quadTo(param0: number, param1: number, param2: number, param3: number): void;
				}
				export class PathTextDrawer extends com.caverock.androidsvg.SVGAndroidRenderer.PlainTextDrawer {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.PathTextDrawer>;
					public processText(param0: string): void;
				}
				export class PlainTextDrawer extends com.caverock.androidsvg.SVGAndroidRenderer.TextProcessor {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.PlainTextDrawer>;
					public processText(param0: string): void;
				}
				export class PlainTextToPath extends com.caverock.androidsvg.SVGAndroidRenderer.TextProcessor {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.PlainTextToPath>;
					public doTextContainer(param0: com.caverock.androidsvg.SVG.TextContainer): boolean;
					public processText(param0: string): void;
				}
				export class RendererState extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.RendererState>;
				}
				export class TextBoundsCalculator extends com.caverock.androidsvg.SVGAndroidRenderer.TextProcessor {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.TextBoundsCalculator>;
					public doTextContainer(param0: com.caverock.androidsvg.SVG.TextContainer): boolean;
					public processText(param0: string): void;
				}
				export abstract class TextProcessor extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.TextProcessor>;
					public doTextContainer(param0: com.caverock.androidsvg.SVG.TextContainer): boolean;
					public processText(param0: string): void;
				}
				export class TextWidthCalculator extends com.caverock.androidsvg.SVGAndroidRenderer.TextProcessor {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGAndroidRenderer.TextWidthCalculator>;
					public processText(param0: string): void;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVGExternalFileResolver extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.SVGExternalFileResolver>;
				public resolveCSSStyleSheet(param0: string): string;
				public resolveImage(param0: string): globalAndroid.graphics.Bitmap;
				public isFormatSupported(param0: string): boolean;
				public constructor();
				public resolveFont(param0: string, param1: number, param2: string): globalAndroid.graphics.Typeface;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVGImageView extends globalAndroid.widget.ImageView {
				public static class: java.lang.Class<com.caverock.androidsvg.SVGImageView>;
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
				public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public setSVG(param0: com.caverock.androidsvg.SVG): void;
				public setImageAsset(param0: string): void;
				public setImageURI(param0: globalAndroid.net.Uri): void;
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
				public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
				public sendAccessibilityEvent(param0: number): void;
				public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
				public setSVG(param0: com.caverock.androidsvg.SVG, param1: string): void;
				public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public constructor(param0: globalAndroid.content.Context);
				public setImageResource(param0: number): void;
				public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
				public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
				public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
				public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
				public setCSS(param0: string): void;
			}
			export module SVGImageView {
				export class LoadResourceTask extends globalAndroid.os.AsyncTask<java.lang.Integer,java.lang.Integer,com.caverock.androidsvg.SVG> {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGImageView.LoadResourceTask>;
					public onPostExecute(param0: com.caverock.androidsvg.SVG): void;
					public doInBackground(param0: native.Array<any>): any;
					public doInBackground(param0: native.Array<java.lang.Integer>): com.caverock.androidsvg.SVG;
					public onPostExecute(param0: any): void;
				}
				export class LoadURITask extends globalAndroid.os.AsyncTask<java.io.InputStream,java.lang.Integer,com.caverock.androidsvg.SVG> {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGImageView.LoadURITask>;
					public onPostExecute(param0: com.caverock.androidsvg.SVG): void;
					public doInBackground(param0: native.Array<java.io.InputStream>): com.caverock.androidsvg.SVG;
					public doInBackground(param0: native.Array<any>): any;
					public onPostExecute(param0: any): void;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVGParseException extends org.xml.sax.SAXException {
				public static class: java.lang.Class<com.caverock.androidsvg.SVGParseException>;
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SVGParser extends java.lang.Object {
				public static class: java.lang.Class<com.caverock.androidsvg.SVGParser>;
				public static XML_STYLESHEET_ATTR_TYPE: string;
				public static XML_STYLESHEET_ATTR_ALTERNATE: string;
				public static XML_STYLESHEET_ATTR_HREF: string;
				public static XML_STYLESHEET_ATTR_MEDIA: string;
				public static XML_STYLESHEET_ATTR_MEDIA_ALL: string;
				public static XML_STYLESHEET_ATTR_ALTERNATE_NO: string;
				public static ENTITY_WATCH_BUFFER_SIZE: number;
			}
			export module SVGParser {
				export class AspectRatioKeywords extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.AspectRatioKeywords>;
				}
				export class ColourKeywords extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.ColourKeywords>;
				}
				export class FontSizeKeywords extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.FontSizeKeywords>;
				}
				export class FontWeightKeywords extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.FontWeightKeywords>;
				}
				export class SAXHandler extends org.xml.sax.ext.DefaultHandler2 {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.SAXHandler>;
					public comment(param0: native.Array<string>, param1: number, param2: number): void;
					public startPrefixMapping(param0: string, param1: string): void;
					public skippedEntity(param0: string): void;
					public endDocument(): void;
					public startElement(param0: string, param1: string, param2: string, param3: org.xml.sax.Attributes): void;
					public externalEntityDecl(param0: string, param1: string, param2: string): void;
					public startDTD(param0: string, param1: string, param2: string): void;
					public characters(param0: native.Array<string>, param1: number, param2: number): void;
					public processingInstruction(param0: string, param1: string): void;
					public fatalError(param0: org.xml.sax.SAXParseException): void;
					public endDTD(): void;
					public getExternalSubset(param0: string, param1: string): org.xml.sax.InputSource;
					public endEntity(param0: string): void;
					public elementDecl(param0: string, param1: string): void;
					public error(param0: org.xml.sax.SAXParseException): void;
					public endElement(param0: string, param1: string, param2: string): void;
					public startCDATA(): void;
					public startDocument(): void;
					public endCDATA(): void;
					public warning(param0: org.xml.sax.SAXParseException): void;
					public resolveEntity(param0: string, param1: string): org.xml.sax.InputSource;
					public ignorableWhitespace(param0: native.Array<string>, param1: number, param2: number): void;
					public attributeDecl(param0: string, param1: string, param2: string, param3: string, param4: string): void;
					public internalEntityDecl(param0: string, param1: string): void;
					public endPrefixMapping(param0: string): void;
					public resolveEntity(param0: string, param1: string, param2: string, param3: string): org.xml.sax.InputSource;
					public startEntity(param0: string): void;
					public notationDecl(param0: string, param1: string, param2: string): void;
					public unparsedEntityDecl(param0: string, param1: string, param2: string, param3: string): void;
					public setDocumentLocator(param0: org.xml.sax.Locator): void;
				}
				export class SVGAttr {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.SVGAttr>;
					public static CLASS: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static clip: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static clip_path: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static clipPathUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static clip_rule: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static color: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static cx: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static cy: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static direction: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static dx: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static dy: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fx: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fy: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static d: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static display: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fill: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fill_rule: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fill_opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static font: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static font_family: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static font_size: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static font_weight: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static font_style: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static gradientTransform: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static gradientUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static height: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static href: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static image_rendering: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static marker: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static marker_start: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static marker_mid: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static marker_end: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static markerHeight: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static markerUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static markerWidth: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static mask: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static maskContentUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static maskUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static media: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static offset: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static orient: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static overflow: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static pathLength: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static patternContentUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static patternTransform: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static patternUnits: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static points: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static preserveAspectRatio: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static r: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static refX: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static refY: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static requiredFeatures: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static requiredExtensions: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static requiredFormats: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static requiredFonts: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static rx: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static ry: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static solid_color: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static solid_opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static spreadMethod: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static startOffset: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stop_color: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stop_opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_dasharray: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_dashoffset: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_linecap: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_linejoin: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_miterlimit: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static stroke_width: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static style: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static systemLanguage: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static text_anchor: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static text_decoration: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static transform: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static type: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static vector_effect: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static version: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static viewBox: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static width: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static x: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static y: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static x1: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static y1: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static x2: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static y2: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static viewport_fill: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static viewport_fill_opacity: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static visibility: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static UNSUPPORTED: com.caverock.androidsvg.SVGParser.SVGAttr;
					public static values(): native.Array<com.caverock.androidsvg.SVGParser.SVGAttr>;
					public static valueOf(param0: string): com.caverock.androidsvg.SVGParser.SVGAttr;
					public static fromString(param0: string): com.caverock.androidsvg.SVGParser.SVGAttr;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class SVGElem {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.SVGElem>;
					public static svg: com.caverock.androidsvg.SVGParser.SVGElem;
					public static a: com.caverock.androidsvg.SVGParser.SVGElem;
					public static circle: com.caverock.androidsvg.SVGParser.SVGElem;
					public static clipPath: com.caverock.androidsvg.SVGParser.SVGElem;
					public static defs: com.caverock.androidsvg.SVGParser.SVGElem;
					public static desc: com.caverock.androidsvg.SVGParser.SVGElem;
					public static ellipse: com.caverock.androidsvg.SVGParser.SVGElem;
					public static g: com.caverock.androidsvg.SVGParser.SVGElem;
					public static image: com.caverock.androidsvg.SVGParser.SVGElem;
					public static line: com.caverock.androidsvg.SVGParser.SVGElem;
					public static linearGradient: com.caverock.androidsvg.SVGParser.SVGElem;
					public static marker: com.caverock.androidsvg.SVGParser.SVGElem;
					public static mask: com.caverock.androidsvg.SVGParser.SVGElem;
					public static path: com.caverock.androidsvg.SVGParser.SVGElem;
					public static pattern: com.caverock.androidsvg.SVGParser.SVGElem;
					public static polygon: com.caverock.androidsvg.SVGParser.SVGElem;
					public static polyline: com.caverock.androidsvg.SVGParser.SVGElem;
					public static radialGradient: com.caverock.androidsvg.SVGParser.SVGElem;
					public static rect: com.caverock.androidsvg.SVGParser.SVGElem;
					public static solidColor: com.caverock.androidsvg.SVGParser.SVGElem;
					public static stop: com.caverock.androidsvg.SVGParser.SVGElem;
					public static style: com.caverock.androidsvg.SVGParser.SVGElem;
					public static SWITCH: com.caverock.androidsvg.SVGParser.SVGElem;
					public static symbol: com.caverock.androidsvg.SVGParser.SVGElem;
					public static text: com.caverock.androidsvg.SVGParser.SVGElem;
					public static textPath: com.caverock.androidsvg.SVGParser.SVGElem;
					public static title: com.caverock.androidsvg.SVGParser.SVGElem;
					public static tref: com.caverock.androidsvg.SVGParser.SVGElem;
					public static tspan: com.caverock.androidsvg.SVGParser.SVGElem;
					public static use: com.caverock.androidsvg.SVGParser.SVGElem;
					public static view: com.caverock.androidsvg.SVGParser.SVGElem;
					public static UNSUPPORTED: com.caverock.androidsvg.SVGParser.SVGElem;
					public static values(): native.Array<com.caverock.androidsvg.SVGParser.SVGElem>;
					public static valueOf(param0: string): com.caverock.androidsvg.SVGParser.SVGElem;
					public static fromString(param0: string): com.caverock.androidsvg.SVGParser.SVGElem;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
				export class TextScanner extends java.lang.Object {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.TextScanner>;
				}
				export class XPPAttributesWrapper extends java.lang.Object implements org.xml.sax.Attributes {
					public static class: java.lang.Class<com.caverock.androidsvg.SVGParser.XPPAttributesWrapper>;
					public getType(param0: string, param1: string): string;
					public getType(param0: number): string;
					public getLength(): number;
					public getValue(param0: string, param1: string): string;
					public getLocalName(param0: number): string;
					public getQName(param0: number): string;
					public getType(param0: string): string;
					public getURI(param0: number): string;
					public getValue(param0: number): string;
					public getIndex(param0: string): number;
					public constructor(param0: com.caverock.androidsvg.SVGParser, param1: org.xmlpull.v1.XmlPullParser);
					public getIndex(param0: string, param1: string): number;
					public getValue(param0: string): string;
				}
			}
		}
	}
}

declare module com {
	export module caverock {
		export module androidsvg {
			export class SimpleAssetResolver extends com.caverock.androidsvg.SVGExternalFileResolver {
				public static class: java.lang.Class<com.caverock.androidsvg.SimpleAssetResolver>;
				public resolveCSSStyleSheet(param0: string): string;
				public resolveImage(param0: string): globalAndroid.graphics.Bitmap;
				public constructor(param0: globalAndroid.content.res.AssetManager);
				public isFormatSupported(param0: string): boolean;
				public constructor();
				public resolveFont(param0: string, param1: number, param2: string): globalAndroid.graphics.Typeface;
			}
		}
	}
}

