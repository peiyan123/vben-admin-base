export interface Point {
  // 唯一标识
  id: Symbol
  // canvasElement 里的鼠标位置
  x?: number
  y?: number
  // 无效/不显示
  invalid?: boolean
  // 点的真实数据
  source: PointSource
}

export interface PointSource {
  // 相对图片的坐标点
  x?: number
  y?: number
  // 点的颜色
  color?: string
  // 顺序
  index?: number
  // 文字
  label?: string
  // 文字
  labelColor?: string
  // 形状id
  shapeId?: any
  // 其他
  [propName: string]: any
}
