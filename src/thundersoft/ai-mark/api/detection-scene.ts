import { fromEvent, Subject, Subscription } from 'rxjs';
import {
  AiMarkInterface,
  MarkCanvasBaseClass,
  ShapeDetectionData,
  MarkShapeDetectionDecorators,
  Shape,
  Line,
  LineDetectionData,
  ShapeSegmentationData,
} from '../core';

// 如果是同一图片，则联动显示
let imageId: any = '',
  aimarkArray: AiMarkInterface[] = [],
  eventSubject: (Subscription | undefined)[] = [],
  imageChange = (url: any, aimark: AiMarkInterface) => {
    // console.log('ai mark => imageChange', url, aimark)
    imageId = url;
    aimarkArray = [aimark];
    eventSubject.forEach((d) => d.unsubscribe());
    eventSubject = [];
  },
  imageCopy = (aimark: AiMarkInterface) => {
    // console.log('ai mark => imageCopy', aimark)
    eventSubject.push(
      aimark.imageChangeEvent!.subscribe((s) => {
        aimarkArray[0].imageStartPoint = aimark.imageStartPoint;
        aimarkArray[0].canvasZoom = aimark.canvasZoom;
      }),
    );
    eventSubject.push(
      aimarkArray[0].imageChangeEvent!.subscribe((s) => {
        aimark.imageStartPoint = aimarkArray[0].imageStartPoint;
        aimark.canvasZoom = aimarkArray[0].canvasZoom;
      }),
    );
    aimarkArray.push(aimark);
  };
@MarkShapeDetectionDecorators
class AiMark extends MarkCanvasBaseClass {}

export class DetectionScene {
  // 画布对象
  markCanvas: AiMarkInterface = new AiMark();

  destroyEvent: (Subscription | undefined)[] = [];

  /**
   * 对象删除事件
   */
  deleteShapeEvent: Subject<Shape> = new Subject<Shape>();
  curShapeCreateCofig: ShapeSegmentationData | null = null;
  /**
   * 对象删除事件
   */
  deleteLineEvent: Subject<Line> = new Subject<Line>();
  constructor(el: HTMLElement, url?: string, markData: any[] = []) {
    if (imageId === url && aimarkArray.length === 1) {
      imageCopy(this.markCanvas);
    } else {
      imageChange(url, this.markCanvas);
    }
    this.markCanvas.destroyMap.set('scene', this.destroyEvent);
    this.markCanvas.init(el, url);
    this.setData(markData);
    this.setLineData(markData);
    // 监听键盘 删除键
    this.destroyEvent.push(
      fromEvent(document, 'keydown').subscribe((e: any) => {
        // backspace: 8   delete:46
        if (e.keyCode === 8 || e.keyCode === 46) {
          // 删除选中的对象或者点
          this.deleteSelected();
          // 删除选中的对象或者点
          this.deleteLineSelected();
        }
      }),
    );

    // 新标注对象 绘制成功
    this.destroyEvent.push(
      this.markCanvas.shapeSegmentationDrawEndEvent.subscribe((d) => {
        // 所有图形都设为 可选的
        this.markCanvas.shapeSelectPlan = [
          ...this.markCanvas.shapeSegmentations,
          ...this.markCanvas.shapeDetections,
        ];
        // // 开启对 双击事件 的过滤
        // this.markCanvas.pointsCreateDBClickOrClick = true
        if (this.curShapeCreateCofig) {
          this.openPolygonMode(this.curShapeCreateCofig);
        }
      }),
    );
    // 对象绘制成功之后，立刻 保存，开启新对象的绘制
    this.destroyEvent.push(
      this.markCanvas.shapeSegmentationDrawSuccessEvent.subscribe((e) => {
        this.markModeSave();
        // 开启新对象的绘制
        this.markForShape(e.option);
      }),
    );
  }

  destroy() {
    // 消除 上一次 init 订阅的事件
    this.markCanvas.destroyMap.forEach((ds) => ds.forEach((d) => d.unsubscribe()));
    this.destroyEvent.forEach((d) => d.unsubscribe());
  }
  /**
   * 删除选中的对象
   */
  deleteLineSelected() {
    // 删除对象
    // 删除形状
    this.markCanvas.lineDetections.splice(
      this.markCanvas.lineDetections.indexOf(this.markCanvas.lineSelected),
      1,
    );
    // 删除形状的点和线
    this.markCanvas.pointsMap.clear();
    this.markCanvas.linesMap.clear();
    this.markCanvas.pointClearDoing!();

    // 事件 通知
    this.deleteLineEvent.next(this.markCanvas.lineSelected);

    // 删除选中的对象
    this.markCanvas.lineSelected = null;
  }
  /**
   * 删除选中的对象
   */
  deleteSelected() {
    // 删除对象
    if (this.markCanvas.shapeSelected) {
      // 删除形状
      this.markCanvas.shapeDetections.splice(
        this.markCanvas.shapeDetections.indexOf(this.markCanvas.shapeSelected),
        1,
      );
      // 删除形状的点和线
      this.markCanvas.pointsMap.delete(this.markCanvas.shapeSelected.shapeId!);
      this.markCanvas.linesMap.delete(this.markCanvas.shapeSelected.shapeId!);
      this.markCanvas.pointClearDoing!();

      // 事件 通知
      this.deleteShapeEvent.next(this.markCanvas.shapeSelected);

      // 删除选中的对象
      this.markCanvas.shapeHover = null;
      this.markCanvas.shapeSelected = null;
    }
  }

  /**
   * 删除选中的对象或者点
   */
  deletePolygonSelected() {
    // 删除已选择的点
    if (
      ((this.markCanvas.shapeSelected && this.markCanvas.shapeSelected.point!.length > 3) ||
        (!this.markCanvas.shapeSelected &&
          this.markCanvas.currentShapeSegmentation &&
          this.markCanvas.currentShapeSegmentation!.point!.length > 1)) &&
      this.markCanvas.pointSelected
    ) {
      console.log(1);
      const shape = this.markCanvas.shapeSelected || this.markCanvas.currentShapeSegmentation;
      shape.point.splice(shape.point.indexOf(this.markCanvas.pointSelected), 1);
      this.markCanvas.pointHover = null;
      this.markCanvas.pointSelected = null;
      // 删除对象
    } else if (this.markCanvas.shapeSelected) {
      console.log(2);
      const shape = this.markCanvas.shapeSelected;
      // 删除对象
      this.markCanvas.shapeSegmentations.splice(
        this.markCanvas.shapeSegmentations.indexOf(shape),
        1,
      );
      this.markCanvas.shapeSelected = null;
      this.markCanvas.shapeHover = null;
      this.markCanvas.currentShapeSegmentation.point.forEach((p) => (p.invalid = true));
      this.markCanvas.currentShapeSegmentation = null;
      // 删除点
      this.markCanvas.pointsMap.delete(shape.shapeId!);
      this.markCanvas.pointClearDoing!();
      // 所有图形都设为 可选的
      this.markCanvas.shapeSelectPlan = this.markCanvas.shapeSegmentations;
      if (this.curShapeCreateCofig) {
        this.openMarkMode(this.curShapeCreateCofig);
      }

      // 事件 通知
      this.deleteShapeEvent.next(shape);

      // 删除新对象
    } else if (this.markCanvas.currentShapeSegmentation) {
      console.log(3);
      const shape = this.markCanvas.currentShapeSegmentation;
      // 删除对象
      this.markCanvas.shapeSelected = null;
      this.markCanvas.shapeHover = null;
      this.markCanvas.currentShapeSegmentation.point.forEach((p) => (p.invalid = true));
      this.markCanvas.currentShapeSegmentation = null;
      // 删除点
      this.markCanvas.pointsMap.delete(shape.shapeId!);
      this.markCanvas.pointClearDoing!();
      // 所有图形都设为 可选的
      this.markCanvas.shapeSelectPlan = this.markCanvas.shapeSegmentations;
      if (this.curShapeCreateCofig) {
        this.openMarkMode(this.curShapeCreateCofig);
      }
    }
  }

  /**
   * 载入 图片 + mark 标注数据
   * @param url
   */
  reload(url: string, markData: ShapeDetectionData[]) {
    // 载入 图片
    this.markCanvas.loadImage!(url);
    // 载入 标注数据
    this.setData(markData);
  }
  /**
   * @returns
   */
  setData(markData: ShapeDetectionData[]) {
    this.markCanvas.pointClear!();
    this.markCanvas.linesMap.set('shape-detection-lines', []);
    this.markCanvas.shapeClear!();
    // 清空 点图标注 数据
    this.markCanvas.shapeDetections!.length = 0;
    // 载入 标注数据
    this.markCanvas.loadShapeDetection!(markData);
  }

  // 满足目前项目的数据回显
  setDataElse(markData: ShapeDetectionData[]) {
    this.markCanvas.pointClear!();
    this.markCanvas.linesMap.set('shape-detection-lines', []);
    this.markCanvas.shapeClear!();
    // 清空 点图标注 数据
    this.markCanvas.shapeDetections!.length = 0;
    // 载入 标注数据
    this.markCanvas.loadShapeDetectionElse!(markData);
  }

  /**
   * 回显多变形 TODO
   */
  setPolygonData(markData: ShapeSegmentationData[]) {
    this.markCanvas.pointClear!();
    this.markCanvas.lineClear!();
    this.markCanvas.shapeClear!();
    // this.markCanvas.fillsMap.clear();
    // 清空 点图标注 数据
    this.markCanvas.shapeSegmentations!.length = 0;
    // 清空 当前标注的数据
    this.markCanvas.currentShapeSegmentation = null;
    this.markCanvas.pointSource = null;
    // 载入 标注数据
    this.markCanvas.loadShapeSegmentationElse!(markData);
    // 可选
    // this.markCanvas.shapeSelectPlan = this.markCanvas.shapeSegmentations;
  }
  /**
   * 设定绊线数据
   * @param markData 绊线集合
   * @returns
   */
  setLineData(markData: Line[]) {
    this.markCanvas.pointClear!();
    // 清空 点图标注 数据
    if (markData) {
      this.markCanvas.lineDetections = markData;
    } else {
      this.markCanvas.lineDetections!.length = 0;
    }
    this.markCanvas.linesMap.set('linedetection', markData);
  }
  /**
   * 箭头转换处理
   * @returns
   */
  arrowchange() {
    // 获取绘制的线集合
    const lines = this.markCanvas.linesMap.get('linedetection');
    if (lines && lines.length > 0) {
      const vercline = lines[lines.length - 1][1];
      const endx = vercline.end.x;
      const endy = vercline.end.y;
      // 垂直线开始点和结束点转换
      vercline.end.x = vercline.start.x;
      vercline.end.y = vercline.start.y;
      vercline.start.x = endx;
      vercline.start.y = endy;
      // 重现计算箭头开始点坐标
      const arrow = this.markCanvas.arrowadd(vercline.start, vercline.end);
      // 设定箭头线
      lines[lines.length - 1][2].start = arrow[0];
      lines[lines.length - 1][2].end = vercline.end;
      lines[lines.length - 1][3].start = arrow[1];
      lines[lines.length - 1][3].end = vercline.end;
    }
  }
  /**
   * 当前选中的数据
   * @returns
   */
  getLineSelected() {
    return this.markCanvas.lineSelected;
  }
  /**
   * 当前选中的数据
   * @returns
   */
  getShapeSelected() {
    return this.markCanvas.shapeSelected;
  }
  /**
   * 进入标注模式
   */
  openLineMarkMode(line?: LineDetectionData) {
    // 所有图形都设为 可选的
    this.markCanvas.lineSelectPlan = this.markCanvas.lineDetections;
    // 开启新对象的标注模式
    if (line) {
      this.markCanvas.lineDetectionDrawOption!(line);
      this.markCanvas.shapeDetectionSource = null;
    }
  }
  /**
   * 进入标注模式
   */
  openMarkMode(shapeCofig?: ShapeDetectionData) {
    // 所有图形都设为 可选的
    this.markCanvas.shapeSelectPlan = this.markCanvas.shapeDetections;
    // 开启新对象的标注模式
    if (shapeCofig) {
      this.markCanvas.shapeDetectionDrawOption!(shapeCofig);
      this.markCanvas.lineDetectionSource = null;
    }
  }

  /**
   * 进入标注模式 多边形
   */
  openPolygonMode(shapeCofig?: ShapeSegmentationData) {
    // 暂存配置信息
    if (shapeCofig) {
      this.curShapeCreateCofig = JSON.parse(JSON.stringify(shapeCofig));
    }
    // 所有图形都设为 可选的
    this.markCanvas.shapeSelectPlan = [
      ...this.markCanvas.shapeDetections,
      ...this.markCanvas.shapeSegmentations,
    ];
    // 开启新对象的标注模式
    if (shapeCofig) {
      // 当前本来就处于 新对象的标注模式
      if (this.markCanvas.currentShapeSegmentation) {
        if (this.markCanvas.currentShapeSegmentation != this.markCanvas.shapeSelected) {
          if (this.markCanvas.currentShapeSegmentation.type == shapeCofig.type) {
            return;
          } else {
            this.markModeSave();
          }
        }
      }
      // 当前本来就处于 对象的编辑模式, 退出对象的编辑模式
      if (this.markCanvas.shapeSelected && this.markCanvas.shapeSelected.point) {
        this.markCanvas.shapeSelected.point.forEach((p) => (p.invalid = true));
      }
      this.markCanvas.shapeSelected = null;
      this.markCanvas.shapeDetectionSource = null;
      this.markForShape(shapeCofig);
      console.log('open polygon mode');
    }
  }

  /**
   * 对象标注
   */
  markForShape(shapeCofig: ShapeSegmentationData) {
    this.markCanvas.lineDetectionSource = null;
    this.markCanvas.lineDetectionSource = null;
    this.markCanvas.pointClearDoing!();
    // 配置标注规则
    this.markCanvas.shapeSegmentationDrawing!(shapeCofig);
  }

  /**
   * 保存
   */
  markModeSave() {
    if (this.markCanvas.currentShapeSegmentation) {
      // 不是编辑模式
      if (!this.markCanvas.shapeSegmentations.includes(this.markCanvas.currentShapeSegmentation!)) {
        // 绘制完成的对象 保存， 没有绘制完成 则丢掉 不保存
        if (!this.markCanvas.pointSource) {
          this.markCanvas.shapeSegmentations.push(this.markCanvas.currentShapeSegmentation!);
        }
        this.markCanvas.pointSource = null;
        this.markCanvas.points = [];
      }
      // 清空当前编辑的对象
      this.markCanvas.currentShapeSegmentation.point.forEach((p) => (p.invalid = true));
      this.markCanvas.currentShapeSegmentation = null;
    }
    this.markCanvas.shapeSelected = null;
  }
  /**
   * 关闭标注模式
   */
  closeLineMarkMode() {
    // 所有图形都设为 不可选的
    this.markCanvas.lineSelectPlan = [];
    // this.markCanvas.lineHoverPlan = this.markCanvas.lineDetections
    // 取消当前选中的图形
    this.markCanvas.lineSelected = null;
    // this.markCanvas.lineHover = null
    // 取消当前 对点的操作
    this.markCanvas.pointClearDoing!();
    // 关闭 新对象的标注模式
    this.markCanvas.lineDetectionSource = null;
  }

  closePolygonMarkMode() {
    // 所有图形都设为 不可选的
    this.markCanvas.shapeSelectPlan = [];
    this.markCanvas.shapeHoverPlan = this.markCanvas.shapeSegmentations;
    // 取消当前选中的图形
    this.markCanvas.shapeSelected = null;
    this.markCanvas.shapeHover = null;
    // 取消当前 对点的操作
    this.markCanvas.pointClearDoing!();
    // 关闭 新对象的标注模式
    this.markCanvas.pointSource = null;
    this.markCanvas.currentShapeSegmentation = null;
    this.curShapeCreateCofig = null;
  }

  /**
   * 关闭标注模式
   */
  closeMarkMode() {
    // 所有图形都设为 不可选的
    this.markCanvas.shapeSelectPlan = [];
    this.markCanvas.shapeHoverPlan = this.markCanvas.shapeDetections;
    // 取消当前选中的图形
    this.markCanvas.shapeSelected = null;
    this.markCanvas.shapeHover = null;
    // 取消当前 对点的操作
    this.markCanvas.pointClearDoing!();
    // 关闭 新对象的标注模式
    this.markCanvas.shapeDetectionSource = null;
  }
  /**
   * 复位
   */
  reset() {
    this.markCanvas.canvasZoomDefault!();
  }
  /**
   * 获取数据
   */
  getLineData() {
    return this.markCanvas.linesMap.get('linedetection');
  }
  /**
   * 获取数据
   */
  getData() {
    return this.markCanvas.shapeDetections
      .filter((s) => s.point)
      .map((s) => ({
        ...s,
        pointSource: JSON.parse(
          JSON.stringify(s.point.map((p) => ({ x: p.source.x, y: p.source.y }))),
        ),
      }));
  }

  /**
   * 获取多变形数据
   */
  getPolygonData() {
    return this.markCanvas.shapeSegmentations
      .filter((s) => s.point)
      .map((s) => ({
        type: s.type,
        label: s.label,
        shapeId: s.shapeId,
        point: JSON.parse(JSON.stringify(s.point.map((p) => ({ x: p.x, y: p.y })))),
        pointSource: JSON.parse(
          JSON.stringify(s.point.map((p) => ({ x: p.source.x, y: p.source.y }))),
        ),
      }));
  }
}

export default DetectionScene;
