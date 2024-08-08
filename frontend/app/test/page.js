"use client";
import React, { useState, useEffect } from "react";

const Testing = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null); // State to store errors

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch(
          "https://somraj-project-tracker-nma47.ondigitalocean.app/projects"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError(error.message); // Update error state
      }
    };

    fetchProjectsData();
  }, []);

  // Display loading indicator or error message conditionally
  if (error) {
    return <div>Error fetching projects: {error}</div>;
  }

  // Display projects if fetched successfully
  return (
    <div>
      <h1>Testing Page</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Testing;
