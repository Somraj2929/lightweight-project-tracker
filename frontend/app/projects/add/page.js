"use client";
const { default: AddProject } = require("../../components/addproject");
const { default: SidePanel } = require("../../components/sidepanel");
const { default: useAuth } = require("../../hooks/useAuth");
const { useRouter } = require("next/navigation");
const { useEffect } = require("react");

const NewProject = () => {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/users/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <AddProject user={user} />
    </>
  );
};

export default NewProject;
