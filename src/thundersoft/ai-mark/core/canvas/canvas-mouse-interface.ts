/**
 * Canvas Warp HtmlElement Event
 */
export interface CanvasViewMouseStyleCursorInterface {

  /**
   * canvas 视图窗口大小改变事件
   */
  canvasViewMouseStyleCursor?: Map<string, MouseStyleCursor>

}

export type MouseStyleCursor = 'auto' | 'default' | 'pointer' | 'move' | 'crosshair'