import { ShapeSegmentationData } from './shape-segmentation-model';

export interface ShapeSegmentationLoadInterface {
  /**
   * 加载图形数据
   * @param shap 
   */
  loadShapeSegmentation?(shap: ShapeSegmentationData[]): void
}