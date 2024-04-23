"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Input,
  Pagination,
  Card,
  CardBody,
  CardFooter,
  Tooltip,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { DeleteIcon } from "@/icons/table/deleteIcon";
import dayjs from "dayjs";
import {
  addOpeningAmount,
  getOpeningAmount,
} from "../openingAmountApiCalls/data";
import { getSalaryData, deleteSalaryData } from "./data";
import { AddSalary } from "./addSalary";
import { useGlobalAmountContext } from "../layout/openingAmountContext";

interface SalaryExpenditureType {
  createdAt: string;
  salary: {
    [key: string]: string;
  };
  id: string;
}

const SalaryExpenses = () => {
  const [previousTotal, setPreviousTotal] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);
  const [allSalaryExpenditureData, setAllSalaryExpenditureData] = useState<
    SalaryExpenditureType[]
  >([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const { previousAmount, setPreviousAmount } = useGlobalAmountContext();

  const fetchSalaryExpenditureData = async () => {
    try {
      await getSalaryData().then((res: any) => {
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
          setAllSalaryExpenditureData(res?.data);
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
        const res = await deleteSalaryData(id);
        if (res?.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchSalaryExpenditureData();
          const totalAmount =
            res.data.data.salary.openingAmount - res.data.data.salary.total;
          await addOpeningAmount(
            previousAmount.id,
            previousAmount.closingAmount + totalAmount
          );
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
    let filteredData = [...allSalaryExpenditureData];
    filteredData = filteredData.filter((data) =>
      dayjs(data?.salary?.date).format("DD/MM/YYYY").includes(filterValue)
    );
    return filteredData;
  }, [allSalaryExpenditureData, filterValue, setFilterValue]);

  let pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [
    page,
    allSalaryExpenditureData,
    setRowsPerPage,
    rowsPerPage,
    filteredItems,
  ]);

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
    fetchSalaryExpenditureData();
    getOpeningAmount().then((res) =>
      setPreviousAmount(res?.data)
    );
    setIsAdded(false);
  }, [isAdded, setIsAdded]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="mx-4 mt-4">Add Salary Expenses</h3>
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
          <AddSalary
            previousTotal={previousAmount.closingAmount}
            previousId={previousAmount.id}
            setIsAdded={setIsAdded}
          />
        </div>
      </div>
      <div className="flex justify-between mx-4">
        <p>Total documents: {allSalaryExpenditureData.length}</p>
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
        <div className="flex flex-wrap justify-center gap-4">
          {items &&
            items.map((data, index) => (
              <Card
                isFooterBlurred
                className="w-[20rem] md:w-fit overflow-auto"
                key={data.id}
              >
                <CardBody className="overflow-auto">
                  {Object.keys(data.salary).map((keys, index) => (
                    <div className="flex gap-3" key={`salary=${index}`}>
                      <p>{keys}: </p>
                      {keys === "date" ? (
                        dayjs(data.salary[keys]).format("DD/MM/YYYY")
                      ) : (
                        <p>{data.salary[keys]}</p>
                      )}
                    </div>
                  ))}
                </CardBody>
                <CardFooter className="justify-center mb-3 before:bg-white/10 border-white/20 border-1 overflow-auto py-1 before:rounded-xl rounded-large w-[calc(100%_-_8px)] shadow-small ml-1">
                  <Tooltip content="Delete data" color="danger">
                    <button
                      className=""
                      onClick={() => {
                        deleteData(data.id);
                      }}
                    >
                      <DeleteIcon size={20} fill="#FF0080" />
                    </button>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
        </div>
        <div className="flex w-full justify-center my-5">
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
      </div>
    </div>
  );
};

export default SalaryExpenses;
