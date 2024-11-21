import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import AnalyticsScript from "@/app/components/AnalyticsScript";

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

        <AnalyticsScript />
        <noscript>
          <img
            src="https://api.project-tracker.somraj.tech/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
    </html>
  );
}
