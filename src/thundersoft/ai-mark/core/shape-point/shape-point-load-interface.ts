import { ShapePointData } from './shape-point-model';

export interface ShapePointLoadInterface {
  /**
   * 加载图形数据
   * @param shap 
   */
  loadShapePoint?(shap: ShapePointData[]): void
}