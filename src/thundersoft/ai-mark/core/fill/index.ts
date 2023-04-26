export * from './fill-draw-decorators';
export * from './fill-draw-interface';
export * from './fill-model';

import { FillDrawInterface } from './fill-draw-interface';

export interface MarkFillInterface extends
  FillDrawInterface
{
    /**
     * 清除
     */
    fillClear?(): void
}

import { AiMarkInterface } from '..';
import { FillDrawDecorators } from './fill-draw-decorators';
import { CONFIG } from '../config';
/**
 * MarkImageDecorators
 * @param constructor 
 * @returns 
 */
export function MarkFillDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @FillDrawDecorators(CONFIG.fill)
  class MarkFillClass extends constructor {
    /**
     * 清除
     */
    fillClear() {
      this.fillsMap.clear()
    }
  }
  return MarkFillClass
};
