export * from './shape-segmentation-interface';
export * from './shape-segmentation-decorators';
export * from './shape-segmentation-load-interface';
export * from './shape-segmentation-load-decorators';
export * from './shape-segmentation-line-interface';
export * from './shape-segmentation-line-decorators';
export * from './shape-segmentation-model';

import { ShapeSegmentationInterface } from './shape-segmentation-interface';
import { ShapeSegmentationLoadInterface } from './shape-segmentation-load-interface';
import { ShapeSegmentationLineInterface } from './shape-segmentation-line-interface';
import { ShapeSegmentationCreaterPointInterface } from './shape-segmentation-creater-point-interface';
export interface MarkShapeSegmentationInterface extends
  ShapeSegmentationInterface,
  ShapeSegmentationLineInterface,
  ShapeSegmentationCreaterPointInterface,
  ShapeSegmentationLoadInterface
{ }

import { AiMarkInterface } from '..';
import { ShapeSegmentationDecorators } from './shape-segmentation-decorators';
import { ShapeSegmentationLoadDecorators } from './shape-segmentation-load-decorators';
import { ShapeSegmentationLineDecorators } from './shape-segmentation-line-decorators';
import { ShapeLabelColeDecorators } from '../shape/shape-label-cole-decorators';
import { ShapeSegmentationCreaterPointDecorators } from './shape-segmentation-creater-point-decorators';
import { MarkShapeDecorators } from '../shape/index';
import { MarkImageDecorators } from '../image/index';
import { MarkLineDecorators } from '../line/index';
import { MarkPointDecorators } from '../point/index';
import { GuidelineDecorators } from '../guide/guide-line-decorators';
import { MarkFillDecorators } from '../fill/index';
/**
 * MarkShapeSegmentationDecorators
 * @param constructor 
 * @returns 
 */
export function MarkShapeSegmentationDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @GuidelineDecorators   // 图层顺序 辅助线 最上层
  @MarkPointDecorators  // 图层顺序 点 ：hover > selected > points
  @MarkLineDecorators  // 图层顺序 线
  @MarkFillDecorators  // 填充颜色
  @ShapeSegmentationLoadDecorators
  @ShapeSegmentationCreaterPointDecorators
  @ShapeSegmentationLineDecorators
  @ShapeLabelColeDecorators
  @ShapeSegmentationDecorators
  @MarkShapeDecorators
  @MarkImageDecorators // 图层顺序 图片
  class MarkShapeSegmentation extends constructor {}
  return MarkShapeSegmentation
};
