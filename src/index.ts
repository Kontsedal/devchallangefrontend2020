import './index.scss';
import { RenderLoop } from './src/core/renderLoop.ts';
import { GameObject } from './src/interfaces/GameObject.ts';
import { Rocket } from './src/objects/Rocket.ts';
import { RenderContext } from './src/core/renderContext.ts';

export class Simulation {
  private renderLoop: RenderLoop;

  private renderContext: RenderContext;

  private gameObjects: GameObject[] = [];

  private rocket: Rocket;

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
      angle: 45,
      speed: 100,
      context: this.renderContext,
    });
    this.gameObjects.push(this.rocket);
    this.renderLoop.start();
  }

  update() {
    if (
      this.rocket.x >=
      this.renderContext.getWidth() - this.renderContext.getWidth() / 3
    ) {
      this.renderContext.setOffsetX(
        this.rocket.x -
          this.renderContext.getWidth() +
          this.renderContext.getWidth() / 3
      );
    }
    this.gameObjects.forEach((obj) => obj.update());
  }

  render() {
    this.renderContext.clear();
    this.gameObjects.forEach((obj) => obj.render());
  }
}

const simulation = new Simulation();
simulation.start();
