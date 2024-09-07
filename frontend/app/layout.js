import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata = {
  title: "Project Management System",
  description: "Project Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
        {/* <script src="https://scripts.simpleanalyticscdn.com/latest.js" /> */}

        <noscript>
          <img
            src="https://api.project-tracker.somraj.tech/noscript.gif"
            alt=""
            referrerpolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
      <Script
        async
        defer
        strategy="afterInteractive"
        data-collect-dnt="true"
        src="https://api.project-tracker.somraj.tech/latest.js"
        data-hostname="https://project-tracker.somraj.tech"
        onLoad={() =>
          console.log("Simple Analytics script loaded successfully")
        }
        onError={() => console.error("Failed to load Simple Analytics script")}
      />
    </html>
  );
}
