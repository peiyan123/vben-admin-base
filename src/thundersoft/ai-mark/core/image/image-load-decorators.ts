import { AiMarkInterface } from '..';
import { RatioCalculation, RatioConversion } from '../util/shape-calculation';
import { Subject } from 'rxjs';

export function ImageLoadDecorators<T extends new (...args: any[]) => AiMarkInterface>(
  constructor: T,
) {
  return class extends constructor {
    // 图片
    image: HTMLImageElement = new Image();

    // 图片开始位置
    imageStartPoint: { x: number; y: number } = { x: 0, y: 0 };
    // 图片纵横比 (image.Width / image.Height): 精度 accuracy = 100000
    imageAspectRatio = 100000;
    // 图片改变事件
    imageChangeEvent: Subject<any> = new Subject<any>();

    /**
     * @override 方法重写 super.init
     * @param el
     * @param url
     * @param args
     */
    init(el: HTMLElement, url: string, ...args: any[]): any {
      const result = super.init(el, ...args);
      this.loadImage(url);
      return { ...result };
    }

    /**
     * 载入图片
     * @param url
     */
    async loadImage(url: string): Promise<any> {
      this.loading = false;
      if (!url) return;
      this.loading = true;
      const image = await this.loadImageUrl(url);
      this.loading = false;
      // 初始化图片参数
      this.initImage();
      // canvas渲染图片
      this.drawImage(image);
      // 通知
      this.imageChangeEvent.next('reload');
      // 图片结果
      return image;
    }

    /**
     * 初始化图片参数
     * @param url
     * @returns 图片信息
     */
    initImage() {
      // 恢复缩放的默认值
      this.canvasZoom = this.accuracy;
      // 图片绘制起点
      this.imageStartPoint = { x: 0, y: 0 };
      // 默认长边适配比例
      this.canvasZoomDefault();
    }

    /**
     * 解析图片
     * @param url
     * @returns 图片信息
     */
    loadImageUrl(url: string): Promise<HTMLImageElement> {
      this.image.src = url;
      return new Promise((resolve) => {
        this.image.onload = () => {
          this.imageAspectRatio = RatioCalculation(
            this.image.width,
            this.image.height,
            this.accuracy,
          );
          resolve(this.image);
        };
      });
    }

    /**
     * 图像缩放默认值，适配长边 进行缩放
     * @param img
     */
    canvasZoomDefault() {
      // 图片纵横比 > 画布纵横比
      if (this.imageAspectRatio > this.canvasAspectRatio) {
        // 缩放 通过图片宽度缩放进行界面适配
        this.canvasZoom = RatioCalculation(
          this.canvasElement.width,
          this.image.width,
          this.accuracy,
        );
        // 图片居中
        this.imageStartPoint.y =
          (this.canvasElement.height -
            RatioConversion(this.image.height, this.canvasZoom, this.accuracy)) /
          2;
        this.imageStartPoint.x = 0;
      } else {
        // 缩放 通过图片高度缩放进行界面适配
        this.canvasZoom = RatioCalculation(
          this.canvasElement.height,
          this.image.height,
          this.accuracy,
        );
        // 图片居中
        this.imageStartPoint.x =
          (this.canvasElement.width -
            RatioConversion(this.image.width, this.canvasZoom, this.accuracy)) /
          2;
        this.imageStartPoint.y = 0;
      }
    }
    /**
     * 绘制图片
     * @param img
     */
    drawImage(img: CanvasImageSource) {
      const fn = (ctx: CanvasRenderingContext2D) => {
        // ctx.restore()

        // 源码开始
        /* ctx.drawImage(
          img, this.imageStartPoint.x, this.imageStartPoint.y,
          RatioConversion(img.width as number, this.canvasZoom, this.accuracy),
          RatioConversion(img.height as number, this.canvasZoom, this.accuracy)
        ) */
        // 源码结束

        // TODO: 上面为源码，下面为解决铺满容器的修改
        ctx.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
        // ctx.save()
      };
      fn(this.offscreenCanvasRenderingContext2D);
      this.canvasProxyOperations.unshift(fn);
    }
  };
}

// export function ImageLoadCanvas(params: ImageLoadCanvasConfig) {
//   return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
//     return class extends constructor {
//     };
//   }
// }
// export interface ImageLoadCanvasConfig {
//   [propName: string]: any
// }
