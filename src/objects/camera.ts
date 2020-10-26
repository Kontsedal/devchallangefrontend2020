import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';
import { CONFIG } from '../config';

type Options = {
  target: GameObject;
  renderContext: RenderContext;
  x: number;
  y: number;
};
export class Camera implements GameObject {
  private readonly target: GameObject;

  private readonly renderContext: RenderContext;

  private readonly initialX: number;

  public x: number;

  private readonly initialY: number;

  public y: number;

  public width = 0;

  public height = 0;

  public collidable = false;

  public collides = false;

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
      this.renderContext.getWidth() -
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
    ) {
      this.x = -(
        this.initialX +
        this.target.x -
        this.renderContext.getWidth() +
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
      );
    } else if (this.target.x <= CONFIG.CAMERA.MIN_TARGET_OFFSET_X) {
      this.x = -(
        this.initialX +
        this.target.x -
        CONFIG.CAMERA.MIN_TARGET_OFFSET_X
      );
    }
    if (
      this.target.x >=
      this.renderContext.getWidth() -
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
    ) {
      this.x = -(
        this.initialX +
        this.target.x -
        this.renderContext.getWidth() +
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
      );
    }

    const maxY =
      this.renderContext.getHeight() - CONFIG.CAMERA.MAX_TARGET_OFFSET_Y;
    if (this.target.y >= maxY) {
      this.y = this.initialY + this.target.y - maxY;
    } else {
      this.y = this.initialY;
    }
    this.renderContext.setOffsetX(this.x);
    this.renderContext.setOffsetY(this.y);
  }

  render(): void {}
}
