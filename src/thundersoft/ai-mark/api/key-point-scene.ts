import { fromEvent, Subject, Subscription } from 'rxjs';
import { AiMarkInterface, MarkCanvasBaseClass, MarkShapePointDecorators, ShapePointData, PointSource, Shape, Point } from '../core';

// 如果是同一图片，则联动显示
let imageId: any = '', aimarkArray: AiMarkInterface[] = [], eventSubject: (Subscription | undefined)[] = [],
    imageChange = (url: any, aimark: AiMarkInterface) => {
        // console.log('ai mark => imageChange', url, aimark)
        imageId = url
        aimarkArray = [aimark]
        eventSubject.forEach(d => d.unsubscribe())
        eventSubject = []
    },
    imageCopy = (aimark: AiMarkInterface) => {
        // console.log('ai mark => imageCopy', aimark)
        eventSubject.push(aimark.imageChangeEvent!.subscribe(s => {
            aimarkArray[0].imageStartPoint = aimark.imageStartPoint
            aimarkArray[0].canvasZoom = aimark.canvasZoom
        }))
        eventSubject.push(aimarkArray[0].imageChangeEvent!.subscribe(s => {
            aimark.imageStartPoint = aimarkArray[0].imageStartPoint
            aimark.canvasZoom = aimarkArray[0].canvasZoom
        }))
        aimarkArray.push(aimark)
    };

@MarkShapePointDecorators
class AiMark extends MarkCanvasBaseClass {}
export class KeyPointScene {

    // 画布对象
    markCanvas: AiMarkInterface = new AiMark()
    /**
     * 对象删除事件
     */
    deleteShapeEvent: Subject<Shape> = new Subject<Shape>()
    /**
     * 点 删除事件
     */
    deletePointEvent: Subject<Point> = new Subject<Point>()

    destroyEvent: (Subscription|undefined)[] = []

    constructor(el: HTMLElement, url?: string, markData: ShapePointData[] = []) {
        if ( (imageId === url) && (aimarkArray.length === 1) ) {
            imageCopy(this.markCanvas)
        } else {
            imageChange(url, this.markCanvas)
        }
        this.markCanvas.destroyMap.set('scene', this.destroyEvent)
        this.markCanvas.init(el, url)
        this.setData(markData)
        this.markCanvas.shapeSelectPlan = this.markCanvas.shapePoints
        // 监听键盘 删除键
        this.destroyEvent.push(fromEvent(document, 'keydown').subscribe((e: any) => {
            // backspace: 8   delete:46
            if ( (e.keyCode === 8) || (e.keyCode === 46)) {
                // 删除选中的对象或者点
                this.deleteSelected()
            }
        }))
        // 对象选中事件
        this.destroyEvent.push(
            this.markCanvas.shapeSelectedBeforeEvent.subscribe(shape => {
            shape.index = shape.maxIndex! + 1 // 设置添加点
            this.markModeSave()
        })
        )
        this.destroyEvent.push(this.markCanvas.shapeSelectedAfterEvent.subscribe(shape => {
            this.markForShape(shape)
        }))
    }
    
    destroy() {
        // 消除 上一次 init 订阅的事件
        this.markCanvas.destroyMap.forEach(ds => ds.forEach(d => d.unsubscribe()))
        this.destroyEvent.forEach(d => d.unsubscribe())
    }

    /**
     * 删除选中的对象或者点
     */
    deleteSelected() {
        // 删除已选择的点
        if ((this.markCanvas.shapeSelected || this.markCanvas.currentShapePoint) && this.markCanvas.pointSelected) {
            const shape = this.markCanvas.shapeSelected || this.markCanvas.currentShapePoint, point = this.markCanvas.pointSelected
            shape.point.splice(shape.point.indexOf(this.markCanvas.pointSelected), 1)
            this.markCanvas.pointHover = null
            this.markCanvas.pointSelected = null
            // 事件 通知
            this.deletePointEvent.next(point)
            // 如果删除了 最后一个点
            if (!this.markCanvas.currentShapePoint!.point.length) {
                this.markCanvas.shapeSelectedExitBeforeEvent.next(this.markCanvas.currentShapePoint!)
                this.markCanvas.shapeSelectedExitAfterEvent.next({})
            }
        // 删除对象
        } else if (this.markCanvas.shapeSelected) {
            const shape = this.markCanvas.shapeSelected
            // 删除对象
            this.markCanvas.shapePoints.splice(this.markCanvas.shapePoints.indexOf(shape), 1)
            this.markCanvas.shapeSelected = null
            this.markCanvas.shapeHover = null
            this.markCanvas.currentShapePoint = null
            // 删除点
            this.markCanvas.pointsMap.delete(shape.shapeId!)
            this.markCanvas.pointClearDoing!()
            // 事件 通知
            this.deleteShapeEvent.next(shape)
        }
    }
    /**
     * 载入 图片 + mark 标注数据
     * @param url 
     */
    reload(url: string, markData: ShapePointData[]) {
        this.markCanvas.loadImage!(url)
        this.setData(markData)
    }
    /**
     * 修改数据
     */
    setData(markData: ShapePointData[]) {
        this.markCanvas.pointClear!()
        this.markCanvas.lineClear!()
        this.markCanvas.shapeClear!()
        // 清空 点图标注 数据
        this.markCanvas.shapePoints!.length = 0
        // 清空 当前标注的对象
        this.markCanvas.currentShapePoint = null
        this.markCanvas.pointDrawPlan!.length = 0
        // 载入 标注数据
        this.markCanvas.loadShapePoint!(markData)
        // 可选
        this.markCanvas.shapeSelectPlan = this.markCanvas.shapePoints
    }
    /**
     * 获取数据
     */
    getData() {
        return this.markCanvas.shapePoints.map(s => JSON.parse(JSON.stringify(s.point.map(p => p.source))))
    }
    /**
     * 获取当前的模式 
     */
    getModel(): string {
        if (this.markCanvas.currentShapePoint && (this.markCanvas.currentShapePoint === this.markCanvas.shapeSelected)) {
            // 对象编辑模式
            return 'edit'
        } else if (this.markCanvas.currentShapePoint) {
            // 新对象的标注模式
            return 'create'
        } else if (this.markCanvas.shapeSelectPlan && this.markCanvas.shapeSelectPlan.length) {
            // 对象选择模式
            return 'select'
        } else {
            // 初始模式，啥都没有
            return 'init'
        }
    }
    /**
     * 获取当前选中的数据
     * @returns 
     */
    getShapeSelected() {
        return this.markCanvas.shapeSelected
    }
    /**
     * 进入新对象的标注模式
     */
    openMarkMode(shapeCofig?: ShapePointData) {
        // 所有图形都设为 可选的
        this.markCanvas.shapeSelectPlan = this.markCanvas.shapePoints
        // 开启新对象的标注模式
        if (shapeCofig) {
            // 当前本来就处于 新对象的标注模式
            if (this.markCanvas.currentShapePoint && (this.markCanvas.currentShapePoint != this.markCanvas.shapeSelected)) return
            // 当前本来就处于 对象的编辑模式, 退出对象的编辑模式
            this.markCanvas.shapeSelected = null
            this.markForShape(shapeCofig)
        }
    }
    /**
     * 关闭标注模式
     */
    closeMarkMode() {
        // 所有图形都设为 不可选的
        this.markCanvas.shapeSelectPlan = []
        this.markCanvas.shapeHoverPlan = this.markCanvas.shapePoints
        // 取消当前选中的图形
        this.markCanvas.shapeSelected = null
        this.markCanvas.shapeHover = null
        // 取消当前 对点的操作
        this.markCanvas.pointClearDoing!()
        // 关闭 新对象的标注模式
        this.markCanvas.currentShapePoint = null
        this.markCanvas.pointDrawPlan = []
    }
    /**
     * 对象标注
     */
    markForShape(shapeCofig: ShapePointData) {
        this.markCanvas.pointClearDoing!()
        if (!shapeCofig.pointDrawPlan) {
            // 生成:计划要绘制的点
            shapeCofig.pointDrawPlan = [] 
            for (let ii = shapeCofig.index!; ii <= shapeCofig.maxIndex!; ii++) {
                shapeCofig.pointDrawPlan.push({ index: ii, label: ii + '' }) 
            }
        }
        // 配置标注规则
        this.markCanvas.shapePointDrawing!(shapeCofig)
    }
    /**
     * 保存
     */
    markModeSave() {
        if (this.markCanvas.currentShapePoint && this.markCanvas.currentShapePoint.point.length) {
            this.markCanvas.currentShapePoint.index = this.markCanvas.currentShapePoint.maxIndex! + 1
            if (!this.markCanvas.shapePoints.includes(this.markCanvas.currentShapePoint!)) {
                this.markCanvas.shapePoints.push(this.markCanvas.currentShapePoint!)
            }
            this.markCanvas.currentShapePoint = null
            this.markCanvas.pointDrawPlan = []
        }
        this.markCanvas.shapeSelected = null
    }
    /**
     * 复位
     */
    reset() {
        this.markCanvas.canvasZoomDefault!()
    }
    /**
     * 连续标注点
     */
    updatePoint(index: number, pointDrawPlan?: PointSource[]) {
        if (this.markCanvas.currentShapePoint) {
            // 当前正在绘制第几个点
            this.markCanvas.currentShapePoint.index = index
            if (!pointDrawPlan) {
                // 计划要绘制的点
                this.markCanvas.currentShapePoint.pointDrawPlan = [] // this.pointSource 无限绘制            
                for (let ii = this.markCanvas.currentShapePoint.index!; ii <= this.markCanvas.currentShapePoint.maxIndex!; ii++) {
                    this.markCanvas.currentShapePoint.pointDrawPlan.push({ index: ii, label: ii + '' }) 
                }
            } else {
                this.markCanvas.currentShapePoint.pointDrawPlan = pointDrawPlan
            }
            this.markCanvas.shapePointDrawing!(this.markCanvas.currentShapePoint)
        }
    }
    /**
     * 单个点标注
     */
    singlePoint(index: number, pointDrawPlan?: PointSource[]) {
        if (this.markCanvas.currentShapePoint) {
            // 当前正在绘制第几个点
            this.markCanvas.currentShapePoint.index = index
            if (!pointDrawPlan) {
                // 计划要绘制的点
                this.markCanvas.currentShapePoint.pointDrawPlan = [] // this.pointSource 无限绘制
                this.markCanvas.currentShapePoint.pointDrawPlan.push({ index: index, label: index + '' })
            } else {
                this.markCanvas.currentShapePoint.pointDrawPlan = pointDrawPlan
            }
            this.markCanvas.shapePointDrawing!(this.markCanvas.currentShapePoint)
        }
    }
}

export default KeyPointScene;