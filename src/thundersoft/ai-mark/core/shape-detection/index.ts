export * from './shape-detection-model';
export * from './shape-detection-interface';


import { ShapeDetectionInterface } from './shape-detection-interface';
import { ShapeDetectionLineInterface } from './shape-detection-line-interface';
import { ShapeDetectionPointInterface } from './shape-detection-point-interface';
import { ShapeDetectionLoadInterface } from './shape-detection-load-interface';
export interface MarkShapeDetectionInterface extends
  ShapeDetectionInterface,
  ShapeDetectionLineInterface,
  ShapeDetectionLoadInterface,
  ShapeDetectionPointInterface
{ }

import { AiMarkInterface } from '..';
import { ShapeLabelColeDecorators } from '../shape/shape-label-cole-decorators';
import { ShapeDetectionDecorators } from './shape-detection-decorators';
import { ShapeDetectionLineDecorators } from './shape-detection-line-decorators';
import { ShapeDetectionPointDecorators } from './shape-detection-point-decorators';
import { ShapeDetectionLoadDecorators } from './shape-detection-load-decorators';
import { MarkShapeDecorators } from '../shape/index';
import { GuidelineDecorators } from '../guide/guide-line-decorators';
import { MarkPointBaseDecorators } from '../point/index';
import { MarkLineDecorators } from '../line/index';
import { MarkImageDecorators } from '../image/index';
import { ShapeSegmentationLineDecorators } from "../shape-segmentation/shape-segmentation-line-decorators";
import { MarkFillDecorators } from "../fill/index";
/**
 * MarkShapePointDecorators
 * @param constructor 
 * @returns 
 */
export function MarkShapeDetectionDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @GuidelineDecorators // 图层顺序 辅助线 最上层
  // @MarkPointDecorators // 图层顺序 点 ：hover > selected > points
  @MarkPointBaseDecorators
  @MarkLineDecorators // 图层顺序 线
  @MarkFillDecorators // 填充颜色
  @ShapeDetectionLoadDecorators
  @ShapeDetectionLineDecorators
  @ShapeSegmentationLineDecorators
  @ShapeLabelColeDecorators
  @ShapeDetectionPointDecorators
  @ShapeDetectionDecorators
  @MarkShapeDecorators
  @MarkImageDecorators // 图层顺序 图片
  class MarkShapeDetection extends constructor {}
  return MarkShapeDetection
}
