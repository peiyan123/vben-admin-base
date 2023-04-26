import { PointSource } from '../point';
import { Shape } from '../shape/index';
export interface ShapePointData extends Shape {
  /**
   * 连接规则
   */
  lineRuleString?: string
  /**
   * 解析后的连接规则
   */
  analysisRuleLine?: Map<string, any>
  /**
   * 计划要绘制的点
   */
  pointDrawPlan?: PointSource[]
}