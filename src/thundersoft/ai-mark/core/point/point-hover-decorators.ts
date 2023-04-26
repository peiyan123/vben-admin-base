import { AiMarkInterface } from '..';
import { Subject } from 'rxjs';
import { Point2Distance } from '../util';
import { Point } from './index';

/**
 * 点选择功能
 */
export function PointHoverDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 判断悬浮的距离范围
     */
    pointHoverDistanceRange = 10
    /**
     * 当前悬浮的点
     */
    pointHover?: Point | any
    /**
     * 点悬浮事件
     */
    pointHoverEvent?: Subject<Point> = new Subject<Point>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      // 绘制悬浮点
      this.drawHoverPoint()
      // 设置悬浮点
      this.pointHoverModel()
      return {...result}
    }

    /**
     * 绘制高亮点
     * @param element 
     */
    drawHoverPoint() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        if (this.pointHover) {
          ctx.setLineDash([1]);
          ctx.beginPath();//开始绘制
          ctx.strokeStyle = this.pointHover.source.color! // 框
          ctx.arc(this.pointHover.x,this.pointHover.y,5,0,Math.PI*2,true)
          ctx.arc(this.pointHover.x,this.pointHover.y,5,0,Math.PI*2,true)
          ctx.arc(this.pointHover.x,this.pointHover.y,5,0,Math.PI*2,true)
          ctx.fill();//开始填充
          ctx.fillStyle = this.pointHover.source.labelColor! // 区域
          ctx.arc(this.pointHover.x, this.pointHover.y, 4, 0, Math.PI * 2, true);
          ctx.arc(this.pointHover.x, this.pointHover.y, 4, 0, Math.PI * 2, true);
          ctx.arc(this.pointHover.x, this.pointHover.y, 4, 0, Math.PI * 2, true);
          ctx.fill();//开始填充
          ctx.stroke();
        }
      })
    }

    /**
     * 设置悬浮点：可以被选中的点，可以悬浮高亮; 可以被移动的点，可以悬浮高亮
     * 对可选点：pointSelectedPlan，pointMousePlan
     */
    pointHoverModel() {
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe(e => {
          let points = []
          // 可以被选中的点，可以悬浮高亮
          if (this.pointSelectedPlan) points.push(this.pointSelectedPlan)
          if (this.pointSelectedPlanMap) this.pointSelectedPlanMap.forEach(typePointArrary => points.push(typePointArrary))
          // 可以被移动的点，可以悬浮高亮
          if (this.pointDragPlan) points.push(this.pointDragPlan)
          if (this.pointDragPlanMap) this.pointDragPlanMap.forEach(typePointArrary => points.push(typePointArrary))
          // 备选悬浮点集合，判断距离，选取当前悬浮点
          points = points.filter(p => !p.invalid)
          if (points.length) {
            // 符合距离的点
            const hoverList = points.filter((p: Point) => (Point2Distance({x: p.x!, y: p.y!}, {x: e.offsetX, y: e.offsetY}) < this.pointHoverDistanceRange))
            if (hoverList.length) {
              // 如果 当前 hover 的点 在 备选的hover列表里，则保持当前点的选中状态
              if (hoverList.includes(this.pointHover)) return
              // 默认 选取 非空备选列表 里的第一个
              this.pointHover = hoverList[0]
              this.canvasViewMouseStyleCursor.set('100-point-hover', 'pointer')
              this.pointHoverEvent.next(this.pointHover)
            } else {
              // 如果 备选列表 是空的 则清空当前的 Hover 点
              this.pointHover = null
              this.canvasViewMouseStyleCursor.delete('100-point-hover')
            }
          } else {
            // 如果 可选列表 是空的 则清空当前的 Hover 点
            this.pointHover = null
            this.canvasViewMouseStyleCursor.delete('100-point-hover')
          }
        })
      )
    }
  }
}
