import { Point, PointSource } from './index';
import { Subject } from 'rxjs';
/**
 * ImageDragInterface
 */
export interface PointCreateInterface {
  /**
   * 鼠标左键点击添加点事件
   */
  pointsCreateByMouseClickBeforeEvent?: Subject<Point>
  /**
   * 鼠标左键点击添加点, 是否区分双击
   */
  pointsCreateDBClickOrClick?: boolean
  /**
   * 预定义画点的模式：按计划绘制，优先于点的默认绘制
   */
  pointDrawPlan?: PointSource[] | null

  /**
   * 点的默认绘制：有值时开启左键点击绘制，null时左键点击不会绘制
   */
  pointSource?: PointSource | null
}