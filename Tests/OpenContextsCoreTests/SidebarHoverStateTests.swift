import CoreGraphics
import XCTest
@testable import OpenContextsCore

final class SidebarHoverStateTests: XCTestCase {
    private let edge = CGRect(x: 992, y: 300, width: 8, height: 200)
    private let expanded = CGRect(x: 740, y: 300, width: 260, height: 200)

    func testShortcutExpansionReturnsToHoverAfterPointerEnters() {
        var state = SidebarHoverState()
        let outside = CGPoint(x: 700, y: 400)
        let inside = CGPoint(x: 900, y: 400)
        state.setShortcutExpanded(true)
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 0))
        XCTAssertFalse(state.update(pointer: inside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 1))
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 2))
        XCTAssertTrue(state.isShortcutExpanded)
        XCTAssertFalse(state.update(pointer: inside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 2.05))
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 3))
        XCTAssertTrue(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                   dragging: false, now: 3.13))
        XCTAssertFalse(state.isExpanded)
        XCTAssertFalse(state.isShortcutExpanded)
        state.setShortcutExpanded(true)
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 10))
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 20))
        XCTAssertTrue(state.isShortcutExpanded)
    }

    func testShortcutHoverExitWaitsForMenuOrDragToFinish() {
        for menuOpen in [false, true] {
            var state = SidebarHoverState()
            let outside = CGPoint(x: 700, y: 400)
            state.setShortcutExpanded(true)
            state.update(pointer: CGPoint(x: 900, y: 400), edgeFrame: edge,
                         expandedFrame: expanded, dragging: false, now: 0)
            for now in [1.0, 5] {
                XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                            dragging: !menuOpen, menuOpen: menuOpen, now: now))
                XCTAssertTrue(state.isShortcutExpanded)
            }
            XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                        dragging: false, now: 6))
            XCTAssertTrue(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                       dragging: false, now: 6.13))
            XCTAssertFalse(state.isExpanded)
            XCTAssertFalse(state.isShortcutExpanded)
        }
    }

    func testShortcutKeepsExpandedAndDismissalWaitsForPointerExit() {
        var state = SidebarHoverState()
        let outside = CGPoint(x: 700, y: 400)
        let inside = CGPoint(x: 900, y: 400)
        state.setShortcutExpanded(true)
        for now in [0.0, 1, 5] {
            XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                        dragging: false, now: now))
            XCTAssertTrue(state.isExpanded)
            XCTAssertTrue(state.isShortcutExpanded)
        }
        state.setShortcutExpanded(false)
        XCTAssertFalse(state.isExpanded)
        XCTAssertFalse(state.isShortcutExpanded)
        for pointer in [inside, CGPoint(x: 996, y: 400), outside] {
            XCTAssertFalse(state.update(pointer: pointer, edgeFrame: edge, expandedFrame: expanded,
                                        dragging: false, now: 6))
            XCTAssertFalse(state.isExpanded)
        }
        XCTAssertTrue(state.update(pointer: CGPoint(x: 996, y: 400), edgeFrame: edge,
                                   expandedFrame: expanded, dragging: false, now: 7))
        XCTAssertTrue(state.isExpanded)
    }

    func testEdgeExpansionStaysOpenAcrossResizeEventsAndDelayedExit() {
        var state = SidebarHoverState()
        XCTAssertTrue(state.update(pointer: CGPoint(x: 996, y: 400), edgeFrame: edge,
                                   expandedFrame: expanded, dragging: false, now: 0))
        XCTAssertTrue(state.isExpanded)
        XCTAssertFalse(state.update(pointer: CGPoint(x: 900, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 0.01))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 900, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 1))

        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 2))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 900, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 2.05))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 3))
        XCTAssertTrue(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                   expandedFrame: expanded, dragging: false, now: 3.12))
        XCTAssertFalse(state.isExpanded)
    }

    func testReentryCancelsCollapseAndDraggingKeepsExpanded() {
        var state = SidebarHoverState(isExpanded: true)
        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 0))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 900, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 0.1))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 1))
        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: true, now: 2))
        XCTAssertTrue(state.isExpanded)
        XCTAssertFalse(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                    expandedFrame: expanded, dragging: false, now: 3))
        XCTAssertTrue(state.update(pointer: CGPoint(x: 700, y: 400), edgeFrame: edge,
                                   expandedFrame: expanded, dragging: false, now: 3.12))
        XCTAssertFalse(state.isExpanded)
    }

    func testContextMenuKeepsExpandedAndRestartsCollapseDelayAfterClosing() {
        var state = SidebarHoverState(isExpanded: true)
        let outside = CGPoint(x: 700, y: 400)
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 0))
        for now in [0.2, 1, 5] {
            XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                        dragging: false, menuOpen: true, now: now))
            XCTAssertTrue(state.isExpanded)
        }
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 6))
        XCTAssertFalse(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                    dragging: false, now: 6.1))
        XCTAssertTrue(state.isExpanded)
        XCTAssertTrue(state.update(pointer: outside, edgeFrame: edge, expandedFrame: expanded,
                                   dragging: false, now: 6.13))
        XCTAssertFalse(state.isExpanded)
    }
}
