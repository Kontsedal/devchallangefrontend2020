import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';
import { Camera } from './camera';
import { AssetsManager } from '../core/assets';
import earthImgSrc from '../../assets/earth.png';

export class Wall implements GameObject {
  private readonly renderContext: RenderContext;

  public x: number;

  public y: number;

  public width: number;

  public height: number;

  public collidable = true;

  public collides = false;

  private camera: Camera;

  private img: HTMLImageElement;

  constructor({
    renderContext,
    height,
    width,
    x,
    camera,
    assetsManager,
  }: {
    renderContext: RenderContext;
    x: number;
    width: number;
    height: number;
    camera: Camera;
    assetsManager: AssetsManager;
  }) {
    this.renderContext = renderContext;
    this.x = x;
    this.y = height;
    this.width = width;
    this.height = height;
    this.camera = camera;
    this.img = assetsManager.register(earthImgSrc);
  }

  update() {}

  render(): void {
    const context = this.renderContext.getContext();
    context.fillStyle = context.createPattern(
      this.img,
      'repeat'
    ) as CanvasPattern;
    context.fillRect(
      this.camera.simulationXToViewportX(this.x),
      this.camera.simulationYToViewportY(this.y),
      this.width,
      this.height
    );
    context.fill();
  }
}
