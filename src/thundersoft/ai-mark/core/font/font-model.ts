import { Point } from '../point/point-model';
export interface Font {
    x?: number
    y?: number
    point?: Point
    label?: string
    labelColor?: string
    backgroundColor?: string
    font?: string
    center?: boolean
    textBaseline?: CanvasTextBaseline
}