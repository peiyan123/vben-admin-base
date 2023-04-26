import { AiMarkInterface } from '..';
import { GuideLineConfig } from './index';

/**
 * GuidelineDecorators
 */
export function GuidelineDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return GuidelineConfigDecorators({})(constructor)
}
/**
 * GuidelineConfigDecorators
 */
export function GuidelineConfigDecorators(config: GuideLineConfig) {
  const configDefault: GuideLineConfig = Object.assign({
    // 实线：0，虚线 > 0
    guideLineDash: 1,
    // 辅助线的宽度
    guideLineWidth: 1,
    // 辅助线的颜色
    guideLineColor: 'rgb(245 220 93)',
    // 辅助线是否展示准星
    guideLineCollimator: true,
    // 准星的颜色
    guideLineCollimatorColor: 'rgb(10 35 162)'
  }, config) as GuideLineConfig
  return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

      guideLineConfig = configDefault

      /**
       * 显示辅助线
       */
      guideLineIsOpen: boolean = true
  
      /**
       * @override 方法重写 super.init
       * @param el 
       * @param url 
       * @param args 
       */
      init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, ...args)
        this.drawGuideline()
        return {...result}
      }
  
      /**
       * 画辅助线
       * @param element 
       */
      drawGuideline() {
        this.canvasOperation((ctx: CanvasRenderingContext2D) => {
          if (this.mousePosition && this.guideLineIsOpen) {
            // 准星
            if (this.guideLineConfig.guideLineCollimator) {
              // 实线
              ctx.setLineDash([0]);
              // 颜色
              ctx.strokeStyle = this.guideLineConfig.guideLineCollimatorColor!
              // 宽度
              ctx.lineWidth = this.guideLineConfig.guideLineWidth!+1
              ctx.beginPath();
              ctx.moveTo(this.mousePosition!.x-15, this.mousePosition!.y);
              ctx.lineTo(this.mousePosition!.x+15, this.mousePosition!.y);
              ctx.moveTo(this.mousePosition!.x, this.mousePosition!.y-15);
              ctx.lineTo(this.mousePosition!.x, this.mousePosition!.y+15);
              ctx.stroke();
            }
            // 实线/虚线
            ctx.setLineDash([this.guideLineConfig.guideLineDash!]);
            // 颜色
            ctx.strokeStyle = this.guideLineConfig.guideLineColor!
            // 宽度
            ctx.lineWidth = this.guideLineConfig.guideLineWidth!  
            ctx.beginPath();
            ctx.moveTo(this.mousePosition!.x, 0);
            ctx.lineTo(this.mousePosition!.x, this.canvasElement.height);
            ctx.moveTo(0, this.mousePosition!.y);
            ctx.lineTo(this.canvasElement.width, this.mousePosition!.y);
            ctx.stroke();
          }
        })
      }
    };
  }
}

