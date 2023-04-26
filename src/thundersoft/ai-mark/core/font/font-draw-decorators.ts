import { AiMarkInterface } from '..';
import { Font } from './font-model';

/**
 * fontDrawDecorators
 */

export function FontDrawDecorators(fontConfig: Font) {
  return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

      fonts: Font[] = []
      fontsMap: Map<string, Font[]> = new Map<string, Font[]>()

      /**
       * @override 方法重写 super.init
       * @param el 
       * @param url 
       * @param args 
       */
      init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, ...args)
        // 开启绘制文字的功能
        this.fontDraw()
        return { ...result }
      }

      /**
       * 绘制
       * @param element 
       */
      fontDraw() {
        this.canvasOperation((ctx: CanvasRenderingContext2D) => {
          const fontDraw = (font: Font) => {
            if (font.point) {
              font.x = font.x || font.point.x
              font.y = font.y || font.point.y
              font.label = font.label || font.point.source.label
              font.labelColor = font.labelColor || font.point.source.labelColor
            }
            const config = {
              ...fontConfig,
              ...font
            }
            if (config.x && config.y && config.labelColor && config.label) {
              const { width } = ctx.measureText(config.label!);
              let x = config.x!, y = config.y!
              if (config.center) {
                x = x - (width / 2) - 5
                y = y + 13
              }
              // 文字背景区域
              if (config.backgroundColor) {
                ctx.fillStyle = config.backgroundColor!
                ctx.fillRect(x + 4, y - 4, width + 5, -20);
              }
              // 设置字体样式
              ctx.font = config.font!;
              ctx.fillStyle = config.labelColor!
              ctx.textBaseline = config.textBaseline!
              // 绘制文字
              ctx.fillText(config.label!, x + 6, y - 5);
            }
          }
          this.fonts.forEach(fontDraw)
          this.fontsMap.forEach(fonts => fonts.forEach(fontDraw))
        })
      }
    }
  }
}

