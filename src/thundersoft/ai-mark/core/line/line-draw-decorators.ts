import { AiMarkInterface, Line, LineConfig } from '..';

/**
 * LineDrawDecorators
 */

export function LineDrawDecorators(lineConfig: LineConfig) {
  return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {
      lines: Line[] = [];
      linesMap: Map<string, Line[]> = new Map<string, Line[]>();

      /**
       * @override 方法重写 super.init
       * @param el
       * @param url
       * @param args
       */
      init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, args);
        // 开启绘制线的功能
        this.lineDraw();
        return { ...result };
      }

      /**
       * 画线
       * @param element
       */
      lineDraw() {
        this.canvasOperation((ctx: CanvasRenderingContext2D) => {
          const lineDraw = (line: Line) => {
            if (!line.start || !line.end) return;
            const config = {
              ...lineConfig,
              ...line.config,
            };
            // 实线/虚线
            ctx.setLineDash([config!.dash!]);
            // 颜色
            ctx.strokeStyle = config!.color!;
            // 宽度
            ctx.lineWidth = config!.width!;
            ctx.beginPath();
            ctx.moveTo(line.start.x!, line.start.y!);
            ctx.lineTo(line.end.x!, line.end.y!);
            ctx.stroke();
          };
          this.lines.forEach(lineDraw);
          // this.linesMap.forEach(lines => lines.forEach(lineDraw))
          // FIXME: lgj 此处临时处理画线箭头，有待重构
          this.linesMap.forEach((lines, index) => {
            if (index == 'linedetection') {
              lines.forEach((line: any) => {
                line.forEach(lineDraw);
              });
            } else {
              lines.forEach(lineDraw);
            }
          });
        });
      }
    };
  };
}
