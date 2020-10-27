export class Component<S extends Record<string, any>> {
  private prevState: S | undefined;

  // @ts-ignore
  public state;

  setState(newState: S) {
    this.prevState = this.state;
    this.state = newState;
    this.render();
  }

  isStateEntryChanged(path: string): boolean {
    if (typeof this.state === 'undefined') {
      return false;
    }
    if (typeof this.prevState === 'undefined') {
      return true;
    }

    const extractValue = (state: S, pathStr: string) =>
      pathStr.split('.').reduce((result, key) => result[key], state);
    return (
      extractValue(this.state, path) !== extractValue(this.prevState, path)
    );
  }

  isStateEntriesChanged(paths: string[] = []) {
    return paths.reduce(
      (result, path) => result || this.isStateEntryChanged(path),
      false
    );
  }

  effect(callback: () => void, statePaths: string[]) {
    if (this.isStateEntriesChanged(statePaths)) {
      callback();
    }
  }

  setStyles(
    element: HTMLElement | void,
    styles: Partial<Record<keyof CSSStyleDeclaration, string | number>>
  ) {
    if (!element) {
      return;
    }

    Object.entries(styles).forEach(([key, value]) => {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      element.style[key] = typeof value === 'number' ? `${value}px` : value;
    });
  }

  render() {}
}
