import './index.scss';
import { RenderLoop } from './src/core/renderLoop.ts';
import { GameObject } from './src/interfaces/GameObject.ts';
import { Rocket } from './src/objects/rocket.ts';
import { RenderContext } from './src/core/renderContext.ts';
import { Camera } from './src/objects/camera.ts';
import { Ground } from './src/objects/ground.ts';

export class Simulation {
  private renderLoop: RenderLoop;

  private renderContext: RenderContext;

  private gameObjects: GameObject[] = [];

  private rocket: Rocket;

  private camera: Camera;

  constructor() {
    this.renderLoop = new RenderLoop({
      onUpdate: this.update.bind(this),
      onRender: this.render.bind(this),
    });
  }

  start() {
    this.renderContext = new RenderContext('.js-canvas');
    this.rocket = new Rocket({
      x: 0,
      y: 300,
      angle: 30,
      speed: 100,
      context: this.renderContext,
    });
    this.camera = new Camera({
      target: this.rocket,
      renderContext: this.renderContext,
      x: 20,
      y: -35,
    });
    this.gameObjects.push(new Ground(this.renderContext));
    this.gameObjects.push(this.rocket);
    this.gameObjects.push(this.camera);
    this.renderLoop.start();
  }

  update() {
    this.gameObjects.forEach((obj) => obj.update());
  }

  render() {
    this.renderContext.clear();
    this.gameObjects.forEach((obj) => obj.render());
  }
}

const simulation = new Simulation();
simulation.start();
