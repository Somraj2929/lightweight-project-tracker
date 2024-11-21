export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    const res = await fetch(
      "https://somraj-project-tracker-nma47.ondigitalocean.app/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      }
    );

    if (res.ok) {
      return new Response(
        JSON.stringify({
          message: "Password reset successful.",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Error resetting password." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
