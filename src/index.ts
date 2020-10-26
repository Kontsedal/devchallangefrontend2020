import './index.scss';
import { RenderLoop } from './core/renderLoop';
import { Rocket } from './objects/rocket';
import { RenderContext } from './core/renderContext';
import { Camera } from './objects/camera';
import { Ground } from './objects/ground';
import { Wall } from './objects/wall';
import { CONFIG } from './config';
import { repeat } from './utils/repeat';

export class Simulation {
  private renderLoop: RenderLoop;

  private readonly renderContext: RenderContext;

  private readonly rocket: Rocket;

  private readonly camera: Camera;

  constructor() {
    this.renderContext = new RenderContext(CONFIG.CANVAS_SELECTOR);
    this.renderLoop = new RenderLoop({ renderContext: this.renderContext });
    this.rocket = new Rocket({
      x: CONFIG.ROCKET.INITIAL_X,
      y: CONFIG.ROCKET.INITIAL_Y,
      angle: CONFIG.ROCKET.INITIAL_ANGLE,
      speed: CONFIG.ROCKET.INITIAL_SPEED,
      context: this.renderContext,
    });
    this.camera = new Camera({
      target: this.rocket,
      renderContext: this.renderContext,
      x: CONFIG.CAMERA.INITIAL_X,
      y: CONFIG.CAMERA.INITIAL_Y,
    });
    repeat(CONFIG.WALLS.REPEAT_TIMES, (index) => {
      this.renderLoop.addGameObject(
        new Wall({
          renderContext: this.renderContext,
          x: CONFIG.WALLS.OFFSET_X + CONFIG.WALLS.DISTANCE * index,
          height: CONFIG.WALLS.HEIGHT,
          width: CONFIG.WALLS.WIDTH,
        })
      );
    });
    this.renderLoop.addGameObject(new Ground(this.renderContext));

    this.renderLoop.addGameObject(this.rocket);
    this.renderLoop.addGameObject(this.camera);
  }

  start() {
    this.renderLoop.start();
  }
}

const simulation = new Simulation();
simulation.start();
