import { Subscription } from 'rxjs';
/**
 * 对 canvasRenderingContext2D 的所有操作方法
 */
export interface CanvasOperationFun {
    (canvasRenderingContext2D: CanvasRenderingContext2D, ...args: any[]): void
}
/**
 * CanvasBaseClassInterface
 */
export interface CanvasBaseClassInterface {
    id: number
    
    // 挂载元素
    elementDom: HTMLElement

    // 固定计算精度 (-+)100000,
    readonly accuracy: number
    
    // canvas 纵横比：（elementDom.Width / elementDom.Height）精度 this.accuracy = 100000
    canvasAspectRatio: number

    // 默认缩放比例，精度 accuracy = 100000
    canvasZoom: number

    // 屏幕内绘制的canva
    canvasElement: HTMLCanvasElement;
    canvasRenderingContext2D: CanvasRenderingContext2D;
    
    // todo 虚拟（离屏canva）性能优化: canvas性能优化 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    offscreenCanvas: HTMLCanvasElement;
    offscreenCanvasRenderingContext2D: CanvasRenderingContext2D;

    // 对 canvasRenderingContext2D 的所有操作方法 顺序集合
    canvasProxyOperations: CanvasOperationFun[]

    loading: boolean
    /**
     * 销毁 订阅事件
     * 消除 上一次 init 订阅的事件
     */
    destroyMap: Map<any, (Subscription|undefined)[]>
    destroy: (Subscription|undefined)[]
    
    init(el: HTMLElement, ...args: any[]): any
    
    reloadCanvasElement(): void

    /**
     * canvas 操作 代理（拦截）
     * @param fn 
     */
    canvasOperation(fn: (canvasRenderingContext2D: CanvasRenderingContext2D) => any): void

    /**
     * 50帧渲染
     */
    canvasRendering(): void
}