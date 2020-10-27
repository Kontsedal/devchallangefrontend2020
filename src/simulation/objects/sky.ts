import { GameObject } from '../interfaces/gameObject';
import skyImageSrc from '../../assets/sky.jpg';
import { RenderContext } from '../core/renderContext';
import { AssetsManager } from '../core/assets';

export class Sky implements GameObject {
  x: number = 0;

  y: number = 0;

  private readonly img: HTMLImageElement;

  private renderContext: RenderContext;

  public collidable = false;

  public height = 0;

  public width = 0;

  public collides = false;

  constructor({
    renderContext,
    assetsManager,
  }: {
    renderContext: RenderContext;
    assetsManager: AssetsManager;
  }) {
    this.renderContext = renderContext;
    this.img = assetsManager.register(skyImageSrc);
    this.calculateSize();
  }

  render() {
    const context = this.renderContext.getContext();
    context.save();
    context.translate(
      this.renderContext.getCurrentX(-this.renderContext.getWidth() * 25),
      -this.renderContext.getCurrentY(
        -this.renderContext.getHeight() + 2 * this.renderContext.offsetY
      )
    );
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
  }

  update() {
    this.calculateSize();
  }

  calculateSize() {
    this.width = this.renderContext.getWidth() * 50;
    this.height = this.renderContext.getHeight() * 50;
  }
}
