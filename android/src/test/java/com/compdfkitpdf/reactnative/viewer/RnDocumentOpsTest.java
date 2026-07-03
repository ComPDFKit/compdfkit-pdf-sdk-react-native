package com.compdfkitpdf.reactnative.viewer;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class RnDocumentOpsTest {

  @Test
  public void normalizeInsertIndexTreatsMinusOneAsAppend() {
    assertEquals(5, RnDocumentOps.normalizeInsertIndex(-1, 5));
  }

  @Test
  public void normalizeInsertIndexKeepsExplicitInsertPositions() {
    assertEquals(2, RnDocumentOps.normalizeInsertIndex(2, 5));
  }

  @Test
  public void validSourcePageIndexRequiresExistingPage() {
    assertTrue(RnDocumentOps.isValidSourcePageIndex(0, 1));
    assertTrue(RnDocumentOps.isValidSourcePageIndex(4, 5));
    assertFalse(RnDocumentOps.isValidSourcePageIndex(-1, 5));
    assertFalse(RnDocumentOps.isValidSourcePageIndex(5, 5));
  }

  @Test
  public void validInsertIndexAllowsAppendSlot() {
    assertTrue(RnDocumentOps.isValidInsertIndex(0, 5));
    assertTrue(RnDocumentOps.isValidInsertIndex(5, 5));
    assertFalse(RnDocumentOps.isValidInsertIndex(-1, 5));
    assertFalse(RnDocumentOps.isValidInsertIndex(6, 5));
  }
}
