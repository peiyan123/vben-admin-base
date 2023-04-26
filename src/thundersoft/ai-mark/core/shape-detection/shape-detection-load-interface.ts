import { ShapeDetectionData } from './shape-detection-model';

export interface ShapeDetectionLoadInterface {
  /**
   * 加载图形数据
   * @param shap
   */
  loadShapeDetection?(shap: ShapeDetectionData[]): void;
  loadShapeDetectionElse?(shap: ShapeDetectionData[]): void;
}
