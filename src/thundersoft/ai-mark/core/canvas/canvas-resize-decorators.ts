import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AiMarkInterface } from '..';
/**
 * ImageCanvas decorator
 */
export function CanvasViewResizeDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    canvasViewResizeEvent!: Observable<any>

    /**
     * @override 方法重写
     * canvas 重新绘制时，重新适配图片比例
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      this.resizeCanvasElement()
      return {...result}
    }

    /**
     * 监听 浏览器窗口变化事件
     */
    resizeCanvasElement() {
      if ((window as any).ResizeObserver) {
        this.canvasViewResizeEvent = new Observable(o => {
          let MutationObserver = (window as any).ResizeObserver
          let observer = new MutationObserver((e: any) => {
            o.next(e);
          })
          observer.observe(this.elementDom)
        });
        this.destroy.push(
          this.canvasViewResizeEvent
          .pipe(debounceTime(20)) // 以免频繁处理
          .subscribe(() => {
              // 这里处理页面变化时的操作,处理高度和宽度都可以
              this.reloadCanvasElement()
          })
        )
      } else {
        // window.resize 监听
        this.canvasViewResizeEvent = fromEvent(window, 'resize')
        this.destroy.push(
          this.canvasViewResizeEvent
          .pipe(debounceTime(20)) // 以免频繁处理
          .subscribe(() => {
              // 这里处理页面变化时的操作,处理高度和宽度都可以
              this.reloadCanvasElement()
          })
        )
      }
    }
  };
}
