export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const res = await fetch("http://localhost:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("data", data);
    console.log("token", data.token);

    if (res.ok) {
      const token = data.token;
      return new Response(JSON.stringify({ token }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
