// Purpouse: This hook is used to check if the user is authenticated and fetch the user info.
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import { getCookie, eraseCookie } from "../utils/cookies";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async (userId, token) => {
      try {
        const response = await fetch(
          `https://starfish-app-ilhlz.ondigitalocean.app/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      if (typeof window !== "undefined") {
        //let token = getCookie("token");
        let token = localStorage.getItem("token");

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
              console.error("Token verification failed");
              //eraseCookie("token");
              localStorage.removeItem("token");
              router.push("/users/login");
            }
          } catch (error) {
            console.error("Error verifying token:", error);
            //eraseCookie("token");
            localStorage.removeItem("token");
            router.push("/users/login");
          }
        } else {
          console.error("No token found, redirecting to login");
          router.push("/users/login");
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { loading, user };
};

export default useAuth;
