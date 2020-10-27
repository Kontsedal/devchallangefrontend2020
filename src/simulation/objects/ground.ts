import { GameObject } from '../interfaces/gameObject';
import groundImageSrc from '../../assets/ground.png';
import { RenderContext } from '../core/renderContext';
import { AssetsManager } from '../core/assets';
import { Camera } from './camera';

export class Ground implements GameObject {
  x: number = -100;

  y: number = 0;

  private readonly img: HTMLImageElement;

  private renderContext: RenderContext;

  public collidable = true;

  public height = 100;

  public width = 0;

  public collides = false;

  private camera: any;

  constructor({
    renderContext,
    assetsManager,
    camera,
  }: {
    renderContext: RenderContext;
    assetsManager: AssetsManager;
    camera: Camera;
  }) {
    this.renderContext = renderContext;
    this.camera = camera;
    this.img = assetsManager.register(groundImageSrc);
    this.calculateSize();
  }

  render() {
    const context = this.renderContext.getContext();
    context.save();
    context.translate(this.camera.getCurrentX(0), this.camera.getCurrentY(0));
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
    this.width = this.renderContext.getWidth() - this.camera.x + 100;
  }
}
