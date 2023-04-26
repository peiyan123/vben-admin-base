import { AiMarkInterface } from '..';
import { ShapeSegmentationData } from './index';
import { merge, Subject, fromEvent } from 'rxjs';
import { Point } from '../point/index';
import { filter } from 'rxjs/operators';

/**
 * ShapeSegmentationDecorators
 */
export function ShapeSegmentationDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    /**
     * 点形集合
     */
    shapeSegmentations?: ShapeSegmentationData[] = []

    // 当前处于编辑状态的点形id
    currentShapeSegmentation: ShapeSegmentationData | null = null

    /**
     * 点图绘制成功事件
     */
    shapeSegmentationDrawSuccessEvent: Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>
      = new Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>()

    /**
     * 点图绘制成功结束
     */
    shapeSegmentationDrawEndEvent: Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>
      = new Subject<{ option: ShapeSegmentationData, shape: ShapeSegmentationData }>()

    /**
     * 点添加成功事件
     */
    shapeSegmentationDrawAddEvent: Subject<{ point: Point, shape: ShapeSegmentationData }> = new Subject<{ point: Point, shape: ShapeSegmentationData }>()

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, args)
      this.shapeSelectPlan = this.shapeSegmentations
      // this.shapeSelectedBeforeEvent.subscribe(() => {
      //   this.pointSource = null
      // })
      return {...result}
    }

    /**
     * 进入绘制模式：画点
     * @param rules 
     */
    shapeSegmentationDrawing(option: ShapeSegmentationData) {
      this.pointSource = null
      // 计算 labelCole
      option.labelColor = this.getLabelCole!(option.color!)
      // 创建当前图形
      if (option === this.shapeSelected) {
        this.currentShapeSegmentation = this.shapeSelected
      } else {
        this.currentShapeSegmentation = {
          ...option,
          // 点集合
          point: option.point || [],
          // 生成一个唯一Id
          shapeId: option.shapeId || 'shapPoint:' + (new Date()).getTime() + Math.round(Math.random() * 10000)
        }
        // 开启点的绘制
        this.pointSource = {
          color: option.color,
          labelColor: option.labelColor,
          shapeId: this.currentShapeSegmentation!.shapeId
        }
      }
      // 点显示
      this.pointsMap.set(this.currentShapeSegmentation!.shapeId!, this.currentShapeSegmentation!.point!)
      this.currentShapeSegmentation.point.forEach(p => p.invalid = false)
      // 点选择/点移动
      this.pointDragPlan = this.pointSelectedPlan = this.currentShapeSegmentation.point
      // 点添加
      this.destroyMap.get('ShapeSegmentationDecorators1').forEach(d => d.unsubscribe())
      this.destroyMap.set('ShapeSegmentationDecorators1', [
        this.pointsCreateByMouseClickBeforeEvent!.subscribe(point => {
          if (this.currentShapeSegmentation) {
            this.pointSelected = null
            this.currentShapeSegmentation.point.push(point)
            this.shapeSegmentationDrawAddEvent.next({ point: point, shape: this.currentShapeSegmentation })
          } else {
            // 无效的点
            point.invalid = true
          }
        })
      ])
      // 双击绘制结束
      this.destroyMap.get('ShapeSegmentationDecorators2').forEach(d => d.unsubscribe())
      this.destroyMap.set('ShapeSegmentationDecorators2', [
        merge(
          // 鼠标左键双击
          this.canvasElementEvents.leftDBClick!,
          // 键盘 enter 
          fromEvent(document, 'keydown').pipe(filter((e: any) => e.keyCode === 13))
        ).subscribe(() => {
          if (this.currentShapeSegmentation) {
            if (this.shapeHover || this.shapeSelected || this.pointHover) {
              return
            } else {
              this.pointHover = null
              if (this.shapeSegmentations.includes(this.currentShapeSegmentation)) {
                this.pointSelected = null
              } else if (this.currentShapeSegmentation.point!.length > 2) {
                this.pointSource = null
                this.shapeSegmentationDrawSuccessEvent.next({option, shape: this.currentShapeSegmentation})
              } else {
                this.currentShapeSegmentation.point.splice(0)
              }
              this.shapeSegmentationDrawEndEvent.next({option, shape: this.currentShapeSegmentation})
              this.points = []
            }
          }
        })
      ])
      return this.currentShapeSegmentation
    }
  }
}

