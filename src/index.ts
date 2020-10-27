import { App } from './view/app';

function main() {
  const app = new App();
  app.init();
}

try {
  main();
} catch (error) {
  console.error('Failed to bootstrap');
}
