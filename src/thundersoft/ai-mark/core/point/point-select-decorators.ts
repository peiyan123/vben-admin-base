import { AiMarkInterface } from '..';
import { Subject } from 'rxjs';
import { Point } from './index';

/**
 * 点选择功能
 */
export function PointSelectDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 可以被选择的点
     */
    pointSelectedPlan: Point[] = []
    pointSelectedPlanMap: Map<string, Point[]>  = new Map<string, Point[]>()

    /**
     * 当前选中的点
     */
    pointSelected?: Point | any
    /**
     * 点选择事件
     */
    pointSelectedEvent?: Subject<Point> = new Subject<Point>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      // 绘制选中点
      this.drawSelectedPoint()
      // 点双击选择,单击退出选择
      this.pointSelectByMouseDBClick()
      return {...result}
    }

    /**
     * 绘制选中点
     * @param element 
     */
    drawSelectedPoint() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        if (this.pointSelected) {
          ctx.setLineDash([1]);
          ctx.beginPath();//开始绘制
          ctx.strokeStyle = this.pointSelected.source.color! // 框
          ctx.arc(this.pointSelected.x,this.pointSelected.y,10,0,Math.PI*2,true)
          ctx.arc(this.pointSelected.x,this.pointSelected.y,10,0,Math.PI*2,true)
          ctx.arc(this.pointSelected.x,this.pointSelected.y,10,0,Math.PI*2,true)
          ctx.fill();//开始填充
          ctx.fillStyle = this.pointSelected.source.labelColor! // 区域
          ctx.arc(this.pointSelected.x, this.pointSelected.y, 7, 0, Math.PI * 2, true);
          ctx.arc(this.pointSelected.x, this.pointSelected.y, 7, 0, Math.PI * 2, true);
          ctx.arc(this.pointSelected.x, this.pointSelected.y, 7, 0, Math.PI * 2, true);
          ctx.fill();//开始填充
          ctx.stroke();
        }
      })
    }

    /**
     * 点双击选择,单击退出选择
     */
    pointSelectByMouseDBClick() {
      this.destroy.push(
        this.canvasElementEvents.leftDBClick.subscribe(e => {
          const pointsSelected = []
          pointsSelected.push(this.pointSelectedPlan)
          this.pointSelectedPlanMap.forEach(points => pointsSelected.push(points))
          if (this.pointHover && pointsSelected.includes(this.pointHover)) {
            this.pointSelected = this.pointHover
            this.pointSelectedEvent.next(this.pointSelected)
          }
        })
      )
      this.destroy.push(
        this.canvasElementEvents.leftSingleClick.subscribe(e => {
          this.pointSelected = null
        })
      )
    }
  }
}
