import { Fill } from '.';
/**
 * LineDrawInterface
 */
export interface FillDrawInterface {

    /**
     * 填充区域
     */
    fills?: Fill[]
    fillsMap?: Map<string, Fill[]>
}