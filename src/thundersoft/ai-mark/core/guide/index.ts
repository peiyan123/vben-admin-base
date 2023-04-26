export * from './guide-grid-decorators';
export * from './guide-line-interface';
export * from './guide-line-decorators';
export * from './guide-line-interface';
export * from './guide-line-model';

import { GuidelineInterface } from './guide-line-interface';
/**
 * MarkGuideToolInterface
 */
export interface MarkGuideToolInterface extends
  GuidelineInterface
{ }

import { AiMarkInterface } from '../index';
import { GuidelineDecorators } from './guide-line-decorators';
/**
 * MarkGuideToolDecorators
 * @param constructor 
 * @returns 
 */
export function MarkGuideToolDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @GuidelineDecorators
  class MarkImageClass extends constructor {}
  return MarkImageClass
};