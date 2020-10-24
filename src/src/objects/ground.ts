import { GameObject } from '../interfaces/GameObject.ts';
import groundImageSrc from '../assets/ground.png';
import { RenderContext } from '../core/renderContext.ts';

export class Ground implements GameObject {
  x: number = 0;

  y: number = 0;

  private img: HTMLImageElement;

  private renderContext: RenderContext;

  constructor(context: RenderContext) {
    this.renderContext = context;
    this.img = new Image();
    this.img.src = groundImageSrc;
  }

  render() {
    const context = this.renderContext.getContext();
    context.translate(
      this.renderContext.getCurrentX(0),
      this.renderContext.getCurrentY(0)
    );
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(
      -100,
      0,
      this.renderContext.getWidth() - this.renderContext.offsetX + 100,
      100
    );
    context.translate(
      -this.renderContext.getCurrentX(0),
      -this.renderContext.getCurrentY(0)
    );
  }

  update() {}
}
