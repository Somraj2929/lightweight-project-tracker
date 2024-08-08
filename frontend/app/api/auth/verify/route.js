import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Ensure proper extraction of the token
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) {
      console.error("Authorization header missing");
      console.log("Authorization header missing");
      return new Response(
        JSON.stringify({ message: "Authorization header missing" }),
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Token not provided" }), {
        status: 401,
      });
    }

    // Verify the token with the correct JWT_SECRET

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    return new Response(JSON.stringify(decoded), { status: 200 });
  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }
}
