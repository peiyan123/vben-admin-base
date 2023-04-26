# 2021-06-10

关键点（key-point-scene）： 功能扩展 => 自定义要绘制的点

涉及变更的类型（扩展了参数 pointDrawPlan?: PointSource[]）：

ShapePointData {
    ...
    pointDrawPlan?: PointSource[]
    ...
}

涉及变更的方法（扩展了参数 pointDrawPlan?: PointSource[]）：

/**
* 单个点标注
*/
singlePoint(index: number, pointDrawPlan?: PointSource[]): void
/**
* 连续标注点
*/
updatePoint(index: number, pointDrawPlan?: PointSource[]): void

