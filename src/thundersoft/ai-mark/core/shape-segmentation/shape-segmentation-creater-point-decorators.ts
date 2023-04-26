import { AiMarkInterface } from '..';
import { Point } from '../point';
import { Point2Distance } from '../util/shape-calculation';
import { ShapeSegmentationData } from './shape-segmentation-model';
/**
 * ShapeSegmentationLoadDecorators
 */
export function ShapeSegmentationCreaterPointDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

        /**
         * 靠近中点的距离
         */
        shapeSegmentationCreaterPointByMidpointHoverDistanceRange = 10

        /**
         * @override 方法重写 super.init
         * @param el 
         * @param url 
         * @param args 
         */
        init(el: HTMLElement, ...args: any[]): any {
            let result = super.init(el, args)
            // 绘制线中点连
            this.drawShapeSegmentationLineMidpoint()
            return {...result}
        }

        /**
         * 绘制中点
         * @param element 
         */
        drawShapeSegmentationLineMidpoint() {
            this.destroy.push(
                this.pointDragEvent.subscribe(point => {
                    if (point.source.scene === 'shape-segmentation-line-midpoint' && !this.currentShapeSegmentation.point.includes(point)) {
                        this.currentShapeSegmentation.point!.splice(point.source.index!, 0, point)
                    }
                })
            )
            this.destroy.push(
                this.canvasElementEvents!.mousemove.subscribe(e => {
                    const midpoints = this.getShapeSegmentationLineMidpoint(this.currentShapeSegmentation)
                    // 符合距离的中点
                    const hoverList = midpoints.filter((p: Point) => {
                        return (Point2Distance({x: p.x!, y: p.y!}, {x: e.offsetX, y: e.offsetY}) < this.shapeSegmentationCreaterPointByMidpointHoverDistanceRange)
                    })
                    if (hoverList.length) {
                        this.pointHover = hoverList[0]
                        this.pointDragPlanMap.set('shape-segmentation-line-midpoint', [this.pointHover])
                        this.canvasViewMouseStyleCursor.set('100-shape-segmentation-midpoint', 'pointer')
                    } else {
                        this.pointDragPlanMap.set('shape-segmentation-line-midpoint', [])
                        this.canvasViewMouseStyleCursor.delete('100-shape-segmentation-midpoint')
                    }
                })
            )
        }
        /**
         * 获取多边型的中点
         */
        getShapeSegmentationLineMidpoint(shape: ShapeSegmentationData | null | undefined): Point[] {
            if (!shape) return []
            const midpoints: Point[] = []
            shape.point.reduce((pre: (Point | null), cur: Point, index: number) => {
                if (!pre) return cur
                if ( Math.abs(pre.x! - cur.x!) > 50 || Math.abs(pre.y! - cur.y!) > 50 ) {
                    const midpoint = {
                        id: Symbol('PointId'),
                        x: Math.round( (pre.x!+cur.x!)/2 ), 
                        y: Math.round((pre.y! + cur.y!) / 2),
                        source: {
                            scene: 'shape-segmentation-line-midpoint',
                            ...cur.source, index,
                            x: Math.round( (pre.source.x!+cur.source.x!)/2 ),
                            y: Math.round( (pre.source.y!+cur.source.y!)/2 ),
                        }
                    }
                    midpoints.push(midpoint)
                }
                return cur
            }, null)
            if (!this.pointSource && shape.point!.length > 2) {
                const pre = shape.point![shape.point!.length - 1], cur = shape.point![0]
                if (Math.abs(pre.x! - cur.x!) > 20 || Math.abs(pre.y! - cur.y!) > 20) {
                    const midpoint = {
                        id: Symbol('PointId'),
                        x: Math.round( (pre.x!+cur.x!)/2 ), 
                        y: Math.round((pre.y! + cur.y!) / 2),
                        source: {
                            scene: 'shape-segmentation-line-midpoint',
                            ...cur.source, index: shape.point!.length,
                            x: Math.round( (pre.source.x!+cur.source.x!)/2 ),
                            y: Math.round( (pre.source.y!+cur.source.y!)/2 ),
                        }
                    }
                    midpoints.push(midpoint)
                }
            }
            return midpoints
        }
    }
}

