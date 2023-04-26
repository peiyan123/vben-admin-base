
import { Subject } from 'rxjs';
import { LineDetectionData } from './line-detection-model';
import { Point } from '..';

export interface LineDetectionInterface {
  /**
   * 线集合
   */
  lineDetections?: LineDetectionData[]
  
  /**
   * 正在绘制的线
   */
  lineDetectionDrawing?: LineDetectionData | null

  /**
   * 绘制成功事件
   */
  lineDetectionCreateSuccess?: Subject<LineDetectionData>

  /**
   * 线绘制 参数 (非空则开启绘制功能)
   */
  lineDetectionSource?: LineDetectionData | null

  /**
   * 进入绘制模式：画点
   * @param rules 
   */
  lineDetectionDrawOption?(option: LineDetectionData): void

  /**
   * 箭头追加
   * @param endpoint
   */
  arrowadd?(startpoint: Point, endpoint: Point)
}
