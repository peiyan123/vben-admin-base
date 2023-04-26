import { AiMarkInterface } from '..';
import { Point } from '../point/index';

/**
 * ShapeDetectionPointDecorators
 */

export function ShapeDetectionPointDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      // 矩形点移动
      this.shapeDetectionPointDrag()
      // 绘制 选中矩形 的4个点
      this.shapeDetectionSelectedDrawPoint()
      return {...result}
    }
  
    /**
     * 绘制 选中矩形 的4个点
     */
    shapeDetectionSelectedDrawPoint() {
      this.canvasOperation(() => {
        if (this.shapeSelected) {
          this.pointDragPlan = this.shapeSelected.point
        }
      })
    }

    /**
     * 矩形点移动
     * @param element 
     */
    shapeDetectionPointDrag() {
      // 获取矩形中的相关点
      const getRelationPoint = (points: Point[], point: Point): null | {x: Point, y: Point} => {
        switch (points.indexOf(point)) {
          case 0:
            return {x: points[3], y: points[1]}
          case 1:
            return {x: points[2], y: points[0]}
          case 2:
            return {x: points[1], y: points[3]}
          case 3:
            return {x: points[0], y: points[2]}
          default:
            return null
        }
      }
      this.destroy.push(
        this.pointDragEvent.subscribe(point => {
          if (this.shapeSelected && this.shapeSelected.point && this.shapeSelected.point.length === 4) {
            const relationPoint = getRelationPoint(this.shapeSelected.point!, point)
            if (relationPoint) {
              relationPoint.x.x = point.x
              relationPoint.x.source.x = point.source.x
              relationPoint.y.y = point.y
              relationPoint.y.source.y = point.source.y
            }
          }
        })
      )
    }
  }
}

