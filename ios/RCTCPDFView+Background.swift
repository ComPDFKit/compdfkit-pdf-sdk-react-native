import UIKit
import ComPDFKit

extension RCTCPDFView {
  func getBackground() -> [String: Any]? {
    guard let background = pdfViewController?.pdfListView?.document?.background(), background.hasBackground else { return nil }
    let value: NSMutableDictionary = ["pages": background.pageString ?? "", "type": background.type == .image ? "image" : "color", "opacity": Double(background.opacity), "scale": Double(background.scale), "rotation": Double(background.rotation), "horizontal_alignment": background.horizontalAlignment == 0 ? "left" : background.horizontalAlignment == 2 ? "right" : "center", "vertical_alignment": background.verticalAlignment == 0 ? "top" : background.verticalAlignment == 2 ? "bottom" : "center", "horizontal_offset": Double(background.xOffset), "vertical_offset": Double(background.yOffset), "allow_view": background.isAllowsView, "allow_print": background.isAllowsPrint]
    if background.type == .color { value["color"] = background.color?.toHexString() ?? "#FFFFFFFF" }
    return value as? [String: Any]
  }

  func updateBackground(info: [String: Any]) throws -> Bool {
    guard let background = pdfViewController?.pdfListView?.document?.background(), let pages = info["pages"] as? String, !pages.isEmpty, let type = info["type"] as? String else { throw NSError(domain: "BACKGROUND_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "Background payload is invalid."]) }
    background.pageString = pages; background.opacity = (info["opacity"] as? NSNumber)?.doubleValue ?? 1; background.scale = (info["scale"] as? NSNumber)?.doubleValue ?? 1; background.rotation = (info["rotation"] as? NSNumber)?.doubleValue ?? 0; background.horizontalAlignment = UInt(backgroundAlignment(info["horizontal_alignment"] as? String, horizontal: true)); background.verticalAlignment = UInt(backgroundAlignment(info["vertical_alignment"] as? String, horizontal: false)); background.xOffset = (info["horizontal_offset"] as? NSNumber)?.doubleValue ?? 0; background.yOffset = (info["vertical_offset"] as? NSNumber)?.doubleValue ?? 0; background.isAllowsView = info["allow_view"] as? Bool ?? true; background.isAllowsPrint = info["allow_print"] as? Bool ?? true
    if type == "color" { guard let color = info["color"] as? String, !color.isEmpty else { throw NSError(domain: "BACKGROUND_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "A color background requires color."]) }; background.type = .color; background.color = backgroundColor(color) } else if type == "image" { guard let path = info["image_path"] as? String, let image = UIImage(contentsOfFile: path) else { throw NSError(domain: "BACKGROUND_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "Background image_path does not exist."]) }; background.type = .image; background.setImage(image) } else { throw NSError(domain: "BACKGROUND_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "Background type is invalid."]) }
    background.update(); pdfViewController?.pdfListView?.layoutDocumentView(); return true
  }
  func clearBackground() -> Bool { guard let background = pdfViewController?.pdfListView?.document?.background() else { return true }; let result = background.clear(); if result { pdfViewController?.pdfListView?.layoutDocumentView() }; return result }
  private func backgroundAlignment(_ value: String?, horizontal: Bool) -> Int { if horizontal { return value == "left" ? 0 : value == "right" ? 2 : 1 }; return value == "top" ? 0 : value == "bottom" ? 2 : 1 }
  private func backgroundColor(_ value: String) -> UIColor { var hex = value; if hex.hasPrefix("#") { hex.removeFirst() }; if hex.count == 8 { hex = String(hex.dropFirst(2)) }; guard let rgb = UInt64(hex, radix: 16) else { return .white }; return UIColor(red: CGFloat((rgb >> 16) & 255) / 255, green: CGFloat((rgb >> 8) & 255) / 255, blue: CGFloat(rgb & 255) / 255, alpha: 1) }
}
