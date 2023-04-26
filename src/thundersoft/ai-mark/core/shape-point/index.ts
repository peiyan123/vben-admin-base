export * from './shape-point-interface';
export * from './shape-point-decorators';
export * from './shape-point-load-interface';
export * from './shape-point-load-decorators';
export * from './shape-point-analysis-rule-line-interface';
export * from './shape-point-analysis-rule-line-decorators';
export * from './shape-point-model';

import { ShapePointInterface } from './shape-point-interface';
import { ShapePointLoadInterface } from './shape-point-load-interface';
import { ShapePointAnalysisRuleLineInterface } from './shape-point-analysis-rule-line-interface';
export interface MarkShapePointInterface extends
  ShapePointInterface,
  ShapePointAnalysisRuleLineInterface,
  ShapePointLoadInterface
{ }

import { AiMarkInterface } from '..';
import { ShapePointDecorators } from './shape-point-decorators';
import { ShapePointLoadDecorators } from './shape-point-load-decorators';
import { ShapePointAnalysisRuleLineDecorators } from './shape-point-analysis-rule-line-decorators';
import { ShapeLabelColeDecorators } from '../shape/shape-label-cole-decorators';
import { MarkShapeDecorators } from '../shape/index';
import { MarkImageDecorators } from '../image/index';
import { GuidelineDecorators } from '../guide/guide-line-decorators';
import { MarkPointDecorators } from '../point/index';
import { MarkLineDecorators } from '../line/index';
/**
 * MarkShapePointDecorators
 * @param constructor 
 * @returns 
 */
export function MarkShapePointDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @GuidelineDecorators                   // 图层顺序 辅助线 最上层
  @MarkPointDecorators                   // 图层顺序 点 ：hover > selected > points
  @MarkLineDecorators                    // 图层顺序 线
  @ShapePointLoadDecorators              // 关键点的 数据回显
  @ShapePointAnalysisRuleLineDecorators  // 关键点的 连线规则
  @ShapeLabelColeDecorators              // labal 颜色计算 1/3 rgb 色值
  @ShapePointDecorators                  // 关键点的 标注模式
  @MarkShapeDecorators                   // 图形 选择
  @MarkImageDecorators                   // 图层顺序 图片
  class MarkShapePoint extends constructor {}
  return MarkShapePoint
};
