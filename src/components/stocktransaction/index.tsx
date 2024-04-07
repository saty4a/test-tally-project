"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddAmount } from "./addAmount";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { DeleteIcon } from "@/icons/table/deleteIcon";
import dayjs from "dayjs";
import { deleteStockAmount, getStockAmounts } from "./data";

const StockTransaction = () => {
  const [previousTotal, setPreviousTotal] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);
  const [stockAmountData, setStockAmountData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  const fetchStockAmounts = async () => {
    try {
      await getStockAmounts().then((res: any) => {
        if (res?.data?.error) {
          Swal.fire({
            icon: "error",
            title: "oops...",
            text: `Server Error: ${res.data?.error}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (!res?.data?.error) {
          setStockAmountData(res?.data?.data);
          setPreviousTotal(res?.data?.data[0].total)
        }
      });
    } catch (error) {}
  };

  const deleteData = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteStockAmount(id);
        if (res?.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchStockAmounts();
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };

  const filteredItems = useMemo(() => {
    let filteredData = [...stockAmountData];
    filteredData = filteredData.filter((data) => data.date.includes(filterValue));
    return filteredData;
  },[stockAmountData, filterValue, setFilterValue])

  let pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  },[])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  },[page, stockAmountData, setRowsPerPage, rowsPerPage, filteredItems])

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  useEffect(() => {
    fetchStockAmounts();
    setIsAdded(false);
  }, [isAdded, setIsAdded]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="mx-4 mt-4">Add Stocks Transaction</h3>
      <div className="flex justify-between mt-5 mx-3">
        <Input
          isClearable
          type="text"
          placeholder="search by date..."
          className="w-1/5"
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <AddAmount previousTotal={previousTotal} setIsAdded={setIsAdded} />
        </div>
      </div >
      <div className="flex justify-between mx-4">
        <p>Total documents: {stockAmountData.length}</p>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small cursor-pointer"
            onChange={(e) => onRowsPerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </label>
      </div> 
      <div className="mx-4">
      <Table
        aria-label="Example static collection table w-full overflow-auto"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>date</TableColumn>
          <TableColumn>openingAmount</TableColumn>
          <TableColumn>cylinders</TableColumn>
          <TableColumn>loadAmount</TableColumn>
          <TableColumn>soldCylinders</TableColumn>
          <TableColumn>soldAmount</TableColumn>
          <TableColumn>total</TableColumn>
          <TableColumn>actions</TableColumn>
        </TableHeader>
        <TableBody items={items} emptyContent={"No data to display"}>
          {(item) => (
            <TableRow key={item.id}>
                <TableCell>
                {dayjs(item.date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                {item.openingAmount}
                </TableCell>
                <TableCell>
                {item.cylinders}
                </TableCell>
                <TableCell>
                {item.loadAmount}
                </TableCell>
                <TableCell>
                {item.soldCylinders}
                </TableCell>
                <TableCell>
                {item.soldAmount}
                </TableCell>
                <TableCell>
                {item.total}
                </TableCell>
                <TableCell className="">
                    <Tooltip content="Delete user" color="danger">
                      <button className="" onClick={() => { deleteData(item.id) }}>
                        <DeleteIcon size={20} fill="#FF0080" />
                      </button>
                    </Tooltip>
                  </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default StockTransaction;

