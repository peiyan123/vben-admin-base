export interface GuideLineConfig {
    // 实线：0，虚线 > 1
    guideLineDash?: number
    // 辅助线的宽度
    guideLineWidth?: number
    // 辅助线的颜色
    guideLineColor?: string
    // 辅助线是否展示准星
    guideLineCollimator?: boolean
    // 准星的颜色
    guideLineCollimatorColor?: string
}