import { fromEvent, Subject, Subscription } from 'rxjs';
import {
    AiMarkInterface,
    MarkCanvasBaseClass,
    LineDetectionData,
    MarkLineDetectionDecorators,
    Shape
} from '../core';

// 如果是同一图片，则联动显示
let imageId: any = '', 
aimarkArray: AiMarkInterface[] = [], 
eventSubject: (Subscription | undefined)[] = [],
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
@MarkLineDetectionDecorators
class AiMark extends MarkCanvasBaseClass {}

export class LineScene {

    // 画布对象
    markCanvas: AiMarkInterface = new AiMark()

    destroyEvent: (Subscription|undefined)[] = []

    /**
     * 对象删除事件
     */
    deleteLineEvent: Subject<Shape> = new Subject<Shape>()

    constructor(el: HTMLElement, url?: string, markData: LineDetectionData[] = []) {
        if ( (imageId === url) && (aimarkArray.length === 1) ) {
            imageCopy(this.markCanvas)
        } else {
            imageChange(url, this.markCanvas)
        }
        this.markCanvas.destroyMap.set('scene', this.destroyEvent)
        this.markCanvas.init(el, url)
        this.setData(markData)
        // 监听键盘 删除键
        this.destroyEvent.push(fromEvent(document, 'keydown').subscribe((e: any) => {
            // backspace: 8   delete:46
            if ( (e.keyCode === 8) || (e.keyCode === 46)) {
                // 删除选中的对象或者点
                this.deleteSelected()
            }
        }))
    }

    destroy() {
        // 消除 上一次 init 订阅的事件
        this.markCanvas.destroyMap.forEach(ds => ds.forEach(d => d.unsubscribe()))
        this.destroyEvent.forEach(d => d.unsubscribe())
    }

    /**
     * 删除选中的对象
     */
    deleteSelected() {
        // 删除对象

        // 删除形状
        this.markCanvas.lineDetections.splice(this.markCanvas.lineDetections.indexOf(this.markCanvas.lineSelected), 1)
        // 删除形状的点和线
        this.markCanvas.pointsMap.clear()
        this.markCanvas.linesMap.clear()
        this.markCanvas.pointClearDoing!()

            // 事件 通知
            this.deleteLineEvent.next(this.markCanvas.lineSelected)

        // 删除选中的对象
        this.markCanvas.lineSelected = null

    }
    /**
     * @returns 
     */
    setData(markData: LineDetectionData[]) {
        this.markCanvas.pointClear!()
        this.markCanvas.lineClear!()
        // 清空 点图标注 数据
        this.markCanvas.lineDetections!.length = 0
        // 载入 标注数据
        // this.markCanvas.loadLineDetection!(markData)
    }
    /**
     * 绊线箭头转换处理
     */
    arrowchange() {
        const lines = this.markCanvas.linesMap.forEach(lins => {
        const lin =  lins[0];
        const vercline = lins[1];
        const x = lin.start.x + lin.end.x - vercline.end.x;
        const y = lin.start.y + lin.end.y - vercline.end.y;

        vercline.end.x = x;
        vercline.end.y = y;
        const arrow = this.markCanvas.arrowadd(vercline.start, vercline.end);
        lins[2].start = arrow[0];
        lins[2].end = vercline.end;
        lins[3].start = arrow[1];
        lins[3].end = vercline.end;
       });
    }
    /**
     * 当前选中的数据
     * @returns
     */
    getLineSelected() {
        return this.markCanvas.lineSelected
    }
    /**
     * 进入标注模式
     */
    openMarkMode(line?: LineDetectionData) {
        // 所有图形都设为 可选的
        this.markCanvas.lineSelectPlan = this.markCanvas.lineDetections
        // 开启新对象的标注模式
        if (line) this.markCanvas.lineDetectionDrawOption!(line)
    }
    /**
     * 关闭标注模式
     */
    closeMarkMode() {
        // 所有图形都设为 不可选的
        this.markCanvas.lineSelectPlan = []
        // this.markCanvas.lineHoverPlan = this.markCanvas.lineDetections
        // 取消当前选中的图形
        this.markCanvas.lineSelected = null
        // this.markCanvas.lineHover = null
        // 取消当前 对点的操作
        this.markCanvas.pointClearDoing!()
        // 关闭 新对象的标注模式
        this.markCanvas.lineDetectionSource = null
    }
    /**
     * 复位
     */
    reset() {
        this.markCanvas.canvasZoomDefault!()
    }
    /**
     * 获取数据
     */
    getData() {
        return this.markCanvas.lineDetections.filter(s => s.point).map(s => ({
            ...s,
            pointSource: JSON.parse(JSON.stringify(s.point.map(p => ({x: p.source.x, y: p.source.y}))))
        }))
    }
}

export default LineScene;