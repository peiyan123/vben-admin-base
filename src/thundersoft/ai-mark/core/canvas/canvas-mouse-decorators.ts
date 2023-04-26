import { AiMarkInterface } from '..';
import { MouseStyleCursor } from './canvas-mouse-interface';

/**
 * ImageCanvas decorator
 */
export function CanvasViewMouseStyleCursorDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * canvas 视图窗口大小改变事件
     */
    canvasViewMouseStyleCursor?: Map<string, MouseStyleCursor> = new Map<string, MouseStyleCursor>()

    /**
     * @override 方法重写
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args)
      this.canvasViewMouseStyleCursorUpData()
      return {...result}
    }

    canvasViewMouseStyleCursorUpData() {
      this.canvasOperation(() => {
        if (this.canvasViewMouseStyleCursor.size) {
          const list = Array.from(this.canvasViewMouseStyleCursor).sort((a, b) => (parseInt(b[0]) - parseInt(a[0])))
          document.body.style.cursor = list[0][1]
        } else {
          document.body.style.cursor = 'auto'
        }
      })
    }

  }
}
