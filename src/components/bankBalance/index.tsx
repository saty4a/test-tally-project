"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { deleteBankAmountData, getBankAmountData } from "./data";
import { getOpeningAmount } from "../openingAmountApiCalls/data";
import {
  openingDataType,
  useGlobalAmountContext,
} from "../layout/openingAmountContext";
import { AddOpeningAmount } from "./addOpeningAmount";

const BankBalance = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [bankAmountData, setBankAmountData] = useState<openingDataType[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const { previousAmount, setPreviousAmount } = useGlobalAmountContext();

  const fetchBankAmounts = async () => {
    try {
      await getBankAmountData().then((res: any) => {
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
          setBankAmountData(res?.data);
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
        const res = await deleteBankAmountData(id);
        if (res?.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchBankAmounts();
          setIsAdded(true);
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
    let filteredData = [...bankAmountData];
    filteredData = filteredData.filter((data) =>
      dayjs(data.createdAt).format("DD/MM/YYYY").includes(filterValue)
    );
    return filteredData;
  }, [bankAmountData, filterValue, setFilterValue]);

  let pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, bankAmountData, setRowsPerPage, rowsPerPage, filteredItems]);

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
    fetchBankAmounts();
    getOpeningAmount().then((res) => {
      setPreviousAmount(res?.data);
    });
    setIsAdded(false);
  }, [isAdded, setIsAdded]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="mx-4 mt-4">Add Bank Balance</h3>
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
          <AddOpeningAmount
            previousTotal={previousAmount}
            setIsAdded={setIsAdded}
          />
        </div>
      </div>
      <div className="flex justify-between mx-4">
        <p>Total documents: {bankAmountData.length}</p>
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
            <TableColumn>currentAccount</TableColumn>
            <TableColumn>CBFS</TableColumn>
            <TableColumn>cash</TableColumn>
            <TableColumn>others</TableColumn>
            <TableColumn>closingAmount</TableColumn>
            <TableColumn>gst1</TableColumn>
            <TableColumn>gst2</TableColumn>
            <TableColumn>actions</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent={"No data to display"}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {dayjs(item.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{item.openingAmount}</TableCell>
                <TableCell>{item.currentAccount}</TableCell>
                <TableCell>{item.cbfs}</TableCell>
                <TableCell>{item.cash}</TableCell>
                <TableCell>{item.others}</TableCell>
                <TableCell>{item.closingAmount}</TableCell>
                <TableCell>{item.gst1}</TableCell>
                <TableCell>{item.gst2}</TableCell>
                <TableCell className="">
                  <Tooltip content="Delete data" color="danger">
                    <button
                      className=""
                      onClick={() => {
                        deleteData(item.id);
                      }}
                    >
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

export default BankBalance;
