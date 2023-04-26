export * from './image-load-decorators';
export * from './image-load-interface';
export * from './image-drag-decorators';
export * from './image-drag-interface';
export * from './image-zoom-decorators';
export * from './image-zoom-interface';
export * from './image-range-decorators';
export * from './image-range-interface';

import { ImageLoadInterface } from './image-load-interface';
import { ImageZoomInterface } from './image-zoom-interface';
import { ImageDragInterface } from './image-drag-interface';
import { ImageRangeInterface } from './image-range-interface';
/**
 * MarkImageInterface
 */
export interface MarkImageInterface extends
  ImageLoadInterface,
  ImageDragInterface,
  ImageRangeInterface,
  ImageZoomInterface
{ }


import { AiMarkInterface } from '..';
import { ImageLoadDecorators } from './image-load-decorators';
import { ImageZoomDecorators } from './image-zoom-decorators';
import { ImageDragDecorators } from './image-drag-decorators';
import { ImageRangeDecorators } from './image-range-decorators';

/**
 * MarkImageDecorators
 * @param constructor 
 * @returns 
 */
export function MarkImageDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @ImageRangeDecorators
  @ImageDragDecorators
  @ImageZoomDecorators
  @ImageLoadDecorators
  class MarkImageClass extends constructor {}
  return MarkImageClass
};