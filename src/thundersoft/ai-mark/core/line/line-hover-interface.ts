import { Subject } from 'rxjs';
import { Line } from './line-model';
export interface ShapeHoverInterface {
  /**
   * 所有可悬浮线
   */
  lineHoverPlan?: Line[]
  /**
   * 线Hover的边界距离
   */
   lineHoverDistanceRange?: number

  /**
   * 线外围距离
   */
   linePeripheralDistance?: number

  /**
   * 线外围悬浮框的宽度
   */
   lineHoverPeripheralWidth?: number

  /**
   * 悬浮高亮
   */
   lineHover?: Line | null

  /**
   * 悬浮高亮 背景
   */
   lineHoverBackground?: boolean | null
  
  /**
   * 线悬浮事件
   */
   lineHoverEvent?: Subject<Line>

  /**
   * 计算 线的 最小 外接距
   */
  updateLineMinMax?(line: Line, linePeripheralDistance: number): void
  
}