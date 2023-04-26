import { AiMarkInterface } from '..';
import { Subject } from 'rxjs';
import { Shape } from '.';

/**
 * 图形选择功能
 */
export function ShapeHoverDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * 所有可悬浮图形
     */
    shapeHoverPlan?: Shape[] = []

    /**
     * 图形Hover的边界距离
     */
    shapeHoverDistanceRange = 12

    /**
     * 图形外围距离
     */
    shapePeripheralDistance = 8

    /**
     * 图形外围悬浮框的宽度
     */
    shapeHoverPeripheralWidth = 2

    /**
     * 悬浮高亮
     */
    shapeHover?: Shape | null
    /**
     * 悬浮高亮 背景
     */
    shapeHoverBackground?: boolean | null
    /**
     * 图形悬浮事件
     */
    shapeHoverEvent: Subject<Shape> = new Subject<Shape>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      // 绘制高亮图形
      this.drawHoverShape()
      // 开启图形Hover功能
      this.openShapeHover()
      return {...result}
    }

    /**
     * 绘制高亮图形
     * @param element 
     */
    drawHoverShape() {
      this.canvasOperation((ctx: CanvasRenderingContext2D) => {
        this.shapeSelectPlan.forEach(shape => this.updateShapeMinMax(shape, this.shapePeripheralDistance))
        this.shapeHoverPlan.forEach(shape => this.updateShapeMinMax(shape, this.shapePeripheralDistance))
        if (this.shapeHover) {
          if (this.shapeHover.type === "polygon") {
            ctx.beginPath();
            ctx.fillStyle = `rgba( ${
              this.shapeHover.color!.split("(")[1].split(")")[0]
            } ,.4)`; // 区域
            // ctx.strokeStyle = "rgba(162,214,234, 0)"; // 框
            ctx.strokeStyle = `rgba( ${
              this.shapeHover.color!.split("(")[1].split(")")[0]
            } ,.8)`; // 框
            ctx.setLineDash([0]);
            ctx.lineWidth = this.shapeHoverPeripheralWidth;
            const points = this.shapeHover.point;
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.fillStyle = `rgba( ${
              this.shapeHover.color!.split("(")[1].split(")")[0]
            } ,.4)`; // 区域
            // ctx.strokeStyle = "rgba(162,214,234, 0)"; // 框
            ctx.strokeStyle = `rgba( ${
              this.shapeHover.color!.split("(")[1].split(")")[0]
            } ,.8)`; // 框
            ctx.fill(); // 开始填充
            // 绘制成矩形
            ctx.fillRect(
              this.shapeHover.minX!,
              this.shapeHover.minY!,
              this.shapeHover.maxX! - this.shapeHover.minX!,
              this.shapeHover.maxY! - this.shapeHover.minY!
            );
            ctx.strokeRect(
              this.shapeHover.minX!,
              this.shapeHover.minY!,
              this.shapeHover.maxX! - this.shapeHover.minX!,
              this.shapeHover.maxY! - this.shapeHover.minY!
            );
            ctx.setLineDash([0]);
            ctx.lineWidth = this.shapeHoverPeripheralWidth;
            ctx.stroke();
          }
        }
      })
    }

    /**
     * 图形Hover
     */
    openShapeHover() {
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe(e => {
          /**
           * 最小外接矩形 边选中
           */
          // // 符合距离的图形
          // let hoverList: Shape[] = []
          // this.shapeSelectPlan.forEach(shape => {
          //   // 最小外接矩形
          //   if ( (Math.abs(e.offsetX-shape.minX!) < this.shapeHoverDistanceRange) && (e.offsetY > (shape.minY!-this.shapeHoverDistanceRange)) && (e.offsetY < (shape.maxY!+this.shapeHoverDistanceRange)) ) {
          //     // 左边
          //     hoverList.push(shape)
          //   } else if ( (Math.abs(e.offsetX-shape.maxX!) < this.shapeHoverDistanceRange) && (e.offsetY > (shape.minY!-this.shapeHoverDistanceRange)) && (e.offsetY < (shape.maxY!+this.shapeHoverDistanceRange)) ) {
          //     // 右边
          //     hoverList.push(shape)
          //   } else if ( (Math.abs(e.offsetY-shape.minY!) < this.shapeHoverDistanceRange) && (e.offsetX > (shape.minX!-this.shapeHoverDistanceRange)) && (e.offsetX < (shape.maxX!+this.shapeHoverDistanceRange)) ) {
          //     // 上边
          //     hoverList.push(shape)
          //   } else if ( (Math.abs(e.offsetY-shape.maxY!) < this.shapeHoverDistanceRange) && (e.offsetX > (shape.minX!-this.shapeHoverDistanceRange)) && (e.offsetX < (shape.maxX!+this.shapeHoverDistanceRange)) ) {
          //     // 下边
          //     hoverList.push(shape)
          //   }
          // })
          /**
           * 最小外接矩形 中间选中
           */
          // 符合距离的图形
          const hoverList: { shape: Shape, dist: number }[] = [];
          const shapePlans = [].concat(this.shapeSelectPlan, this.shapeHoverPlan)
          const shapeHoverPlan: Shape[] = shapePlans;
          shapeHoverPlan.forEach(shape => {
            const a = e.offsetX - shape.minX!,
                  b = shape.maxX! - e.offsetX,
                  c = e.offsetY - shape.minY!,
                  d = shape.maxY! - e.offsetY
            
            if (a > 0 && b > 0 && c > 0 && d > 0) {
              hoverList.push({
                shape,
                dist: [a, b, c, d].sort((a, b) => a - b)[0],
              })
            }
          })
          if (hoverList.length) {
            this.shapeHover = hoverList.sort((a, b) => a.dist - b.dist)[0].shape
            this.canvasViewMouseStyleCursor.set('99-shape-hover', 'pointer')
            this.shapeHoverEvent.next(this.shapeHover)
          } else {
            // 清楚缓存的高亮图形
            this.shapeHover = null
            this.canvasViewMouseStyleCursor.delete('99-shape-hover')
          }
        })
      )
    }
    /**
     * 计算 图形的 最小 外接距
     */
    updateShapeMinMax(shape: Shape, shapePeripheralDistance: number) {
      if (shape.point && shape.point.length) {
        shape.minX = Math.min(...(shape.point!.map(p => p.x) as number[])) - shapePeripheralDistance
        shape.maxX = Math.max(...(shape.point!.map(p => p.x) as number[])) + shapePeripheralDistance
        shape.minY = Math.min(...(shape.point!.map(p => p.y) as number[])) - shapePeripheralDistance
        shape.maxY = Math.max(...(shape.point!.map(p => p.y) as number[])) + shapePeripheralDistance
      } else {
        shape.minX = 0
        shape.maxX = 0
        shape.minY = 0
        shape.maxY = 0
      }
    }
  }
}