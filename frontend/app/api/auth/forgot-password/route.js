export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const res = await fetch(
      "http://localhost:8081/auth/request-password-reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (res.ok) {
      return new Response(
        JSON.stringify({
          message: "Check your email for the password reset link.",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Too many request. Please try again later" }),
        {
          status: 429,
        }
      );
    }
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
