import { AiMarkInterface } from '..';
import { Shape } from '.';

/**
 * 图形选择功能
 */
export function ShapeRectangleFillDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 绘制 图形 最小外截距 的填充区域
     */
    shapeRectangleFill: Map<string, Shape[]>  = new Map<string, Shape[]>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      // 绘制 图形 最小 外截距 区域
      this.shapeRectangleFillDraw()
      return {...result}
    }

    /**
     * 绘制选中图形
     * @param element 
     */
    shapeRectangleFillDraw() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        this.shapeRectangleFill.forEach(shapes => shapes.forEach(shape => {
          this.updateShapeMinMax!(shape, this.shapePeripheralDistance!)
          ctx.beginPath();
          ctx.fillStyle = `rgba( ${shape.color!.split('(')[1].split(')')[0]} ,.2)`
          // ctx.fillStyle = 'rgba(162,214,234, .2)' // 区域
          ctx.strokeStyle = 'rgba(162,214,234, 0)' // 框
          ctx.fill();//开始填充
          // 绘制成矩形
          ctx.fillRect(shape.minX!, shape.minY!, (shape.maxX! - shape.minX!), (shape.maxY! - shape.minY!));
          ctx.strokeRect(shape.minX!, shape.minY!, (shape.maxX! - shape.minX!), (shape.maxY! - shape.minY!));
          ctx.stroke();
        }))
      })
    }

  }
}