type Options = {
  fps?: number;
  onRender: () => void;
  onUpdate: () => void;
};

export class RenderLoop {
  private readonly frameLengthSeconds: number;

  private readonly onRender: () => void;

  private readonly onUpdate: () => void;

  private animationFrameId: number;

  constructor({ fps = 60, onRender, onUpdate }: Options) {
    this.frameLengthSeconds = 1 / fps;
    this.onRender = onRender;
    this.onUpdate = onUpdate;
    this.animationFrameId = 0;
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
        this.onUpdate();
      }
      lastTimestamp = currentTimestamp;

      this.onRender();
      this.animationFrameId = requestAnimationFrame(tick);
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }
}
