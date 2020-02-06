import { connect, disconnect, seed, clean } from './utils';

async function main() {
  try {
    await clean();
    await seed();
    await disconnect();
  } catch (err) {
    console.error(err);
  }
}

main();
