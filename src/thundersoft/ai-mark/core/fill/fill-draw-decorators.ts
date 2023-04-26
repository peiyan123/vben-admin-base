import { AiMarkInterface } from '..';
import { Fill } from './fill-model';

/**
 * fillDrawDecorators
 */

export function FillDrawDecorators(fillConfig: Fill) {
  return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

      fills: Fill[] = []
      fillsMap: Map<string, Fill[]> = new Map<string, Fill[]>()

      /**
       * @override 方法重写 super.init
       * @param el 
       * @param url 
       * @param args 
       */
      init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, args)
        // 开启绘制文字的功能
        this.fillDraw()
        return {...result}
      }

      /**
       * 区域绘制
       * @param element 
       */
      fillDraw() {
        this.canvasOperation((context: CanvasRenderingContext2D) => {
          const fillDraw = (fill: Fill) => {
            if (!fill.points || !fill.points.length) return
            const config = {
              ...fillConfig,
              ...fill
            }
            context.setLineDash([0])
            context.strokeStyle = 'rgba(255, 255, 255, 0)'
            context.beginPath() //清除上一次的绘制参数 开始绘制
            context.moveTo(config.points![0].x!, config.points![0].y!)
            for (let index = 1; index < config.points!.length; index++) {
              context.lineTo(config.points![index].x!, config.points![index].y!)
            }
            context.closePath()//封闭多边形结束方法
            context.lineWidth = 0 //线条宽度
            // context.fillStyle = 'red'; //线条颜色
            // context.strokeStyle = 'red'
            // context.strokeStyle = fill.color as string //多边形填充颜色
            context.fillStyle = config.color as string //多边形填充颜色
            context.fill() //多边形填充
            context.stroke() //结束绘制
          }
          this.fills.forEach(fillDraw)
          this.fillsMap.forEach(fills => fills.forEach(fillDraw))
        })
      }
    }
  }
}

