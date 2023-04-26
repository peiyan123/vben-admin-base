import { AiMarkInterface } from '..';
import { ShapeDetectionData } from './shape-detection-model';
import { Line } from '../line/line-model';
import { Font } from '../font/font-model';

/**
 * ShapeDetectionLineDecorators
 */

export function ShapeDetectionLineDecorators<T extends new (...args: any[]) => AiMarkInterface>(
  constructor: T,
) {
  return class extends constructor {
    /**
     * @override 方法重写 super.init
     * @param el
     * @param url
     * @param args
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args);
      // 最小 外截距 距离
      this.shapePeripheralDistance = 0;
      this.shapeHoverPeripheralWidth = 2;
      // 绘制连线
      this.drawShapeDetectionLine();
      return { ...result };
    }

    /**
     * 绘制连线
     * @param element
     */
    drawShapeDetectionLine() {
      this.canvasOperation(() => {
        this.points = [];
        // this.fontsMap.delete('shape-detection-fonts')
        this.shapeDetections.forEach((shape) =>
          this.updateShapeMinMax!(shape, this.shapePeripheralDistance!),
        );
        // this.linesMap.delete('shape-detection-lines')
        const fonts: Font[] = [],
          lines: Line[] = [],
          detectionsLine = (shape: ShapeDetectionData) => {
            if (!shape.point || !shape.point.length) return;
            // this.points.push(...shape.point!)
            shape.point.forEach((ele) => {
              this.points.push(ele);
            });
            // draw lines
            lines.push({
              start: shape.point![0],
              end: shape.point![1],
              config: { color: shape.color },
            });
            lines.push({
              start: shape.point![1],
              end: shape.point![2],
              config: { color: shape.color },
            });
            lines.push({
              start: shape.point![2],
              end: shape.point![3],
              config: { color: shape.color },
            });
            lines.push({
              start: shape.point![3],
              end: shape.point![0],
              config: { color: shape.color },
            });
            if (!shape.label) return;
            // label font
            fonts.push({
              x: shape.minX,
              y: shape.maxY,
              label: shape.label,
              labelColor: shape.labelColor,
              backgroundColor: `rgba( ${shape.color!.split('(')[1].split(')')[0]} ,.3)`,
            });
          };
        // 图形数据绘制
        this.shapeDetections.forEach((det) => {
          if (det === this.shapeSelected || det === this.shapeDetectionDrawing) {
            det.point.forEach((p) => (p.invalid = false));
          } else {
            det.point.forEach((p) => (p.invalid = true));
          }
          detectionsLine(det);
        });
        // 当前绘制的图形
        if (this.shapeDetectionDrawing) {
          this.updateShapeMinMax!(this.shapeDetectionDrawing, this.shapePeripheralDistance!);
          detectionsLine(this.shapeDetectionDrawing);
        }
        this.linesMap.set('shape-detection-lines', lines);
        this.fontsMap.set('shape-detection-fonts', fonts);
        // FIXME: lgj 此处临时处理画线箭头，有待重构
        if (this.lineDetectionDrawing) {
          this.linesMap.set('linedetection', [...this.lineDetections, this.lineDrawing]);
        } else {
          this.linesMap.set('linedetection', this.lineDetections);
        }
      });
    }
  };
}
