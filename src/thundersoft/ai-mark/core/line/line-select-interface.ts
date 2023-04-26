
import { Subject } from 'rxjs';
import { Line } from './line-model';
export interface LineSelectInterface {
  /**
   * 所有可选择线
   */
  lineSelectPlan?: Line[]

  /**
   * 选中的线
   */
  lineSelected?: Line | null
  
  /**
   * 线选中事件 之前
   */
  lineSelectedBeforeEvent?: Subject<Line>
  
  /**
   * 线选中事件 之前
   */
  lineSelectedAfterEvent?: Subject<Line>

  /**
   * 鼠标左键单击 退出对象选中 功能
   */
  lineSelectedExitKeyEsc?: boolean | null

  /**
   * 鼠标左键单击 退出对象选中 功能
   */
  lineSelectedExitClick?: boolean | null
  
  /**
   * 线选中事件 退出图形选择
   */
  lineSelectedExitBeforeEvent?: Subject<Line>
  /**
   * 线选中事件 退出图形选择
   */
  lineSelectedExitAfterEvent?: Subject<any>

}