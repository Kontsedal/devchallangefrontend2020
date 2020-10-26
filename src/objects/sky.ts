import { GameObject } from '../interfaces/gameObject';
import skyImageSrc from '../assets/sky.jpg';
import { RenderContext } from '../core/renderContext';

export class Sky implements GameObject {
  x: number = 0;

  y: number = 0;

  private readonly img: HTMLImageElement;

  private renderContext: RenderContext;

  public collidable = false;

  public height = 0;

  public width = 0;

  public collides = false;

  constructor(context: RenderContext) {
    this.renderContext = context;
    this.img = new Image();
    this.img.src = skyImageSrc;
  }

  render() {
    const context = this.renderContext.getContext();
    context.save();
    context.translate(
      this.renderContext.getCurrentX(0),
      -this.renderContext.getCurrentY(2 * this.renderContext.offsetY)
    );
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
  }

  update() {
    this.width = this.renderContext.getWidth() - this.renderContext.offsetX;
    this.height =
      this.renderContext.getWidth() * 2 + this.renderContext.offsetY;
  }
}
