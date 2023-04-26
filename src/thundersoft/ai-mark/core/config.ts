import { Font } from './font/font-model';
import { Fill } from './fill/fill-model';
import { PointSource } from './point/point-model';
import { LineConfig } from './line/line-model';

export interface AiMarkConfigInterface{
    font: Font
    fill: Fill
    point: PointSource
    line: LineConfig
}

export const CONFIG: AiMarkConfigInterface = {
    font: {
        font: '16px bold 宋体',
        textBaseline: 'bottom'
    },
    fill: {
        color: 'rgba(162,214,234, .3)',
        points: []
    },
    point: {
        color: 'black',  // 点的颜色
        index: 1,        // 顺序
        label: ''        // 文字
    },
    line: {
        dash: 0,         // 实线：0，虚线 > 1
        width: 1,        // 线的宽度
        color: 'black'   // 线的颜色
    }
}