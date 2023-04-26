import { Point } from './index';
/**
 * ImageDragInterface
 */
export interface PointAllDrawInterface {
  // 当前画布上绘制的所有点
  points?: Point[]
  pointsMap?: Map<string, Point[]>
}