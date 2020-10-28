import { GameObject } from '../interfaces/gameObject';
import skyImageSrc from '../../assets/sky.jpg';
import { RenderContext } from '../core/renderContext';
import { AssetsManager } from '../core/assets';
import { Camera } from './camera';

export class Sky implements GameObject {
  x: number = 0;

  y: number = 0;

  private readonly img: HTMLImageElement;

  private renderContext: RenderContext;

  public collidable = false;

  public height = 0;

  public width = 0;

  public collides = false;

  private camera: Camera;

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
    this.img = assetsManager.register(skyImageSrc);
    this.calculateSize();
  }

  render() {
    this.calculateSize();
    const context = this.renderContext.getContext();
    console.log({
      cx: this.camera.getCurrentX(0),
      cy: this.camera.getCurrentY(0),
    });
    context.save();
    context.translate(
      this.camera.getCurrentX(0),
      -this.height / 2 + this.camera.y
    );
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    context.restore();
  }

  update() {}

  calculateSize() {
    this.width = 20000;
    this.height = 20000;
  }
}
