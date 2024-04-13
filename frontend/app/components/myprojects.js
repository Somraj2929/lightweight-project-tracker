import React, { Children } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
} from "@nextui-org/react";

const columns = [
  { name: "Project", uid: "name" },
  { name: "Status", uid: "status" },
  { name: "Created At", uid: "createdAt" },
  { name: "From", uid: "assignedFrom" },
];

const projects = [
  {
    id: 1,
    name: "Build a website using NextJS and TailwindCSS",
    team: "Mamaearth",
    status: "inprogress",
    createdAt: "2021-09-03",
    assignedFrom: "Tony Reichert",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Build a mobile app",
    team: "TheDermaCo",
    status: "open",
    createdAt: "2021-09-03",
    assignedFrom: "Zoey Lang",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Build a CRM system",
    team: "CRM Team",
    status: "closed",
    createdAt: "2021-09-03",
    assignedFrom: "Jane Fisher",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "Build a marketing campaign",
    team: "Marketing",
    status: "closed",
    createdAt: "2021-09-03",
    assignedFrom: "William Howard",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Build a sales strategy",
    team: "Sales",
    status: "inprogress",
    createdAt: "2021-09-03",
    assignedFrom: "Kristen Copper",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

const statusColorMap = {
  closed: "success",
  open: "primary",
  inprogress: "warning",
};

export default function MyProjects() {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthAbbreviation = monthNames[date.getMonth()];

    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${monthAbbreviation} ${day}, ${year}`;

    return formattedDate;
  }

  const renderCell = React.useCallback((project, columnKey) => {
    const cellValue = project[columnKey];

    switch (columnKey) {
      case "name":
        return <div className="text-slate-800 font-semibold ">{cellValue}</div>;
      case "createdAt":
        return <div className="font-semibold">{formatDate(cellValue)}</div>;
      case "status":
        return (
          <div className="">
            <Chip
              className="uppercase font-bold"
              color={statusColorMap[project.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          </div>
        );
      case "assignedFrom":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: project.avatar }}
            // description={project.email}
            name={cellValue}
            className="font-semibold"
          ></User>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table isStriped aria-label="my latest projects">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "name" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={projects}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
