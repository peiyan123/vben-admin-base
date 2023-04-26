import { Point } from './index';
import { Subject } from 'rxjs';
/**
 * ImageDragInterface
 */
export interface PointDragtInterface {
  /**
   * 可以被移动的点
   */
  pointDragPlan?: Point[]
  pointDragPlanMap?: Map<string, Point[]>

  /**
   * 点移动中事件 
   */
  pointDragEvent?: Subject<Point>
  /**
   * 点开始移动事件
   */
  pointDragStartEvent?: Subject<Point>
  /**
   * 点结束移动事件
   */
  pointDragEndEvent?: Subject<Point>
 
  /**
   * 正在被移动的点
   */
  pointDragDrawing?: Point | null

}