import { fromEvent, Observable, race } from 'rxjs';
import { filter, bufferCount, buffer, map, debounceTime, first, repeat } from 'rxjs/operators';
import { AiMarkInterface } from '..';
import { CanvasElementEvents } from './canvas-event-interface';

/**
 * Canvas Warp HtmlElement Event
 */

export function CanvasEventDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {

    isFirefox = navigator.userAgent.indexOf("Firefox")>0  

    isSafari = navigator.userAgent.indexOf("Safari") > 0
    
    isCamino = navigator.userAgent.indexOf("Camino") > 0
    
    isMozilla = navigator.userAgent.indexOf("Gecko/") > 0
    
    // canvasElement 的事件集合
    canvasElementEvents!: CanvasElementEvents

    // 区分单击双击 的时间间隔，当 双击时不会触发单击事件
    doubleClickDuration = 300;

    /**
     * @override 方法重写 super.init
     * @param el 
     * @param url 
     * @param args 
     */
    init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, ...args)
        // 绑定事件
        this.bindingElementEvents(this.elementDom)
        return {...result}
    }
    // 绑定事件
    bindingElementEvents(element: Element) {
      const click = fromEvent(element, 'click')
      const leftClick = click.pipe(filter((event: any) => event.button === 0));
      this.canvasElementEvents = {
        // 滚轮事件
        scroll: this.getScroll(),
        //  click 单击鼠标左键时发生，如果右键也按下则不会发生。当用户的焦点在按钮上并按了 Enter 键时，同样会触发这个事件
        click, leftClick, ...this.getLeftClickOfAbsoluteEvent(leftClick),
        // dblclick 双击鼠标左键时发生，如果右键也按下则不会发生
        dblclick: fromEvent(element, 'dblclick'),
        // mousedown 单击任意一个鼠标按钮时发生
        mousedown: fromEvent(element, 'mousedown'),
        // mouseout 鼠标指针位于某个元素上且将要移出元素的边界时发生
        mouseout: fromEvent(element, 'mouseout'),
        // 鼠标移出元素范围时触发，该事件不冒泡，即鼠标移到其后代元素时不会触发。
        mouseleave: fromEvent(element, 'mouseleave'),
        // mouseover 鼠标指针移出某个元素到另一个元素上时发生
        mouseover: fromEvent(element, 'mouseover'),
        // mouseover 鼠标移入元素范围内触发，该事件不冒泡，即鼠标移到其后代元素上时不会触发。
        mouseenter: fromEvent(element, 'mouseenter'),
        // mouseup 松开任意一个鼠标按钮时发生
        mouseup: fromEvent(element, 'mouseup'),
        // mousemove 鼠标在某个元素上时持续发生
        mousemove: fromEvent(element, 'mousemove')
      }
    }
    // 获取左键 单击/双击 ，绝对事件
    getLeftClickOfAbsoluteEvent(leftClick: Observable<Event>) {
      // 时间间隔 缓存区域
      const debounce$ = leftClick.pipe(map((e: any) => {
        return { ...e, offsetX: e.offsetX, offsetY: e.offsetY }
      }), debounceTime(this.doubleClickDuration));
      // 累计数量限制
      const clickLimit$ = leftClick.pipe(map((e: any) => {
        return { ...e, offsetX: e.offsetX, offsetY: e.offsetY }
      }), bufferCount(2));
      // 缓存区域
      const bufferGate$ = race(debounce$, clickLimit$).pipe(map((e: any) => {
        return { ...e, offsetX: e.offsetX, offsetY: e.offsetY }
      }), first(), repeat());
      // // 释放结果
      // return {
      //   leftSingleClick: leftClick.pipe(map((e: any) => {
      //     return { ...e, offsetX: e.offsetX, offsetY: e.offsetY }
      //   }), buffer(bufferGate$), filter((clicks: any) => clicks.length === 1), map((clicks: any) => clicks[0])),
      //   leftDBClick: leftClick.pipe(map((e: any) => {
      //     return { ...e, offsetX: e.offsetX, offsetY: e.offsetY }
      //   }), buffer(bufferGate$), filter((clicks: any) => clicks.length > 1), map((clicks: any) => clicks[0]))
      // }
      // 释放结果
      return {
        leftSingleClick: bufferGate$.pipe(filter((clicks: any) => !(clicks[0]&&clicks[1]))),
        leftDBClick: bufferGate$.pipe(filter((clicks: any) => clicks[0]&&clicks[1]), map((clicks: any) => clicks[0]) )
      }
    }
    // 滚轮事件
    getScroll() {
      let scroll: Observable<any>
      // Firefox
      if (this.isFirefox) {
        // Firefox使用addEventListener添加滚轮事件  
        scroll = fromEvent(this.elementDom, 'DOMMouseScroll')
        // scroll = fromEvent(element, 'wheel')
      } else {
        scroll = fromEvent(this.elementDom, 'mousewheel')
      }
      // JS阻止鼠标的默认点击事件(例如鼠标的点击右键)
      (this.elementDom as any).oncontextmenu = function (e: any) {
        e.returnvalue = false
        e.preventDefault()
        return false
      }
      return scroll
    }
  }
}