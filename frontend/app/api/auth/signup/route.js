import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, team, role, password } = req.body;

    // Replace with your signup logic
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
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Signup failed" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
