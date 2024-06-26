"use client";
import React from "react";
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
// import { FaEye } from "react-icons/fa";
// import { FaEdit } from "react-icons/fa";
// import { FaTrash } from "react-icons/fa";
// import { VerticalDotsIcon } from "./tableicons/VerticalDotsIcon";
import { EyeIcon } from "./tableicons/EyeIcon";
import { EditIcon } from "./tableicons/EditIcon";
import { DeleteIcon } from "./tableicons/DeleteIcon";
import { SearchIcon } from "./tableicons/SearchIcon";
import { ChevronDownIcon } from "./tableicons/ChevronDownIcon";
import { capitalize } from "./utils";
import {
  columns as allColumns,
  projects as allProjects,
  statusOptions,
} from "../../public/allprojectdata";
import Link from "next/link";

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

export default function SampleProjects() {
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
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return allColumns;

    return allColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProjects = [...allProjects];

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
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((project, columnKey) => {
    const cellValue = project[columnKey];

    switch (columnKey) {
      case "id":
        return <div className="font-semibold">{cellValue}</div>;

      case "name":
        return <div className="text-slate-800 font-semibold ">{cellValue}</div>;
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

      case "assignedFrom":
        return (
          <User
            avatarProps={{ radius: "full", src: project.fromAvatar }}
            name={cellValue}
          >
            {project.assignedFrom}
          </User>
        );

      case "assignedTo":
        return (
          <User
            avatarProps={{ radius: "full", src: project.toAvatar }}
            name={cellValue}
          >
            {project.assignedTo}
          </User>
        );

      case "team":
        return <div className="font-semibold">{cellValue}</div>;
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
            <Tooltip color="danger" content="Delete Project">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
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
                {allColumns.map((column) => (
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
            Total {allProjects.length} projects
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
    allProjects.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <div className="hidden sm:flex w-full justify-between">
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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="All projects table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[auto]", //382px 5 rows
      }}
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
  );
}
