import { AiMarkInterface, ShapePointData } from '..';
import { LineConfig } from '../line';
import { Line } from '../line/line-model';

/**
 * ShapePointLoadDecorators
 */
export function ShapePointAnalysisRuleLineDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

        /**
         * @override 方法重写 super.init
         * @param el 
         * @param url 
         * @param args 
         */
        init(el: HTMLElement, ...args: any[]): any {
            let result = super.init(el, args)
            // 开启绘制地图连线规则画线的功能
            this.drawShapePointLine()
            return {...result}
        }

        /**
         * 画线
         * @param element 
         */
        drawShapePointLine() {
            this.canvasOperation(() => {
                this.linesMap.delete('shape-point-lines')
                this.pointsMap.clear()
                const lines: Line[] = [],
                    lineDraw = (shape: ShapePointData) => {
                    this.pointsMap.set(shape.shapeId!, shape.point!)
                    shape.analysisRuleLine.forEach((config: LineConfig, indexs) => {
                        const index1 = parseInt(indexs.split('-')[0])
                        const index2 = parseInt(indexs.split('-')[1])
                        const start = shape.point.find(point => point.source.index === index1)
                        const end = shape.point.find(point => point.source.index === index2)
                        if (start && end) {
                            lines.push({ start, end, config: {...config}})
                        }
                    })
                }
                // 图形数据绘制
                this.shapePoints.forEach(lineDraw)
                // 当前绘制的图形
                if (this.currentShapePoint) {
                    lineDraw(this.currentShapePoint)
                    this.pointsMap.set('shape-point-points', this.currentShapePoint.point!)
                }
                this.linesMap.set('shape-point-lines', lines)
            })
        }
        /**
         * 解析画线规则
         * @param lineRuleString 例如： "1:3;5:3;5-1"
         * todo: lineRuleString 校验
         * @param config 连线配置
         * @returns 
         */
        analysisRuleLine(lineRuleString: string, config: any): Map<string, any> {
            // 规则拆分
            let ruleList: any[] = lineRuleString!.split(';')
            // 规则解析
            const result: Map<string, any> = new Map<string, any>()
            ruleList.reduce((map: any, rule) => {
                if (rule.includes('-')) {
                    if (parseInt(rule.split('-')[0]) > parseInt(rule.split('-')[1])) {
                        map.set((parseInt(rule.split('-')[1]) + '-' + parseInt(rule.split('-')[0])), config)
                    } else {
                        map.set((parseInt(rule.split('-')[0]) + '-' + parseInt(rule.split('-')[1])), config)
                    }
                }
                if (rule.includes(':')) {
                    let startIndex: number = 0, endIndex: number =0
                    if (parseInt(rule.split(':')[0]) > parseInt(rule.split(':')[1])) {
                        startIndex = parseInt(rule.split(':')[1])
                        endIndex = parseInt(rule.split(':')[0])
                    } else {
                        startIndex = parseInt(rule.split(':')[0])
                        endIndex = parseInt(rule.split(':')[1])
                    }
                    for (let i = startIndex; i < endIndex; i++) {
                        map.set((i + '-' + (i+1)), config)
                    }
                }
                return map
            }, result)
            return result
        }
    }
}

