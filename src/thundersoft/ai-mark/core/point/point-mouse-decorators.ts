import { AiMarkInterface } from '..';

/**
 * PointMouseDecorators
 */
export function PointMouseDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    // canvasElement 里的鼠标位置
    mousePosition!: {
      x: number
      y: number
      // layer  兼容性问题：不同浏览器表现不同
      // event.x，event.y  兼容性问题：不同浏览器表现不同
      offset: {
        x: number
        y: number
      }
      client: {
        x: number
        y: number
      }
      page: {
        x: number
        y: number
      }
      screen: {
        x: number
        y: number
      }
    }

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, ...args)
        // 鼠标位置监听
        this.canvasMousePositionListener()
        return {...result}
    }

    /**
     * 鼠标位置监听
     * @param element 
     */
    canvasMousePositionListener() {
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe(e => {
          this.mousePosition = {
            x: e.offsetX,
            y: e.offsetY,
            offset: {
              x: e.offsetX,
              y: e.offsetY,
            },
            client: {
              x: e.clientX,
              y: e.clientY,
            },
            page: {
              x: e.pageX,
              y: e.pageX,
            },
            screen: {
              x: e.screenX,
              y: e.screenX,
            }
          }
        })
      )
    }
  };
}
