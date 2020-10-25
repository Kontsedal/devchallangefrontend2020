import { RenderContext } from '../core/renderContext.ts';
import { GameObject } from '../interfaces/GameObject.ts';

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
      this.renderContext.getWidth() - this.renderContext.getWidth() / 3
    ) {
      this.x = -(
        this.initialX +
        this.target.x -
        this.renderContext.getWidth() +
        this.renderContext.getWidth() / 3
      );
    } else if (this.target.x <= 100) {
      this.x = -(this.initialX + this.target.x - 100);
    }
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

    const maxY = this.renderContext.getHeight() - 100;
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
