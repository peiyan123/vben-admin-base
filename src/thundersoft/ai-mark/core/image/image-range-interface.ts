/**
 * ImageDragInterface
 */
export interface ImageRangeInterface {
    /**
     * 点在图片上的判断
     */
    imageRangeOnXY?(x: number, y: number): boolean
}