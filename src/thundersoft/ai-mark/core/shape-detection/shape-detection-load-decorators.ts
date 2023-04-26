import { AiMarkInterface, RatioCalculation, ShapeSegmentationData } from '..';
import { ShapeDetectionData } from './shape-detection-model';

/**
 * ShapePointLoadDecorators
 */
export function ShapeDetectionLoadDecorators<T extends new (...args: any[]) => AiMarkInterface>(
  constructor: T,
) {
  return class extends constructor {
    /**
     * 加载图形数据
     * @param shap
     */
    loadShapeDetection?(shap: ShapeDetectionData[]): void {
      this.shapeSelectPlan = this.shapeDetections = [];
      shap.forEach((shapConfig) => {
        // 计算 labelCole
        shapConfig.labelColor = this.getLabelCole!(shapConfig.color!);
        // 图形id
        shapConfig.shapeId =
          shapConfig.shapeId ||
          'shapPoint:' + new Date().getTime() + Math.round(Math.random() * 10000);
        // 加载图形的点
        shapConfig.point = shapConfig.pointSource!.map((source) => ({
          id: Symbol('PointId'),
          source: {
            ...source,
            color: shapConfig.color,
            labelColor: shapConfig.labelColor,
            shapeId: shapConfig.shapeId,
          },
        }));

        this.shapeDetections!.push({
          ...shapConfig,
          shapeId: shapConfig.shapeId,
        });
      });
    }

    // 满足目前项目的数据回显
    loadShapeDetectionElse?(shap: ShapeDetectionData[]): void {
      this.shapeSelectPlan = this.shapeDetections = [];
      shap.forEach((shapConfig) => {
        // 计算 labelCole
        shapConfig.labelColor = this.getLabelCole!(shapConfig.color!);
        // 图形id
        shapConfig.shapeId =
          shapConfig.shapeId ||
          'shapPoint:' + new Date().getTime() + Math.round(Math.random() * 10000);
        // 加载图形的点
        shapConfig.point = shapConfig.pointSource!.map((source) => ({
          id: Symbol('PointId'),
          source: {
            ...source,
            color: shapConfig.color,
            labelColor: shapConfig.labelColor,
            shapeId: shapConfig.shapeId,
          },
        }));
        //
        setTimeout(() => {
          console.log(this.imageStartPoint!.x, this.canvasZoom, this.accuracy);
          shapConfig.point!.forEach((item: any) => {
            item.source.x = RatioCalculation(
              item.source.x - this.imageStartPoint!.x,
              this.canvasZoom,
              this.accuracy,
            );
            item.source.y = RatioCalculation(
              item.source.y - this.imageStartPoint!.y,
              this.canvasZoom,
              this.accuracy,
            );
          });
          this.shapeDetections!.push({
            ...shapConfig,
            shapeId: shapConfig.shapeId,
          });
        }, 300);
      });
    }

    /**
     * 加载多边形图形数据
     * @param shap
     */
     loadShapeSegmentation?(shap: ShapeSegmentationData[]): void {
      this.shapeSegmentations!.length = 0;
      shap.forEach((shapConfig) => {
        // 计算 labelCole
        shapConfig.labelColor = this.getLabelCole!(shapConfig.color!);
        shapConfig.type = "polygon";
        // 图形id
        shapConfig.shapeId =
          shapConfig.shapeId ||
          "shapPoint:" +
            new Date().getTime() +
            Math.round(Math.random() * 10000);
        // 加载图形的点
        shapConfig.point = shapConfig.pointSource!.map((source) => ({
          invalid: true,
          id: Symbol("PointId"),
          source: {
            ...source,
            color: shapConfig.color,
            labelColor: shapConfig.labelColor,
            shapeId: shapConfig.shapeId,
          },
        }));
        this.pointsMap.set(shapConfig.shapeId, shapConfig.point!);
        // 加入集合
        this.shapeSegmentations!.push({
          ...shapConfig,
          shapeId: shapConfig.shapeId,
        });
      });
    }

    /**
     * 加载多边形图形数据
     * @param shap
     */
     loadShapeSegmentationElse?(shap: ShapeSegmentationData[]): void {
      this.shapeSegmentations!.length = 0;
      shap.forEach((shapConfig) => {
        // 计算 labelCole
        shapConfig.labelColor = this.getLabelCole!(shapConfig.color!);
        shapConfig.type = "polygon";
        // 图形id
        shapConfig.shapeId =
          shapConfig.shapeId ||
          "shapPoint:" +
            new Date().getTime() +
            Math.round(Math.random() * 10000);
        // 加载图形的点
        shapConfig.point = shapConfig.pointSource!.map((source) => {
          return {
            invalid: true,
            id: Symbol("PointId"),
            source: {
              ...source,
              color: shapConfig.color,
              labelColor: shapConfig.labelColor,
              shapeId: shapConfig.shapeId,
            },
          }
        })

        setTimeout(() => {
          shapConfig.point!.forEach((item: any) => {
            item.source.x = RatioCalculation(
              item.source.x - this.imageStartPoint!.x,
              this.canvasZoom,
              this.accuracy,
            );
            item.source.y = RatioCalculation(
              item.source.y - this.imageStartPoint!.y,
              this.canvasZoom,
              this.accuracy,
            );
          });
          this.pointsMap.set(shapConfig.shapeId, shapConfig.point!);
          // 加入集合
          this.shapeSegmentations!.push({
            ...shapConfig,
            shapeId: shapConfig.shapeId,
          });
        },100)
      });
    }
  };
}
