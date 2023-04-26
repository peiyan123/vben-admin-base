import { Shape } from './shape-model';
import { Subject } from 'rxjs';
export interface ShapeSelectInterface {
  /**
   * 所有可选择图形
   */
  shapeSelectPlan?: Shape[]

  /**
   * 选中的图形
   */
  shapeSelected?: Shape | null
  
  /**
   * 图形选中事件 之前
   */
  shapeSelectedBeforeEvent?: Subject<Shape>
  
  /**
   * 图形选中事件 之前
   */
  shapeSelectedAfterEvent?: Subject<Shape>

  /**
   * 鼠标左键单击 退出对象选中 功能
   */
  shapeSelectedExitKeyEsc?: boolean | null

  /**
   * 鼠标左键单击 退出对象选中 功能
   */
  shapeSelectedExitClick?: boolean | null
  
  /**
   * 图形选中事件 退出图形选择
   */
  shapeSelectedExitBeforeEvent?: Subject<Shape>
  /**
   * 图形选中事件 退出图形选择
   */
  shapeSelectedExitAfterEvent?: Subject<any>

}