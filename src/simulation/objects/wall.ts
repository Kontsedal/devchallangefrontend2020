import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';
import { Camera } from './camera';

export class Wall implements GameObject {
  private readonly renderContext: RenderContext;

  public x: number;

  public y: number;

  public width: number;

  public height: number;

  public collidable = true;

  public collides = false;

  private camera: Camera;

  constructor({
    renderContext,
    height,
    width,
    x,
    camera,
  }: {
    renderContext: RenderContext;
    x: number;
    width: number;
    height: number;
    camera: Camera;
  }) {
    this.renderContext = renderContext;
    this.x = x;
    this.y = height;
    this.width = width;
    this.height = height;
    this.camera = camera;
  }

  update() {}

  render(): void {
    const context = this.renderContext.getContext();
    context.fillRect(
      this.camera.getCurrentX(this.x),
      this.camera.getCurrentY(this.y),
      this.width,
      this.height
    );
    context.fill();
  }
}
