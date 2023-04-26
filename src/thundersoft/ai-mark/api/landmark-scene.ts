import { KeyPointScene, ShapePointData } from '../';
import { Subject } from 'rxjs';

export class LandmarkScene {
    /**
     * 单例模式
     */
    private static Object: LandmarkScene

    keyPointCanvas!: KeyPointScene

    // 标注规则
    state = {
        lineRuleString: '',
        // lineRuleString: '1:3;6:3;6-1;6-3',
        index: 1,
        maxIndex: 6,
        color: 'rgb(60,60,60)'
    };

    setState = (value: ShapePointData) => {
        Object.assign(this.state, value)
        this.stateChangeEvent.next(this.state)
    }
    stateChangeEvent: Subject<ShapePointData> = new Subject<ShapePointData>()

    private constructor() {}
    
    /**
     * 初始化
     * @param el 
     * @param url 
     * @returns 
     */
    static init(el: HTMLElement, image?: string, markData: ShapePointData[] = [], rule?: ShapePointData): LandmarkScene {
        if (!LandmarkScene.Object) {
            LandmarkScene.Object = new LandmarkScene();
            LandmarkScene.Object.keyPointCanvas = new KeyPointScene(el)
            // 新标注对象 绘制点事件
            LandmarkScene.Object.keyPointCanvas.markCanvas.shapePointDrawAddEvent.subscribe(d => {
                LandmarkScene.Object.setState({ index: d.point.source.index! + 1 });
                // 所有图形都设为 不可选的
                LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectPlan = []
                // 关闭对 双击事件 的过滤
                LandmarkScene.Object.keyPointCanvas.markCanvas.pointsCreateDBClickOrClick = false
                LandmarkScene.Object.keyPointCanvas.markCanvas.shapeHover = null
                // 绘制 新标注对象 的 外矩形 填充区域
                LandmarkScene.Object.keyPointCanvas.markCanvas.shapeRectangleFill.set('landmark-shape', [d.shape])
            })
            // 选中对象之后
            LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectedAfterEvent.subscribe(d => {
                // 其他图形都设为 不可选的
                LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectPlan = [d]
                // 关闭对 双击事件 的过滤
                LandmarkScene.Object.keyPointCanvas.markCanvas.pointsCreateDBClickOrClick = false
                // 当前对象信息
                let index = 1, color = d.color
                if (d.point && d.point.length) {
                    index = d.point.sort((a, b) => b.source.index! - a.source.index!)[0].source.index!
                    if (index != (d as ShapePointData).maxIndex) {
                        index += 1
                    }
                }
                LandmarkScene.Object.setState({ index, color });
                LandmarkScene.Object.keyPointCanvas.updatePoint(index)
            })
            // 选中点
            // LandmarkScene.Object.keyPointCanvas.markCanvas.pointSelectedEvent.subscribe(d => {
            //     // alert('选中点:' + JSON.stringify(d))
            // })
            // 退出 对象选中 （ 键盘 ‘Esc’ 或者鼠标左键单击 图形外部区域）
            LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectedExitKeyEsc = true
            LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectedExitBeforeEvent.subscribe(shape => {
                if (shape === LandmarkScene.Object.keyPointCanvas.markCanvas.currentShapePoint) {
                    LandmarkScene.Object.keyPointCanvas.markCanvas.currentShapePoint = null
                    LandmarkScene.Object.keyPointCanvas.markCanvas.pointDrawPlan = []
                }
            })
            // 退出对象选中之后, 开启 标注 功能
            LandmarkScene.Object.keyPointCanvas.markCanvas.shapeSelectedExitBeforeEvent.subscribe(() => {
                setTimeout(() => {
                    LandmarkScene.Object.mark()
                })
            })
            // 删除对象 之后
            LandmarkScene.Object.keyPointCanvas.deleteShapeEvent.subscribe(() => {
                // 开启标注 模式
                LandmarkScene.Object.mark()
            })
        }
        if (el != LandmarkScene.Object.keyPointCanvas.markCanvas.elementDom) {
            // todo: 多次调用会 没有销毁 html 监听事件
            console.warn('AiMark Canvas init(el), 多次调用可能会造成内存回收问题')
            LandmarkScene.Object.keyPointCanvas = new KeyPointScene(el)
        }
        if (image) LandmarkScene.Object.keyPointCanvas.markCanvas.loadImage!(image)
        LandmarkScene.Object.keyPointCanvas.setData(markData)
        if (rule) {
            LandmarkScene.Object.setState(rule)
            LandmarkScene.Object.mark()
        }
        return LandmarkScene.Object;
    }
    
    // 随机生成一个颜色
    getColor() {
        return 'rgb(' + parseInt(Math.random() * 1000 + '') / 4 + ',' + parseInt(Math.random() * 1000 + '') / 4 + ',' + parseInt(Math.random() * 1000 + '') / 4 + ')'
    }

    // 标注
    mark() {
        const index = 1, color = this.getColor()
        this.setState({ index, color });
        this.keyPointCanvas.closeMarkMode()
        this.keyPointCanvas.markCanvas.shapeRectangleFill.delete('landmark-shape')
        // 开启 对 双击事件 的过滤
        this.keyPointCanvas.markCanvas.pointsCreateDBClickOrClick = true
        this.keyPointCanvas.openMarkMode({
            lineRuleString: this.state.lineRuleString,
            maxIndex: this.state.maxIndex,
            index, color
        })
    }

    // 保存后，开启 新对象的绘制
    save() {
        // 删除 新标注对象 的 外矩形 填充区域
        this.keyPointCanvas.markCanvas.shapeRectangleFill.delete('landmark-shape')
        if (this.keyPointCanvas.markCanvas.shapeSelected) {
            // 已选择对象，编辑模式，退出编辑模式
            this.keyPointCanvas.markCanvas.shapeSelectedExitBeforeEvent!.next(this.keyPointCanvas.markCanvas.shapeSelected)
            this.keyPointCanvas.markCanvas.shapeSelected = null
            this.keyPointCanvas.markCanvas.shapeSelectedExitAfterEvent!.next({})
        } else {
            // 执行 保存
            this.keyPointCanvas.markModeSave()
        }
        // 开启 对象选择功能
        this.keyPointCanvas.markCanvas.shapeSelectPlan = this.keyPointCanvas.markCanvas.shapePoints
        // 开启 对 双击事件 的过滤
        this.keyPointCanvas.markCanvas.pointsCreateDBClickOrClick = true
        // 开启 标注功能（新颜色）
        this.mark()
    }

    // 更新绘制点
    updatePoint(index: number) {
        this.setState({index});
        this.keyPointCanvas.updatePoint(index)
    }

    // 回显
    setData(shap: ShapePointData[]) {
        this.keyPointCanvas.markCanvas.loadShapePoint!(shap)
    }

    // 获取数据
    getData() {
        return this.keyPointCanvas.getData()
    }

    // 禁用
    close() {
        this.save()
        this.keyPointCanvas.closeMarkMode()
    }
    // 开启
    open() {
        // 开启 对象选择功能
        this.keyPointCanvas.markCanvas.shapeSelectPlan = this.keyPointCanvas.markCanvas.shapePoints
        // 开启 对 双击事件 的过滤
        this.keyPointCanvas.markCanvas.pointsCreateDBClickOrClick = true
        // 开启 标注功能（新颜色）
        this.mark()
    }
}

export default LandmarkScene;