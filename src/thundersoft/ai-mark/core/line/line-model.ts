import { Point } from '../point/index';

export interface Line {
    start: Point
    end: Point
    shapeId?: any
    point?: Point[]
    config?: LineConfig
}
export interface LineConfig {
    // 实线：0，虚线 > 1
    dash?: number
    // 线的宽度
    width?: number
    // 线的颜色
    color?: string
}