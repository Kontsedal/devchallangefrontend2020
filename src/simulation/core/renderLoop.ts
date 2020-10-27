import { GameObject } from '../interfaces/gameObject';
import { getCollisions } from './collision';
import { RenderContext } from './renderContext';

type Options = {
  fps?: number;
  renderContext: RenderContext;
};

export class RenderLoop {
  private readonly frameLengthSeconds: number;

  private animationFrameId: number = 0;

  private gameObjects: GameObject[] = [];

  private renderContext: RenderContext;

  constructor({ fps = 60, renderContext }: Options) {
    this.frameLengthSeconds = 1 / fps;
    this.renderContext = renderContext;
  }

  start() {
    let lastTimestamp = performance.now();
    let tickTimeDelta = 0;
    let currentTimestamp;
    const tick = () => {
      currentTimestamp = performance.now();
      tickTimeDelta += Math.min(1, (currentTimestamp - lastTimestamp) / 1000);
      while (tickTimeDelta > this.frameLengthSeconds) {
        tickTimeDelta -= this.frameLengthSeconds;
        this.update();
      }
      lastTimestamp = currentTimestamp;

      this.render();
      this.animationFrameId = requestAnimationFrame(tick);
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }

  update() {
    this.gameObjects.forEach((obj) => {
      const collisions = getCollisions(this.gameObjects, obj);
      obj.update(collisions);
    });
  }

  render() {
    this.renderContext.clear();
    this.gameObjects.forEach((obj) => obj.render());
  }

  addGameObject(obj: GameObject) {
    this.gameObjects.push(obj);
  }
}
