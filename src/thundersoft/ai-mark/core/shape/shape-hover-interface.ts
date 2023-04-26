import { Shape } from './shape-model';
import { Subject } from 'rxjs';
export interface ShapeHoverInterface {
  /**
   * 所有可悬浮图形
   */
  shapeHoverPlan?: Shape[]
  /**
   * 图形Hover的边界距离
   */
  shapeHoverDistanceRange?: number

  /**
   * 图形外围距离
   */
  shapePeripheralDistance?: number

  /**
   * 图形外围悬浮框的宽度
   */
  shapeHoverPeripheralWidth?: number

  /**
   * 悬浮高亮
   */
  shapeHover?: Shape | null

  /**
   * 悬浮高亮 背景
   */
  shapeHoverBackground?: boolean | null
  
  /**
   * 图形悬浮事件
   */
  shapeHoverEvent?: Subject<Shape>

  /**
   * 计算 图形的 最小 外接距
   */
  updateShapeMinMax?(shape: Shape, shapePeripheralDistance: number): void
  
}