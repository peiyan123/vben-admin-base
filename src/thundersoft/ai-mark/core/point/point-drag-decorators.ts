import { AiMarkInterface } from '..';
import { Subject, fromEvent } from 'rxjs';
import { Point } from './index';
import { RatioCalculation } from '../util/shape-calculation';
import { PointSource } from './point-model';
import { filter } from 'rxjs/operators';

/**
 * PointDragDecorators
 */
export function PointDragDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 可以被移动的点
     */
    pointDragPlan: Point[] = []
    pointDragPlanMap: Map<string, Point[]>  = new Map<string, Point[]>()
    /**
     * 正在被移动的点
     */
    pointDragDrawing?: Point | null
    /**
     * 鼠标左键拖动时 按下的 位置
     */
    pointDragingmouseDown?: { x: number, y: number } | null = null
    /**
     * 鼠标左键按下拖动时 被拖动点的位置
     */
    pointDragingmouseDownPoint?: { x: number, y: number } | null = null
    /**
     * 点移动事件
     */
    pointDragEvent: Subject<Point> = new Subject<Point>()
    /**
     * 点开始移动事件
     */
    pointDragStartEvent?: Subject<Point> = new Subject<Point>()
    /**
     * 点结束移动事件
     */
    pointDragEndEvent?: Subject<Point> = new Subject<Point>()

    /**
     * 暂存点绘制数据 (为了解决 鼠标安下 点移动和点创建的冲突)
     */
    pointDragTemp: boolean = false
    pointDragTempPointSource: PointSource | null | undefined = null
    pointDragTempPointDrawPlan: PointSource[] | null | undefined = null

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      // 可移动的点 的拖动功能
      this.pointsMouseDrag()
      return {...result}
    }
    /**
     * 可移动的点 的拖动功能
     */
    pointsMouseDrag() {
      this.destroy.push(
        this.canvasElementEvents!.mousedown.pipe(filter((event: any) => event.button === 0)).subscribe((e): any => {
          const pointsMouse = []
          pointsMouse.push((this.pointDragPlan || []))
          this.pointDragPlanMap.forEach(points => pointsMouse.push(points))
          if (!this.pointDragDrawing && this.pointHover && pointsMouse.includes(this.pointHover)) {
            if (!this.pointDragTemp) {
              // console.log('点拖动 开启：临时关闭鼠标左键单击创建点的功能（触发了鼠标左键按下事件）')
              this.pointDragTemp = true
              this.pointDragTempPointSource = this.pointSource
              this.pointDragTempPointDrawPlan = this.pointDrawPlan
              this.pointSource = null
              this.pointDrawPlan = []
            }
            this.pointDragingmouseDown = { x: e.screenX, y: e.screenY }
            this.pointDragDrawing = this.pointHover
            this.pointDragingmouseDownPoint = { x: this.pointHover.x, y: this.pointHover.y }
            this.pointDragStartEvent.next(this.pointDragDrawing!)
            this.pointDragEvent.next(this.pointDragDrawing!)
          }
        })
      )
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe(e => {
          // pointDragDrawing 当前移动的点，pointDragingmouseDown 鼠标左键按下的位置
          if (this.pointDragDrawing && this.pointDragingmouseDown) {
            // 点在图片上的判断
            if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return
            // 新点的位置
            const x = this.pointDragingmouseDownPoint!.x! + (e.screenX - this.pointDragingmouseDown.x)
            const y = this.pointDragingmouseDownPoint!.y! + (e.screenY - this.pointDragingmouseDown.y)
            this.pointDragDrawing!.source.x = RatioCalculation((x - this.imageStartPoint!.x), this.canvasZoom, this.accuracy),
            this.pointDragDrawing!.source.y = RatioCalculation((y - this.imageStartPoint!.y), this.canvasZoom, this.accuracy),
            this.pointDragDrawing!.x = x
            this.pointDragDrawing!.y = y
            this.canvasViewMouseStyleCursor.set('101-point-drag','move')
            this.pointDragEvent.next(this.pointDragDrawing)
          }
        })
      )
      this.destroy.push(
        fromEvent(window, 'mouseup').subscribe(() => {
          if (this.pointDragDrawing) {
            this.pointDragEvent.next(this.pointDragDrawing!)
            this.pointDragEndEvent.next(this.pointDragDrawing!)
            this.pointDragDrawing = null
            this.canvasViewMouseStyleCursor.delete('101-point-drag')
            this.pointDragingmouseDown = null
            this.pointDragingmouseDownPoint = null
          }
        })
      )
      this.destroy.push(
        this.canvasElementEvents.leftSingleClick.subscribe(() => {
          if (this.pointDragTemp) {
            // console.log('点拖动 完成：恢复鼠标左键单击创建点的功能（触发了鼠标左键单击事件）')
            this.pointDragTemp = false
            this.pointSource = this.pointDragTempPointSource
            this.pointDrawPlan = this.pointDragTempPointDrawPlan
          }
        })
      )
      this.destroy.push(
        this.canvasElementEvents.leftDBClick.subscribe(() => {
          if (this.pointDragTemp) {
            // console.log('点拖动 完成：恢复鼠标左键单击创建点的功能（触发了鼠标左键双击事件）')
            this.pointDragTemp = false
            this.pointSource = this.pointDragTempPointSource
            this.pointDrawPlan = this.pointDragTempPointDrawPlan
          }
        })
      )
    }
  }
}
