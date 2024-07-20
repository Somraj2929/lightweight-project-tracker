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

export const fetchAllUsers = async () => {
  const url = `${API_BASE_URL}/users/`;
  return await fetchData(url);
};

export const fetchMessagesByChatId = async (chatId) => {
  const url = `${API_BASE_URL}/chats/${chatId}`;
  return await fetchData(url);
};

export const validateChatId = async (chatid) => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatid}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatid }),
  });

  if (response.ok) {
    return response.json();
  } else {
    return null;
  }
};

export const createChatRoom = async (currentUser) => {
  console.log(currentUser);
  const response = await fetch(`${API_BASE_URL}/chats/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ createdBy: currentUser }),
  });

  if (response.ok) {
    return response.json();
  } else {
    return null;
  }
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to update avatar URL");
  } else {
    return response.json();
  }
};
