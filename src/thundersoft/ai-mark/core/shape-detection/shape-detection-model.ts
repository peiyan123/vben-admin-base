import { Point, Shape } from '..';

export interface ShapeDetectionData extends Shape {
  /**
   * 开始点
   */
  startPoint?: Point
  /**
   * 结束点
   */
  endPint?: Point
}