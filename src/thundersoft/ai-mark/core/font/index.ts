export * from './font-draw-decorators';
export * from './font-draw-interface';
export * from './font-model';

import { FontDrawInterface } from './font-draw-interface';

export interface MarkFontInterface extends
  FontDrawInterface
{
    /**
     * 清除文字
     */
    fontClear?(): void
}

import { AiMarkInterface } from '..';
import { FontDrawDecorators } from './font-draw-decorators';
import { CONFIG } from '../config';
/**
 * MarkImageDecorators
 * @param constructor 
 * @returns 
 */
export function MarkFontDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @FontDrawDecorators(CONFIG.font)
  class MarkFontClass extends constructor {
    /**
     * 清除文字
     */
    fontClear() {
      this.fonts = []
      this.fontsMap.clear()
    }
  }
  return MarkFontClass
};
