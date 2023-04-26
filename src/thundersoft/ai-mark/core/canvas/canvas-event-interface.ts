import { Observable } from 'rxjs';

/**
 * Canvas Warp HtmlElement Event
 */
export interface CanvasEventInterface {

    isFirefox?: boolean

    isSafari?: boolean
    
    isCamino?: boolean
    
    isMozilla?: boolean

    // canvasElement 的事件集合
    canvasElementEvents?: CanvasElementEvents
}

export interface CanvasElementEvents {
    // 滚轮事件  滚动方向:Firefox：event.detail other event.wheelDelta
    scroll: Observable<any>
    //  click 单击鼠标左键时发生，如果右键也按下则不会发生。当用户的焦点在按钮上并按了 Enter 键时，同样会触发这个事件
    click: Observable<any>
    leftClick: Observable<any>
    leftSingleClick: Observable<any>
    leftDBClick: Observable<any>
    // dblclick 双击鼠标左键时发生，如果右键也按下则不会发生
    dblclick: Observable<any>
    // mousedown 单击任意一个鼠标按钮时发生
    mousedown: Observable<any>
    // mouseout 鼠标指针位于某个元素上且将要移出元素的边界时发生
    mouseout: Observable<any>
    // 鼠标移出元素范围时触发，该事件不冒泡，即鼠标移到其后代元素时不会触发。
    mouseleave: Observable<any>
    // mouseover 鼠标指针移出某个元素到另一个元素上时发生
    mouseover: Observable<any>
    // mouseover 鼠标移入元素范围内触发，该事件不冒泡，即鼠标移到其后代元素上时不会触发。
    mouseenter: Observable<any>
    // mouseup 松开任意一个鼠标按钮时发生
    mouseup: Observable<any>
    // mousemove 鼠标在某个元素上时持续发生
    mousemove: Observable<any>

    [propName: string]: Observable<any>
}