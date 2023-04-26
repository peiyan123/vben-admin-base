import { Point, PointSource } from '../point';
export interface Shape {
  /**
   * id
   */
  shapeId?: string
  /**
   * 点
   */
  point?: Point[]
  /**
   * 点数据
   */
  pointSource?: PointSource[]
  /**
   * 当前点的index值，index 从1开始的正整数
   */
  index?: number
  /**
   * 可绘制点的数量
   */
  maxIndex?: number
  /**
   * 颜色
   */
  color?: string
  /**
   * label
   */
  label?: string
  /**
   * 颜色
   */
  labelColor?: string
  /**
   * 类型
   */
  type?: string
  /**
   * 是否默认区域
   */
  defaultArea?: boolean
  /**
   * 所在区域
   */
  area?: string
  /**
   * 外接距
   */
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
}