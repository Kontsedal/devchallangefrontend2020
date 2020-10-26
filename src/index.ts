import './index.scss';
import { RenderLoop } from './core/renderLoop';
import { Rocket } from './objects/rocket';
import { RenderContext } from './core/renderContext';
import { Camera } from './objects/camera';
import { Ground } from './objects/ground';
import { Wall } from './objects/wall';

export class Simulation {
  private renderLoop: RenderLoop;

  private readonly renderContext: RenderContext;

  private readonly rocket: Rocket;

  private readonly camera: Camera;

  constructor() {
    this.renderContext = new RenderContext('.js-canvas');
    this.renderLoop = new RenderLoop({ renderContext: this.renderContext });
    this.rocket = new Rocket({
      x: 50,
      y: 100,
      angle: 45,
      speed: 120,
      context: this.renderContext,
    });
    this.camera = new Camera({
      target: this.rocket,
      renderContext: this.renderContext,
      x: 20,
      y: -35,
    });
    new Array(40).fill(0).forEach((_, index) => {
      this.renderLoop.addGameObject(
        new Wall({ renderContext: this.renderContext, x: 700 + 400 * index })
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
