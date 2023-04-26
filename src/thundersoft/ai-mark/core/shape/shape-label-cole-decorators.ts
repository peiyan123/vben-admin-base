import { AiMarkInterface } from '..';

/**
 * ShapePointLoadDecorators
 */
export function ShapeLabelColeDecorators <T extends new (...args: any[]) => AiMarkInterface>(constructor: T) {
  return class extends constructor {
    /**
     * labelCole
     * @param shap 
     */
    getLabelCole(color: string): string {
      if (color.split("(").length) {
        if (color.split("(")[1].split(",").length === 3) {
          const cs = color.split("(")[1].split(",")
          if ( (parseInt(cs[0]) + parseInt(cs[1]) + parseInt(cs[2]))/3 >= 128 ) {
            return "#000000"
          } else {
            return "#FFFFFF"
          }
        } else {
          return "#000000"
        }
      } else {
        return "#000000"
      }
    }
  }
}

