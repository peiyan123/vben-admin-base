import { Point } from '../point';
import { Subject } from 'rxjs';
import { ShapeSegmentationData } from './shape-segmentation-model';

export interface ShapeSegmentationInterface {
  /**
   * 点形集合
   */
  shapeSegmentations?: ShapeSegmentationData[]
  
  /**
   * 当前处于编辑状态的点形id
   */
  currentShapeSegmentation?: ShapeSegmentationData | null

  /**
   * 点图绘制完成
   */
  shapeSegmentationDrawSuccessEvent?: Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>

  /**
   * 点图绘制结束
   */
  shapeSegmentationDrawEndEvent?: Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>

  /**
   * 点图的点事件
   */
  shapeSegmentationDrawAddEvent?: Subject<{ point: Point, shape: ShapeSegmentationData }>

  /**
   * 进入画点模式
   * @param rules 
   */
  shapeSegmentationDrawing?(shap: ShapeSegmentationData): void
}