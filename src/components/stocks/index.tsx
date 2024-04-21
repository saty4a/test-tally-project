"use client";

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
  CircularProgress,
} from "@nextui-org/react";
import { AddStocks } from "./addStocks";
import { getStockDatas, getStocknames } from "./data";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddStocksCode } from "./addStockName";
import axios from "axios";
import Swal from "sweetalert2";
import { DeleteIcon } from "@/icons/table/deleteIcon";
import dayjs from "dayjs";

export const Stocks = () => {
  const [stockNames, setStockNames] = useState<string[]>();
  const [isAdded, setIsAdded] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [tableHeaderNames, setTableHeaderNames] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [newfinalData, setNewFinalData] = useState({});
  let ModifiedStockNames: any[] = [];

  const fetchStockNames = async () => {
    let array = [];
    let arr1 = [];
    let arr3 = [];
    try {
      const response = await getStocknames().then((res: any) => {
        if (res?.data?.error) {
          Swal.fire({
            icon: "error",
            title: "oops...",
            text: `Server Error: ${res.data?.error}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }

        if (!res.data.error) {
          let obj = res.data[0];
          for (let index = 0; index < Object.values(obj).length; index++) {
            if (index > 0 && index < 8) {
              ModifiedStockNames[index - 1] = Object.values(obj)[index];
              array[index - 1] = (
                <TableHeaderData
                  type={"opening"}
                  data={Object.values(obj)[index]}
                />
              );
              arr1[index - 1] = (
                <TableHeaderData
                  type={"closing"}
                  data={Object.values(obj)[index]}
                />
              );
              arr3[index - 1] = (
                <TableHeaderData
                  type={"final"}
                  data={Object.values(obj)[index]}
                />
              );
            }
          }
          setStockNames(ModifiedStockNames);
        }
        const newarr = ["date", ...array, ...arr1, ...arr3, "actions"];
        setTableHeaderNames(newarr);
      });
    } catch (error) {
      console.error("Error Details:", error);
    }
  };

  const fetchStockData = async () => {
    getStockDatas().then((res) => {
      setStockData(res?.data?.data), setNewFinalData(res?.data?.data[0]);
    });
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
        const res = await axios.delete(`/api/stockdata/${id}`);
        if (res.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchStockData();
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
    let filteredData = [...stockData];

    filteredData = filteredData.filter((data) =>
      dayjs(data?.date).format("DD/MM/YYYY").includes(filterValue)
    );

    return filteredData;
  }, [stockData, filterValue, setFilterValue]);

  let pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, stockData, setRowsPerPage, rowsPerPage, filteredItems]);

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
    fetchStockNames();
    fetchStockData();
    setIsAdded(false);
  }, [isAdded, setIsAdded]);

  return (
    <div className="mt-5 mx-4 overflow-auto w-none">
      <h3 className="ms-1">Add Stocks</h3>
      <div className="flex justify-between mt-5">
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
          <AddStocksCode setIsAdded={setIsAdded} />
          <AddStocks
            stockNames={stockNames}
            setIsAdded={setIsAdded}
            newfinalData={newfinalData}
          />
        </div>
      </div>
      <div className="flex justify-between my-3">
        <p>Total documents: {stockData.length}</p>
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
      {tableHeaderNames.length === 0 ? (
        <CircularProgress
          size="lg"
          label="Loading..."
          aria-label="loading..."
          className="m-auto"
        />
      ) : (
        <div className="my-5">
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
              {tableHeaderNames.length > 0 ? (
                tableHeaderNames.map((data, index) => (
                  <TableColumn
                    key={index}
                    className="text-[14px] py-2 px-1 text-center"
                  >
                    {data}
                  </TableColumn>
                ))
              ) : (
                <TableColumn>empty</TableColumn>
              )}
            </TableHeader>
            <TableBody items={items} emptyContent={"No data to display"}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell className="">
                    {dayjs(item.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P1}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P2}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P3}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P4}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P5}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P6}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.opening_P7}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P1}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P2}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P3}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P4}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P5}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P6}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.closing_P7}
                  </TableCell>
                  <TableCell className="text-center">{item.final_P1}</TableCell>
                  <TableCell className="text-center">{item.final_P2}</TableCell>
                  <TableCell className="text-center">{item.final_P3}</TableCell>
                  <TableCell className="text-center">{item.final_P4}</TableCell>
                  <TableCell className="text-center">{item.final_P5}</TableCell>
                  <TableCell className="text-center">{item.final_P6}</TableCell>
                  <TableCell className="text-center">{item.final_P7}</TableCell>
                  <TableCell className="">
                    <Tooltip content="Delete data" color="danger">
                      <button className="" onClick={() => deleteData(item.id)}>
                        <DeleteIcon size={20} fill="#FF0080" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const TableHeaderData = ({ type, data }: { type: string; data: any }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="">{type}</p>
      {data}
    </div>
  );
};
