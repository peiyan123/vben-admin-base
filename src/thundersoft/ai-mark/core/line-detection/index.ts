export * from './line-detection-interface';
export * from './line-detection-model';

import { LineDetectionInterface } from './line-detection-interface';


export interface MarkLineDetectionInterface extends
    LineDetectionInterface
//   LineDetectionLoadInterface,
//   LineDetectionPointInterface
{ }

import { AiMarkInterface } from '..';
// import { ShapeLabelColeDecorators } from '../shape/shape-label-cole-decorators';
// import { ShapeDetectionDecorators } from './shape-detection-decorators';
// import { ShapeDetectionLineDecorators } from './shape-detection-line-decorators';
// import { ShapeDetectionPointDecorators } from './shape-detection-point-decorators';
// import { ShapeDetectionLoadDecorators } from './shape-detection-load-decorators';
import { MarkShapeDecorators } from '../shape/index';
import { GuidelineDecorators } from '../guide/guide-line-decorators';
import { MarkPointBaseDecorators, MarkPointDecorators } from '../point/index';
import { MarkLineDecorators } from '../line/index';
import { MarkImageDecorators } from '../image/index';
import { LineDetectionDecorators } from './line-detection-decorators';
/**
 * MarkShapePointDecorators
 * @param constructor 
 * @returns 
 */
export function MarkLineDetectionDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @GuidelineDecorators // 图层顺序 辅助线 最上层
  @MarkPointDecorators // 图层顺序 点 ：hover > selected > points
  @MarkPointBaseDecorators
  @MarkLineDecorators // 图层顺序 线
//   @LineDetectionLoadDecorators
  @LineDetectionDecorators
//   @LineDetectionPointDecorators
  @MarkLineDecorators
  @MarkImageDecorators // 图层顺序 图片
  class MarkLineDetection extends constructor {}
  return MarkLineDetection
}