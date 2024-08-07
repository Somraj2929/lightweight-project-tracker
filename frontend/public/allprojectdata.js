const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "TEAM", uid: "team" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "UPDATED AT", uid: "updatedAt", sortable: true },
  { name: "FROM", uid: "assignedFrom" },
  { name: "TO", uid: "assignedTo" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Open", uid: "open" },
  { name: "InProgress", uid: "inprogress" },
  { name: "Closed", uid: "closed" },
];

const projects = [
  {
    id: 1,
    name: "Build website using NextJS",
    team: "mamaearth",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Tony Reichert",
    assignedTo: "Tony",
    toAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    fromAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    description:
      "A project to build a website using NextJS for Mamaearth team. Add a new feature to the website.",
  },
  {
    id: 2,
    name: "Build a mobile app",
    team: "Development",
    status: "inprogress",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Zoey Lang",
    assignedTo: "Zoey",
    toAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    fromAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    description: "A project to build a mobile app for the Development team.",
  },
  {
    id: 3,
    name: "Build a CRM system",
    team: "Development",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Jane Fisher",
    assignedTo: "Jane",
    toAvatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    fromAvatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    description: "A project to build a CRM system for the Development team.",
  },
  {
    id: 4,
    name: "Build a marketing campaign",
    team: "Marketing",
    status: "closed",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "William Howard",
    assignedTo: "William",
    toAvatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    fromAvatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    description:
      "A project to build a marketing campaign for the Marketing team.",
  },
  {
    id: 5,
    name: "Build a sales strategy",
    team: "Sales",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Kristen Copper",
    assignedTo: "Kristen",
    toAvatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    fromAvatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    description: "A project to build a sales strategy for the Sales team.",
  },
  {
    id: 6,
    name: "Build a website using NextJS",
    team: "Management",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Tony Reichert",
    assignedTo: "Tony",
    toAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    fromAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    description:
      "A project to build a website using NextJS for the Management team.",
  },
  {
    id: 7,
    name: "Build a mobile app",
    team: "Design",
    status: "inprogress",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Zoey Lang",
    assignedTo: "Zoey",
    toAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    fromAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    description: "A project to build a mobile app for the Design team.",
  },
  {
    id: 8,
    name: "Build a CRM system",
    team: "HR",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Jane Fisher",
    assignedTo: "Jane",
    toAvatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    fromAvatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    description: "A project to build a CRM system for the HR team.",
  },
  {
    id: 9,
    name: "Build a marketing campaign",
    team: "Finance",
    status: "closed",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "William Howard",
    assignedTo: "William",
    toAvatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    fromAvatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    description:
      "A project to build a marketing campaign for the Finance team.",
  },
  {
    id: 10,
    name: "Build a sales strategy",
    team: "Operations",
    status: "open",
    createdAt: "2021-09-03",
    updatedAt: "2021-09-03",
    assignedFrom: "Kristen Copper",
    assignedTo: "Kristen",
    toAvatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    fromAvatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    description: "A project to build a sales strategy for the Operations team.",
  },
];

export { columns, projects, statusOptions };
