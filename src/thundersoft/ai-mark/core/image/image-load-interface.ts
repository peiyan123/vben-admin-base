import { Subject } from 'rxjs';
/**
 * ImageDragInterface
 */
export interface ImageLoadInterface {
  // 图片
  image?: HTMLImageElement
  // 图片开始位置
  imageStartPoint?: { x: number, y: number }
  // 图片纵横比 (image.Width / image.Height): 精度 accuracy = 100000
  imageAspectRatio?: number
  // 图片改变事件
  imageChangeEvent?: Subject<any>

  /**
   * 载入图片
   * @param url 
   */
  loadImage?(url: string): void

  /**
   * 初始化图片参数
   * @param url 
   * @returns 图片信息
   */
  initImage?(): void

  /**
   * 图像缩放默认值，适配长边 进行缩放
   * @param img 
   */
  canvasZoomDefault?(): void
}