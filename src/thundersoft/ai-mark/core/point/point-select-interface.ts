import { Point } from './index';
import { Subject } from 'rxjs';
/**
 * ImageDragInterface
 */
export interface PointSelectInterface {
  /**
   * 可以被选择的点
   */
  pointSelectedPlan?: Point[]
  pointSelectedPlanMap?: Map<string, Point[]>

  /**
   * 当前选中的点
   */
  pointSelected?: Point | null

  /**
   * 点选择事件
   */
  pointSelectedEvent?: Subject<Point>
}