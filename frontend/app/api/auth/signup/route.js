export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { name, email, team, role, password } = await req.json();

    const response = await fetch("http://localhost:8081/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, team, role, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token;
      return new Response(JSON.stringify({ token }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Signup failed" }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
