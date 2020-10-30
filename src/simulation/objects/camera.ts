import { RenderContext } from '../core/renderContext';
import { GameObject } from '../interfaces/gameObject';
import { CONFIG } from '../../config';

/**
 * Responsible for shifting painting when target is out of current view box
 */
export class Camera implements GameObject {
  private target: GameObject | undefined;

  private readonly renderContext: RenderContext;

  private readonly initialX: number = CONFIG.CAMERA.INITIAL_X;

  public x: number = CONFIG.CAMERA.INITIAL_X;

  private readonly initialY: number = CONFIG.CAMERA.INITIAL_Y;

  public y: number = CONFIG.CAMERA.INITIAL_Y;

  public width = 0;

  public height = 0;

  public collidable = false;

  public collides = false;

  constructor({ renderContext }: { renderContext: RenderContext }) {
    this.renderContext = renderContext;
  }

  setTarget(target: GameObject) {
    this.target = target;
  }

  update() {
    if (!this.target) {
      return;
    }
    let newX = 0;
    let newY = 0;
    const targetXToStartFollow =
      this.renderContext.getWidth() -
      this.renderContext.getWidth() * CONFIG.CAMERA.MAX_TARGET_OFFSET_X_PERCENT;
    if (this.target.x >= targetXToStartFollow) {
      newX = targetXToStartFollow - this.target.x;
    } else if (this.target.x <= CONFIG.CAMERA.MIN_TARGET_OFFSET_X) {
      newX = this.target.x - CONFIG.CAMERA.MIN_TARGET_OFFSET_X - this.initialX;
    }
    const targetYToStartFollow =
      this.renderContext.getHeight() - CONFIG.CAMERA.MAX_TARGET_OFFSET_Y;
    if (this.target.y >= targetYToStartFollow) {
      newY = this.initialY + this.target.y - targetYToStartFollow;
    } else {
      newY = this.initialY;
    }

    /**
     * Make changing of camera position more smooth, so it won't react on target
     * position change immediately. Makes target following more natural
     */
    this.x =
      (this.x * CONFIG.CAMERA.TRANSITION_COEF + newX) /
      (CONFIG.CAMERA.TRANSITION_COEF + 1);
    this.y =
      (this.y * CONFIG.CAMERA.TRANSITION_COEF + newY) /
      (CONFIG.CAMERA.TRANSITION_COEF + 1);
  }

  /**
   * Makes y coordinate start at the bottom (canvas y=0 x=0 is top left corner).
   * Also includes camera offset
   */
  simulationYToViewportY(originalY: number): number {
    return this.renderContext.getHeight() - originalY + this.y;
  }

  /**
   * Make x respect camera offset
   */
  simulationXToViewportX(originalX: number): number {
    return originalX + this.x;
  }

  viewportXToSimulationX(x: number): number {
    return x - this.x;
  }

  viewportYToSimulationY(y: number): number {
    return this.renderContext.getHeight() + this.y - y;
  }

  render(): void {}
}
