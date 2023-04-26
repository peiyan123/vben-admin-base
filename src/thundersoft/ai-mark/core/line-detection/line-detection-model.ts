import { Line, Point } from '..';

export interface LineDetectionData extends Line {
  /**
   * 开始点
   */
  startPoint?: Point
  /**
   * 结束点
   */
  endPoint?: Point
}