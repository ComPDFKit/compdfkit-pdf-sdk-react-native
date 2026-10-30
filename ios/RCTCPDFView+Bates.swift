import UIKit
import ComPDFKit

extension RCTCPDFView {
  func getBates() -> [String: Any]? {
    guard let bates = pdfViewController?.pdfListView?.document?.bates() else { return nil }
    guard (0..<6).contains(where: { !(bates.text(at: UInt($0)) ?? "").isEmpty }) else { return nil }
    let margin = bates.margin
    let slots = (0..<6).map { index -> [String: Any] in [
      "position": batesPosition(index), "text": bates.text(at: UInt(index)) ?? "",
      "font_name": bates.fontName(at: UInt(index)) ?? "Helvetica", "font_size": Double(bates.fontSize(at: UInt(index))),
      "text_color": bates.textColor(at: UInt(index))?.toHexString() ?? "#000000"
    ] }
    return ["pages": bates.pageString ?? "", "margin": ["left": Double(margin.left), "top": Double(margin.top), "right": Double(margin.right), "bottom": Double(margin.bottom)], "page_offset": 0, "rule": 2, "slots": slots]
  }

  func updateBates(info: [String: Any]) throws -> Bool {
    guard let bates = pdfViewController?.pdfListView?.document?.bates(), let pages = info["pages"] as? String, !pages.isEmpty, let margin = info["margin"] as? [String: Any], let slots = info["slots"] as? [[String: Any]], !slots.isEmpty, let left = batesNumber(margin["left"]), let top = batesNumber(margin["top"]), let right = batesNumber(margin["right"]), let bottom = batesNumber(margin["bottom"]) else { throw NSError(domain: "BATES_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "Bates payload is invalid."]) }
    var used = Set<Int>()
    for slot in slots { guard let index = batesIndex(slot["position"] as? String), used.insert(index).inserted, let size = batesNumber(slot["font_size"]), size > 0 else { throw NSError(domain: "BATES_FAIL", code: 1, userInfo: [NSLocalizedDescriptionKey: "Bates slot is invalid."]) } }
    bates.pageString = pages; bates.margin = UIEdgeInsets(top: top, left: left, bottom: bottom, right: right)
    for index in 0..<6 { bates.setText("", at: UInt(index)) }
    for slot in slots { guard let index = batesIndex(slot["position"] as? String), let size = batesNumber(slot["font_size"]) else { continue }; bates.setText(slot["text"] as? String ?? "", at: UInt(index)); bates.setFontName(slot["font_name"] as? String ?? "Helvetica", at: UInt(index)); bates.setFontSize(size, at: UInt(index)); bates.setTextColor(batesColor(slot["text_color"] as? String ?? "#FF000000"), at: UInt(index)) }
    bates.update(); pdfViewController?.pdfListView?.layoutDocumentView(); return true
  }

  func clearBates() -> Bool { guard let bates = pdfViewController?.pdfListView?.document?.bates() else { return false }; let result = bates.clear(); if result { pdfViewController?.pdfListView?.layoutDocumentView() }; return result }

  private func batesNumber(_ value: Any?) -> CGFloat? { guard let value = value as? NSNumber else { return nil }; return CGFloat(value.doubleValue) }
  private func batesPosition(_ index: Int) -> String { ["header_left", "header_center", "header_right", "footer_left", "footer_center", "footer_right"][index] }
  private func batesIndex(_ value: String?) -> Int? { ["header_left", "header_center", "header_right", "footer_left", "footer_center", "footer_right"].firstIndex(of: value ?? "") }
  private func batesColor(_ value: String) -> UIColor { var hex = value; if hex.hasPrefix("#") { hex.removeFirst() }; if hex.count == 8 { hex = String(hex.dropFirst(2)) }; guard let rgb = UInt64(hex, radix: 16), hex.count == 6 else { return .black }; return UIColor(red: CGFloat((rgb >> 16) & 255) / 255, green: CGFloat((rgb >> 8) & 255) / 255, blue: CGFloat(rgb & 255) / 255, alpha: 1) }
}
