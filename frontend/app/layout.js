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
        <AnalyticsScript />
      </body>
    </html>
  );
}
