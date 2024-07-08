// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async (userId, token) => {
      try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            await fetchUserInfo(userData.userID, token); // Pass token for fetching user info
          } else {
            localStorage.removeItem("token");
            router.push("/users/login");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          router.push("/users/login");
        }
      } else {
        router.push("/users/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  return { loading, user };
};

export default useAuth;
