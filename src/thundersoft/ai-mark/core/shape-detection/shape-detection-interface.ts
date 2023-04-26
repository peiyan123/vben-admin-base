import { ShapeDetectionData } from './shape-detection-model';
import { Subject } from 'rxjs';
import { LineDetectionData, Point } from '..';

export interface ShapeDetectionInterface {
  /**
   * 矩形集合
   */
  shapeDetections?: ShapeDetectionData[]
  
  /**
   * 正在绘制的矩形
   */
  shapeDetectionDrawing?: ShapeDetectionData | null

  /**
   * 绘制成功事件
   */
  shapeDetectionCreateSuccess?: Subject<ShapeDetectionData>

  /**
   * 矩形绘制 参数 (非空则开启绘制功能)
   */
  shapeDetectionSource?: ShapeDetectionData | null
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
   * 箭头坐标计算
   * @param startpoint
   * @param endpoint
   */
  arrowadd?(startpoint: Point, endpoint: Point)
  /**
   * 垂线坐标计算
   * @param endpoint
   */
  verticaladd?(startpoint: Point, endpoint: Point)
  /**
   * 进入绘制模式：画点
   * @param option 
   */
  shapeDetectionDrawOption?(option: ShapeDetectionData): void
}