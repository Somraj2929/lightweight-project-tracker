"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import { PlusIcon } from "./tableicons/PlusIcon";
import { EyeIcon } from "./tableicons/EyeIcon";
import { EditIcon } from "./tableicons/EditIcon";
import { DeleteIcon } from "./tableicons/DeleteIcon";
import { SearchIcon } from "./tableicons/SearchIcon";
import { ChevronDownIcon } from "./tableicons/ChevronDownIcon";
import { capitalize } from "./utils";
//import users from "@/public/users";
import Link from "next/link";
import {
  fetchColumns,
  fetchProjects,
  fetchAllUsers,
  deleteProjects,
} from "../helper/apiHelpers";
import SpinnerCustom from "./spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap = {
  open: "primary",
  inprogress: "warning",
  closed: "success",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "status",
  "createdAt",
  "assignedFrom",
  "actions",
];

export default function FetchAllProjects({ currentUser }) {
  const [columns, setColumns] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [columnsData, projectsData, usersData] = await Promise.all([
          fetchColumns(),
          fetchProjects(),
          fetchAllUsers(),
        ]);

        setStatusOptions(columnsData[0].statusOptions);
        setColumns(columnsData[0].columns);
        setProjects(projectsData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const unauthorized = () =>
    toast("You are not the creator of the project", { type: "error" });

  const authorized = () =>
    toast("Project deleted successfully", { type: "success" });

  const handleProjectDelete = async (projectFromUserId, projectId) => {
    const authorizedUser = currentUser.id;

    if (projectFromUserId === authorizedUser) {
      try {
        const response = await deleteProjects(projectId, authorizedUser);

        if (response.success === true) {
          authorized();
          window.location.reload();
        } else {
          console.error("Error deleting project:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    } else {
      unauthorized();
    }
  };

  const getUserDetailsById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const formatDate = useCallback((inputDate) => {
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

    return `${monthAbbreviation} ${day}, ${year}`;
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredProjects = [...projects];

    if (hasSearchFilter) {
      filteredProjects = filteredProjects.filter((project) =>
        project.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredProjects = filteredProjects.filter((project) =>
        Array.from(statusFilter).includes(project.status)
      );
    }

    return filteredProjects;
  }, [filterValue, statusFilter, projects]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (project, columnKey) => {
      const cellValue = project[columnKey];

      switch (columnKey) {
        case "id":
          return <div className="font-semibold">{cellValue}</div>;

        case "name":
          return (
            <div className="text-slate-800 font-semibold ">{cellValue}</div>
          );
        case "status":
          return (
            <Chip
              className="uppercase font-bold"
              color={statusColorMap[project.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );

        case "createdAt":
          return <div className="font-semibold">{formatDate(cellValue)}</div>;

        case "updatedAt":
          return <div className="font-semibold">{formatDate(cellValue)}</div>;

        case "fromUserId":
          const assignedFromUser = getUserDetailsById(project.fromUserId);
          return (
            <User
              avatarProps={{ radius: "full", src: assignedFromUser.avatar }}
              name={assignedFromUser.name}
              description={assignedFromUser.email}
            ></User>
          );

        case "toUserId":
          const assignedToUser = getUserDetailsById(project.toUserId);
          return (
            <User
              avatarProps={{ radius: "full", src: assignedToUser.avatar }}
              name={assignedToUser.name}
              description={assignedToUser.email}
            ></User>
          );

        case "team":
          return <div className="font-semibold capitalize">{cellValue}</div>;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Link href={`/projects/view/${project.id}`}>
                <Tooltip color="primary" content="View Project">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Tooltip>
              </Link>
              <Link href={`/projects/edit/${project.id}`}>
                <Tooltip color="primary" content="Edit Project">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
              </Link>
              <div
                onClick={() =>
                  handleProjectDelete(project.fromUserId, project.id)
                }
              >
                <Tooltip color="danger" content="Delete Project">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [users]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 w-auto">
        <div className="flex justify-between flex-col md:flex-row gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[30%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  className="font-medium bg-blue-100"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  className="font-medium bg-blue-100"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Link href="/projects/add">
              <Button color="primary" endContent={<PlusIcon />}>
                Add New
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {projects.length} projects
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    projects.length,
    onSearchChange,
    onClear,
    columns,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <div className="flex w-full justify-between">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="solid"
            color="primary"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="solid"
            color="primary"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  if (loading) {
    return (
      <>
        <SpinnerCustom />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Table
        aria-label="All projects table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-auto w-auto",
        }}
        className="w-auto"
        selectedKeys={selectedKeys}
        selectionMode="single"
        selectionBehavior="toggle"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No project found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
