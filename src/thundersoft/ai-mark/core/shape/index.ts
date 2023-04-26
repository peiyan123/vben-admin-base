export * from './shape-select-decorators';
export * from './shape-select-interface';
export * from './shape-hover-decorators';
export * from './shape-hover-interface';
export * from './shape-label-cole-decorators';
export * from './shape-label-cole-interface';
export * from './shape-model';

/**
 * MarkShapeInterface
 */
import { ShapeSelectInterface } from './shape-select-interface';
import { ShapeHoverInterface } from './shape-hover-interface';
import { ShapeLabelColeInterface } from './shape-label-cole-interface';
import { ShapeRectangleFillInterface } from './shape-rectangle-fill-interface';
export interface MarkShapeInterface extends
  ShapeSelectInterface,
  ShapeLabelColeInterface,
  ShapeRectangleFillInterface,
  ShapeHoverInterface
{
    /**
     * 清除图形
     */
    shapeClear?(): void
}

/**
 * MarkShapePointDecorators
 * @param constructor 
 * @returns 
 */
import { AiMarkInterface } from '..';
import { ShapeSelectDecorators } from '../shape/shape-select-decorators';
import { ShapeHoverDecorators } from './shape-hover-decorators';
import { ShapeRectangleFillDecorators } from './shape-rectangle-fill-decorators';
export function MarkShapeDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @ShapeHoverDecorators
  @ShapeRectangleFillDecorators
  @ShapeSelectDecorators
  class MarkShapeBaseClass extends constructor {
    /**
     * 清除图形
     */
    shapeClear() {
      this.shapeSelectPlan = []
      this.shapeSelected = null
      this.shapeHover = null
    }
  }
  return MarkShapeBaseClass
};
