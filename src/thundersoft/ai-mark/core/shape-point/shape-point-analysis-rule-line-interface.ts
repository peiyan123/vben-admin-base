export interface ShapePointAnalysisRuleLineInterface {
  /**
   * 解析画线规则
   * @param lineRuleString 例如： "1:3;5:3;5-1"
   * todo: lineRuleString 校验
   * @param config 连线配置
   * @returns 
   */
  analysisRuleLine?(lineRuleString: string, config: any): Map<string, any>
}