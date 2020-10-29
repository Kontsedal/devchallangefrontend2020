import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';
import { CONFIG } from '../../config';

export class Camera implements GameObject {
  private target: GameObject | undefined;

  private readonly renderContext: RenderContext;

  private readonly initialX: number = CONFIG.CAMERA.INITIAL_X;

  public x: number = CONFIG.CAMERA.INITIAL_X;

  private readonly initialY: number = CONFIG.CAMERA.INITIAL_Y;

  public y: number = CONFIG.CAMERA.INITIAL_Y;

  public width = 0;

  public height = 0;

  public collidable = false;

  public collides = false;

  constructor({ renderContext }: { renderContext: RenderContext }) {
    this.renderContext = renderContext;
  }

  setTarget(target: GameObject) {
    this.target = target;
  }

  update() {
    if (!this.target) {
      return;
    }
    let newX = 0;
    let newY = 0;
    if (
      this.target.x >=
      this.renderContext.getWidth() -
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
    ) {
      newX = -(
        this.initialX +
        this.target.x -
        this.renderContext.getWidth() +
        this.renderContext.getWidth() *
          CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT
      );
    } else if (this.target.x <= CONFIG.CAMERA.MIN_TARGET_OFFSET_X) {
      newX = -(
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
      newX = -(
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
      newY = this.initialY + this.target.y - maxY;
    } else {
      newY = this.initialY;
    }
    this.x =
      (this.x * CONFIG.CAMERA.TRANSITION_COEF + newX) /
      (CONFIG.CAMERA.TRANSITION_COEF + 1);
    this.y =
      (this.y * CONFIG.CAMERA.TRANSITION_COEF + newY) /
      (CONFIG.CAMERA.TRANSITION_COEF + 1);
  }

  getCurrentY(originalY: number): number {
    return this.renderContext.getHeight() - originalY + this.y;
  }

  getCurrentX(originalX: number): number {
    return originalX + this.x;
  }

  normalizeX(x: number): number {
    return x - this.x;
  }

  normalizeY(y: number): number {
    return this.renderContext.getHeight() + this.y - y;
  }

  render(): void {}
}
