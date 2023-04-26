import { AiMarkInterface, ShapeSegmentationData } from '..';
import { Point } from '../point';
import { Font } from '../font/font-model';
import { Line } from '../line/line-model';
import { Fill } from '../fill/fill-model';
/**
 * ShapeSegmentationLoadDecorators
 */
export function ShapeSegmentationLineDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {
        /**
         * @override 方法重写 super.init
         * @param el 
         * @param url 
         * @param args 
         */
        init(el: HTMLElement, ...args: any[]): any {
            let result = super.init(el, args)
            // 开启绘制连线
            this.drawShapeSegmentationLine()
            return {...result}
        }

        /**
         * 绘制连线
         * @param element 
         */
        drawShapeSegmentationLine() {
            this.canvasOperation(() => {
                this.fontsMap.delete('shape-segmentation-fonts')
                this.linesMap.delete('shape-segmentation-lines')
                this.fillsMap.delete('shape-segmentation-fills')
                const fonts: Font[] = [],
                lines: Line[] = [],         
                fills: Fill[] = [],         
                detectionsLine = (shape: ShapeSegmentationData, endToEnd: boolean) => {
                    // 顺序连线绘制
                    shape.point.reduce((pre: (Point | null), cur: Point) => {
                        if (pre) {
                            lines.push({ start: pre, end: cur, config: { color: shape.color, dash: 0, width: 2 } })
                        }
                        return cur
                    }, null)
                    if (endToEnd && shape.point && shape.point.length > 2) {
                        // 区域绘制
                        fills.push({ points:shape.point, color: `rgba( ${shape.color!.split('(')[1].split(')')[0]} ,.05)` })
                        // end to end 首尾相连
                        lines.push({ start: shape.point[0], end: shape.point[shape.point.length - 1], config: { color: shape.color, dash: 0, width: 2 } })
                        if (!shape.label) return
                        // label font
                        fonts.push({
                            x: Math.round(shape.point.reduce((total, p) => (total+p.x!), 0) / shape.point.length ),
                            y: Math.round(shape.point.reduce((total, p) => (total+p.y!), 0) / shape.point.length ),
                            label: shape.label, center: true,
                            labelColor: shape.labelColor,
                            backgroundColor: `rgba( ${shape.color!.split('(')[1].split(')')[0]} ,.3)`
                        })                        
                    } else if (!endToEnd && this.pointSource && shape.point && shape.point.length) {
                        // 标注模式 虚线提示
                        lines.push({
                            start: { id: Symbol('PointId'), x: this.mousePosition!.x!, y: this.mousePosition!.y!, source: {} },
                            end: shape.point[shape.point.length - 1],
                            config: { color: shape.color, dash: 2, width: 2 }
                        })
                    }                     
                }
                // 图形数据绘制
                this.shapeSegmentations.forEach(shape => detectionsLine(shape, true))
                // 当前绘制的图形 虚线
                if (this.currentShapeSegmentation) {
                    if (this.currentShapeSegmentation === this.shapeSelected) {
                        detectionsLine(this.currentShapeSegmentation, true)
                    } else {
                        detectionsLine(this.currentShapeSegmentation, false)
                    }
                }
                this.fontsMap.set('shape-segmentation-fonts', fonts)
                this.linesMap.set('shape-segmentation-lines', lines)
                this.fillsMap.set('shape-segmentation-fills', fills)
            })
        }
    }
}

