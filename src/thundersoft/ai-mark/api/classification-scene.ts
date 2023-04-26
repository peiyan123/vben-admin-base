import { AiMarkInterface, MarkCanvasBaseClass, MarkImageDecorators } from '../core';
import { Subscription } from 'rxjs';

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
@MarkImageDecorators
class AiMark extends MarkCanvasBaseClass {}

/**
 * 图片分类场景 ClassificationScene
 */
export class ClassificationScene {
    
    // 画布对象
    markCanvas: AiMarkInterface = new AiMark()

    constructor(el: HTMLElement, url: string) {
        if ( (imageId === url) && (aimarkArray.length === 1) ) {
            imageCopy(this.markCanvas)
        } else {
            imageChange(url, this.markCanvas)
        }
        this.markCanvas.init(el, url)
    }

    destroy() {
        // 消除 上一次 init 订阅的事件
        this.markCanvas.destroyMap.forEach(ds => ds.forEach(d => d.unsubscribe()))
    }

    reload(url: string) {
        this.markCanvas.loadImage!(url)
    }
}

export default ClassificationScene;