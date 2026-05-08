package com.compdfkitpdf.reactnative.codec.annotation;


import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFSoundAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.RnFileUtils;
import com.compdfkitpdf.reactnative.codec.RnDocumentAware;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.io.File;

/**
 * Maps sound annotation annotation data between native objects and React Native maps.
 */
public class RnSoundAnnotationCodec extends RnBaseAnnotationCodec implements RnDocumentAware {

  private CPDFDocument document;

  /**
   * Sets the document.
   */
  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  /**
   * Writes native properties into the React Native map.
   */
  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {

  }


  /**
   * Updates annotation.
   */
  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
  }


  /**
   * Adds annotation.
   */
  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    int pageIndex =  annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap =annotMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    String soundPath = annotMap.getString("soundPath");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFSoundAnnotation soundAnnotation = (CPDFSoundAnnotation) page.addAnnot(Type.SOUND);
    if (soundAnnotation.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      soundAnnotation.setTitle(title);
      soundAnnotation.setContent(content);
      soundAnnotation.setRect(rectF);
      if (annotMap.hasKey("createDate") ){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        soundAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        soundAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        soundAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        soundAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      if (!TextUtils.isEmpty(soundPath)){
        String path = RnFileUtils.parseFilePath(document.getContext(), soundPath );
        File file = new File(path);
        if (file.exists()){
          soundAnnotation.setSoundPath(file.getAbsolutePath());
        }
      }
    }
    return soundAnnotation;
  }
}
