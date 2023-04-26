import { AiMarkInterface } from '..';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, throttle } from 'rxjs/operators';

/**
 * 依赖：@ImageLoadCanvas
 *      @CanvasEventDecorators
 * ImageDragDecorators decorator
 */

export function ImageDragDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 图片开始拖拽时 鼠标点按下的位置
     */
    imageDragingStartPoint?: { x: number, y: number } | null
    /**
     * 画布视图内 鼠标 中键（滑轮）和 右键【e.button === 1 || e.button === 2】 按下事件,开启拖拽  e.offsetX
     * 全局 fromEvent(window, 'mousedown').subscribe((e: any) => {  // e.screenX
     */
    imageDrawCanvasViewMouseDownEvent?: Observable<any>
    /**
     * window 整个网页内 鼠标抬起 事件
     */
    imageDrawCanvasViewMouseUpEvent: Subject<any> = new Subject()
    /**
     * 图片开始拖拽时 图片的位置
     */
    imageDrawStartImagePosition: { x: number, y: number } = { x: 0, y: 0 }

    
    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      this.imageDrag()
      return {...result}
    }
    /**
     * 鼠标拖拽图片
     */
    imageDrag() {
      this.imageDrawCanvasViewMouseDownEvent = this.canvasElementEvents!.mousedown // fromEvent(this.elementDom, 'mousedown')
      .pipe(filter((event: any) => [1, 2].includes(event.button))) // 中键（滑轮）和 右键【e.button === 1 || e.button === 2】
      .pipe(throttle(() => this.imageDrawCanvasViewMouseUpEvent)) // 鼠标抬起之后 才能重新触发
      // 中键（滑轮）和 右键 按下监听
      this.destroy.push(
        this.imageDrawCanvasViewMouseDownEvent.subscribe((e): any => {
          e.returnvalue = false
          e.preventDefault()
          this.imageDragingStartPoint = { x: e.screenX, y: e.screenY }
          this.imageDrawStartImagePosition = { x: this.imageStartPoint!.x, y: this.imageDrawStartImagePosition.y = this.imageStartPoint!.y }
          return false
        })
      )
      this.destroy.push(
        // fromEvent(window, 'mousemove').subscribe((e: any) => {
        this.canvasElementEvents!.mousemove.subscribe(e => {
          if (this.imageDragingStartPoint) {
            const x = this.imageDrawStartImagePosition.x + (e.screenX - this.imageDragingStartPoint.x)
            const y = this.imageDrawStartImagePosition.y + (e.screenY - this.imageDragingStartPoint.y)
            // // 限制图片不能拖动出画布范围
            // if (Math.abs(x) > (this.canvasElement.width-60) || Math.abs(y) > (this.canvasElement.height-60) ) {
            //   return
            // }
            this.imageStartPoint = {x, y}
            // 通知
            this.imageChangeEvent!.next('drag')
          }
        })
      )
      this.destroy.push(
        // this.canvasElementEvents!.mouseup.subscribe(e => {
        fromEvent(window, 'mouseup').subscribe((e: any) => {
          this.imageDragingStartPoint = null
          this.imageDrawCanvasViewMouseUpEvent.next(e)
        })
      )
    }
  };
};