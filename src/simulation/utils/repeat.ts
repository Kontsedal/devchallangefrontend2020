export const repeat = (repeatTimes: number, cb: (index: number) => void) =>
  new Array(repeatTimes).fill(0).forEach((_, index) => cb(index));
