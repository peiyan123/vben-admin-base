import { AiMarkInterface } from '..';
import { Subject, fromEvent, merge } from 'rxjs';
import { Shape } from '.';
import { filter } from 'rxjs/operators';

/**
 * 图形选择功能
 */
export function ShapeSelectDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 所有可选择图形
     */
    shapeSelectPlan: Shape[] = []

    /**
     * 选中的图形
     */
    shapeSelected?: Shape | null
    
    /**
     * 图形选中事件 之前
     */
    shapeSelectedBeforeEvent: Subject<Shape> = new Subject<Shape>()

    /**
     * 图形选中事件 之后
     */
    shapeSelectedAfterEvent: Subject<Shape> = new Subject<Shape>()

    /**
     * 鼠标左键单击 退出对象选中 功能
     */
    shapeSelectedExitKeyEsc?: boolean | null = false

    /**
     * 鼠标左键单击 退出对象选中 功能
     */
    shapeSelectedExitClick?: boolean | null = false

    /**
     * 图形选中事件 退出图形选择
     */
    shapeSelectedExitBeforeEvent: Subject<Shape> = new Subject<Shape>()
    /**
     * 图形选中事件 退出图形选择
     */
    shapeSelectedExitAfterEvent: Subject<any> = new Subject<any>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      // 绘制选中图形
      this.drawSelectedShape()
      // 开启图形选择功能
      this.openShapeSelect()
      // 鼠标左键单击 退出对象选中
      this.exitShapeSelected()
      return {...result}
    }

    /**
     * 绘制选中图形
     * @param element 
     */
    drawSelectedShape() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        if (this.shapeSelected) {
          this.updateShapeMinMax!(this.shapeSelected, this.shapePeripheralDistance!)
          ctx.beginPath();
          ctx.fillStyle = `rgba( ${this.shapeSelected.color!.split('(')[1].split(')')[0]} ,.2)` // 区域
          ctx.strokeStyle = 'rgba(162,214,234, 0)' // 框
          ctx.fill();//开始填充
          // 绘制成矩形
          ctx.fillRect(this.shapeSelected.minX!, this.shapeSelected.minY!, (this.shapeSelected.maxX! - this.shapeSelected.minX!), (this.shapeSelected.maxY! - this.shapeSelected.minY!));
          ctx.strokeRect(this.shapeSelected.minX!, this.shapeSelected.minY!, (this.shapeSelected.maxX! - this.shapeSelected.minX!), (this.shapeSelected.maxY! - this.shapeSelected.minY!));
          ctx.stroke();
        }
      })
    }

    /**
     * 图形双击选择
     */
    openShapeSelect() {
      this.destroy.push(
        this.canvasElementEvents.leftDBClick.subscribe(e => {
          if (this.shapeHover && !this.pointHover && (this.shapeHover != this.shapeSelected) && this.shapeSelectPlan.includes(this.shapeHover) ) {
            this.shapeSelectedBeforeEvent.next(this.shapeHover)
            this.shapeSelected = this.shapeHover
            this.pointSelectedPlan = this.shapeSelected.point
            this.pointDragPlan = this.shapeSelected.point
            this.shapeSelectedAfterEvent.next(this.shapeSelected)
          }
        })
      )
    }

    /**
     * 鼠标左键单击 / 键盘Esc 退出对象选中
     */
    exitShapeSelected() {
      this.destroy.push(
        merge(
         // 鼠标单击 图形外部
         this.canvasElementEvents!.leftSingleClick.pipe(filter((e: any) => {
           if (
             this.shapeSelectedExitClick &&
             this.shapeSelected && (
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
         fromEvent(document, 'keydown').pipe(filter((e: any) => ( this.shapeSelectedExitKeyEsc! && e.keyCode === 27) ))
        ).subscribe(() => {
          if (this.shapeSelected) {
            this.shapeSelectedExitBeforeEvent.next(this.shapeSelected)
            this.shapeSelected = null
            this.shapeSelectedExitAfterEvent.next({})
          }
        })
      )
    }
  }
}