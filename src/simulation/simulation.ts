import '../index.scss';
import { RenderLoop } from './core/renderLoop';
import { Rocket } from './objects/rocket';
import { RenderContext } from './core/renderContext';
import { Camera } from './objects/camera';
import { Ground } from './objects/ground';
import { Wall } from './objects/wall';
import { CONFIG } from '../config';
import { Sky } from './objects/sky';
import { AssetsManager } from './core/assets';
import { repeat } from '../utils/function';

export class Simulation {
  private renderLoop: RenderLoop;

  private readonly renderContext: RenderContext;

  private readonly rocket: Rocket;

  private readonly camera: Camera;

  private readonly assetsManager: AssetsManager = new AssetsManager();

  constructor() {
    this.renderContext = new RenderContext(CONFIG.CANVAS_SELECTOR);
    this.renderLoop = new RenderLoop({ renderContext: this.renderContext });

    this.camera = new Camera({
      renderContext: this.renderContext,
    });
    this.rocket = new Rocket({
      renderContext: this.renderContext,
      assetsManager: this.assetsManager,
      camera: this.camera,
    });
    this.camera.setTarget(this.rocket);
    this.renderLoop.addGameObject(
      new Sky({
        renderContext: this.renderContext,
        assetsManager: this.assetsManager,
        camera: this.camera,
      })
    );
    this.renderLoop.addGameObject(
      new Wall({
        renderContext: this.renderContext,
        x: -100 - CONFIG.CAMERA.INITIAL_X,
        height: 5000,
        width: 100,
        camera: this.camera,
        assetsManager: this.assetsManager,
      })
    );
    repeat(CONFIG.WALLS.REPEAT_TIMES, (index) => {
      this.renderLoop.addGameObject(
        new Wall({
          renderContext: this.renderContext,
          x: CONFIG.WALLS.OFFSET_X + CONFIG.WALLS.DISTANCE * index,
          height: CONFIG.WALLS.HEIGHT,
          width: CONFIG.WALLS.WIDTH,
          camera: this.camera,
          assetsManager: this.assetsManager,
        })
      );
    });
    this.renderLoop.addGameObject(
      new Ground({
        renderContext: this.renderContext,
        assetsManager: this.assetsManager,
        camera: this.camera,
      })
    );

    this.renderLoop.addGameObject(this.rocket);
    this.renderLoop.addGameObject(this.camera);
  }

  async init() {
    await this.assetsManager.waitUntilLoaded();
  }

  start() {
    this.renderLoop.start();
  }

  stop() {
    this.renderLoop.stop();
  }

  render() {
    this.renderLoop.render();
  }

  update() {
    this.renderLoop.update();
  }

  getRocketPosition(): { x: number; y: number } {
    return {
      x: this.camera.getCurrentX(this.rocket.x),
      y: this.camera.getCurrentY(this.rocket.y),
    };
  }

  setRocketPosition(position: { x: number; y: number }) {
    this.rocket.setPosition({
      x: this.camera.normalizeX(position.x),
      y: this.camera.normalizeY(position.y),
    });
  }

  getRocketAngle(): number {
    return this.rocket.getCurrentAngle();
  }

  getRocketInitialAngle() {
    return this.rocket.getInitialAngle();
  }

  getRocketSpeed(): number {
    return this.rocket.getSpeed();
  }

  setRocketSpeed(speed: number) {
    return this.rocket.setSpeed(speed);
  }

  setRocketAngle(angle: number) {
    this.rocket.setAngle(angle);
  }

  getCameraXOffset() {
    return this.camera.x;
  }

  getSimulationSpeed() {
    return this.rocket.getSimulationSpeed();
  }

  setSimulationSpeed(speed: number) {
    this.rocket.setSimulationSpeed(speed);
  }
}
