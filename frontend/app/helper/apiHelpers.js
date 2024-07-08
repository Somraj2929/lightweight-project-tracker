const API_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8081";
const token = localStorage.getItem("token");

// Helper function to fetch data and parse JSON
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Fetch columns
export const fetchColumns = async () => {
  const url = `${API_BASE_URL}/statusandcolumns/`;
  return await fetchData(url);
};

// Fetch projects
export const fetchProjects = async () => {
  const url = `${API_BASE_URL}/projects/`;
  return await fetchData(url);
};

export const fetchProjectById = async (id) => {
  const url = `${API_BASE_URL}/projects/${id}`;
  return await fetchData(url);
};
