import { AiMarkInterface } from '..';
import { GuideLineConfig } from './index';

/**
 * GuideGridDecorators
 */
export function GuideGridDecorators<T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return GuideGridConfigDecorators({})(constructor)
}
/**
 * GuideGridConfigDecorators
 */
export function GuideGridConfigDecorators(config: GuideLineConfig) {
  const configDefault: GuideLineConfig = Object.assign({
      // 实线：0，虚线 > 0
      guideLineDash: 1,
      // 辅助线的宽度
      guideLineWidth: 1,
      // 辅助线的颜色
      guideLineColor: '#f5dc5d'
  }, config) as GuideLineConfig
  return function <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
    return class extends constructor {

      guideGridConfig = configDefault

      /**
       * 显示辅助线
       */
      guideGridIsOpen: boolean = true
  
      /**
       * @override 方法重写 super.init
       * @param el 
       * @param url 
       * @param args 
       */
      init(el: HTMLElement, ...args: any[]): any {
        let result = super.init(el, ...args)
        this.openGuideGrid()
        return {...result}
      }
      /**
       * 开启网格
       */
      openGuideGrid() {
        this.canvasOperation((ctx: CanvasRenderingContext2D) => {
          const stepX = 10, stepY = 10,
            color: string | CanvasGradient | CanvasPattern = 'lightGray',
            lineWidth = 0.5
          // 创建垂直格网线路径
          for(let i = 0.5 + stepX; i < this.canvasElement.width; i += stepX){
              ctx.moveTo(i, 0);
              ctx.lineTo(i, this.canvasElement.height);
          }
          // 创建水平格网线路径
          for(let j = 0.5 + stepY; j < this.canvasElement.height; j += stepY){
            ctx.moveTo(0, j);
            ctx.lineTo(this.canvasElement.width, j);
          }
          // 设置绘制颜色
          ctx.strokeStyle = color;
          // 设置绘制线段的宽度
          ctx.lineWidth = lineWidth;
          // 绘制格网
          ctx.stroke();
          // 清除路径
          ctx.beginPath();
        })
      }
    };
  }
}

