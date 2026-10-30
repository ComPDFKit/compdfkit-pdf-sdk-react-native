/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 */

package com.compdfkitpdf.reactnative.viewer;

/** Converts background rotation using the same convention as the watermark bridge. */
final class RnBackgroundRotation {
  private RnBackgroundRotation() {}

  static float toNative(double clockwiseDegrees) {
    return (float) -Math.toRadians(clockwiseDegrees);
  }

  static float fromNative(float counterclockwiseRadians) {
    // Preserve SDK float precision so 360 degrees remains valid for read-modify-write.
    return (float) -Math.toDegrees(counterclockwiseRadians);
  }
}
