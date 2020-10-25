import { RenderContext } from '../core/renderContext.ts';
import { GameObject } from '../interfaces/GameObject.ts';

type Options = {
  renderContext: RenderContext;
  x: number;
};
export class Wall implements GameObject {
  private readonly renderContext: RenderContext;

  private x: number;

  private y: number;

  public width: number;

  public height: number;

  constructor({ renderContext, height = 200, width = 50, x }: Options) {
    this.renderContext = renderContext;
    this.x = x;
    this.y = height;
    this.width = width;
    this.height = height;
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
    console.log(
      this.renderContext.getCurrentX(this.x),
      this.renderContext.getCurrentY(this.y),
      this.width,
      this.height
    );
    context.fill();
  }
}
