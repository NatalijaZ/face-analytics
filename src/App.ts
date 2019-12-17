import Container from 'typedi';
import { FaceAnalyticsApplication } from '@/FaceAnalyticsApplication';

function main () {
  const application = Container.get(FaceAnalyticsApplication);
  application.start();
}

main();
