import * as process from 'node:process';

export default () => ({
  sqsEndpoint: process.env.SQS_ENDPOINT || 'http://localhost:9324/000000000000',
  region: process.env.AWS_REGION || 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
