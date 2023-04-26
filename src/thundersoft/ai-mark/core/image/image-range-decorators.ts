import { AiMarkInterface } from '..';
import { RatioConversion } from '../util/shape-calculation';

/**
 * 依赖：@ImageLoadCanvas
        @CanvasEventDecorators
 * ImageZoomDecorators decorator
 */

export function ImageRangeDecorators<T extends new (...args: any[]) => AiMarkInterface>(
  constructor: T,
) {
  return class extends constructor {
    /**
     * 点在图片上的判断
     */
    imageRangeOnXY(x: number, y: number): boolean {
      // 图片的范围
      // const endX = RatioConversion(this.image!.width, this.canvasZoom, this.accuracy)
      // const endY = RatioConversion(this.image!.height, this.canvasZoom, this.accuracy)
      // if (
      //   (x < this.imageStartPoint!.x) ||
      //   (x > (this.imageStartPoint!.x + endX)) ||
      //   (y < this.imageStartPoint!.y) ||
      //   (y > (this.imageStartPoint!.y + endY))
      // ) {
      //   return false
      // }
      return true;
    }
  };
}
