const s3 = require('s3');
const path = require('path');
const task = require('./task');
require('dotenv').config({path: '.env'});

module.exports = task('upload', () => Promise.resolve()
  .then(() => Uploader)
);
const Uploader = new Promise((resolve, reject) => {
  const client = s3.createClient({
  s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.YOUR_AWS_SECRET_KEY,
      region: 'ap-southeast-1',
      sslEnabled: true,
    },
  });
  const uploader = client.uploadDir({
    localDir: './static/dist',
    deleteRemoved: true,
    s3Params: {
      Bucket: process.env.BUCKET_NAME
    },
  });
  uploader.on('error', reject);
  uploader.on('end', resolve);
});