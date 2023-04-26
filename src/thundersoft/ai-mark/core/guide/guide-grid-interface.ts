import { GuideLineConfig } from './guide-line-model';
/**
 * GuideGridInterface
 */
export interface GuideGridInterface {
    /**
     * 显示辅助线
     */
    guideGridIsOpen?: boolean
    /**
     * 辅助线配置
     */
    guideGridConfig?: GuideLineConfig
}