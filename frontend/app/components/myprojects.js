import React from "react";
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
import users from "@/public/users";

const columns = [
  { name: "My Recent Project", uid: "name" },
  { name: "Status", uid: "status" },
  { name: "Created At", uid: "createdAt" },
  { name: "From", uid: "fromUserId" },
];

const getUserDetailsById = (userId) => {
  return users.find((user) => user.id === userId);
};

const statusColorMap = {
  closed: "success",
  open: "primary",
  inprogress: "warning",
};

export default function MyProjects({ projects = [], user }) {
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

  const filteredProjects = projects.filter(
    (project) => project.toUserId === user.id || project.fromUserId === user.id
  );
  const recentProjects = filteredProjects.slice(0, 10);

  const renderCell = React.useCallback((projects, columnKey) => {
    const cellValue = projects[columnKey];

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
              color={statusColorMap[projects.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          </div>
        );
      case "fromUserId":
        const assignedFrom = getUserDetailsById(projects.fromUserId);
        return (
          <User
            avatarProps={{
              radius: "full",
              size: "sm",
              src: assignedFrom.avatar,
            }}
            description={assignedFrom.email}
            name={assignedFrom.name}
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
      <TableBody items={recentProjects}>
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
