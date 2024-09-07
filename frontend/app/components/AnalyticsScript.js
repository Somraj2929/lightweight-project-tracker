"use client";

import Script from "next/script";

const AnalyticsScript = () => {
  return (
    <Script
      async
      defer
      strategy="afterInteractive"
      data-collect-dnt="true"
      src="https://api.project-tracker.somraj.tech/latest.js"
      data-hostname="project-tracker.somraj.tech"
      onLoad={() => console.log("Simple Analytics script loaded successfully")}
      onError={() => console.error("Failed to load Simple Analytics script")}
    />
  );
};

export default AnalyticsScript;
