// import '@tensorflow/tfjs-node';

import Container from 'typedi';
import { FaceAnalyticsApplication } from '@/FaceAnalyticsApplication';

async function main () {
  const application = Container.get(FaceAnalyticsApplication);
  await application.start();
}

main();
