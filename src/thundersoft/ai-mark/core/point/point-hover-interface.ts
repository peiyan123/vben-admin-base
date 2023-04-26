import { Point } from './index';
import { Subject } from 'rxjs';
/**
 * ImageDragInterface
 */
export interface PointHoverInterface {
    /**
     * 判断悬浮的距离范围
     */
    pointHoverDistanceRange?: number
    /**
     * 当前悬浮的点
     */
    pointHover?: Point | any
    /**
     * 点悬浮事件
     */
    pointHoverEvent?: Subject < Point >
    
    /**
     * 绘制高亮点
     * @param element 
     */
    drawHoverPoint?(): any 

    /**
     * 设置悬浮点
     * 对可选点：pointSelectedPlan，进行悬浮高亮
     */
    pointHoverModel?(): any 
}