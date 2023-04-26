import { fromEvent, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { AiMarkInterface, Line, Point, RatioCalculation } from "..";
import { LineDetectionData } from "./line-detection-model";
/**
 * LineDetectionDecorators
 */
export function LineDetectionDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

        /**
         * 对象集合
         */
        lineDetections?: LineDetectionData[] = []

        /**
         * 正在绘制的线
         */
        lineDetectionDrawing: LineDetectionData | null = null

        /**
         * 点结束移动事件
         */
        lineDetectionCreateSuccess?: Subject<LineDetectionData> = new Subject<LineDetectionData>()

        /**
         * 线绘制 参数 (非空则开启绘制功能)
         */
        lineDetectionSource: LineDetectionData | null = null


        /**
         * @override 方法重写 super.init
         * @param el 
         * @param url 
         * @param args 
         */
        init(el: HTMLElement, ...args: any[]): any {
            let result = super.init(el, ...args)
            this.shapeHoverBackground = true;
            // 绘制线点
            this.drawLineDetection()
            return {...result}
        }


        /**
         * 进入绘制模式：画点
         * @param rules
         */
        lineDetectionDrawOption(line: LineDetectionData) {
            // // 计算 labelCole
            // option.labelColor = this.getLabelCole!(option.color!)
            // 创建当前图形
            this.lineDetectionSource = line
        }
        /**
         * 箭头开始点计算处理
         * @param startpoint 开始点
         * @param endpoint 结束点
         * @returns 箭头开始点坐标集合
         */
        arrowadd(startpoint: Point, endpoint: Point) {
            // 追加中垂线箭头
            // 箭头线长度
            const arrowlen = 20;
            // 正切角度
            const tanglea = Math.atan2((endpoint.y - startpoint.y), (endpoint.x - startpoint.x))
            // 左侧箭头线坐标x
            const arrowleftx = endpoint.x - arrowlen * Math.cos(tanglea + 30 * Math.PI / 180);
            // 左侧箭头线坐标y
            const arrowlefty = endpoint.y - arrowlen * Math.sin(tanglea + 30 * Math.PI / 180);
            // 右侧箭头线坐标x
            const arrowrightx = endpoint.x - arrowlen * Math.cos(tanglea - 30 * Math.PI / 180);
            // 右侧箭头线坐标y
            const arrowrighty = endpoint.y - arrowlen * Math.sin(tanglea - 30 * Math.PI / 180);
            // 左侧箭头开始坐标
            let arrowLineLeftPoint: Point = {
                id: Symbol('aPointId'),
                x: arrowleftx,
                y: arrowlefty,
                source: {
                }
            }
            // 右侧箭头开始坐标
            let arrowLineRightPoint: Point = {
                id: Symbol('aPointId'),
                x: arrowrightx,
                y: arrowrighty,
                source: {
                }
            }
            // 返回箭头线的两个开始点集合
            return [arrowLineLeftPoint, arrowLineRightPoint]

        }
        /**
         * 垂直线坐标计算处理
         * @param startpoint 开始点
         * @param endpoint 结束点
         * @returns 垂直线开始结束坐标
         */
         verticaladd(startpoint: Point, endpoint: Point) {
            // 追加中垂线箭头
            // 箭头线长度
            const arrowlen = 20;
            // 正切角度
            const tanglea = Math.atan2((endpoint.y - startpoint.y), (endpoint.x - startpoint.x))
            // 左侧箭头线坐标x
            const arrowleftx = endpoint.x - arrowlen * Math.cos(tanglea + 30 * Math.PI / 180);
            // 左侧箭头线坐标y
            const arrowlefty = endpoint.y - arrowlen * Math.sin(tanglea + 30 * Math.PI / 180);
            // 右侧箭头线坐标x
            const arrowrightx = endpoint.x - arrowlen * Math.cos(tanglea - 30 * Math.PI / 180);
            // 右侧箭头线坐标y
            const arrowrighty = endpoint.y - arrowlen * Math.sin(tanglea - 30 * Math.PI / 180);
            // 左侧箭头开始坐标
            let arrowLineLeftPoint: Point = {
                id: Symbol('aPointId'),
                x: arrowleftx,
                y: arrowlefty,
                source: {
                }
            }
            // 右侧箭头开始坐标
            let arrowLineRightPoint: Point = {
                id: Symbol('aPointId'),
                x: arrowrightx,
                y: arrowrighty,
                source: {
                }
            }
            // 返回箭头线的两个开始点集合
            return [arrowLineLeftPoint, arrowLineRightPoint]

        }
        /**
         * 绘制线
         * @param element 
         */
        drawLineDetection() {
            // 所有图形都设为可选的
            this.lineSelectPlan = this.lineDetections
            // 鼠标左键按下
            this.destroy.push(
            this.canvasElementEvents!.mousedown.pipe(filter((event: any) => event.button === 0)).subscribe((e): any => {
                // 线Hover
                if (this.pointHover) return
                // 线绘制 参数
                if (!this.lineDetectionSource) return
                // 点在图片上的判断
                if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return
                // 绘制开始点
                let startPoint: Point = {
                    id: Symbol('PointId'),
                    x: e.offsetX, 
                    y: e.offsetY,
                    source: {
                        color: this.lineDetectionSource.config.color,
                        x: RatioCalculation((e.offsetX - this.imageStartPoint!.x), this.canvasZoom, this.accuracy),
                        y: RatioCalculation((e.offsetY - this.imageStartPoint!.y), this.canvasZoom, this.accuracy),
                    }
                }
                this.lineDetectionDrawing = {
                    shapeId: 'lineDetection:' + (new Date()).getTime() + Math.round(Math.random() * 10000),
                    ...this.lineDetectionSource,
                    startPoint
                }
                this.lineSelected = this.lineDetectionDrawing
            })
            )
            // 鼠标左键按下 拖动 绘制线
            this.destroy.push(
            this.canvasElementEvents!.mousemove.subscribe(e => {
                // 正在绘制的线
                if (!this.lineDetectionDrawing) return
                // 点在图片上的判断
                if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return
                // 绘制结束点
                let endPoint: Point = {
                    id: Symbol('PointId'),
                    x: e.offsetX,
                    y: e.offsetY,
                    source: {
                        ...this.lineDetectionDrawing.startPoint.source,
                        x: RatioCalculation((e.offsetX - this.imageStartPoint!.x), this.canvasZoom, this.accuracy),
                        y: RatioCalculation((e.offsetY - this.imageStartPoint!.y), this.canvasZoom, this.accuracy),
                    }
                }
                Object.assign(this.lineDetectionDrawing, {
                endPoint,
                point: [
                        this.lineDetectionDrawing.startPoint!, 
                        endPoint
                    ]
                })
                const lines: Line[] = [];
                lines.push({ start: this.lineDetectionDrawing.point![0], 
                             end: this.lineDetectionDrawing.point![1], 
                             config: {color: this.lineDetectionDrawing.config!.color,
                                      width: this.lineDetectionDrawing.config!.width}})
                
                
                if (true) {
                    // 垂直竖线开始点坐标
                    let verticalLineStartPoint: Point = {
                        id: Symbol('vPointId'),
                        x: (this.lineDetectionDrawing.startPoint.x + this.lineDetectionDrawing.endPoint.x) / 2 ,
                        y: (this.lineDetectionDrawing.startPoint.y + this.lineDetectionDrawing.endPoint.y) / 2 ,
                        source: {
                        }
                    }

                    // 垂直竖线结束点坐标逻辑
                    const angleBad = Math.abs(Math.atan2((this.lineDetectionDrawing.endPoint.y - this.lineDetectionDrawing.startPoint.y),
                                                (this.lineDetectionDrawing.endPoint.x - this.lineDetectionDrawing.startPoint.x)));
                    console.info('angleBad:' + angleBad);
                    const angleEa = 90 * Math.PI / 180 - (angleBad + 30 * Math.PI / 180);
                    console.info('angleEa:' + angleEa);

                    const pa = angleBad !== 0 ? Math.abs((this.lineDetectionDrawing.endPoint.y - 
                                                         this.lineDetectionDrawing.startPoint.y)/ 
                                                         Math.sin(angleBad) / 2) : 
                                                         Math.abs(this.lineDetectionDrawing.endPoint.x - this.lineDetectionDrawing.startPoint.x);

                    console.info('pa:' + pa);
                    const ae = pa / Math.cos(30 * Math.PI / 180);
                    console.info('ae:' + ae);
                    // x坐标在和x轴平行和非平行的处理逻辑，平行时候直接中点x坐标，非平行时候通过角度取得
                    const x = angleBad !== 0 ? this.lineDetectionDrawing.startPoint.x + ae * Math.sin(angleEa) : 
                    Math.abs(this.lineDetectionDrawing.startPoint.x + this.lineDetectionDrawing.endPoint.x) / 2;

                    console.info('x:' + x);

                    // 中垂线方程
                    const leftFormula1 = (this.lineDetectionDrawing.startPoint.y + this.lineDetectionDrawing.endPoint.y) / 2;
                    console.info('leftFormula1:' + leftFormula1);
                    const leftFormula2 = (this.lineDetectionDrawing.startPoint.x - this.lineDetectionDrawing.endPoint.x) / 
                                          (this.lineDetectionDrawing.startPoint.y - this.lineDetectionDrawing.endPoint.y);
                    console.info('leftFormula2:' + leftFormula2);
                    const leftFormula3 = (this.lineDetectionDrawing.startPoint.x + this.lineDetectionDrawing.endPoint.x) / 2;
                    console.info('leftFormula3:' + leftFormula3);

                    // 获取y点坐标
                    const y = -leftFormula2 * (x - leftFormula3) + leftFormula1;
                    
                    console.info('y:' + y);
                    
                    // 垂直线结束点坐标
                    let verticalLineEndPoint: Point = {
                        id: Symbol('vPointId'),
                        x: x,
                        y: y,
                        source: {
                        }
                    }
                    // 追加到线集合
                    lines.push({ start: verticalLineStartPoint, 
                                 end: verticalLineEndPoint, 
                                 config: {
                                    color: this.lineDetectionDrawing.config!.color,
                                    width: this.lineDetectionDrawing.config!.width
                                 }
                                })

                    const arrow = this.arrowadd(verticalLineStartPoint, verticalLineEndPoint);
                   
                    // 追加到线集合
                    lines.push({ start: arrow[0],
                                end: verticalLineEndPoint,
                                config: {
                                    color: this.lineDetectionDrawing.config!.color,
                                    width: this.lineDetectionDrawing.config!.width
                                }
                       })
                    // 追加到线集合
                    lines.push({ start: arrow[1],
                                end: verticalLineEndPoint,
                                config: {
                                    color: this.lineDetectionDrawing.config!.color,
                                    width: this.lineDetectionDrawing.config!.width
                                }
                        })
                }
                // 最终设置到画线集合
                this.linesMap.set('linedetection', lines);
                // 绘制线上点
                this.points = this.lineDetectionDrawing.point;
            })
            )
            // 鼠标左键抬起 线绘制完成
            this.destroy.push(
            fromEvent(window, 'mouseup').subscribe(() => {
                if (this.lineDetectionDrawing) {
                    this.lineDetections.push(this.lineDetectionDrawing)
                    this.lineDetectionCreateSuccess.next(this.lineDetectionDrawing)
                }
                this.points = []
                this.pointSelectedPlan = []
                this.pointDragPlan = []
                this.lineDetectionDrawing = null
            })
            )
        }
    }
    
}