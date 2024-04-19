const { default: AddProject } = require("../../components/addproject");
const { default: SidePanel } = require("../../components/sidepanel");

const NewProject = () => {
  return (
    <>
      <SidePanel />
      <AddProject />
    </>
  );
};

export default NewProject;
