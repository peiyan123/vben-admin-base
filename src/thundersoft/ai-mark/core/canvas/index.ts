export * from './canvas-base-interface';
export * from './canvas-base-class';
export * from './canvas-event-interface';
export * from './canvas-event-decorators';
export * from './canvas-resize-interface';
export * from './canvas-resize-decorators';

import { CanvasBaseClassInterface } from './canvas-base-interface';
import { CanvasEventInterface } from './canvas-event-interface';
import { CanvasViewResizeInterface } from './canvas-resize-interface';
import { CanvasViewMouseStyleCursorInterface } from './canvas-mouse-interface';

/**
 * MarkCanvasInterface
 */
export interface MarkCanvasInterface extends
    CanvasBaseClassInterface,
    CanvasEventInterface,
    CanvasViewResizeInterface,
    CanvasViewMouseStyleCursorInterface
{ }

import { CanvasBaseClass } from './canvas-base-class';
import { CanvasEventDecorators } from './canvas-event-decorators';
import { CanvasViewResizeDecorators } from './canvas-resize-decorators';
import { CanvasViewMouseStyleCursorDecorators } from './canvas-mouse-decorators';
/**
 * MarkCanvasBaseClass
 */
@CanvasEventDecorators
@CanvasViewResizeDecorators
@CanvasViewMouseStyleCursorDecorators
export class MarkCanvasBaseClass extends CanvasBaseClass {}



