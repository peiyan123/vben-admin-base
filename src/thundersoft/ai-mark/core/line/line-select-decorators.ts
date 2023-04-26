import { AiMarkInterface } from '..';
import { Subject, fromEvent, merge } from 'rxjs';
import { Line } from '.';
import { filter } from 'rxjs/operators';

/**
 * 图形选择功能
 */
export function ShapeSelectDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 所有可选择线
     */
    lineSelectPlan: Line[] = []

    /**
     * 选中的线
     */
    lineSelected?: Line | null
    
    /**
     * 线选中事件 之前
     */
    lineSelectedBeforeEvent: Subject<Line> = new Subject<Line>()

    /**
     * 线选中事件 之后
     */
    lineSelectedAfterEvent: Subject<Line> = new Subject<Line>()

    /**
     * 鼠标左键单击 退出对象选中 功能
     */
    lineSelectedExitKeyEsc?: boolean | null = false

    /**
     * 鼠标左键单击 退出对象选中 功能
     */
    lineSelectedExitClick?: boolean | null = false

    /**
     * 线选中事件 退出图形选择
     */
    lineSelectedExitBeforeEvent: Subject<Line> = new Subject<Line>()
    /**
     * 线选中事件 退出图形选择
     */
    lineSelectedExitAfterEvent: Subject<any> = new Subject<any>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      // 绘制选中图形
      this.drawSelectedLine()
      // 开启图形选择功能
      this.openLineSelect()
      // 鼠标左键单击 退出对象选中
      this.exitLineSelected()
      return {...result}
    }

    /**
     * 绘制选中图形
     * @param element 
     */
    drawSelectedLine() {
        if (this.lineSelected) {
          this.points = this.lineSelected.point;
        }
    }

    /**
     * 线双击选择
     */
    openLineSelect() {
      this.destroy.push(
        this.canvasElementEvents.leftDBClick.subscribe(e => {
        })
      )
    }

    /**
     * 鼠标左键单击 / 键盘Esc 退出对象选中
     */
    exitLineSelected() {
      this.destroy.push(
        merge(
         // 鼠标单击 图形外部
         this.canvasElementEvents!.leftSingleClick.pipe(filter((e: any) => {
           if (
             this.lineSelectedExitClick &&
             this.lineSelected && (
               e.offsetX < this.shapeSelected.minX! ||
               e.offsetX > this.shapeSelected.maxX! ||
               e.offsetY < this.shapeSelected.minY! ||
               e.offsetY > this.shapeSelected.maxY!
             )
           ) {
             return true
           }
           return false
         })),
         // 键盘 esc
         fromEvent(document, 'keydown').pipe(filter((e: any) => ( this.lineSelectedExitKeyEsc! && e.keyCode === 27) ))
        ).subscribe(() => {
          if (this.lineSelected) {
            this.lineSelectedExitBeforeEvent.next(this.lineSelected)
            this.lineSelected = null
            this.lineSelectedExitAfterEvent.next({})
          }
        })
      )
    }
  }
}