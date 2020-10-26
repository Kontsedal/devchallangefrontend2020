import './index.scss';
import { RenderLoop } from './core/renderLoop';
import { GameObject } from './interfaces/gameObject';
import { Rocket } from './objects/rocket';
import { RenderContext } from './core/renderContext';
import { Camera } from './objects/camera';
import { Ground } from './objects/ground';
import { Wall } from './objects/wall';
import { getCollisions } from './core/collision';

export class Simulation {
  private renderLoop: RenderLoop;

  private readonly renderContext: RenderContext;

  private gameObjects: GameObject[] = [];

  private readonly rocket: Rocket;

  private readonly camera: Camera;

  constructor() {
    this.renderLoop = new RenderLoop({
      onUpdate: this.update.bind(this),
      onRender: this.render.bind(this),
    });
    this.renderContext = new RenderContext('.js-canvas');
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
  }

  start() {
    new Array(40).fill(0).forEach((_, index) => {
      this.gameObjects.push(
        new Wall({ renderContext: this.renderContext, x: 700 + 400 * index })
      );
    });
    this.gameObjects.push(new Ground(this.renderContext));

    this.gameObjects.push(this.rocket);
    this.gameObjects.push(this.camera);
    this.renderLoop.start();
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
}

const simulation = new Simulation();
simulation.start();
