import { AiMarkInterface } from '..';
import { Subject } from 'rxjs';
import { Line } from '.';

/**
 * 线选择功能
 */
export function LineHoverDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 所有可悬浮线
     */
    lineHoverPlan?: Line[] = []

    /**
     * 线Hover的边界距离
     */
     lineHoverDistanceRange = 12

    /**
     * 线外围距离
     */
     linePeripheralDistance = 8

    /**
     * 线外围悬浮框的宽度
     */
     lineHoverPeripheralWidth = 2

    /**
     * 悬浮高亮
     */
     lineHover?: Line | null
    /**
     * 悬浮高亮 背景
     */
     lineHoverBackground?: boolean | null
    /**
     * 图形悬浮事件
     */
     lineHoverEvent: Subject<Line> = new Subject<Line>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      // 绘制高亮图形
      this.drawHoverLine()
      // 开启图形Hover功能
      this.openLineHover()
      return {...result}
    }

    /**
     * 绘制高亮图形
     * @param element 
     */
    drawHoverLine() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        if (this.lineHover) {
        }
      })
    }

    /**
     * 图形Hover
     */
    openLineHover() {
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe(e => {
          /**
           * 最小外接矩形 中间选中
           */
          // 符合距离的图形
          const linePlans = [].concat(this.lineSelectPlan, this.lineHoverPlan)
          const lineHoverPlan: Line[] = linePlans;
          lineHoverPlan.forEach(line => {

            if ((e.offsetX - line.start.x) / (line.end.x - line.start.x) 
                    === ((e.offsetY - line.start.y) / (line.end.y - line.start.y))) {
                this.lineHover = line;
                this.canvasViewMouseStyleCursor.set('99-shape-hover', 'pointer')
                this.lineHoverEvent.next(this.lineHover)
            } else {
                // 清楚缓存的高亮图形
                this.lineHover = null
                this.canvasViewMouseStyleCursor.delete('99-shape-hover')
            }
          })
        })
      )
    }
    isInLine(line) {
    }
  }
}