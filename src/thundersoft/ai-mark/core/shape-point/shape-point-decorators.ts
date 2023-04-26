import { AiMarkInterface } from '..';
import { ShapePointData } from './index';
import { Subject } from 'rxjs';
import { Point } from '../point/index';

/**
 * ShapePointDecorators
 */
export function ShapePointDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 点形集合
     */
    shapePoints?: ShapePointData[] = []

    /**
     * 当前正在编辑的 关键点 对象
     */
    currentShapePoint: ShapePointData | null = null

    /**
     * 点图绘制成功事件
     */
    shapePointDrawSuccessEvent: Subject<{ point: Point, shape: ShapePointData }> = new Subject<{ point: Point, shape: ShapePointData }>()

    /**
     * 点添加成功事件
     */
    shapePointDrawAddEvent: Subject<{ point: Point, shape: ShapePointData }> = new Subject<{ point: Point, shape: ShapePointData }>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      // 图形对象 全部设为可选择
      this.shapeSelectPlan = this.shapePoints
      // 鼠标左键单击绘制点
      this.shapePointCreatePointByLeftClick()
      return {...result}
    }

    /**
     * 鼠标左键单击绘制点
     */
    shapePointCreatePointByLeftClick() {
      this.destroy.push(
        this.pointsCreateByMouseClickBeforeEvent!.subscribe(point => {
          if (this.currentShapePoint) {
            // 清除之前绘制的图形点
            this.currentShapePoint.point.filter(p => (p.source.shapeId === this.currentShapePoint!.shapeId) && (point.source.index === p.source.index))
              .forEach(i => { this.currentShapePoint!.point.splice(this.currentShapePoint!.point.indexOf(i), 1) })
            // 绘制成的点加到图形里面
            this.currentShapePoint.point.push(point)
            this.pointDrawPlan.shift()
            // 发出通知
            this.shapePointDrawAddEvent.next({ point: point, shape: this.currentShapePoint })
            // 绘制完成 最后一个点
            if (point.source.index === this.currentShapePoint!.maxIndex!) {
              this.shapePointDrawSuccessEvent.next({point: point, shape: this.currentShapePoint})
            }
          } else {
            // 无效的点
            point.invalid = true
          }
        })
      )
    }

    /**
     * 进入绘制模式：画点
     * @param rules 
     */
    shapePointDrawing(option: ShapePointData) {
      // 计算 labelCole
      option.labelColor = this.getLabelCole!(option.color!)
      // 创建当前图形
      if (option === this.shapeSelected) {
        this.currentShapePoint = this.shapeSelected
      } else if (option != this.currentShapePoint) {
        this.currentShapePoint = {
          ...option,
          // 点集合
          point: option.point || [],
          // 生成一个唯一Id
          shapeId: option.shapeId || 'shapPoint:' + (new Date()).getTime() + Math.round(Math.random() * 10000)
        }
      }
      this.pointDragPlan = this.pointSelectedPlan = this.currentShapePoint.point
      // 连线
      this.currentShapePoint.analysisRuleLine = this.analysisRuleLine!(option.lineRuleString!, { color: option.color })
      // 修正：计划要绘制的点
      this.currentShapePoint.pointDrawPlan.forEach(point => {
        point.color = point.color || this.currentShapePoint!.color
        point.labelColor = point.labelColor || this.currentShapePoint!.labelColor
        point.shapeId = point.shapeId || this.currentShapePoint!.shapeId
      });
      // 把图形的 点绘制计划 做为当前的绘制计划
      this.pointDrawPlan = this.currentShapePoint.pointDrawPlan
      return this.currentShapePoint
    }
  }
}

