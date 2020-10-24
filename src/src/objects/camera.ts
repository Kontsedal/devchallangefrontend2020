import { RenderContext } from '../core/renderContext.ts';
import { GameObject } from '../interfaces/GameObject.ts';

type Options = {
  target: GameObject;
  renderContext: RenderContext;
  x: number;
  y: number;
};
export class Camera {
  private readonly target: GameObject;

  private readonly renderContext: RenderContext;

  private initialX: number;

  private x: number;

  private initialY: number;

  private y: number;

  constructor({ target, renderContext, x, y }: Options) {
    this.target = target;
    this.renderContext = renderContext;
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
  }

  update() {
    if (
      this.target.x >=
      this.renderContext.getWidth() - this.renderContext.getWidth() / 3
    ) {
      this.x = -(
        this.initialX +
        this.target.x -
        this.renderContext.getWidth() +
        this.renderContext.getWidth() / 3
      );
    }
    this.renderContext.setOffsetX(this.x);
    this.renderContext.setOffsetY(this.y);
  }
}
