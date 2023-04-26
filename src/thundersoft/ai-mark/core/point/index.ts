export * from './point-all-draw-decorators';
export * from './point-all-draw-interface';
export * from './point-model';
export * from './point-mouse-decorators';
export * from './point-mouse-interface';
export * from './point-hover-decorators';
export * from './point-hover-interface';
export * from './point-select-decorators';
export * from './point-select-interface';
export * from './point-drag-decorators';
export * from './point-drag-interface';

import { PointAllDrawInterface } from './point-all-draw-interface';
import { PointMouseInterface } from './point-mouse-interface';
import { PointHoverInterface } from './point-hover-interface';
import { PointSelectInterface } from './point-select-interface';
import { PointDragtInterface } from './point-drag-interface';
import { PointCreateInterface } from './point-create-interface';
/**
 * MarkPointInterface
 */
export interface MarkPointInterface extends
  PointAllDrawInterface,
  PointMouseInterface,
  PointHoverInterface,
  PointSelectInterface,
  PointCreateInterface,
  PointDragtInterface
{
    /**
     * 清除点
     */
    pointClear?(): void
    /**
     * 清除 绘制点
     */
    pointClearDraw?(): void
      /**
     * 清除 正在执行动做的点
     */
    pointClearDoing?(): void
    /**
     * 清除 创建点
     */
    pointClearCreate?(): void
}

import { AiMarkInterface } from '..';
import { PointAllDrawDecorators } from './point-all-draw-decorators';
import { PointMouseDecorators } from './point-mouse-decorators';
import { PointSelectDecorators } from './point-select-decorators';
import { PointHoverDecorators } from './point-hover-decorators';
import { PointDragDecorators } from './point-drag-decorators';
import { PointCreateDecorators } from './point-create-decorators';
import { MarkFontDecorators } from '../font/index';
import { CONFIG } from '../config';
/**
 * MarkImageDecorators
 * @param constructor 
 * @returns 
 */
export function MarkPointDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @PointDragDecorators // 点拖动
  @PointSelectDecorators // 点选择
  @PointHoverDecorators // 点 Hover
  @PointMouseDecorators // 鼠标点的位置
  @PointAllDrawDecorators // 绘制点
  @MarkFontDecorators
  @PointCreateDecorators(CONFIG.point) // 创建点, 参数：创建点的配置，null 开启
  class MarkPointClass extends constructor {
    /**
     * 清除点
     */
    pointClear() {
      this.pointClearDoing()
      this.pointClearDraw()
      this.pointClearCreate()
    }
    /**
     * 清除 绘制点
     */
    pointClearDraw() {
      this.points = []
      this.pointsMap.clear()
    }
    /**
     * 清除 正在执行动做的点
     */
    pointClearDoing() {
      this.pointSelectedPlan = []
      this.pointSelectedPlanMap.clear()
      this.pointSelected = null
      this.pointDragPlan = []
      this.pointDragPlanMap.clear()
      this.pointDragDrawing = null
      this.pointHover = null
    }
    /**
     * 清除 创建点
     */
    pointClearCreate() {
      this.pointDrawPlan = []
      this.pointSource = null
    }
  }
  return MarkPointClass
};
/**
 * MarkImageDecorators
 * @param constructor 
 * @returns 
 */
export function MarkPointBaseDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  @PointDragDecorators // 点拖动
  // @PointSelectDecorators // 点选择
  @PointHoverDecorators // 点 Hover
  @PointMouseDecorators // 鼠标点的位置
  @PointAllDrawDecorators // 绘制点
  @MarkFontDecorators
  @PointCreateDecorators(CONFIG.point) // 创建点, 参数：创建点的配置，null 开启
  class MarkPointClass extends constructor {
    /**
     * 清除点
     */
    pointClear() {
      this.pointClearDoing()
      this.pointClearDraw()
      this.pointClearCreate()
    }
    /**
     * 清除 绘制点
     */
    pointClearDraw() {
      this.points = []
      this.pointsMap.clear()
    }
    /**
     * 清除 正在执行动做的点
     */
    pointClearDoing() {
      // this.pointSelectedPlan = []
      // this.pointSelectedPlanMap.clear()
      // this.pointSelected = null
      this.pointDragPlan = []
      this.pointDragPlanMap.clear()
      this.pointDragDrawing = null
      this.pointHover = null
    }
    /**
     * 清除 创建点
     */
    pointClearCreate() {
      this.pointDrawPlan = []
      this.pointSource = null
    }
  }
  return MarkPointClass
};