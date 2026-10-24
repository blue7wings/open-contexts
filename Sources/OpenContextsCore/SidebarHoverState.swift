import CoreGraphics
import Foundation

public struct SidebarHoverState: Equatable {
    public private(set) var isExpanded: Bool
    public private(set) var isShortcutExpanded = false
    private var outsideSince: TimeInterval?
    private var waitingForPointerExit = false
    private var waitingForShortcutHover = false

    public init(isExpanded: Bool = false) {
        self.isExpanded = isExpanded
    }

    public mutating func setShortcutExpanded(_ expanded: Bool) {
        isShortcutExpanded = expanded
        isExpanded = expanded
        outsideSince = nil
        waitingForPointerExit = !expanded
        waitingForShortcutHover = expanded
    }

    @discardableResult
    public mutating func update(pointer: CGPoint, edgeFrame: CGRect, expandedFrame: CGRect,
                                dragging: Bool, menuOpen: Bool = false, now: TimeInterval,
                                collapseDelay: TimeInterval = 0.12) -> Bool {
        let previous = isExpanded
        if expandedFrame.contains(pointer) || edgeFrame.contains(pointer) {
            waitingForShortcutHover = false
        }
        if dragging || menuOpen || (isShortcutExpanded && waitingForShortcutHover) {
            isExpanded = true
            outsideSince = nil
        } else if waitingForPointerExit {
            isExpanded = false
            if !expandedFrame.contains(pointer) && !edgeFrame.contains(pointer) {
                waitingForPointerExit = false
            }
            outsideSince = nil
        } else if !isExpanded {
            if edgeFrame.contains(pointer) { isExpanded = true }
            outsideSince = nil
        } else if expandedFrame.contains(pointer) || edgeFrame.contains(pointer) {
            outsideSince = nil
        } else if let outsideSince, now >= outsideSince {
            if now - outsideSince >= max(collapseDelay, 0) {
                isExpanded = false
                isShortcutExpanded = false
                self.outsideSince = nil
            }
        } else {
            outsideSince = now
        }
        return previous != isExpanded
    }
}
