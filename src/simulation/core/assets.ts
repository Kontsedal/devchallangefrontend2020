export class AssetsManager {
  private assetsQueue: Promise<any>[] = [];

  private assetsMap: Record<string, HTMLImageElement> = {};

  register(assetUrl: string): HTMLImageElement {
    if (this.assetsMap[assetUrl]) {
      return this.assetsMap[assetUrl];
    }
    const img = new Image();
    img.src = assetUrl;
    this.assetsQueue.push(
      new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      })
    );
    return img;
  }

  waitUntilLoaded() {
    return Promise.all(this.assetsQueue);
  }
}
