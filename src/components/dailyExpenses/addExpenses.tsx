import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { addOpeningAmount } from "../openingAmountApiCalls/data";

interface stockData {
  amountData: amountDataType;
  updateDailyExpenditure: Function;
  type: MutableRefObject<string>;
}

interface amountDataType {
  date: string;
  openingAmount: number;
  total: number;
}

export const AddExpenses = ({
  previousTotal,
  previousId,
  setIsAdded,
}: {
  previousTotal: number;
  previousId: string;
  setIsAdded: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amountData, setAmountData] = useState({
    date: "",
    openingAmount: 0,
    total: 0,
  });
  // const price = useRef(0);
  const type = useRef<string>("");

  const updateDailyExpenditure = (value: number) => {
    // price.current = value;
    setAmountData({ ...amountData, [type.current]: value });
  };

  const addExpenditureData = async () => {
    if (amountData.date === "" || amountData.openingAmount === 0) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `required fields should be filled`,
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    let totalAmount = 0;
    const values = Object.values(amountData);
    for (let index = 1; index < values.length; index++) {
      if (
        amountData.openingAmount !== values[index] &&
        amountData.total !== values[index]
      ) {
        totalAmount = totalAmount + +values[index];
      }
    }
    const finalAmount = amountData.openingAmount - totalAmount;
    setAmountData({ ...amountData, total: finalAmount });
    const obj = { ...amountData, total: finalAmount };
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this! total- ${finalAmount}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });
    if (result.isConfirmed) {
      await sendExpenditureData(finalAmount, obj);
    }
  };

  const sendExpenditureData = async (finalAmount: number, obj: any) => {
    try {
      await addOpeningAmount(previousId, finalAmount);
      const res = await axios.post("/api/dailyexpenses", { expenditure: obj });
      if (res.data.error) {
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: `Server Error: ${res.data.error}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      if (!res.data.error) {
        Swal.fire({
          icon: "success",
          title: "Success.",
          text: `stocks amount added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdded(true);
        onClose();
        setAmountData({
          date: "",
          openingAmount: res.data.data.total | 0,
          total: 0,
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: `Error details ${error}`,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  useEffect(() => {
    setAmountData({ ...amountData, openingAmount: previousTotal });
  }, [previousTotal]);

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add Expenditure data
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-center"
        style={{ width: "600px" }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Expenditure Data</ModalHeader>
          <ModalBody>
            <StocksOptions
              amountData={amountData}
              updateDailyExpenditure={updateDailyExpenditure}
              type={type}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                addExpenditureData();
              }}
            >
              Add Expenditure Data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const StocksOptions = ({
  amountData,
  updateDailyExpenditure,
  type,
}: stockData) => {
  return (
    <div className="grid gap-4">
      <Input
        type="date"
        label="date"
        variant="bordered"
        onChange={(e) => {
          (type.current = "date"), updateDailyExpenditure(e.target.value);
        }}
      />
      <Input
        isClearable
        required
        type="number"
        label="opening amount"
        variant="bordered"
        value={`${amountData.openingAmount}`}
        min={0}
        onChange={(e) => {
          (type.current = "openingAmount"),
            updateDailyExpenditure(parseInt(e.target.value));
        }}
      />
      <div className="flex items-center gap-3">
        <Input
          required
          type="text"
          className="h-[3rem]"
          label="Daily Expenditure type"
          variant="bordered"
          onChange={(e) => {
            type.current = e.target.value;
          }}
          // placeholder="Daily Expenditure type"
        />
        <Input
          required
          type="number"
          className="h-[3rem]"
          label="Expenditure Amount"
          // placeholder="Expenditure Amount"
          variant="bordered"
          min={0}
          onChange={(e) => {
            updateDailyExpenditure(parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
};
