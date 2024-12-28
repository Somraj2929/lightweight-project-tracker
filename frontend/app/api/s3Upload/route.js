import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, fileType } = body;
    console.log("S3 Access Key ID:", process.env.S3_ACCESS_KEY_ID);
    // Generate a single unique file name
    const uniqueFileName = `profiles/${Date.now()}-${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName,
      Expires: 60,
      ContentType: fileType,
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;

    return new Response(JSON.stringify({ signedUrl, fileUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate signed URL" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
