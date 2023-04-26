import { AiMarkInterface } from '..';
import { ShapePointData } from './index';

/**
 * ShapePointLoadDecorators
 */
export function ShapePointLoadDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      return {...result}
    }
    /**
     * 加载图形数据
     * @param shap 
     */
    loadShapePoint?(shap: ShapePointData[]): void {
      this.shapePoints!.length = 0
      shap.forEach(shapConfig => {
        // 计算 labelCole
        shapConfig.labelColor = this.getLabelCole!(shapConfig.color!)
        // 图形id
        shapConfig.shapeId = shapConfig.shapeId || 'shapPoint:'+(new Date()).getTime()+Math.round(Math.random()*10000)
        // 加载图形的点
        shapConfig.point = shapConfig.pointSource!.map(source => ({
          id: Symbol('PointId'), source: {
            ...source,
            color: shapConfig.color,
            labelColor: shapConfig.labelColor,
            shapeId: shapConfig.shapeId
          }
        }))
        this.pointsMap.set(shapConfig.shapeId, shapConfig.point)
        // 规则解析
        shapConfig.analysisRuleLine = this.analysisRuleLine!(shapConfig.lineRuleString!, {color: shapConfig.color})
        // 加入集合
        this.shapePoints!.push({
          ...shapConfig,
          shapeId: shapConfig.shapeId
        })
      })
    }
  }
}

