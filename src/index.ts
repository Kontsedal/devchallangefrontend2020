import { App } from './view/app';

async function main() {
  const app = new App();
  await app.init();
}

main().catch(() => {
  console.error('Failed to bootstrap');
});
