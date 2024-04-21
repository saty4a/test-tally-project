import { useEffect, useState } from "react";
import { AddStocksCode } from "../stocks/addStockName";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import Swal from "sweetalert2";
import { getStocknames } from "../stocks/data";
import { AddAmount } from "../stocktransaction/addAmount";
import { getOpeningAmount } from "../openingAmountApiCalls/data";
import { AddOpeningAmount } from "../bankBalance/addOpeningAmount";
import { useGlobalAmountContext } from "../layout/openingAmountContext";
import dayjs from "dayjs";

export interface openingDataType {
  id: string;
  currentAccount: number;
  cbfs: number;
  cash: number;
  others: number;
  openingAmount: number;
  createdAt: Date;
  gst1: number;
  gst2: number;
  closingAmount: number;
}

const LesureData = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [stockNames, setStockNames] = useState<string[]>([]);
  const [transactionData, setTransactionData] = useState({
    date: "",
    openingAmount: 0,
    cylinders: 0,
    loadAmount: 0,
    soldCylinders: 0,
    soldAmount: 0,
    total: 0,
  });
  const { previousAmount, setPreviousAmount } = useGlobalAmountContext();
  const [previousTotal, setPreviousTotal] = useState<openingDataType>({
    id: "",
    currentAccount: 0,
    cbfs: 0,
    cash: 0,
    others: 0,
    openingAmount: 0,
    closingAmount: 0,
    createdAt: new Date(),
    gst1: 0,
    gst2: 0,
  });

  let ModifiedStockNames: any[] = [];
  const StockCodes = [
    {
      key: "P1",
    },
    {
      key: "P2",
    },
    {
      key: "P3",
    },
    {
      key: "P4",
    },
    {
      key: "P5",
    },
    {
      key: "P6",
    },
    {
      key: "P7",
    },
  ];

  const fetchStockNames = async () => {
    try {
      await getStocknames().then((res: any) => {
        if (res?.data?.error) {
          Swal.fire({
            icon: "error",
            title: "oops...",
            text: `Server Error: ${res?.data?.error}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }

        if (!res?.data?.error) {
          let obj = res.data[0];

          for (let index = 0; index < Object.values(obj).length; index++) {
            if (index > 0 && index < 8) {
              ModifiedStockNames[index - 1] = Object.values(obj)[index];
            }
          }
          setStockNames(ModifiedStockNames);
        }
      });
    } catch (error) {
      console.error("Error Details:", error);
    }
  };

  const fetchTransactionData = async () => {
    try {
      await axios.get("/api/latest-transaction-data").then((res: any) => {
        if (res?.data?.error) {
          Swal.fire({
            icon: "error",
            title: "oops...",
            text: `Server Error: ${res?.data?.error}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }

        if (!res?.data?.error) {
          setTransactionData(res.data.data);
        }
      });
    } catch (error) {
      console.error("Error Details:", error);
    }
  };

  useEffect(() => {
    fetchStockNames();
    fetchTransactionData();
    getOpeningAmount().then((res: any) => {
      setPreviousTotal(res?.data);
      setPreviousAmount(res?.data);
    });
    setIsAdded(false);
  }, [setIsAdded, isAdded]);

  return (
    <div className="flex flex-col gap-2 justify-between mx-3">
      <div>
        <div className="flex gap-3 justify-between lg:justify-start items-center my-3">
          <p className="">Opening Data</p>
          <AddOpeningAmount
            previousTotal={previousAmount}
            setIsAdded={setIsAdded}
          />
        </div>
        <div>
          <Table
            isCompact={true}
            className=""
            aria-label="table for stock transaction"
          >
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>openingAmount</TableColumn>
              <TableColumn>currentAccount</TableColumn>
              <TableColumn>cbfs</TableColumn>
              <TableColumn>cash</TableColumn>
              <TableColumn>others</TableColumn>
              <TableColumn>closingAmount</TableColumn>
              <TableColumn>GST 1</TableColumn>
              <TableColumn>GST 2</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."}>
              <TableRow>
                <TableCell>
                  {dayjs(previousAmount?.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{previousAmount?.openingAmount}</TableCell>
                <TableCell>{previousAmount?.currentAccount}</TableCell>
                <TableCell>{previousAmount?.cbfs}</TableCell>
                <TableCell>{previousAmount?.cash}</TableCell>
                <TableCell>{previousAmount?.others}</TableCell>
                <TableCell>{previousAmount?.closingAmount}</TableCell>
                <TableCell>{previousTotal?.gst1}</TableCell>
                <TableCell>{previousTotal?.gst2}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <div className="flex gap-3 justify-between lg:justify-start items-center my-3">
          <p className="">Stock code</p>
          <AddStocksCode setIsAdded={setIsAdded} />
        </div>
        <Table aria-label="table for stock codes">
          <TableHeader columns={StockCodes}>
            {(column) => (
              <TableColumn key={column.key} className="">
                {column.key}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={stockNames} emptyContent={"No rows to display."}>
            {stockNames && stockNames.length > 0 ? (
              <TableRow>
                {stockNames?.map((item, index) => (
                  <TableCell key={index}>{item}</TableCell>
                ))}
              </TableRow>
            ) : (
              []
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="flex gap-3 justify-between lg:justify-start items-center my-3">
          <p className="">Latest Stock Transaction code</p>
          <AddAmount
            previousId={previousAmount.id}
            previousTotal={previousAmount.openingAmount}
            setIsAdded={setIsAdded}
          />
        </div>
        <Table aria-label="table for stock transaction">
          <TableHeader columns={StockCodes}>
            <TableColumn>date</TableColumn>
            <TableColumn>openingAmount</TableColumn>
            <TableColumn>cylinders</TableColumn>
            <TableColumn>loadAmount</TableColumn>
            <TableColumn>soldCylinders</TableColumn>
            <TableColumn>soldAmount</TableColumn>
            <TableColumn>total</TableColumn>
          </TableHeader>
          <TableBody items={stockNames} emptyContent={"No rows to display."}>
            <TableRow>
              <TableCell>{transactionData?.date}</TableCell>
              <TableCell>{transactionData?.openingAmount}</TableCell>
              <TableCell>{transactionData?.cylinders}</TableCell>
              <TableCell>{transactionData?.loadAmount}</TableCell>
              <TableCell>{transactionData?.soldCylinders}</TableCell>
              <TableCell>{transactionData?.soldAmount}</TableCell>
              <TableCell>{transactionData?.total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LesureData;
