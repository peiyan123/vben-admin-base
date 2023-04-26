import { AiMarkInterface } from '..';
import { LineDetectionData } from './line-detection-model';

/**
 * ShapePointLoadDecorators
 */
export function LineDetectionLoadDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 加载线数据
     * @param shap 
     */
    loadShapeDetection?(lines: LineDetectionData[]): void {
      this.lineSelectPlan = this.lineDetections = []
      lines.forEach(line => {
        // // 计算 labelCole
        // shapConfig.labelColor = this.getLabelCole!(shapConfig.color!)
        // 图形id
        line.shapeId = line.shapeId || 'linePoint:'+(new Date()).getTime()+Math.round(Math.random()*10000)
        // 加载图形的点
        line.point = line.point!.map(source => ({
          id: Symbol('PointId'), source: {
            ...source,
            color: line.config!.color,
            shapeId: line.shapeId
          }
        }))
        this.lineDetections!.push({
          ...line,
          shapeId: line.shapeId
        })
      })
    }
  }
}

