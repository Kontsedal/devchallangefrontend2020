import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';

type Options = {
  renderContext: RenderContext;
  x: number;
  width?: number;
  height?: number;
};
export class Wall implements GameObject {
  private readonly renderContext: RenderContext;

  public x: number;

  public y: number;

  public width: number;

  public height: number;

  public collidable = true;

  public collides = false;

  constructor({ renderContext, height, width, x }: Options) {
    this.renderContext = renderContext;
    this.x = x;
    this.y = height ?? 200;
    this.width = width ?? 50;
    this.height = height ?? 200;
  }

  update() {}

  render(): void {
    const context = this.renderContext.getContext();
    context.fillRect(
      this.renderContext.getCurrentX(this.x),
      this.renderContext.getCurrentY(this.y),
      this.width,
      this.height
    );
    context.fill();
  }
}
