
/**
 * 比例计算 AspectRatio
 * @param w 
 * @param h 
 * @param accuracy 
 * @returns 
 */
export function RatioCalculation(w: number, h: number, accuracy: number) {
    return Math.round((w/h) * accuracy)
}

/**
 * 比例换算 AspectRatio
 * @param w 
 * @param h 
 * @param accuracy 
 * @returns 
 */
export function RatioConversion(value: number, ratio: number, accuracy: number) {
    return Math.round((value * ratio) / accuracy)
}

/**
 * 两点直接的距离
 * @param w 
 * @param h 
 * @param accuracy 
 * @returns 
 */
export function Point2Distance(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    return Math.sqrt(( ( (p1.x-p2.x)*(p1.x-p2.x) ) + ( (p1.y-p2.y)*(p1.y-p2.y) ) ))
}

