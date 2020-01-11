declare namespace UIBezierPath {
	 function fromStringWithFont(string: string, font: UIFont): UIBezierPath;
	 function drawLineSegmentsCountInContextWithTransform(pts: any, count: number, context:any, _transform: CGAffineTransform)
	 function addLinesCountCloseToPath(points, length, close, path)
	 function addCubicLinesCountCloseToPath(points, length, close, path)
}

declare interface UIBezierPath {
	drawAttributedString(string: NSAttributedString);
	addLinesCountClose(pts: any, count: number, close:boolean)
	addCubicLinesCountClose(pts: any, count: number, close:boolean)
}

declare function AddDashesToPath(path: UIBezierPath): void;

declare function AdjustPathToRect(path: UIBezierPath, destRect: CGRect): void;

declare function ApplyCenteredPathTransform(path: UIBezierPath, transform: CGAffineTransform): void;

declare function AspectScaleFill(sourceSize: CGSize, destRect: CGRect): number;

declare function AspectScaleFit(sourceSize: CGSize, destRect: CGRect): number;

declare function BevelPath(p: UIBezierPath, color: UIColor, r: number, theta: number): void;

declare class BezierElement extends NSObject implements NSCopying {

	static alloc(): BezierElement; // inherited from NSObject

	static elementWithPathElement(element: CGPathElement): BezierElement;

	static new(): BezierElement; // inherited from NSObject

	controlPoint1: CGPoint;

	controlPoint2: CGPoint;

	elementType: CGPathElementType;

	point: CGPoint;

	readonly stringValue: string;

	addToPath(path: UIBezierPath): void;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	elementByApplyingBlock(block: (p1: CGPoint) => CGPoint): BezierElement;

	showTheCode(): void;
}

declare function BezierInflectedShape(numberOfInflections: number, percentInflection: number): UIBezierPath;

declare function BezierPathFromString(string: string, font: UIFont): UIBezierPath;

declare function BezierPathFromStringWithFontFace(string: string, fontFace: string): UIBezierPath;

declare function BezierPathWithElements(elements: NSArray<any>): UIBezierPath;

declare function BezierPathWithPoints(points: NSArray<any>): UIBezierPath;

declare function BezierPolygon(numberOfSides: number): UIBezierPath;

declare function BezierStarShape(numberOfInflections: number, percentInflection: number): UIBezierPath;

declare function Clamp(a: number, min: number, max: number): number;

declare function ClampToRect(pt: CGPoint, rect: CGRect): CGPoint;

declare function ClipToRect(rect: CGRect): void;

declare function CopyBezierDashes(source: UIBezierPath, destination: UIBezierPath): void;

declare function CopyBezierState(source: UIBezierPath, destination: UIBezierPath): void;

declare function CroppedPath(path: UIBezierPath, percent: number): UIBezierPath;

declare function CubicBezier(t: number, start: number, c1: number, c2: number, end: number): number;

declare function CubicBezierLength(start: CGPoint, c1: CGPoint, c2: CGPoint, end: CGPoint): number;

declare function CubicBezierPoint(t: number, start: CGPoint, c1: CGPoint, c2: CGPoint, end: CGPoint): CGPoint;

declare function DegreesFromRadians(radians: number): number;

declare function DrawAttributedStringInBezierPath(path: UIBezierPath, attributedString: NSAttributedString): void;

declare function DrawAttributedStringInBezierSubpaths(path: UIBezierPath, attributedString: NSAttributedString): void;

declare function DrawInnerShadow(path: UIBezierPath, color: UIColor, size: CGSize, blur: number): void;

declare function DrawShadow(path: UIBezierPath, color: UIColor, size: CGSize, blur: number): void;

declare function EaseIn(currentTime: number, factor: number): number;

declare function EaseInOut(currentTime: number, factor: number): number;

declare function EaseOut(currentTime: number, factor: number): number;

declare function ElementDistanceFromPoint(element: BezierElement, point: CGPoint, startPoint: CGPoint): number;

declare function EmbossPath(path: UIBezierPath, color: UIColor, radius: number, blur: number): void;

declare function ExtrudePath(path: UIBezierPath, color: UIColor, radius: number, angle: number): void;

declare function FillRect(rect: CGRect, color: UIColor): void;

declare function FitPathToRect(path: UIBezierPath, rect: CGRect): void;

declare function InnerBevel(p: UIBezierPath, color: UIColor, r: number, theta: number): void;

declare function InterpolateLineSegment(p1: CGPoint, p2: CGPoint, percent: number, slope: interop.Pointer | interop.Reference<CGPoint>): CGPoint;

declare function InterpolatePointFromElement(element: BezierElement, point: CGPoint, startPoint: CGPoint, percent: number, slope: interop.Pointer | interop.Reference<CGPoint>): CGPoint;

declare function InterpolatedPath(path: UIBezierPath): UIBezierPath;

declare function MirrorPathHorizontally(path: UIBezierPath): void;

declare function MirrorPathVertically(path: UIBezierPath): void;

declare function MovePathCenterToPoint(path: UIBezierPath, point: CGPoint): void;

declare function MovePathToPoint(path: UIBezierPath, point: CGPoint): void;

declare function OffsetPath(path: UIBezierPath, offset: CGSize): void;

declare function OriginMakeRect(origin: CGPoint): CGRect;

declare function PathBoundingBox(path: UIBezierPath): CGRect;

declare function PathBoundingBoxWithLineWidth(path: UIBezierPath): CGRect;

declare function PathBoundingCenter(path: UIBezierPath): CGPoint;

declare function PathByApplyingTransform(path: UIBezierPath, transform: CGAffineTransform): UIBezierPath;

declare function PathCenter(path: UIBezierPath): CGPoint;

declare function PathFromPercentToPercent(path: UIBezierPath, startPercent: number, endPercent: number): UIBezierPath;

declare function PointAddPoint(p1: CGPoint, p2: CGPoint): CGPoint;

declare function PointDistanceFromPoint(p1: CGPoint, p2: CGPoint): number;

declare function PointSubtractPoint(p1: CGPoint, p2: CGPoint): CGPoint;

declare function PointsMakeRect(p1: CGPoint, p2: CGPoint): CGRect;

declare function QuadBezier(t: number, start: number, c1: number, end: number): number;

declare function QuadBezierLength(start: CGPoint, c1: CGPoint, end: CGPoint): number;

declare function QuadBezierPoint(t: number, start: CGPoint, c1: CGPoint, end: CGPoint): CGPoint;

declare function RadiansFromDegrees(degrees: number): number;

declare function RectAroundCenter(center: CGPoint, size: CGSize): CGRect;

declare function RectByFillingRect(sourceRect: CGRect, destinationRect: CGRect): CGRect;

declare function RectByFittingRect(sourceRect: CGRect, destinationRect: CGRect): CGRect;

declare function RectCenteredInRect(rect: CGRect, mainRect: CGRect): CGRect;

declare function RectGetBottomLeft(rect: CGRect): CGPoint;

declare function RectGetBottomRight(rect: CGRect): CGPoint;

declare function RectGetCenter(rect: CGRect): CGPoint;

declare function RectGetMidBottom(rect: CGRect): CGPoint;

declare function RectGetMidLeft(rect: CGRect): CGPoint;

declare function RectGetMidRight(rect: CGRect): CGPoint;

declare function RectGetMidTop(rect: CGRect): CGPoint;

declare function RectGetPointAtPercents(rect: CGRect, xPercent: number, yPercent: number): CGPoint;

declare function RectGetScale(sourceRect: CGRect, destRect: CGRect): CGSize;

declare function RectGetTopLeft(rect: CGRect): CGPoint;

declare function RectGetTopRight(rect: CGRect): CGPoint;

declare function RectInsetByPercent(rect: CGRect, percent: number): CGRect;

declare function RectMakeRect(origin: CGPoint, size: CGSize): CGRect;

declare function RotatePath(path: UIBezierPath, theta: number): void;

declare function ScalePath(path: UIBezierPath, sx: number, sy: number): void;

declare function SetShadow(color: UIColor, size: CGSize, blur: number): void;

declare function ShowPathProgression(path: UIBezierPath, maxPercent: number): void;

declare function SizeMakeRect(size: CGSize): CGRect;

declare function SizeScaleByFactor(aSize: CGSize, factor: number): CGSize;

declare function TransformGetRotation(t: CGAffineTransform): number;

declare function TransformGetXScale(t: CGAffineTransform): number;

declare function TransformGetYScale(t: CGAffineTransform): number;
