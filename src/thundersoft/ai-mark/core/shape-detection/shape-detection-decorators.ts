import { AiMarkInterface, Line, LineDetectionData, ShapeSegmentationData } from '..';
import { fromEvent, Subject, merge } from 'rxjs';
import { Point } from '../point/index';
import { RatioCalculation } from '../util/shape-calculation';
import { ShapeDetectionData } from './index';
import { filter } from 'rxjs/operators';

/**
 * ShapeDetectionDecorators
 */

export function ShapeDetectionDecorators<T extends new (...args: any[]) => AiMarkInterface>(
  constructor: T,
) {
  return class extends constructor {
    /**
     * 对象集合
     */
    shapeDetections?: ShapeDetectionData[] = [];

    /**
     * 正在绘制的矩形
     */
    shapeDetectionDrawing: ShapeDetectionData | null = null;

    /**
     * 点结束移动事件
     */
    shapeDetectionCreateSuccess?: Subject<ShapeDetectionData> = new Subject<ShapeDetectionData>();

    /**
     * 矩形绘制 参数 (非空则开启绘制功能)
     */
    shapeDetectionSource: ShapeDetectionData | null = null;
    /**
     * 对象集合
     */
    lineDetections?: LineDetectionData[] = [];

    /**
     * 正在绘制的线
     */
    lineDetectionDrawing: LineDetectionData | null = null;

    /**
     * 点结束移动事件
     */
    lineDetectionCreateSuccess?: Subject<LineDetectionData> = new Subject<LineDetectionData>();

    /**
     * 线绘制 参数 (非空则开启绘制功能)
     */
    lineDetectionSource: LineDetectionData | null = null;

    /**
     * 点形集合
     */
    shapeSegmentations?: ShapeSegmentationData[] = [];

    // 当前处于编辑状态的点形id
    currentShapeSegmentation: ShapeSegmentationData | null = null;

    lineDrawing: Array<any> = [];

    /**
     * 点图绘制成功事件
     */
    shapeSegmentationDrawSuccessEvent: Subject<{
      option: ShapeSegmentationData;
      shape: ShapeSegmentationData;
    }> = new Subject<{
      option: ShapeSegmentationData;
      shape: ShapeSegmentationData;
    }>();

    /**
     * 点图绘制成功结束
     */
    shapeSegmentationDrawEndEvent: Subject<{
      option: ShapeSegmentationData;
      shape: ShapeSegmentationData;
    }> = new Subject<{
      option: ShapeSegmentationData;
      shape: ShapeSegmentationData;
    }>();

    /**
     * 点添加成功事件
     */
    shapeSegmentationDrawAddEvent: Subject<{
      point: Point;
      shape: ShapeSegmentationData;
    }> = new Subject<{ point: Point; shape: ShapeSegmentationData }>();

    /**
     * 通知检查点数据事件
     */
    notifyCheckPoint: Subject<{
      point: Point;
      shape: ShapeSegmentationData;
      option: ShapeSegmentationData;
    }> = new Subject<{
      point: Point;
      shape: ShapeSegmentationData;
      option: ShapeSegmentationData;
    }>();

    /**
     * 通知检查点数据事件
     */
    notifyMessage: Subject<any> = new Subject<any>();

    /**
     * @override 方法重写 super.init
     * @param el
     * @param url
     * @param args
     */
    init(el: HTMLElement, ...args: any[]): any {
      let result = super.init(el, ...args);
      this.shapeHoverBackground = true;
      // 绘制矩形点
      this.drawShapeDetection();
      this.drawLineDetection();
      return { ...result };
    }

    /**
     * 进入绘制模式：画点
     * @param rules
     */
    shapeDetectionDrawOption(option: ShapeDetectionData) {
      // 计算 labelCole
      option.labelColor = this.getLabelCole!(option.color!);
      // 创建当前图形
      this.shapeDetectionSource = option;
    }
    /**
     * 进入绘制模式：画点
     * @param rules
     */
    lineDetectionDrawOption(line: LineDetectionData) {
      // // 计算 labelCole
      // option.labelColor = this.getLabelCole!(option.color!)
      // 创建当前图形
      this.lineDetectionSource = line;
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
      const tanglea = Math.atan2(endpoint.y - startpoint.y, endpoint.x - startpoint.x);
      // 左侧箭头线坐标x
      const arrowleftx = endpoint.x - arrowlen * Math.cos(tanglea + (20 * Math.PI) / 180);
      // 左侧箭头线坐标y
      const arrowlefty = endpoint.y - arrowlen * Math.sin(tanglea + (20 * Math.PI) / 180);
      // 右侧箭头线坐标x
      const arrowrightx = endpoint.x - arrowlen * Math.cos(tanglea - (20 * Math.PI) / 180);
      // 右侧箭头线坐标y
      const arrowrighty = endpoint.y - arrowlen * Math.sin(tanglea - (20 * Math.PI) / 180);
      // 左侧箭头开始坐标
      let arrowLineLeftPoint: Point = {
        id: Symbol('aPointId'),
        x: arrowleftx,
        y: arrowlefty,
        source: {},
      };
      // 右侧箭头开始坐标
      let arrowLineRightPoint: Point = {
        id: Symbol('aPointId'),
        x: arrowrightx,
        y: arrowrighty,
        source: {},
      };
      // 返回箭头线的两个开始点集合
      return [arrowLineLeftPoint, arrowLineRightPoint];
    }
    /**
     * 垂直线坐标计算处理
     * @param startpoint 开始点
     * @param endpoint 结束点
     * @returns 垂直线开始结束坐标
     */
    verticaladd(startpoint: Point, endpoint: Point) {
      // 垂直竖线结束点坐标逻辑
      const angleBad = Math.abs(Math.atan2(endpoint.y - startpoint.y, endpoint.x - startpoint.x));
      console.info('angleBad:' + angleBad);
      const angleEa = (90 * Math.PI) / 180 - (angleBad + (20 * Math.PI) / 180);
      console.info('angleEa:' + angleEa);

      const pa =
        angleBad !== 0
          ? Math.abs((endpoint.y - startpoint.y) / Math.sin(angleBad) / 2)
          : Math.abs(endpoint.x - startpoint.x);

      console.info('pa:' + pa);
      const ae = pa / Math.cos((20 * Math.PI) / 180);
      console.info('ae:' + ae);
      // x坐标在和x轴平行和非平行的处理逻辑，平行时候直接中点x坐标，非平行时候通过角度取得
      const x =
        angleBad !== 0
          ? startpoint.x + ae * Math.sin(angleEa)
          : Math.abs(startpoint.x + endpoint.x) / 2;

      console.info('x:' + x);

      // 中垂线方程
      const leftFormula1 = (startpoint.y + endpoint.y) / 2;
      console.info('leftFormula1:' + leftFormula1);
      const leftFormula2 = (startpoint.x - endpoint.x) / (startpoint.y - endpoint.y);
      console.info('leftFormula2:' + leftFormula2);
      const leftFormula3 = (startpoint.x + endpoint.x) / 2;
      console.info('leftFormula3:' + leftFormula3);
      // 获取y点坐标
      const y = -leftFormula2 * (x - leftFormula3) + leftFormula1;

      console.info('y:' + y);

      // 垂直线结束点坐标
      let verticalLineEndPoint: Point = {
        id: Symbol('vPointId'),
        x: x,
        y: y,
        source: {},
      };
      // 垂线开始点x
      const vstartx = startpoint!.x + endpoint!.x - verticalLineEndPoint.x;
      // 垂线开始点y
      const vstarty = startpoint!.y + endpoint!.y - verticalLineEndPoint.y;
      // 垂直线开始点坐标
      let verticalLineStartPoint: Point = {
        id: Symbol('vPointId'),
        x: vstartx,
        y: vstarty,
        source: {},
      };
      // 返回垂线开始结束点
      return [verticalLineStartPoint, verticalLineEndPoint];
    }
    /**
     * 绘制线
     */
    drawLineDetection() {
      // 所有图形都设为可选的
      this.lineSelectPlan = this.lineDetections;
      // 鼠标左键按下
      this.destroy.push(
        this.canvasElementEvents!.mousedown.pipe(
          filter((event: any) => event.button === 0),
        ).subscribe((e): any => {
          // 线Hover
          if (this.pointHover) return;
          // 线绘制 参数
          if (!this.lineDetectionSource) return;
          // 点在图片上的判断
          if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return;
          // 绘制开始点
          let startPoint: Point = {
            id: Symbol('PointId'),
            x: e.offsetX,
            y: e.offsetY,
            source: {
              color: this.lineDetectionSource.config.color,
              x: RatioCalculation(
                e.offsetX - this.imageStartPoint!.x,
                this.canvasZoom,
                this.accuracy,
              ),
              y: RatioCalculation(
                e.offsetY - this.imageStartPoint!.y,
                this.canvasZoom,
                this.accuracy,
              ),
            },
          };
          this.lineDetectionDrawing = {
            shapeId: 'lineDetection:' + new Date().getTime() + Math.round(Math.random() * 10000),
            ...this.lineDetectionSource,
            startPoint,
          };
          this.lineSelected = this.lineDetectionDrawing;
        }),
      );
      // 鼠标左键按下 拖动 绘制线
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe((e) => {
          // 正在绘制的线
          if (!this.lineDetectionDrawing) return;
          // 点在图片上的判断
          if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return;
          // 绘制结束点
          let endPoint: Point = {
            id: Symbol('PointId'),
            x: e.offsetX,
            y: e.offsetY,
            source: {
              ...this.lineDetectionDrawing.startPoint.source,
              x: RatioCalculation(
                e.offsetX - this.imageStartPoint!.x,
                this.canvasZoom,
                this.accuracy,
              ),
              y: RatioCalculation(
                e.offsetY - this.imageStartPoint!.y,
                this.canvasZoom,
                this.accuracy,
              ),
            },
          };
          Object.assign(this.lineDetectionDrawing, {
            endPoint,
            point: [this.lineDetectionDrawing.startPoint!, endPoint],
          });
          const lines: Line[] = [];
          lines.push({
            start: this.lineDetectionDrawing.point![0],
            end: this.lineDetectionDrawing.point![1],
            config: {
              color: this.lineDetectionDrawing.config!.color,
              width: this.lineDetectionDrawing.config!.width,
            },
          });

          // if (this.lineDetectionDrawing.config!.hasVerticle) {
          // 获取垂直线坐标
          const vPoints = this.verticaladd(
            this.lineDetectionDrawing.startPoint,
            this.lineDetectionDrawing.endPoint,
          );
          // 追加到线集合
          if (localStorage.getItem('id') !== 'nlprdetection') {
            lines.push({
              start: vPoints[0],
              end: vPoints[1],
              config: {
                color: this.lineDetectionDrawing.config!.color,
                width: this.lineDetectionDrawing.config!.width,
              },
            });
          }
          const arrow = this.arrowadd(vPoints[0], vPoints[1]);
          if (localStorage.getItem('id') !== 'nlprdetection') {
            // 追加到线集合
            lines.push({
              start: arrow[0],
              end: vPoints[1],
              config: {
                color: this.lineDetectionDrawing.config!.color,
                width: this.lineDetectionDrawing.config!.width,
              },
            });
            // 追加到线集合
            lines.push({
              start: arrow[1],
              end: vPoints[1],
              config: {
                color: this.lineDetectionDrawing.config!.color,
                width: this.lineDetectionDrawing.config!.width,
              },
            });
          }
          // }
          // 最终设置到画线集合
          // this.linesMap.set('linedetection', lines);
          // 绘制线上点
          this.points = this.lineDetectionDrawing.point;
          // FIXME: lgj 此处临时处理，有待重构
          this.lineDrawing = lines;
        }),
      );
      // 鼠标左键抬起 线绘制完成
      this.destroy.push(
        fromEvent(window, 'mouseup').subscribe(() => {
          if (this.lineDetectionDrawing) {
            // this.lineDetections.push(this.lineDetectionDrawing);
            // this.lineDetectionCreateSuccess.next(this.lineDetectionDrawing);
            // FIXME: lgj 此处临时处理，有待重构
            this.lineDetections?.push(this.lineDrawing);
          }
          this.points = [];
          this.pointSelectedPlan = [];
          this.pointDragPlan = [];
          this.lineDetectionDrawing = null;
          this.lineDrawing = [];
        }),
      );
    }
    /**
     * 绘制矩形
     * @param element
     */
    drawShapeDetection() {
      // 所有图形都设为可选的
      this.shapeSelectPlan = this.shapeDetections;
      // 鼠标左键按下
      this.destroy.push(
        this.canvasElementEvents!.mousedown.pipe(
          filter((event: any) => event.button === 0),
        ).subscribe((e): any => {
          // 矩形Hover
          if (this.pointHover) return;
          // 矩形绘制 参数
          if (!this.shapeDetectionSource) return;
          // 点在图片上的判断
          if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return;
          // 绘制开始点
          let startPoint: Point = {
            id: Symbol('PointId'),
            x: e.offsetX,
            y: e.offsetY,
            source: {
              color: this.shapeDetectionSource.color,
              labelColor: this.shapeDetectionSource.labelColor,
              x: RatioCalculation(
                e.offsetX - this.imageStartPoint!.x,
                this.canvasZoom,
                this.accuracy,
              ),
              y: RatioCalculation(
                e.offsetY - this.imageStartPoint!.y,
                this.canvasZoom,
                this.accuracy,
              ),
            },
          };
          this.shapeDetectionDrawing = {
            shapeId: 'shapDetection:' + new Date().getTime() + Math.round(Math.random() * 10000),
            ...this.shapeDetectionSource,
            startPoint,
          };
          this.shapeSelected = this.shapeDetectionDrawing;
        }),
      );
      // 鼠标左键按下 拖动 绘制矩形
      this.destroy.push(
        this.canvasElementEvents!.mousemove.subscribe((e) => {
          // 正在绘制的矩形
          if (!this.shapeDetectionDrawing) return;
          // 点在图片上的判断
          if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) return;
          // 绘制结束点
          let endPint: Point = {
            id: Symbol('PointId'),
            x: e.offsetX,
            y: e.offsetY,
            source: {
              ...this.shapeDetectionDrawing.startPoint.source,
              x: RatioCalculation(
                e.offsetX - this.imageStartPoint!.x,
                this.canvasZoom,
                this.accuracy,
              ),
              y: RatioCalculation(
                e.offsetY - this.imageStartPoint!.y,
                this.canvasZoom,
                this.accuracy,
              ),
            },
          };
          Object.assign(this.shapeDetectionDrawing, {
            endPint,
            point: [
              this.shapeDetectionDrawing.startPoint!,
              {
                id: Symbol('PointId'),
                x: endPint.x!,
                y: this.shapeDetectionDrawing.startPoint!.y!,
                source: {
                  ...this.shapeDetectionDrawing.startPoint.source,
                  x: endPint!.source.x!,
                  y: this.shapeDetectionDrawing.startPoint!.source.y!,
                },
              },
              endPint,
              {
                id: Symbol('PointId'),
                x: this.shapeDetectionDrawing.startPoint!.x!,
                y: endPint.y!,
                source: {
                  ...this.shapeDetectionDrawing.startPoint.source,
                  x: this.shapeDetectionDrawing.startPoint!.source.x!,
                  y: endPint!.source.y!,
                },
              },
            ],
          });

          this.points = this.shapeDetectionDrawing.point;
        }),
      );
      // 鼠标左键抬起 矩形绘制完成
      this.destroy.push(
        fromEvent(window, 'mouseup').subscribe(() => {
          if (this.shapeDetectionDrawing) {
            // 矩形 最长边 小于 10px 则忽略
            if (
              this.shapeDetectionDrawing.maxX! - this.shapeDetectionDrawing.minX! > 10 ||
              this.shapeDetectionDrawing.maxY! - this.shapeDetectionDrawing.minY! > 10
            ) {
              this.shapeDetections.push(this.shapeDetectionDrawing);
              this.shapeDetectionCreateSuccess.next(this.shapeDetectionDrawing);
            } else {
              this.shapeSelected = null;
              this.points = [];
              this.pointSelectedPlan = [];
              this.pointDragPlan = [];
            }
          }
          this.shapeDetectionDrawing = null;
        }),
      );
    }

    /**
     * 进入绘制模式：画点
     * @param rules
     */
    shapeSegmentationDrawing(option: ShapeSegmentationData) {
      this.pointSource = null;
      // 计算 labelCole
      option.labelColor = this.getLabelCole!(option.color!);
      // 创建当前图形
      if (option === this.shapeSelected) {
        this.currentShapeSegmentation = this.shapeSelected;
      } else {
        this.currentShapeSegmentation = {
          ...option,
          // 点集合
          point: option.point || [],
          // 生成一个唯一Id
          shapeId:
            option.shapeId ||
            'shapPoint:' + new Date().getTime() + Math.round(Math.random() * 10000),
        };
        // 开启点的绘制
        this.pointSource = {
          color: option.color,
          labelColor: option.labelColor,
          shapeId: this.currentShapeSegmentation!.shapeId,
        };
      }
      // 点显示
      this.pointsMap.set(
        this.currentShapeSegmentation!.shapeId!,
        this.currentShapeSegmentation!.point!,
      );
      this.currentShapeSegmentation.point.forEach((p) => (p.invalid = false));
      // 点选择/点移动
      this.pointDragPlan = this.pointSelectedPlan = this.currentShapeSegmentation.point;
      // 点添加
      this.destroyMap.get('ShapeSegmentationDecorators1') &&
        this.destroyMap.get('ShapeSegmentationDecorators1').forEach((d) => d.unsubscribe());
      this.destroyMap.set('ShapeSegmentationDecorators1', [
        this.pointsCreateByMouseClickBeforeEvent!.subscribe((point) => {
          if (this.getShapeUp()) {
            this.notifyMessage.next();
            return;
          }
          if (this.currentShapeSegmentation) {
            if (this.currentShapeSegmentation.point.length > 1) {
              // 当点击当前图形起始点自动闭合图形

              if (this.isRange(point, this.currentShapeSegmentation.point[0])) {
                this.pointSource = null;
                this.shapeSegmentationDrawSuccessEvent.next({
                  option,
                  shape: this.currentShapeSegmentation,
                });
              } else {
                this.notifyCheckPoint.next({
                  point,
                  shape: this.currentShapeSegmentation,
                  option,
                });
              }
            } else {
              this.pointSelected = null;
              this.currentShapeSegmentation.point.push(point);
              this.shapeSegmentationDrawAddEvent.next({
                point: point,
                shape: this.currentShapeSegmentation,
              });
            }

            // if (this.currentShapeSegmentation.point.length === 10) {

            // this.pointSource = null;
            // this.shapeSegmentationDrawSuccessEvent.next({
            //   option,
            //   shape: this.currentShapeSegmentation,
            // });
            // }
          } else {
            // 无效的点
            point.invalid = true;
          }
        }),
      ]);
      // 双击绘制结束
      this.destroyMap.get('ShapeSegmentationDecorators2') &&
        this.destroyMap.get('ShapeSegmentationDecorators2').forEach((d) => d.unsubscribe());
      this.destroyMap.set('ShapeSegmentationDecorators2', [
        merge(
          // 鼠标左键双击
          this.canvasElementEvents.leftDBClick!,
          // 键盘 enter
          fromEvent(document, 'keydown').pipe(filter((e: any) => e.keyCode === 13)),
        ).subscribe(() => {
          if (this.currentShapeSegmentation) {
            if (this.getShapeUp()) {
              this.notifyMessage.next();
              return;
            }
            if (this.shapeHover || this.shapeSelected || this.pointHover) {
              return;
            } else {
              this.pointHover = null;
              if (this.shapeSegmentations.includes(this.currentShapeSegmentation)) {
                this.pointSelected = null;
              } else if (this.currentShapeSegmentation.point!.length > 2) {
                // this.notifyCheckPoint.next({
                //   option,
                //   shape: this.currentShapeSegmentation,
                // });
                this.pointSource = null;
                this.shapeSegmentationDrawSuccessEvent.next({
                  option,
                  shape: this.currentShapeSegmentation,
                });
              } else {
                this.currentShapeSegmentation.point.splice(0);
              }
              this.shapeSegmentationDrawEndEvent.next({
                option,
                shape: this.currentShapeSegmentation,
              });
              this.points = [];
            }
          }
        }),
      ]);

      // this.destroy.push(
      //   this.canvasElementEvents!.mousemove.subscribe((e) => {
      //     // 正在绘制的线
      //     if (!this.currentShapeSegmentation) {
      //       return;
      //     }
      //     // 点在图片上的判断
      //     if (!this.imageRangeOnXY!(e.offsetX, e.offsetY)) {
      //       return;
      //     }
      //     if (this.currentShapeSegmentation.point.length > 2) {
      //       const point = this.currentShapeSegmentation.point[0];
      //       if (this.isRange({ x: e.offsetX, y: e.offsetY }, point)) {
      //         this.pointSource = null;
      //         this.shapeSegmentationDrawSuccessEvent.next({
      //           option,
      //           shape: this.currentShapeSegmentation,
      //         });
      //       } else {
      //         console.log("bu zai");
      //       }
      //     }
      //   })
      // );
      return this.currentShapeSegmentation;
    }

    /**
     * 图形个数上线
     */
    getShapeUp() {
      const a = this.shapeDetections.length;
      const b = this.shapeSegmentations.length;
      return a + b >= 4;
    }

    // 判断当前鼠标在某个点的范围
    isRange(point1, point2) {
      const offset = 5;
      if (
        point1.x < point2.x - offset ||
        point1.x > point2.x + offset ||
        point1.y < point2.y - offset ||
        point1.y > point2.y + offset
      ) {
        return false;
      }
      return true;
    }
  };
}
