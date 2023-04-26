/**
 * ImageDragInterface
 */
export interface PointMouseInterface {
  // 鼠标的位置
  mousePosition?: {
    x: number
    y: number
    // layer  兼容性问题：不同浏览器表现不同
    // event.x，event.y  兼容性问题：不同浏览器表现不同
    offset: {
      x: number
      y: number
    }
    client: {
      x: number
      y: number
    }
    page: {
      x: number
      y: number
    }
    screen: {
      x: number
      y: number
    }
  }
}