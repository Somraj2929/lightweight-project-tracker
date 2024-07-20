const s3Config = {
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
  region: process.env.NEXT_PUBLIC_S3_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  dirName: process.env.NEXT_PUBLIC_S3_DIR_NAME,
};

export default s3Config;
