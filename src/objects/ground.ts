import { GameObject } from '../interfaces/gameObject';
import groundImageSrc from '../assets/ground.png';
import { RenderContext } from '../core/renderContext';

export class Ground implements GameObject {
  x: number = -100;

  y: number = 0;

  private readonly img: HTMLImageElement;

  private renderContext: RenderContext;

  public collidable = true;

  public height = 100;

  public width = 0;

  public collides = false;

  constructor(context: RenderContext) {
    this.renderContext = context;
    this.img = new Image();
    this.img.src = groundImageSrc;
  }

  render() {
    const context = this.renderContext.getContext();
    context.save();
    context.translate(
      this.renderContext.getCurrentX(0),
      this.renderContext.getCurrentY(0)
    );
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
  }

  update() {
    this.width =
      this.renderContext.getWidth() - this.renderContext.offsetX + 100;
  }
}
