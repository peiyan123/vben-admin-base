import { Point } from '../point';
import { Subject } from 'rxjs';
import { ShapePointData } from './shape-point-model';

export interface ShapePointInterface {
  /**
   * 点形集合
   */
  shapePoints?: ShapePointData[]
  
  /**
   * 当前处于编辑状态的点形id
   */
  currentShapePoint?: ShapePointData | null

  /**
   * 点图绘制完成
   */
  shapePointDrawSuccessEvent?: Subject<{ point: Point, shape: ShapePointData }>

  /**
   * 点图的点事件
   */
  shapePointDrawAddEvent?: Subject<{ point: Point, shape: ShapePointData }>

  /**
   * 进入画点模式
   * @param rules 
   */
  shapePointDrawing?(shap: ShapePointData): void

}