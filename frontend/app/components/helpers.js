import users from "@/public/users";
export function getUserDetailsById(userId) {
  return (
    users.find((user) => user.id === userId) || {
      name: "Unknown User",
      avatar: "",
      age: "",
      team: "",
      status: "",
      role: "",
      email: "",
    }
  );
}
