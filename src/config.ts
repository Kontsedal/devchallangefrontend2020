export const CONFIG = {
  CANVAS_SELECTOR: '.js-canvas',
  ROCKET: {
    INITIAL_X: 50,
    INITIAL_Y: 200,
    INITIAL_ANGLE: 35,
    INITIAL_SPEED: 150,
    COLLISION_SPEED_MULTIPLIER: 0.8,
    MINIMAL_SPEED: 2,
    SPEED_TO_FIX_ANGLE: 20,
    SIMULATION_SPEED: 5,
    WIDTH: 40,
    HEIGHT: 40,
  },
  CAMERA: {
    INITIAL_X: 20,
    INITIAL_Y: -35,
    MIN_TARGET_OFFSET_X: 20,
    MAX_TARGET_OFFSET_X_PERCENT: 0.3,
    MAX_TARGET_OFFSET_Y: 100,
  },
  WALLS: {
    OFFSET_X: 700,
    REPEAT_TIMES: 40,
    DISTANCE: 400,
    HEIGHT: 200,
    WIDTH: 50,
  },
  GRAVITY_FORCE: 9.8,
  MAX_COLLISION_DEPTH: 20,
  MOVE_ARROW: {
    MAX_HEIGHT: 400,
    MIN_WIDTH: 50,
    MAX_SPEED: 300,
    MIN_SPEED: 50,
  },
};
