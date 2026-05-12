import Foundation
import CoreText
import UIKit

@objcMembers
@objc(StaticLayoutHelper)
class StaticLayoutHelper: NSObject {

    private var frame: CTFrame!
    private var lines: [CTLine] = []
    private var origins: [CGPoint] = []
    private var attributedString: NSAttributedString
    private var width: CGFloat

    init(attributedString: NSAttributedString, width: CGFloat) {
        self.attributedString = attributedString
        self.width = width
        super.init()
        buildFrame()
    }

    private func buildFrame() {
        let framesetter = CTFramesetterCreateWithAttributedString(attributedString)

        let path = CGMutablePath()
        path.addRect(CGRect(x: 0, y: 0, width: width, height: CGFloat.greatestFiniteMagnitude))

        frame = CTFramesetterCreateFrame(framesetter, CFRangeMake(0, 0), path, nil)

        lines = (CTFrameGetLines(frame) as! [CTLine])

        origins = Array(repeating: .zero, count: lines.count)
        CTFrameGetLineOrigins(frame, CFRangeMake(0, 0), &origins)
    }

    // MARK: - Basics

    func getLineCount() -> Int {
        return lines.count
    }

    func getLineWidth(_ line: Int) -> CGFloat {
        guard line < lines.count else { return 0 }

        var ascent: CGFloat = 0
        var descent: CGFloat = 0
        var leading: CGFloat = 0

        let width = CTLineGetTypographicBounds(lines[line], &ascent, &descent, &leading)
        return CGFloat(width)
    }

    // MARK: - Vertical Metrics

    private func lineMetrics(_ line: Int) -> (top: CGFloat, bottom: CGFloat, baseline: CGFloat)? {
        guard line < lines.count else { return nil }

        let origin = origins[line]

        var ascent: CGFloat = 0
        var descent: CGFloat = 0
        var leading: CGFloat = 0

        CTLineGetTypographicBounds(lines[line], &ascent, &descent, &leading)

        let baseline = origin.y
        let top = baseline - ascent
        let bottom = baseline + descent

        return (top, bottom, baseline)
    }

    func getLineTop(_ line: Int, totalHeight: CGFloat) -> CGFloat {
        guard let m = lineMetrics(line) else { return 0 }
        return totalHeight - m.top
    }

    func getLineBottom(_ line: Int, totalHeight: CGFloat) -> CGFloat {
        guard let m = lineMetrics(line) else { return 0 }
        return totalHeight - m.bottom
    }

    func getLineBaseline(_ line: Int, totalHeight: CGFloat) -> CGFloat {
        guard let m = lineMetrics(line) else { return 0 }
        return totalHeight - m.baseline
    }

    // MARK: - Hit Testing

    func getLineForVertical(_ y: CGFloat, totalHeight: CGFloat) -> Int {
        let flippedY = totalHeight - y

        for i in 0..<lines.count {
            if let m = lineMetrics(i) {
                if flippedY >= m.top && flippedY <= m.bottom {
                    return i
                }
            }
        }

        return max(lines.count - 1, 0)
    }

    func getOffsetForHorizontal(_ line: Int, x: CGFloat) -> Int {
        guard line < lines.count else {
            return attributedString.length
        }

        let ctLine = lines[line]
        let origin = origins[line]

        let relativeX = x - origin.x
        return CTLineGetStringIndexForPosition(ctLine, CGPoint(x: relativeX, y: 0))
    }

    // MARK: - Selection Rects

    func getSelectionRects(_ start: Int, end: Int, totalHeight: CGFloat) -> [CGRect] {
        var rects: [CGRect] = []

        for (i, line) in lines.enumerated() {
            let range = CTLineGetStringRange(line)

            let lineStart = range.location
            let lineEnd = range.location + range.length

            if end < lineStart || start > lineEnd {
                continue
            }

            let selStart = max(start, lineStart)
            let selEnd = min(end, lineEnd)

            let startOffset = CTLineGetOffsetForStringIndex(line, selStart, nil)
            let endOffset = CTLineGetOffsetForStringIndex(line, selEnd, nil)

            guard let m = lineMetrics(i) else { continue }

            let origin = origins[i]

            let rect = CGRect(
                x: origin.x + startOffset,
                y: totalHeight - m.bottom,
                width: endOffset - startOffset,
                height: m.bottom - m.top
            )

            rects.append(rect)
        }

        return rects
    }

    // MARK: - Ellipsizing (END only)
    @nonobjc
    func createEllipsizedLine(_ line: Int) -> CTLine? {
        guard line < lines.count else { return nil }

        let originalLine = lines[line]

        let token = NSAttributedString(string: "…", attributes: attributedString.attributes(at: 0, effectiveRange: nil))
        let truncToken = CTLineCreateWithAttributedString(token)

        return CTLineCreateTruncatedLine(originalLine, Double(width), .end, truncToken)
    }
}
