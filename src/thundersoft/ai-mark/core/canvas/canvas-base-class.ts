import { AiMarkInterface, RatioCalculation, CanvasOperationFun } from '..';
import { Subscription } from 'rxjs';

/**
 * Canvas 基础实现类
 */
export class CanvasBaseClass implements AiMarkInterface {

    id = (new Date()).getTime()
    canvasRenderingId: any
    
    // 挂载元素
    elementDom!: HTMLElement

    // 固定计算精度 (-+)100000,
    readonly accuracy = 100000
    
    // canvas 纵横比：（elementDom.Width / elementDom.Height）精度 this.accuracy = 100000
    canvasAspectRatio = 100000

    // 默认缩放比例，精度 accuracy = 100000
    canvasZoom: number = 100000

    // 屏幕内绘制的canva
    canvasElement: HTMLCanvasElement;
    canvasRenderingContext2D: CanvasRenderingContext2D;
    
    // todo 虚拟（离屏canva）性能优化
    offscreenCanvas: HTMLCanvasElement;
    offscreenCanvasRenderingContext2D: CanvasRenderingContext2D;

    // 对 canvasRenderingContext2D 的所有操作方法 顺序集合
    canvasProxyOperations: CanvasOperationFun[] = []

    loading = false

    // 销毁 订阅事件
    destroyMap: Map<any, (Subscription|undefined)[]> = new Map<any, (Subscription|undefined)[]>()
    destroy: (Subscription|undefined)[] = []

    constructor() {
        this.destroyMap.set('default', this.destroy)
        this.canvasElement = document.createElement("canvas")
        this.offscreenCanvas = document.createElement("canvas")
        this.canvasRenderingContext2D = this.canvasElement.getContext('2d') as CanvasRenderingContext2D;
        this.offscreenCanvasRenderingContext2D = this.offscreenCanvas.getContext('2d') as CanvasRenderingContext2D;
    }
    
    /**
     * 装饰类 挂载点
     * @param el 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
        // 消除 上一次 init 订阅的事件
        this.destroyMap.forEach(ds => {
            ds.forEach(d => d.unsubscribe())
            ds.length = 0
        })
        this.elementDom = el
        this.reloadCanvasElement()
        this.canvasRendering()
        return {canvas: this.canvasElement}
    }
    
    reloadCanvasElement() {
        // scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。 
        // clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。 
        // offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。
        if (this.elementDom && this.elementDom.innerHTML) {
            this.elementDom.innerHTML = ''
        }
        this.canvasElement = document.createElement("canvas")
        this.canvasRenderingContext2D = this.canvasElement.getContext('2d') as CanvasRenderingContext2D;
        // 填充大小
        this.canvasElement.setAttribute('id', this.id+'')
        this.canvasElement.width = (this.elementDom && this.elementDom.scrollWidth) || 0
        this.canvasElement.height = (this.elementDom && this.elementDom.scrollHeight) || 0
        // 纵横比 w/h
        this.canvasAspectRatio = RatioCalculation(this.canvasElement.width, this.canvasElement.height, this.accuracy)
        // 挂载
        this.elementDom.appendChild(this.canvasElement)
    }

    /**
     * canvas 操作 代理（拦截）
     * @param fn 
     */
    canvasOperation(fn: (canvasRenderingContext2D: CanvasRenderingContext2D) => any) {
        fn(this.offscreenCanvasRenderingContext2D)
        this.canvasProxyOperations.push(fn)
    }

    /**
     * 50帧渲染
     */
    canvasRendering() {
        // 20ms 绘制一次
        this.canvasRenderingId = setInterval(() => {
            // // console.log('50帧渲染:', this.id)
            if (document.getElementById(this.id+'')) {
                this.canvasRenderingContext2D.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
                if (this.loading) {
                    this.canvasRenderingContext2D.font='66px bold 宋体'
                    this.canvasRenderingContext2D.fillText('Loading ...', this.elementDom.scrollWidth/2 - 160, this.elementDom.scrollHeight/2 + 20);
                } else {
                    this.canvasProxyOperations.forEach(f => f(this.canvasRenderingContext2D))
                }
            } else {
                clearInterval(this.canvasRenderingId)
                // 消除 订阅的事件
                this.destroyMap.forEach(ds => {
                    ds.forEach(d => d.unsubscribe())
                    ds.length = 0
                })
            }
        }, 20)
    }
}